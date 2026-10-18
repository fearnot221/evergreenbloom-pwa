import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Runs the worker template with fake caches and fetch, then fires its install event. */
async function install(existing: Record<string, Record<string, unknown>>, message?: unknown) {
  const stores = new Map<string, Map<string, unknown>>(
    Object.entries(existing).map(([name, entries]) => [name, new Map(Object.entries(entries))]),
  );
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name) as Map<string, unknown>;
    return {
      match: async (path: string) => store.get(path),
      put: async (path: string, value: unknown) => void store.set(path, value),
      addAll: async (paths: string[]) => {
        for (const path of paths) store.set(path, 'ok');
      },
    };
  };
  const listeners: Record<string, (event: unknown) => void> = {};
  const self = {
    skipWaiting: () => void stores.set('skipped', new Map()),
    addEventListener: (type: string, fn: (e: unknown) => void) => (listeners[type] = fn),
  };
  const fetch = async () => ({ ok: true });
  const caches = { open, keys: async () => [...stores.keys()] };
  const source = `const VERSION='new',CORE='songying-core-new',SHELL='songying-shell-new';
const URLS=['/','/app.js'];\n${fs.readFileSync('scripts/sw-template.js', 'utf8')}`;
  new Function('self', 'caches', 'fetch', 'Response', source)(self, caches, fetch, class {});
  let done: Promise<unknown> = Promise.resolve();
  listeners.install({ waitUntil: (p: Promise<unknown>) => (done = p) });
  await done;
  if (message) listeners.message({ data: message, ports: [] });
  return stores;
}

describe('service worker update', () => {
  it('re-saves the core when the visitor had saved the previous version offline', async () => {
    const stores = await install({ 'songying-core-old': { '/__saved': 'yes' } });
    expect(stores.get('songying-core-new')?.has('/__saved')).toBe(true);
    expect(stores.get('songying-core-new')?.has('/app.js')).toBe(true);
  });

  it("activates a waiting worker only on the visitor's request", async () => {
    expect((await install({}, { type: 'ACTIVATE' })).has('skipped')).toBe(true);
    expect((await install({})).has('skipped')).toBe(false);
  });

  it('saves nothing when the visitor never saved', async () => {
    const stores = await install({ 'songying-core-old': {} });
    expect(stores.get('songying-core-new')).toBeUndefined();
  });
});
