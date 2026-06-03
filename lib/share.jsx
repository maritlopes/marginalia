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
    ctx.fillText('maritlopes.github.io/marginalia', W / 2, H - 80);

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

window.Share = Share;
