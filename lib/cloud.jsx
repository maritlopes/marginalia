// lib/cloud.jsx — sincronização opcional na nuvem (Supabase) — Fase 1
// Modelo simples: uma linha por usuária (tabela marginalia_state), com o
// estado completo do app em JSON. Mescla nuvem x local pela data mais recente.
// Login por código de 6 dígitos (OTP) — ideal para PWA no iPhone.
(function () {
  const SUPABASE_URL = 'https://rpsiewnsvqpeadwaqsib.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_QyDwy0ZCCRYzSFfTXCXQYQ_h3vEAL3I';

  if (!window.supabase || !window.supabase.createClient || typeof MG === 'undefined') {
    console.warn('[Marginália] nuvem indisponível (supabase-js ou MG ausente).');
    window.MGCloud = { available: false };
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'marginalia-auth',
    },
  });

  let pushTimer = null;

  function setStatus(s) {
    window.__cloudStatus = s;
    if (typeof window.__rerender === 'function') window.__rerender();
  }

  async function currentUser() {
    try { const { data } = await sb.auth.getUser(); return data && data.user ? data.user : null; }
    catch { return null; }
  }

  async function pull() {
    const { data, error } = await sb
      .from('marginalia_state')
      .select('data, updated_at')
      .maybeSingle();
    if (error) { console.warn('[nuvem] pull:', error.message); return null; }
    return data; // { data, updated_at } | null
  }

  async function push() {
    const user = await currentUser();
    if (!user) return;
    const state = MG.getState();
    setStatus('Sincronizando…');
    const { error } = await sb.from('marginalia_state').upsert({
      user_id: user.id,
      data: state,
      updated_at: new Date().toISOString(),
    });
    if (error) { console.warn('[nuvem] push:', error.message); setStatus('Erro ao sincronizar'); }
    else setStatus('Sincronizado');
  }

  function schedulePush() {
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 1500);
  }

  // Mesclagem SEGURA por união: nunca apaga itens de um lado.
  // Livros/notas/desafios são unidos por id; em conflito, prevalece a versão
  // do estado com updatedAt mais recente. Progresso/prefs também mesclados.
  function mergeStates(localS, cloudS) {
    if (!cloudS) return localS;
    if (!localS) return cloudS;
    const newer = (cloudS.updatedAt || '') > (localS.updatedAt || '') ? cloudS : localS;
    const older = newer === cloudS ? localS : cloudS;
    const unionById = (key) => {
      const m = new Map();
      (newer[key] || []).forEach((x) => { if (x && x.id != null) m.set(x.id, x); });
      (older[key] || []).forEach((x) => { if (x && x.id != null && !m.has(x.id)) m.set(x.id, x); });
      return [...m.values()];
    };
    const bothNull = (k) => localS[k] === null && cloudS[k] === null;
    return {
      ...older, ...newer,
      books: bothNull('books') ? null : unionById('books'),
      notes: bothNull('notes') ? null : unionById('notes'),
      challenges: unionById('challenges'),
      progress: { ...(older.progress || {}), ...(newer.progress || {}) },
      ecos: { ...(older.ecos || {}), ...(newer.ecos || {}) },
      prefs: { ...(older.prefs || {}), ...(newer.prefs || {}) },
      updatedAt: new Date().toISOString(),
    };
  }

  async function syncOnLogin() {
    const user = await currentUser();
    if (!user) return;
    setStatus('Sincronizando…');
    const cloud = await pull();
    const local = MG.getState();
    const merged = mergeStates(local, cloud ? cloud.data : null);
    MG.setState(merged);
    if (typeof window._refreshLive === 'function') window._refreshLive();
    if (typeof window.__rerender === 'function') window.__rerender();
    await push();                              // sobe o resultado mesclado
    setStatus('Sincronizado');
  }

  window.MGCloud = {
    available: true,
    currentUser,
    async sendCode(email) {
      return sb.auth.signInWithOtp({ email: String(email).trim(), options: { shouldCreateUser: true } });
    },
    async verifyCode(email, code) {
      const r = await sb.auth.verifyOtp({ email: String(email).trim(), token: String(code).trim(), type: 'email' });
      if (!r.error) await syncOnLogin();
      return r;
    },
    async signOut() {
      await sb.auth.signOut();
      setStatus('');
      if (typeof window.__rerender === 'function') window.__rerender();
    },
    // entrar como convidado(a): conta anônima com um nome de exibição (sem e-mail)
    async signInGuest(name) {
      const r = await sb.auth.signInAnonymously({
        options: { data: { name: String(name || '').trim() || 'Convidado(a)' } },
      });
      if (!r.error) await syncOnLogin();
      return r;
    },
    schedulePush,
    syncOnLogin,
  };

  // ─── Fase 2: círculos de leitura (grupos) ───────────────────
  window.MGCloud.groups = {
    async list() {
      const { data, error } = await sb.from('groups').select('*').order('created_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async create(name) {
      return sb.rpc('create_group', { p_name: String(name || '').trim() });
    },
    async join(code, name) {
      return sb.rpc('join_group', {
        p_code: String(code || '').trim(),
        p_name: name ? String(name).trim() : null,
      });
    },
    async members(groupId) {
      const { data, error } = await sb.from('group_members')
        .select('user_id, email, role, joined_at').eq('group_id', groupId)
        .order('joined_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async leave(groupId) {
      const u = await currentUser(); if (!u) return;
      return sb.from('group_members').delete().eq('group_id', groupId).eq('user_id', u.id);
    },
    async challenges(groupId) {
      const { data, error } = await sb.from('group_challenges')
        .select('*').eq('group_id', groupId).order('created_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async createChallenge(groupId, c) {
      const u = await currentUser(); if (!u) return { error: { message: 'sem sessão' } };
      return sb.from('group_challenges').insert({
        group_id: groupId, title: c.title, type: c.type || 'count',
        target: c.target || 6, created_by: u.id,
      }).select().single();
    },
    async progress(challengeId) {
      const { data, error } = await sb.from('group_challenge_progress')
        .select('user_id, email, value, updated_at').eq('challenge_id', challengeId);
      return error ? [] : (data || []);
    },
    async pushProgress(challengeId, value) {
      const u = await currentUser(); if (!u) return;
      return sb.from('group_challenge_progress').upsert({
        challenge_id: challengeId, user_id: u.id, email: u.email,
        value: value, updated_at: new Date().toISOString(),
      });
    },
  };

  // ─── Ecos (IA) ──────────────────────────────────────────────
  // chama a função 'ecos' no Supabase, que pede ao Gemini as ressonâncias do livro
  window.MGCloud.gerarEcos = async function (title, author) {
    try {
      const { data, error } = await sb.functions.invoke('ecos', { body: { title, author } });
      if (error) return { error };
      if (data && data.error) return { error: { message: data.error } };
      return { ecos: (data && data.ecos) || [] };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  };

  // sempre que o app salva localmente, agenda um envio à nuvem (se logada)
  window.__onLocalSave = schedulePush;

  // ao abrir, se já houver sessão, sincroniza
  sb.auth.getSession().then(({ data }) => { if (data && data.session) syncOnLogin(); });
})();
