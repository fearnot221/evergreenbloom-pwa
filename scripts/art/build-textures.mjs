// Draws the two glyph-fill textures (seamless 320px tiles) into public/art/:
//   cones.svg    pine cones (松果) of overlapping scales, three browns on pine ink
//   petals.svg   notched sakura petals, light and deep pinks on a sakura ground
// Deterministic (seeded) so rebuilding gives the same art. Run: node scripts/art/build-textures.mjs
import fs from 'node:fs';

let seed = 20261017;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const S = 320;
const f = (n) => Math.round(n);

// Draw each mark again across any tile edge it is near (reach px), so the tile repeats
// without seams but without nine copies of every mark.
function tiled(x, y, draw, reach = 60) {
  const xs = [0, ...(x < reach ? [S] : []), ...(x > S - reach ? [-S] : [])];
  const ys = [0, ...(y < reach ? [S] : []), ...(y > S - reach ? [-S] : [])];
  let out = '';
  for (const dx of xs) for (const dy of ys) out += draw(x + dx, y + dy);
  return out;
}

// A pine cone: rows of overlapping rounded scales, narrow at the tip and base, widest
// a third of the way down; drawn tip-up around the origin, about 64 units tall.
const SCALE = 'M0 0c-5-1-8-5-7-9c3 2 5 2 7 2c2 0 4 0 7-2c1 4-2 8-7 9z';
const browns = ['#9a6440', '#7a4a2c', '#c08a5c'];
function cone(cx, cy, rot, size) {
  let scales = '';
  const rows = 9;
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    const width = Math.sin(Math.PI * (0.15 + t * 0.8)) * 1.1;
    const count = Math.max(2, Math.round(width * 4));
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * 9 * width;
      const y = -32 + r * 7.5;
      scales += `<path d="${SCALE}" fill="${browns[(r + i) % 3]}" transform="translate(${f(x)} ${f(y)})"/>`;
    }
  }
  const stem = '<path d="M0 -32v-8" stroke="#5a3a24" stroke-width="2.4" stroke-linecap="round"/>';
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(rot)}) scale(${size.toFixed(2)})">${stem}${scales}</g>`;
}
let cones = '';
for (let i = 0; i < 30; i++) {
  const x = rand() * S;
  const y = rand() * S;
  const r = rand() * 360;
  const s = 0.85 + rand() * 0.45;
  cones += tiled(x, y, (cx, cy) => cone(cx, cy, r, s), 60);
}
fs.writeFileSync(
  'public/art/cones.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" fill="#1f3a2f"/>${cones}</svg>\n`,
);

const PETAL = 'M0 0C-15-7-25-25-19-41C-15-50-6-51 0-44C6-51 15-50 19-41C25-25 15-7 0 0Z';
const pinks = ['#fbe3ea', '#c9507d', '#f6c4d4'];
let petals = '';
for (let i = 0; i < 70; i++) {
  const x = rand() * S;
  const y = rand() * S;
  const r = rand() * 360;
  const s = 0.32 + rand() * 0.4;
  const color = pinks[i % 3];
  petals += tiled(
    x,
    y,
    (cx, cy) =>
      `<path d="${PETAL}" fill="${color}" transform="translate(${f(cx)} ${f(cy)}) rotate(${f(r)}) scale(${s.toFixed(2)})"/>`,
  );
}
fs.writeFileSync(
  'public/art/petals.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" fill="#e98aab"/>${petals}</svg>\n`,
);
// 液體填滿: a sakura liquid with a wavy surface, top half empty, for background-clip text.
// The wave repeats every 400px across, so background-position-x can loop it.
fs.writeFileSync(
  'public/art/liquid.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><path d="M0 200C50 180 150 180 200 200S350 220 400 200V400H0Z" fill="#e98aab"/></svg>\n',
);
console.log(
  'textures:',
  fs.statSync('public/art/cones.svg').size,
  fs.statSync('public/art/petals.svg').size,
  'bytes',
);
