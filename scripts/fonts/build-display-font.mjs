// Builds the self-hosted display subset (SIL OFL 1.1, see public/fonts/OFL.txt):
//   songying-display.woff2  LXGW WenKai TC Bold (霞鶩文楷), titles, wordmark, statements
//
// Usage: node scripts/fonts/build-display-font.mjs <LXGWWenKaiTC-Bold.ttf>
// Source: github.com/lxgw/LxgwWenkaiTC releases, or the @fontsource/lxgw-wenkai-tc 700
// woff2 chunks merged with fontTools.merge.Merger. Requires fonttools with brotli; set
// PYFTSUBSET to use a specific pyftsubset binary.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { collectCharacters, subsets } from './characters.mjs';

const [source] = process.argv.slice(2);
if (!source || !fs.existsSync(source)) {
  console.error('Usage: build-display-font.mjs <LXGWWenKaiTC-Bold.ttf>');
  process.exit(1);
}
const name = 'songying-display';
const chars = collectCharacters(subsets[name]);
const textFile = `public/fonts/${name}.chars.txt`;
fs.writeFileSync(textFile, chars);
execFileSync(process.env.PYFTSUBSET || 'pyftsubset', [
  source,
  `--text-file=${textFile}`,
  '--flavor=woff2',
  '--layout-features=kern,palt,halt',
  '--no-hinting',
  '--desubroutinize',
  `--output-file=public/fonts/${name}.woff2`,
]);
const size = fs.statSync(`public/fonts/${name}.woff2`).size;
console.log(`${name}: ${[...chars].length} characters, ${(size / 1024).toFixed(1)} KiB`);
