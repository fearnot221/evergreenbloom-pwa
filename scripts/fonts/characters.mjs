import fs from 'node:fs';

/**
 * Printable ASCII plus every non-ASCII, non-space character in the given sources. A
 * source is a whole file, or `{ file, keys }` to take only those keys' string values
 * (data files whose body text never renders in the display face).
 */
export function collectCharacters(sources) {
  const set = new Set();
  for (let c = 0x20; c < 0x7f; c++) set.add(String.fromCharCode(c));
  for (const source of sources) {
    const { file, keys } = typeof source === 'string' ? { file: source } : source;
    let text = fs.readFileSync(file, 'utf8');
    if (keys) {
      const pattern = new RegExp(`\\b(?:${keys.join('|')}):\\s*'([^']*)'`, 'g');
      text = [...text.matchAll(pattern)].map((match) => match[1]).join('');
    }
    for (const ch of text) {
      if (ch.codePointAt(0) > 0x7f && !/\s/u.test(ch)) set.add(ch);
    }
  }
  return [...set].sort().join('');
}

/** Which source files feed the display subset. Shared by the build script and tests. */
export const subsets = {
  'songying-display': [
    'src/data/display-copy.ts',
    { file: 'src/data/content.ts', keys: ['title', 'name', 'story', 'status', 'value'] },
    { file: 'src/data/stamps.ts', keys: ['name'] },
    'src/data/poster-copy.ts',
  ],
};
