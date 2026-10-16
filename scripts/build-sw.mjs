import crypto from 'node:crypto';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'));
const core = new Set([
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
]);
const visited = new Set();
function walk(key) {
  if (visited.has(key) || /src\/map\/(engine|RoutingDebug)\.(ts|tsx)$/.test(key)) return;
  visited.add(key);
  const item = manifest[key];
  if (!item) return;
  core.add(`/${item.file}`);
  for (const file of item.css || []) core.add(`/${file}`);
  for (const dep of item.imports || []) walk(dep);
  for (const dep of item.dynamicImports || []) walk(dep);
}
walk('index.html');
// Files the saved stylesheets load (fonts, glyph textures) must be saved with them.
for (const url of [...core].filter((u) => u.endsWith('.css'))) {
  const css = fs.readFileSync(`dist${url}`, 'utf8');
  for (const [, ref] of css.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) core.add(ref);
}
// Three.js is reachable only through the excluded renderer modules, never precached.
const urls = [...core];
const file = (url) => `dist${url === '/' ? '/index.html' : url}`;
const missing = urls.filter((url) => !fs.existsSync(file(url)));
if (missing.length) throw new Error(`Offline core lists files missing from dist: ${missing}`);
// The version follows every file's content, so any change (even the manifest alone)
// ships a new worker and a new cache.
const hash = crypto.createHash('sha256');
for (const url of urls.sort()) hash.update(url).update(fs.readFileSync(file(url)));
const version = hash.digest('hex').slice(0, 12);
const worker =
  `const VERSION=${JSON.stringify(version)},CORE='songying-core-'+VERSION,SHELL='songying-shell-'+VERSION;\nconst URLS=${JSON.stringify(urls)};\n` +
  fs.readFileSync('scripts/sw-template.js', 'utf8');
fs.writeFileSync('dist/sw.js', worker);
fs.writeFileSync('dist/offline-core.json', JSON.stringify({ version, urls }, null, 2));
console.log('PWA core:', urls.length, 'files, version', version);
