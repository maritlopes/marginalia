// Configuração do Vite — fundação do app Marginália.
// O app mantém a arquitetura de globais no window (sem refatorar os .jsx);
// o Vite só pré-compila o JSX e empacota tudo com hash no nome do arquivo
// (cache-bust real — cura o cache teimoso do iPhone/PWA).
import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';

// O manifest e os ícones do PWA precisam ficar na RAIZ com nome estável
// (os caminhos internos do manifest resolvem relativos à URL dele); este
// plugin desfaz o hash que o Vite aplica nesses três links do index.html.
// (closeBundle: a troca de URL por hash acontece depois do transformIndexHtml,
//  então só dá pra desfazer no arquivo final já escrito)
const keepPwaPaths = {
  name: 'keep-pwa-paths',
  closeBundle() {
    const p = 'dist/index.html';
    let s = readFileSync(p, 'utf8');
    s = s
      .replace(/\/assets\/manifest-[\w-]+\.json/g, '/manifest.json')
      .replace(/\/assets\/icon-180-[\w-]+\.png/g, '/icon-180.png')
      .replace(/\/assets\/icon-512-[\w-]+\.png/g, '/icon-512.png');
    writeFileSync(p, s);
  },
};

export default defineConfig({
  plugins: [keepPwaPaths],
  // as páginas estáticas (/clube/, /linha-do-tempo/, /nobel/, /maratona-nobel/)
  // e os assets da raiz são copiados pelo workflow de deploy, não pelo Vite
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
