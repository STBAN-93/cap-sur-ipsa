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

export default defineConfig({
  // chemins relatifs : le dossier dist/ fonctionne aussi dans un sous-dossier (GitHub Pages)
  base: './',
  // site d'une seule page, mais sans repli « SPA » : un fichier absent doit renvoyer 404
  appType: 'mpa',
  plugins: [mediaManifest()],
  server: { port: 5173, open: false },
  // Three.js r128 (~600 ko) n'est pas découpable : on relève le seuil d'alerte
  build: { chunkSizeWarningLimit: 900 },
});
