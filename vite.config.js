import { defineConfig } from 'vite';

export default defineConfig({
  // chemins relatifs : le dossier dist/ fonctionne aussi dans un sous-dossier
  base: './',
  // site d'une seule page, mais sans repli « SPA » : un fichier absent (ex. photos/photo-3.jpg) doit renvoyer 404
  appType: 'mpa',
  server: { port: 5173, open: false },
  // Three.js r128 (~600 ko) n'est pas découpable : on relève le seuil d'alerte
  build: { chunkSizeWarningLimit: 900 },
});
