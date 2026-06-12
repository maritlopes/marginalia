// Pré-requisitos globais do app — substitui os <script> de CDN (unpkg/jsdelivr).
// Os .jsx do Marginália falam entre si via window.*; React, ReactDOM e Supabase
// agora vêm do bundle, mas continuam expostos nos mesmos nomes globais.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

window.React = React;
window.ReactDOM = ReactDOM; // expõe createRoot, como o UMD fazia
window.supabase = { createClient };
