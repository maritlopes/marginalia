// lib/cloud.jsx — sincronização opcional na nuvem (Supabase) — Fase 1
// Modelo simples: uma linha por usuária (tabela marginalia_state), com o
// estado completo do app em JSON. Mescla nuvem x local pela data mais recente.
// Login por código de 6 dígitos (OTP) — ideal para PWA no iPhone.
(function () {
  const SUPABASE_URL = 'https://rpsiewnsvqpeadwaqsib.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_QyDwy0ZCCRYzSFfTXCXQYQ_h3vEAL3I';
  const ADMIN_EMAIL = 'maritei2010@gmail.com'; // administradora do app (aprova quem entra)

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
      readingLog: unionById('readingLog'),
      progress: { ...(older.progress || {}), ...(newer.progress || {}) },
      ecos: { ...(older.ecos || {}), ...(newer.ecos || {}) },
      prefs: { ...(older.prefs || {}), ...(newer.prefs || {}) },
      updatedAt: new Date().toISOString(),
    };
  }

  // registra/checa a aprovação no nível do app e guarda o status (porta única)
  async function checkAppApproval(user) {
    try {
      const nm = (user.user_metadata && user.user_metadata.name) || (user.email || '').split('@')[0] || '';
      const { data, error } = await sb.rpc('register_app_member', { p_name: nm });
      window.__isAppAdmin = (user.email === ADMIN_EMAIL);
      window.__appStatus = error ? 'approved' : (data || 'pending'); // falha-aberto: erro nunca tranca
    } catch (e) {
      window.__isAppAdmin = (user.email === ADMIN_EMAIL);
      window.__appStatus = 'approved';
    }
    if (typeof window.__rerender === 'function') window.__rerender();
  }

  async function syncOnLogin() {
    const user = await currentUser();
    if (!user) return;
    await checkAppApproval(user);            // porta do app: define window.__appStatus
    if (window.__appStatus === 'pending') return; // pendente: não sincroniza dados ainda
    // propaga o nome de exibição às memberships (para os outros verem o nome certo)
    try { const nm = (user.user_metadata && user.user_metadata.name); if (nm) await sb.rpc('set_my_member_name', { p_name: nm }); } catch (e) { /* ok */ }
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
      window.__appStatus = undefined; window.__isAppAdmin = false;
      setStatus('');
      if (typeof window.__rerender === 'function') window.__rerender();
    },
    // define o nome de exibição (avatar + autoria dos recados no grupo)
    async setName(name) {
      const nm = String(name || '').trim();
      const r = await sb.auth.updateUser({ data: { name: nm } });
      try { if (nm) await sb.rpc('set_my_member_name', { p_name: nm }); } catch (e) { /* ok */ }
      if (typeof window.__rerender === 'function') window.__rerender();
      return r;
    },
    // entrar como convidado(a): conta anônima com um nome de exibição (sem e-mail)
    // (não sincroniza aqui para não disparar re-render no meio do fluxo de ingresso;
    //  quem chama cuida de atualizar a tela depois)
    async signInGuest(name) {
      return sb.auth.signInAnonymously({
        options: { data: { name: String(name || '').trim() || 'Convidado(a)' } },
      });
    },
    // ─── porta única do app: administradora aprova quem entra ───
    async appPending() {
      const { data, error } = await sb.from('app_members')
        .select('user_id, name, email, created_at').eq('status', 'pending')
        .order('created_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async appApprove(userId) { return sb.rpc('app_approve', { p_user: userId }); },
    async appReject(userId) { return sb.rpc('app_reject', { p_user: userId }); },
    async refreshAppStatus() {
      const u = await currentUser();
      if (u) await checkAppApproval(u);
      return window.__appStatus;
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
    // ─── aprovação da dona: pedir para entrar + aprovar/recusar ───
    async requestJoin(code, name) {
      const { data, error } = await sb.rpc('request_join', {
        p_code: String(code || '').trim(),
        p_name: name ? String(name).trim() : null,
      });
      if (error) return { error };
      return { result: (data && data[0]) || null }; // {group_id, group_name, status}
    },
    async pendingRequests(groupId) {
      const { data, error } = await sb.from('group_join_requests')
        .select('user_id, requester_name, created_at').eq('group_id', groupId)
        .order('created_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async approveRequest(groupId, userId) {
      return sb.rpc('approve_request', { p_group: groupId, p_user: userId });
    },
    async rejectRequest(groupId, userId) {
      return sb.rpc('reject_request', { p_group: groupId, p_user: userId });
    },
    async members(groupId) {
      const { data, error } = await sb.from('group_members')
        .select('user_id, email, display_name, role, joined_at').eq('group_id', groupId)
        .order('joined_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async leave(groupId) {
      const u = await currentUser(); if (!u) return;
      return sb.from('group_members').delete().eq('group_id', groupId).eq('user_id', u.id);
    },
    // ─── círculos abertos (descobríveis por todos) ───
    async setOpen(groupId, open) {
      return sb.rpc('set_group_open', { p_group: groupId, p_open: open !== false });
    },
    async openGroups() {
      const { data, error } = await sb.from('groups')
        .select('id, name, invite_code, owner_id, created_at')
        .eq('is_open', true).order('created_at', { ascending: false });
      return error ? [] : (data || []);
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
        kind: c.kind || 'count', description: c.description || null,
        target: c.target || 6, created_by: u.id,
      }).select().single();
    },
    async deleteChallenge(challengeId) {
      return sb.from('group_challenges').delete().eq('id', challengeId);
    },
    // ─── desafios curados: livros do desafio + marcações de "li" ───
    async challengeBooks(challengeId) {
      const { data, error } = await sb.from('group_challenge_books')
        .select('*').eq('challenge_id', challengeId)
        .order('position', { ascending: true }).order('created_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async addChallengeBook(challengeId, b) {
      const u = await currentUser(); if (!u) return { error: { message: 'sem sessão' } };
      return sb.from('group_challenge_books').insert({
        challenge_id: challengeId, created_by: u.id,
        title: b.title, author: b.author,
        year: b.year || null, country: b.country || null, position: b.position || 0,
      }).select().single();
    },
    async removeChallengeBook(bookId) {
      return sb.from('group_challenge_books').delete().eq('id', bookId);
    },
    // todas as marcações de "li" dos livros deste desafio (para o placar)
    async challengeDones(challengeId) {
      const books = await this.challengeBooks(challengeId);
      const ids = books.map((b) => b.id);
      if (!ids.length) return [];
      const { data, error } = await sb.from('group_challenge_book_done')
        .select('book_id, user_id').in('book_id', ids);
      return error ? [] : (data || []);
    },
    async toggleBookDone(bookId, done) {
      const u = await currentUser(); if (!u) return { error: { message: 'sem sessão' } };
      if (done) return sb.from('group_challenge_book_done')
        .upsert({ book_id: bookId, user_id: u.id, done_at: new Date().toISOString() });
      return sb.from('group_challenge_book_done').delete().eq('book_id', bookId).eq('user_id', u.id);
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
    // ─── mural do círculo (recados + notas compartilhadas) ───
    async posts(groupId) {
      const { data, error } = await sb.from('group_posts')
        .select('*').eq('group_id', groupId).order('created_at', { ascending: true });
      return error ? [] : (data || []);
    },
    async post(groupId, p) {
      const u = await currentUser();
      if (!u) return { error: { message: 'sem sessão' } };
      const author = (u.user_metadata && u.user_metadata.name) || (u.email || '').split('@')[0] || 'Membro';
      return sb.from('group_posts').insert({
        group_id: groupId, user_id: u.id, author_name: author,
        kind: p.kind || 'mensagem', body: p.body, book_title: p.book_title || null,
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
