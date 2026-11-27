import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Module virtuel « virtual:media » : liste, au moment du build (ou du dev), les photos
   public/photos/photo-N.jpg et le logo public/assets/logo-ipsa.(svg|png) réellement présents.
   Le site ne demande ainsi que des fichiers qui existent (plus de requêtes 404 à chaque visite). */
function mediaManifest() {
  const ID = 'virtual:media', RID = '\0' + ID;
  const pub = fileURLToPath(new URL('./public', import.meta.url));
  const scan = () => {
    const dir = path.join(pub, 'photos');
    const photos = fs.existsSync(dir)
      ? fs.readdirSync(dir).map((f) => /^photo-(\d+)\.jpg$/.exec(f)).filter(Boolean)
          .map((m) => +m[1]).filter((n) => n >= 1 && n <= 18).sort((a, b) => a - b)
      : [];
    const logos = ['assets/logo-ipsa.svg', 'assets/logo-ipsa.png'].filter((f) => fs.existsSync(path.join(pub, f)));
    return `export const photos = ${JSON.stringify(photos)};\nexport const logos = ${JSON.stringify(logos)};\n`;
  };
  return {
    name: 'media-manifest',
    resolveId: (id) => (id === ID ? RID : null),
    load: (id) => (id === RID ? scan() : null),
    configureServer(server) {
      // en dev : déposer ou retirer une photo / le logo recharge la page avec la nouvelle liste
      const onChange = (file) => {
        const rel = path.relative(pub, file).replace(/\\/g, '/');
        if (!/^(photos\/|assets\/logo-ipsa\.)/.test(rel)) return;
        const mod = server.moduleGraph.getModuleById(RID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.add(pub);
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}

/* Gabarits partagés : dans chaque page HTML, <!-- @include nom --> est remplacé par
   src/partials/nom.html (menu, pied de page, palette, Copilote…). Écrits une seule fois,
   présents dans le HTML final de chaque page (pas d'attente du JavaScript). */
function partials() {
  const dir = fileURLToPath(new URL('./src/partials', import.meta.url));
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, name) =>
        fs.readFileSync(path.join(dir, name + '.html'), 'utf8')),
    },
    configureServer(server) {
      // en dev : modifier un gabarit recharge la page
      server.watcher.add(dir);
      server.watcher.on('change', (file) => {
        if (path.dirname(file) === dir) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

/* toutes les pages du site : chacune est construite et publiée dans dist/ */
const root = fileURLToPath(new URL('.', import.meta.url));
const PAGES = ['index', 'formations', 'campus', 'carrieres', 'lancement', 'base'];

export default defineConfig({
  // chemins relatifs : le dossier dist/ fonctionne aussi dans un sous-dossier (GitHub Pages)
  base: './',
  // site multi-pages, sans repli « SPA » : un fichier absent doit renvoyer 404
  appType: 'mpa',
  plugins: [mediaManifest(), partials()],
  server: { port: 5173, open: false },
  build: {
    // Three.js r128 (~600 ko, accueil seulement) n'est pas découpable : on relève le seuil d'alerte
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: Object.fromEntries(PAGES.map((p) => [p, path.join(root, p + '.html')])),
    },
  },
});
