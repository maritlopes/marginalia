// Entrada do bundle — importa os arquivos do app NA MESMA ORDEM em que o
// index.html antigo os injetava como text/babel. A ordem importa: cada
// arquivo publica sua superfície no window ao final, e o seguinte a consome.
import './globals-setup.js';
import '../lib/sources.jsx';
import '../lib/storage.jsx';
import '../lib/i18n.jsx';
import '../lib/share.jsx';
import '../tokens.jsx';
import '../data.jsx';
import '../frames/ios-frame.jsx';
import '../home-variants.jsx';
import '../screens.jsx';
import '../lib/cloud.jsx';
import './app-main.jsx';
