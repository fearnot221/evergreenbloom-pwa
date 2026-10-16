import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { backup, DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { createApp } from '../server/app.mjs';

const origin = 'http://localhost:8080';
const secret = 'correct-horse-battery-42';
const stampKeys = {
  lake: 'LAKE-TEST-SECRET-1234',
  library: 'PHOTO-TEST-SECRET-1234',
  gate: 'GATE-TEST-SECRET-1234',
};
// Real 1px PNG; the review, rather than file presence, earns the photo stamp.
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aA1cAAAAASUVORK5CYII=',
  'base64',
);

async function fixture(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'songying-api-'));
  await writeFile(path.join(dir, 'index.html'), '<html>app</html>');
  const options = {
    database: path.join(dir, 'game.sqlite'),
    origin,
    staffUsername: 'staff',
    staffPassword: secret,
    stampKeys,
    staticDir: dir,
  };
  let app;
  let base;
  const start = async () => {
    app = await createApp(options);
    app.server.listen(0, '127.0.0.1');
    await once(app.server, 'listening');
    base = `http://127.0.0.1:${app.server.address().port}`;
  };
  const stop = async () => {
    app.server.closeAllConnections();
    await new Promise((resolve) => app.server.close(resolve));
    app.close();
  };
  await start();
  t.after(async () => {
    await stop();
    await rm(dir, { recursive: true, force: true });
  });
  const request = async (route, { cookie = '', data, headers = {}, method, raw } = {}) => {
    const response = await fetch(base + route, {
      method: method ?? (data === undefined && raw === undefined ? 'GET' : 'POST'),
      headers: {
        Origin: origin,
        Cookie: cookie,
        ...(data === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: raw ?? (data === undefined ? undefined : JSON.stringify(data)),
    });
    const bytes = await response.arrayBuffer();
    let value;
    try {
      value = JSON.parse(Buffer.from(bytes).toString());
    } catch {
      value = Buffer.from(bytes);
    }
    return {
      status: response.status,
      headers: response.headers,
      cookie: response.headers.get('set-cookie')?.split(';')[0],
      data: value,
    };
  };
  const register = async (name = 'participant') => {
    const response = await request('/api/register', {
      data: { username: name, password: secret, role: 'staff' },
    });
    assert.equal(response.status, 201);
    assert.equal(response.data.user.role, 'player');
    return response;
  };
  const staff = async () => {
    const response = await request('/api/login', { data: { username: 'staff', password: secret } });
    assert.equal(response.status, 200);
    return response.cookie;
  };
  return {
    request,
    register,
    staff,
    options,
    restart: async () => {
      await stop();
      await start();
    },
  };
}

test('one Compose file, no secondary deployment configs or public station secrets', async () => {
  const names = await readdir('.');
  assert.deepEqual(
    names.filter((name) => /^(docker-)?compose.*\.ya?ml$/.test(name)),
    ['docker-compose.yml'],
  );
  const client = await readFile('src/data/stamps.ts', 'utf8');
  assert.doesNotMatch(client, /\bkey:|\banswer:/);
  assert.match(
    await readFile('scripts/sw-template.js', 'utf8'),
    /url.pathname.startsWith\('\/api\/'\)/,
  );
});

test('login binds server progress to a player, logout revokes the session, role cannot be self-selected', async (t) => {
  const f = await fixture(t);
  assert.equal((await f.request('/api/me')).status, 401);
  const player = await f.register();
  assert.match(player.headers.get('set-cookie'), /HttpOnly/);
  assert.match(player.headers.get('set-cookie'), /SameSite=Lax/);
  assert.equal(player.headers.get('cache-control'), 'no-store');
  assert.equal((await f.request('/api/staff/redemptions', { cookie: player.cookie })).status, 403);
  assert.equal(
    (
      await f.request('/api/login', {
        data: { username: 'participant', password: 'wrong-password-1234' },
      })
    ).status,
    401,
  );
  assert.equal(
    (await f.request('/api/register', { data: { username: 'PARTICIPANT', password: secret } }))
      .status,
    409,
  );
  assert.equal(
    (await f.request('/api/register', { data: { username: 'new-user', password: 'weak' } })).status,
    400,
  );
  assert.equal((await f.request('/api/logout', { cookie: player.cookie, data: {} })).status, 200);
  assert.equal((await f.request('/api/me', { cookie: player.cookie })).status, 401);
  const login = await f.request('/api/login', {
    data: { username: 'PARTICIPANT', password: secret },
  });
  assert.equal(login.data.user.id, player.data.user.id);
  const db = new DatabaseSync(f.options.database);
  t.after(() => db.close());
  const row = db.prepare("SELECT password_hash FROM users WHERE username='participant'").get();
  assert.notEqual(row.password_hash, secret);
  assert.match(row.password_hash, /^[a-f0-9]{32}:[a-f0-9]{128}$/);
  assert.notEqual(
    db.prepare('SELECT token_hash FROM sessions WHERE user_id=?').get(player.data.user.id)
      .token_hash,
    login.cookie.split('=')[1],
  );
});

test('same-origin checks, malformed bodies, upload limits, unknown API and private file isolation', async (t) => {
  const f = await fixture(t);
  const player = await f.register();
  assert.equal(
    (
      await f.request('/api/register', {
        data: { username: 'forged', password: secret },
        headers: { Origin: 'https://evil.example' },
      })
    ).status,
    403,
  );
  assert.equal(
    (await f.request('/api/login', { data: {}, headers: { 'Content-Type': 'text/plain' } })).status,
    415,
  );
  assert.equal(
    (await f.request('/api/login', { raw: '{', headers: { 'Content-Type': 'application/json' } }))
      .status,
    400,
  );
  assert.equal((await f.request('/api/unknown')).status, 404);
  assert.equal((await f.request('/game')).status, 200);
  assert.equal((await f.request('/assets/missing.js')).status, 404);
  assert.equal((await f.request('/game.sqlite')).status, 404);
  assert.equal((await f.request('/.env')).status, 404);
  f.options.origin = 'https://game.example';
  await f.restart();
  const secure = await f.request('/api/login', {
    data: { username: 'participant', password: secret },
    headers: { Origin: f.options.origin },
  });
  assert.equal(secure.status, 200);
  assert.match(secure.headers.get('set-cookie'), /; Secure/);
  f.options.origin = origin;
  await f.restart();

  const upload = await f.request('/api/claims/library/photo', {
    cookie: player.cookie,
    raw: Buffer.alloc(3 * 1024 * 1024 + 1),
    headers: {
      'X-Stamp-Key': stampKeys.library,
      'X-Photo-Consent': 'yes',
      'Content-Type': 'image/png',
    },
  });
  assert.equal(upload.status, 413);
});

test('server checks codes and quiz answers, deduplicates stamps and ignores forged user IDs', async (t) => {
  const f = await fixture(t);
  const player = await f.register();
  const other = await f.register('other-user');
  const cookie = player.cookie;
  assert.equal((await f.request('/api/resolve', { cookie, data: { key: 'GATE-26' } })).status, 400);
  assert.equal(
    (await f.request('/api/resolve', { cookie, data: { key: stampKeys.gate } })).data.spot,
    'gate',
  );
  assert.equal(
    (await f.request('/api/claims/gate', { cookie, data: { key: stampKeys.lake } })).status,
    400,
  );
  assert.equal(
    (await f.request('/api/claims/lake', { cookie, data: { key: stampKeys.lake, answer: 1 } }))
      .status,
    400,
  );
  assert.equal(
    (await f.request('/api/claims/lake', { cookie, data: { key: stampKeys.lake } })).status,
    400,
  );
  assert.equal(
    (await f.request('/api/claims/lake', { cookie, data: { key: stampKeys.lake, answer: 0 } }))
      .status,
    200,
  );
  const results = await Promise.all(
    Array.from({ length: 5 }, () =>
      f.request('/api/claims/gate', {
        cookie,
        data: { key: stampKeys.gate, userId: other.data.user.id, earnedAt: '1900-01-01' },
      }),
    ),
  );
  assert.ok(results.every((result) => result.status === 200));
  assert.equal(Object.keys(results[0].data.stamps).length, 2);
  assert.ok(Date.parse(results[0].data.stamps.gate) > Date.parse('2020-01-01'));
  assert.deepEqual((await f.request('/api/me', { cookie: other.cookie })).data.stamps, {});
});

test('photo presence never earns a stamp; only staff can review; rejection allows resubmission and approval deletes image', async (t) => {
  const f = await fixture(t);
  const player = await f.register();
  const staff = await f.staff();
  const upload = (raw, extra = {}) =>
    f.request('/api/claims/library/photo', {
      cookie: player.cookie,
      raw,
      headers: {
        'Content-Type': 'image/png',
        'X-Stamp-Key': stampKeys.library,
        'X-Photo-Consent': 'yes',
        ...extra,
      },
    });
  assert.equal(
    (
      await f.request('/api/claims/library', {
        cookie: player.cookie,
        data: { key: stampKeys.library, photo: true },
      })
    ).status,
    400,
  );
  assert.equal((await upload(png, { 'X-Photo-Consent': 'no' })).status, 400);
  assert.equal((await upload(Buffer.from('<svg onload="x"/>'))).status, 415);
  assert.equal((await upload(png, { 'Content-Type': 'image/jpeg' })).status, 415);
  const pending = await upload(png);
  assert.equal(pending.status, 202);
  assert.equal(pending.data.photos.library, 'pending');
  assert.equal(pending.data.stamps.library, undefined);
  const firstId = (await f.request('/api/staff/photos', { cookie: staff })).data[0].id;
  assert.equal((await upload(png)).status, 202);
  assert.equal(
    (await f.request(`/api/staff/photos/${firstId}`, { cookie: staff, data: { approve: true } }))
      .status,
    409,
  );

  let photos = (await f.request('/api/staff/photos', { cookie: staff })).data;
  assert.equal(photos.length, 1);
  assert.equal(
    (await f.request(`/api/staff/photos/${photos[0].id}`, { cookie: player.cookie })).status,
    403,
  );
  const image = await f.request(`/api/staff/photos/${photos[0].id}`, { cookie: staff });
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.equal(image.headers.get('cache-control'), 'no-store');
  assert.equal(image.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(
    (
      await f.request(`/api/staff/photos/${photos[0].id}`, {
        cookie: staff,
        data: { approve: false },
      })
    ).status,
    200,
  );
  assert.equal(
    (await f.request('/api/me', { cookie: player.cookie })).data.photos.library,
    'rejected',
  );
  assert.equal((await upload(png)).status, 202);
  photos = (await f.request('/api/staff/photos', { cookie: staff })).data;
  assert.equal(
    (
      await f.request(`/api/staff/photos/${photos[0].id}`, {
        cookie: staff,
        data: { approve: true },
      })
    ).status,
    200,
  );
  assert.ok((await f.request('/api/me', { cookie: player.cookie })).data.stamps.library);
  assert.equal(
    (
      await f.request(`/api/staff/photos/${photos[0].id}`, {
        cookie: staff,
        data: { approve: true },
      })
    ).status,
    409,
  );
  assert.equal(
    (await f.request(`/api/staff/photos/${photos[0].id}`, { cookie: staff })).status,
    404,
  );
  const db = new DatabaseSync(f.options.database);
  t.after(() => db.close());
  assert.equal(db.prepare('SELECT image FROM photos').get().image, null);
});

test('complete server stamps are required; concurrent redemption is exactly once; records survive restart and backup', async (t) => {
  const f = await fixture(t);
  const player = await f.register();
  const staff = await f.staff();
  const db = new DatabaseSync(f.options.database);
  t.after(() => db.close());
  const code = db
    .prepare('SELECT redeem_code FROM users WHERE id=?')
    .get(player.data.user.id).redeem_code;
  assert.equal(
    (await f.request('/api/staff/redeem', { cookie: staff, data: { code } })).status,
    409,
  );
  assert.equal(
    (await f.request('/api/staff/redeem', { cookie: player.cookie, data: { code } })).status,
    403,
  );
  for (const spot of ['lake', 'gate'])
    await f.request(`/api/claims/${spot}`, {
      cookie: player.cookie,
      data: { key: stampKeys[spot], answer: 0 },
    });
  await f.request('/api/claims/library/photo', {
    cookie: player.cookie,
    raw: png,
    headers: {
      'Content-Type': 'image/png',
      'X-Stamp-Key': stampKeys.library,
      'X-Photo-Consent': 'yes',
    },
  });
  const photo = (await f.request('/api/staff/photos', { cookie: staff })).data[0];
  await f.request(`/api/staff/photos/${photo.id}`, { cookie: staff, data: { approve: true } });
  assert.equal((await f.request('/api/me', { cookie: player.cookie })).data.redeemCode, code);
  assert.equal(
    (await f.request('/api/staff/lookup', { cookie: staff, data: { code } })).data.complete,
    true,
  );
  const results = await Promise.all(
    Array.from({ length: 6 }, () =>
      f.request('/api/staff/redeem', { cookie: staff, data: { code } }),
    ),
  );
  assert.equal(results.filter((item) => item.status === 201).length, 1);
  assert.equal(results.filter((item) => item.status === 409).length, 5);
  let records = (await f.request('/api/staff/redemptions', { cookie: staff })).data;
  assert.equal(records.length, 1);
  assert.equal(records[0].reviewer, 'staff');
  assert.equal(records[0].stamp_count, 3);
  await f.restart();
  assert.equal(
    (await f.request('/api/me', { cookie: player.cookie })).data.redemption.id,
    records[0].id,
  );
  records = (await f.request('/api/staff/redemptions', { cookie: staff })).data;
  assert.equal(records.length, 1);
  const copy = path.join(path.dirname(f.options.database), 'backup.sqlite');
  await backup(db, copy);
  const restored = new DatabaseSync(copy);
  t.after(() => restored.close());
  assert.equal(restored.prepare('SELECT count(*) as n FROM redemptions').get().n, 1);
});

test('expired photos are removed, expired sessions rejected and staff password rotation revokes old sessions', async (t) => {
  const f = await fixture(t);
  const player = await f.register();
  const staff = await f.staff();
  await f.request('/api/claims/library/photo', {
    cookie: player.cookie,
    raw: png,
    headers: {
      'Content-Type': 'image/png',
      'X-Stamp-Key': stampKeys.library,
      'X-Photo-Consent': 'yes',
    },
  });
  const db = new DatabaseSync(f.options.database);
  t.after(() => db.close());
  db.prepare("UPDATE photos SET submitted_at='2000-01-01'").run();
  assert.deepEqual((await f.request('/api/staff/photos', { cookie: staff })).data, []);
  assert.equal(db.prepare('SELECT image,status FROM photos').get().status, 'rejected');
  assert.equal(db.prepare('SELECT image FROM photos').get().image, null);
  db.prepare('UPDATE sessions SET expires_at=0 WHERE user_id=?').run(player.data.user.id);
  assert.equal((await f.request('/api/me', { cookie: player.cookie })).status, 401);
  f.options.staffPassword = 'rotated-staff-password-42';
  await f.restart();
  assert.equal((await f.request('/api/me', { cookie: staff })).status, 401);
  assert.equal(
    (
      await f.request('/api/login', {
        data: { username: 'staff', password: f.options.staffPassword },
      })
    ).status,
    200,
  );
});

test('rate limits repeated login attempts and fails closed on unsafe deployment secrets', async (t) => {
  const f = await fixture(t);
  for (let i = 0; i < 15; i++)
    assert.equal(
      (await f.request('/api/login', { data: { username: 'unknown-user', password: secret } }))
        .status,
      401,
    );
  const blocked = await f.request('/api/login', {
    data: { username: 'unknown-user', password: secret },
  });
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('retry-after'), '60');
  await assert.rejects(createApp({ ...f.options, origin: 'http://public.example' }), /HTTPS/);
  await assert.rejects(
    createApp({ ...f.options, stampKeys: { ...stampKeys, gate: 'GATE-26' } }),
    /STAMP_KEYS/,
  );
});
