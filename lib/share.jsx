// lib/share.jsx — gera cards de citação compartilháveis (PNG)
// Estilo: paleta Marginália, Fraunces serif, sóbrio, literário.

const Share = {
  // Renderiza um card 1080×1080 (Instagram square) com a citação
  // Retorna canvas com a imagem pronta.
  async renderQuoteCard({ note, book, format = 'square' }) {
    const W = format === 'story' ? 1080 : 1080;
    const H = format === 'story' ? 1920 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. Fundo cremoso com sutil textura
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, W, H);

    // 2. Borda sutil
    ctx.strokeStyle = 'rgba(176,83,58,0.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // 3. Header: símbolo + Marginália (no topo centralizado)
    if (window.__shareSymbolImg) {
      const img = window.__shareSymbolImg;
      const symW = 90;
      const symH = (img.naturalHeight / img.naturalWidth) * symW;
      ctx.drawImage(img, (W - symW) / 2, 90, symW, symH);
    }
    ctx.fillStyle = '#8E3E2A';
    ctx.font = 'italic 500 38px "Fraunces", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Marginália', W / 2, 230);

    // 4. Pequeno divisor
    ctx.strokeStyle = 'rgba(176,83,58,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, 260);
    ctx.lineTo(W / 2 + 60, 260);
    ctx.stroke();

    // 5. Categoria/tipo de nota (pequena etiqueta)
    const kindLabels = {
      'citação': 'CITAÇÃO',
      'reflexão': 'REFLEXÃO',
      'pergunta': 'PERGUNTA',
      'resumo': 'SÍNTESE',
      'marginal': 'MARGINAL',
      'conexão': 'CONEXÃO',
      'mapa': 'MAPA',
    };
    const label = kindLabels[note.kind] || note.kind?.toUpperCase() || 'NOTA';
    ctx.fillStyle = '#B0533A';
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(label.split('').join(' '), W / 2, 320);

    // 6. Citação principal (centralizada, Fraunces italic)
    ctx.fillStyle = '#2A2620';
    ctx.font = 'italic 500 56px "Fraunces", Georgia, serif';
    ctx.textAlign = 'center';
    const text = '"' + (note.text || '').trim() + '"';
    const lines = wrapText(ctx, text, W - 200, 76);
    const startY = H / 2 - (lines.length * 76) / 2 + 20;
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, startY + i * 76);
    });

    // 7. Atribuição (autor, livro, página)
    const attrY = startY + lines.length * 76 + 80;
    ctx.fillStyle = '#6A5D4E';
    ctx.font = '500 28px "Fraunces", Georgia, serif';
    ctx.fillText(`— ${book.author || 'Anônimo'}`, W / 2, attrY);

    ctx.fillStyle = '#8A7E6B';
    ctx.font = 'italic 24px "Fraunces", Georgia, serif';
    const cite = `${book.title}${note.chapter ? ' · ' + note.chapter : ''}${note.page ? ' · pág ' + note.page : ''}`;
    ctx.fillText(cite, W / 2, attrY + 40);

    // 8. Rodapé: marca + URL
    ctx.fillStyle = 'rgba(106,93,78,0.55)';
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText('clubemarginalia.com.br', W / 2, H - 80);

    return canvas;
  },

  // Renderiza um card 1080×1080 de RECOMENDAÇÃO: livro + estrelas + texto da leitora.
  // Mesmo estilo do card de citação (paleta Marginália, Fraunces).
  async renderRecommendationCard({ book }) {
    const W = 1080, H = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';

    // fundo + borda
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(176,83,58,0.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // header: símbolo + Marginália
    if (window.__shareSymbolImg) {
      const img = window.__shareSymbolImg;
      const symW = 90;
      const symH = (img.naturalHeight / img.naturalWidth) * symW;
      ctx.drawImage(img, (W - symW) / 2, 90, symW, symH);
    }
    ctx.fillStyle = '#8E3E2A';
    ctx.font = 'italic 500 38px "Fraunces", Georgia, serif';
    ctx.fillText('Marginália', W / 2, 230);

    // divisor
    ctx.strokeStyle = 'rgba(176,83,58,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, 260);
    ctx.lineTo(W / 2 + 60, 260);
    ctx.stroke();

    // etiqueta
    ctx.fillStyle = '#B0533A';
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.fillText('R E C O M E N D A Ç Ã O', W / 2, 318);

    // mede os blocos do miolo para centralizar verticalmente
    const blocks = [];
    const rating = Math.max(0, Math.min(5, Math.round(book.rating || 0)));
    if (rating) blocks.push({ type: 'stars', rating, h: 80 });

    ctx.font = '500 54px "Fraunces", Georgia, serif';
    const titleLines = wrapText(ctx, book.title || 'Sem título', W - 240);
    blocks.push({ type: 'lines', lines: titleLines, lh: 64, font: '500 54px "Fraunces", Georgia, serif', color: '#2A2620', h: titleLines.length * 64 });

    blocks.push({ type: 'one', text: '— ' + (book.author || 'Anônimo'), lh: 48, font: 'italic 30px "Fraunces", Georgia, serif', color: '#6A5D4E', h: 48, gapBefore: 8 });

    const rec = (book.recommendation || '').trim();
    if (rec) {
      ctx.font = 'italic 500 40px "Fraunces", Georgia, serif';
      const recLines = wrapText(ctx, '“' + rec + '”', W - 240);
      blocks.push({ type: 'lines', lines: recLines, lh: 56, font: 'italic 500 40px "Fraunces", Georgia, serif', color: '#2A2620', h: recLines.length * 56, gapBefore: 38 });
    }

    const totalH = blocks.reduce((s, b) => s + (b.gapBefore || 0) + b.h, 0);
    const regionTop = 360, regionBottom = H - 130;
    let y = regionTop + Math.max(0, ((regionBottom - regionTop) - totalH) / 2);

    for (const b of blocks) {
      y += (b.gapBefore || 0);
      if (b.type === 'stars') {
        drawStars(ctx, W / 2, y + 26, b.rating, 46);
        y += b.h; continue;
      }
      ctx.fillStyle = b.color;
      ctx.font = b.font;
      if (b.type === 'lines') {
        b.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, y + (i + 1) * b.lh - b.lh * 0.22));
        y += b.h;
      } else {
        ctx.fillText(b.text, W / 2, y + b.lh * 0.7);
        y += b.h;
      }
    }

    // rodapé
    ctx.fillStyle = 'rgba(106,93,78,0.55)';
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText('clubemarginalia.com.br', W / 2, H - 80);

    return canvas;
  },

  // Pré-carrega o símbolo (uma vez)
  async preloadSymbol() {
    if (window.__shareSymbolImg) return;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { window.__shareSymbolImg = img; resolve(); };
      img.onerror = () => resolve();
      img.src = 'symbol.png';
    });
  },

  // Baixa a imagem como PNG
  download(canvas, filename = 'marginalia-citacao.png') {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  },

  // Copia para clipboard (quando suportado)
  async copyToClipboard(canvas) {
    try {
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    } catch {
      return false;
    }
  },

  // Web Share API (mobile — abre menu nativo de compartilhar)
  async share(canvas, note, book) {
    try {
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], 'marginalia-citacao.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${book.title} — ${book.author}`,
          text: note.text,
        });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },
};

// Helper: quebra texto em linhas pelo width
function wrapText(ctx, text, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Helper: desenha uma fileira de 5 estrelas (rating preenchidas, resto vazias)
function drawStars(ctx, cx, cy, rating, size) {
  const gap = size * 0.3;
  const total = 5;
  const totalW = total * size + (total - 1) * gap;
  let x = cx - totalW / 2 + size / 2;
  for (let i = 0; i < total; i++) {
    drawStar(ctx, x, cy, size / 2, i < rating ? '#B0533A' : 'rgba(176,83,58,0.22)');
    x += size + gap;
  }
}

function drawStar(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const aOuter = -Math.PI / 2 + i * 2 * Math.PI / 5;
    const aInner = aOuter + Math.PI / 5;
    if (i === 0) ctx.moveTo(cx + Math.cos(aOuter) * r, cy + Math.sin(aOuter) * r);
    else ctx.lineTo(cx + Math.cos(aOuter) * r, cy + Math.sin(aOuter) * r);
    ctx.lineTo(cx + Math.cos(aInner) * r * 0.42, cy + Math.sin(aInner) * r * 0.42);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

window.Share = Share;
