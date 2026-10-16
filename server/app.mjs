import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { promisify } from 'node:util';
import { createGzip } from 'node:zlib';
import { stampSpots } from '../src/data/stamps.ts';

const scrypt = promisify(scryptCallback);
const sha = (value) => createHash('sha256').update(value).digest('hex');
const token = () => randomBytes(32).toString('base64url');
const date = () => new Date().toISOString();
const MAX_PHOTO = 3 * 1024 * 1024;
const SESSION_AGE = 7 * 24 * 60 * 60;
const COOKIE = 'songying-session';
const PUBLIC_SPOTS = new Set(stampSpots.map((spot) => spot.id));
// shortcut: the approved prototype has one quiz; add server-only answers when tasks change.
const ANSWERS = { lake: 0 };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const fail = (status, message) => {
  throw new HttpError(status, message);
};
function username(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9._-]{2,31}$/i.test(value.trim()))
    fail(400, '帳號須為 3 至 32 個英文字母、數字、點、底線或連字號。');
  return value.trim().toLowerCase();
}
function password(value) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128)
    fail(400, '密碼須為 12 至 128 個字元。');
  return value;
}
async function passwordHash(value) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${Buffer.from(await scrypt(value, salt, 64)).toString('hex')}`;
}
async function passwordMatches(value, hash) {
  const [salt, expected] = hash.split(':');
  const actual = Buffer.from(await scrypt(value, salt, 64));
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
function imageType(bytes) {
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return 'image/png';
  if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return 'image/jpeg';
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  )
    return 'image/webp';
  fail(415, '請上傳 JPEG、PNG 或 WebP 照片。');
}
async function body(req, limit) {
  if (Number(req.headers['content-length']) > limit) fail(413, '上傳內容超過大小限制。');
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        chunks.length = 0;
        reject(new HttpError(413, '上傳內容超過大小限制。'));
      } else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
    req.on('aborted', () => reject(new HttpError(400, '上傳已中斷。')));
  });
}
async function jsonBody(req) {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json')
    fail(415, '請使用 JSON 請求。');
  try {
    const data = JSON.parse((await body(req, 4096)).toString('utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail(400, '資料格式錯誤。');
    return data;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    fail(400, '資料格式錯誤。');
  }
}

export async function createApp({
  database,
  origin,
  staffUsername,
  staffPassword,
  stampKeys,
  staticDir = 'dist',
}) {
  const publicOrigin = new URL(origin);
  if (
    !['http:', 'https:'].includes(publicOrigin.protocol) ||
    publicOrigin.origin !== origin ||
    (publicOrigin.protocol === 'http:' &&
      !['localhost', '127.0.0.1', '[::1]'].includes(publicOrigin.hostname))
  )
    throw new Error('APP_ORIGIN must be an HTTPS origin, or HTTP localhost for development');
  const staffName = username(staffUsername);
  password(staffPassword);
  const keys = Object.values(stampKeys ?? {});
  if (
    keys.length !== PUBLIC_SPOTS.size ||
    [...PUBLIC_SPOTS].some((id) => typeof stampKeys[id] !== 'string') ||
    keys.some((key) => !/^[A-Z0-9-]{16,80}$/.test(key) || /REPLACE|CHANGE|EXAMPLE/.test(key)) ||
    new Set(keys).size !== keys.length
  )
    throw new Error(
      'STAMP_KEYS must contain a unique uppercase secret (16-80 characters) for every spot',
    );

  const db = new DatabaseSync(database);
  db.exec(
    'PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;',
  );
  if (db.prepare('PRAGMA user_version').get().user_version > 1)
    throw new Error('Database schema is newer than this server');
  db.exec(
    [
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('player','staff')), redeem_code TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL)",
      'CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL)',
      'CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id)',
      'CREATE TABLE IF NOT EXISTS stamps (user_id TEXT NOT NULL REFERENCES users(id), spot_id TEXT NOT NULL, earned_at TEXT NOT NULL, method TEXT NOT NULL, PRIMARY KEY(user_id,spot_id))',
      "CREATE TABLE IF NOT EXISTS photos (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), spot_id TEXT NOT NULL, image BLOB, mime TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')), consent_at TEXT NOT NULL, submitted_at TEXT NOT NULL, reviewed_at TEXT, reviewer TEXT, UNIQUE(user_id,spot_id))",
      'CREATE TABLE IF NOT EXISTS redemptions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE REFERENCES users(id), redeemed_at TEXT NOT NULL, reviewer TEXT NOT NULL, stamp_count INTEGER NOT NULL)',
      'CREATE INDEX IF NOT EXISTS photos_pending ON photos(status,submitted_at)',
      'PRAGMA user_version=1',
    ].join(';'),
  );
  const transaction = (fn) => {
    db.exec('BEGIN IMMEDIATE');
    try {
      const result = fn();
      db.exec('COMMIT');
      return result;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  };
  const existingStaff = db.prepare('SELECT * FROM users WHERE username=?').get(staffName);
  if (existingStaff && existingStaff.role !== 'staff')
    throw new Error('STAFF_USERNAME belongs to a player; choose a different staff account');
  if (!existingStaff) {
    db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?)').run(
      randomUUID(),
      staffName,
      await passwordHash(staffPassword),
      'staff',
      randomBytes(12).toString('hex').toUpperCase(),
      date(),
    );
  } else if (!(await passwordMatches(staffPassword, existingStaff.password_hash))) {
    const hash = await passwordHash(staffPassword);
    transaction(() => {
      db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash, existingStaff.id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(existingStaff.id);
    });
  }
  const expirePhotos = () => {
    db.prepare(
      "UPDATE photos SET image=NULL,status='rejected',reviewed_at=?,reviewer='system:expiry' WHERE status='pending' AND submitted_at<?",
    ).run(date(), new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
  };
  expirePhotos();
  const cleanup = setInterval(expirePhotos, 60 * 60 * 1000);
  cleanup.unref();
  const dummyHash = await passwordHash(token());
  const root = path.resolve(staticDir);
  const buckets = new Map();
  const limited = (key, limit) => {
    const now = Date.now();
    if (buckets.size >= 10000) {
      for (const [name, bucket] of buckets) if (bucket.until <= now) buckets.delete(name);
      if (buckets.size >= 10000 && !buckets.has(key)) fail(429, '目前流量較高，請稍後再試。');
    }
    let bucket = buckets.get(key);
    if (!bucket || bucket.until <= now) {
      bucket = { count: 0, until: now + 60000 };
      buckets.set(key, bucket);
    }
    if (++bucket.count > limit) fail(429, '操作太頻繁，請稍後再試。');
  };
  const cookie = (value, maxAge = SESSION_AGE) =>
    COOKIE +
    '=' +
    value +
    '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' +
    maxAge +
    (publicOrigin.protocol === 'https:' ? '; Secure' : '');
  const sessionToken = (req) => {
    const raw = (req.headers.cookie ?? '')
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE}=`))
      ?.slice(COOKIE.length + 1);
    return raw && /^[\w-]{43}$/.test(raw) ? sha(raw) : '';
  };
  const userFor = (req) => {
    const user = db
      .prepare(
        'SELECT users.*, sessions.token_hash FROM sessions JOIN users ON users.id=sessions.user_id WHERE token_hash=? AND expires_at>?',
      )
      .get(sessionToken(req), Date.now());
    if (!user) fail(401, '請先登入。');
    return user;
  };
  const staffFor = (req) => {
    const user = userFor(req);
    if (user.role !== 'staff') fail(403, '此功能只開放工作人員使用。');
    return user;
  };
  const issueSession = (res, id) => {
    const raw = token();
    db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(Date.now());
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(
      sha(raw),
      id,
      Date.now() + SESSION_AGE * 1000,
    );
    res.setHeader('Set-Cookie', cookie(raw));
  };
  const playerFor = (req) => {
    const user = userFor(req);
    if (user.role !== 'player') fail(403, '工作人員帳號不參加集章兌獎。');
    return user;
  };
  const complete = (id) => {
    const spots = new Set(
      db
        .prepare('SELECT spot_id FROM stamps WHERE user_id=?')
        .all(id)
        .map((row) => row.spot_id),
    );
    return [...PUBLIC_SPOTS].every((spot) => spots.has(spot));
  };
  const view = (user) => ({
    user: { id: user.id, username: user.username, role: user.role },
    stamps: Object.fromEntries(
      db
        .prepare('SELECT spot_id,earned_at FROM stamps WHERE user_id=?')
        .all(user.id)
        .map((row) => [row.spot_id, row.earned_at]),
    ),
    photos: Object.fromEntries(
      db
        .prepare('SELECT spot_id,status FROM photos WHERE user_id=?')
        .all(user.id)
        .map((row) => [row.spot_id, row.status]),
    ),
    redeemCode: user.role === 'player' && complete(user.id) ? user.redeem_code : null,
    redemption:
      db.prepare('SELECT id,redeemed_at,reviewer FROM redemptions WHERE user_id=?').get(user.id) ??
      null,
  });
  const writeStamp = (id, spot) =>
    db
      .prepare('INSERT INTO stamps VALUES (?,?,?,?) ON CONFLICT(user_id,spot_id) DO NOTHING')
      .run(id, spot.id, date(), spot.method);
  const claimSpot = (key, id) => {
    if (typeof key !== 'string' || key.length > 80) fail(400, '集章點代碼無效。');
    const normalized = key.trim().toUpperCase();
    const spot = stampSpots.find((item) => sha(stampKeys[item.id]) === sha(normalized));
    if (!spot || (id && spot.id !== id)) fail(400, '集章點代碼無效。');
    return spot;
  };
  const send = (res, status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(JSON.stringify(value));
  };
  async function api(req, res, url) {
    expirePhotos();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    if (req.method === 'POST' && req.headers.origin !== origin)
      fail(403, '請從集章 App 送出操作。');
    const ip = req.socket.remoteAddress;
    if (url.pathname === '/api/register' && req.method === 'POST') {
      limited(`auth:${ip}`, 60);
      const input = await jsonBody(req);
      const name = username(input.username);
      const secret = password(input.password);
      if (db.prepare('SELECT id FROM users WHERE username=?').get(name))
        fail(409, '此帳號已有人使用。');
      const hash = await passwordHash(secret);
      const id = randomUUID();
      transaction(() => {
        // Concurrent registrations are serialized by the unique username constraint.
        if (db.prepare('SELECT id FROM users WHERE username=?').get(name))
          fail(409, '此帳號已有人使用。');
        db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?)').run(
          id,
          name,
          hash,
          'player',
          randomBytes(12).toString('hex').toUpperCase(),
          date(),
        );
        issueSession(res, id);
      });
      return send(res, 201, view(db.prepare('SELECT * FROM users WHERE id=?').get(id)));
    }
    if (url.pathname === '/api/login' && req.method === 'POST') {
      limited(`auth:${ip}`, 60);
      const input = await jsonBody(req);
      const name = username(input.username);
      const secret = password(input.password);
      limited(`login:${sha(name)}`, 15);
      const user = db.prepare('SELECT * FROM users WHERE username=?').get(name);
      const matches = await passwordMatches(secret, user?.password_hash ?? dummyHash);
      if (!user || !matches) fail(401, '帳號或密碼錯誤。');
      issueSession(res, user.id);
      return send(res, 200, view(user));
    }
    if (url.pathname === '/api/logout' && req.method === 'POST') {
      await jsonBody(req);
      db.prepare('DELETE FROM sessions WHERE token_hash=?').run(sessionToken(req));
      res.setHeader('Set-Cookie', cookie('', 0));
      return send(res, 200, { ok: true });
    }
    if (url.pathname === '/api/me' && req.method === 'GET')
      return send(res, 200, view(userFor(req)));
    if (url.pathname === '/api/resolve' && req.method === 'POST') {
      const user = playerFor(req);
      limited(`claim:${user.id}`, 60);
      const input = await jsonBody(req);
      return send(res, 200, { spot: claimSpot(input.key).id });
    }
    const claim = url.pathname.match(/^\/api\/claims\/([a-z-]+)$/);
    if (claim && req.method === 'POST') {
      const user = playerFor(req);
      limited(`claim:${user.id}`, 60);
      const input = await jsonBody(req);
      const spot = claimSpot(input.key, claim[1]);
      if (spot.method === 'photo') fail(400, '拍照任務需要上傳並通過審核。');
      if (spot.method === 'quiz' && input.answer !== ANSWERS[spot.id])
        fail(400, '答案不正確，請再讀一次說明牌。');
      writeStamp(user.id, spot);
      return send(res, 200, view(user));
    }
    const upload = url.pathname.match(/^\/api\/claims\/([a-z-]+)\/photo$/);
    if (upload && req.method === 'POST') {
      const user = playerFor(req);
      limited(`claim:${user.id}`, 20);
      const spot = claimSpot(req.headers['x-stamp-key'], upload[1]);
      if (spot.method !== 'photo' || req.headers['x-photo-consent'] !== 'yes')
        fail(400, '請先同意照片上傳與審核用途。');
      if (db.prepare('SELECT 1 FROM stamps WHERE user_id=? AND spot_id=?').get(user.id, spot.id))
        fail(409, '這個章已完成。');
      const bytes = await body(req, MAX_PHOTO);
      if (db.prepare('SELECT 1 FROM stamps WHERE user_id=? AND spot_id=?').get(user.id, spot.id))
        fail(409, '這個章已完成。');
      const mime = imageType(bytes);
      if (req.headers['content-type'] !== mime) fail(415, '照片格式與內容不符。');
      const now = date();
      db.prepare(
        "INSERT INTO photos VALUES (?,?,?,?,?,'pending',?,?,NULL,NULL) ON CONFLICT(user_id,spot_id) DO UPDATE SET id=excluded.id,image=excluded.image,mime=excluded.mime,status='pending',consent_at=excluded.consent_at,submitted_at=excluded.submitted_at,reviewed_at=NULL,reviewer=NULL",
      ).run(randomUUID(), user.id, spot.id, bytes, mime, now, now);
      return send(res, 202, view(user));
    }
    if (url.pathname.startsWith('/api/staff/')) {
      const staff = staffFor(req);
      limited(`staff:${staff.id}`, 120);
      if (url.pathname === '/api/staff/photos' && req.method === 'GET') {
        return send(
          res,
          200,
          db
            .prepare(
              "SELECT photos.id,photos.spot_id,photos.submitted_at,users.username FROM photos JOIN users ON users.id=photos.user_id WHERE status='pending' ORDER BY submitted_at LIMIT 100",
            )
            .all(),
        );
      }
      const photo = url.pathname.match(/^\/api\/staff\/photos\/([a-f0-9-]+)$/);
      if (photo && req.method === 'GET') {
        const row = db
          .prepare("SELECT image,mime FROM photos WHERE id=? AND status='pending'")
          .get(photo[1]);
        if (!row?.image) fail(404, '照片不存在或已完成審核。');
        res.writeHead(200, {
          'Content-Type': row.mime,
          'Content-Security-Policy': "default-src 'none'; sandbox",
          'Content-Disposition': 'inline',
        });
        return res.end(row.image);
      }
      if (photo && req.method === 'POST') {
        const input = await jsonBody(req);
        if (typeof input.approve !== 'boolean') fail(400, '請選擇通過或退回。');
        transaction(() => {
          const row = db
            .prepare("SELECT * FROM photos WHERE id=? AND status='pending'")
            .get(photo[1]);
          if (!row) fail(409, '照片已由其他工作人員處理。');
          const spot = stampSpots.find((item) => item.id === row.spot_id);
          if (spot?.method !== 'photo') fail(409, '集章點設定已變更，無法審核。');
          if (input.approve) writeStamp(row.user_id, spot);
          db.prepare(
            'UPDATE photos SET status=?,image=NULL,reviewed_at=?,reviewer=? WHERE id=?',
          ).run(input.approve ? 'approved' : 'rejected', date(), staff.username, row.id);
        });
        return send(res, 200, { ok: true });
      }
      if (url.pathname === '/api/staff/lookup' && req.method === 'POST') {
        const input = await jsonBody(req);
        if (typeof input.code !== 'string' || !/^[A-F0-9]{24}$/.test(input.code))
          fail(400, '兌獎碼格式不正確。');
        const user = db
          .prepare('SELECT * FROM users WHERE redeem_code=? AND role=?')
          .get(input.code, 'player');
        if (!user) fail(404, '找不到此兌獎碼。');
        return send(res, 200, {
          username: user.username,
          complete: complete(user.id),
          redemption: view(user).redemption,
        });
      }
      if (url.pathname === '/api/staff/redeem' && req.method === 'POST') {
        const input = await jsonBody(req);
        if (typeof input.code !== 'string' || !/^[A-F0-9]{24}$/.test(input.code))
          fail(400, '兌獎碼格式不正確。');
        const receipt = transaction(() => {
          const user = db
            .prepare("SELECT * FROM users WHERE redeem_code=? AND role='player'")
            .get(input.code);
          if (!user) fail(404, '找不到此兌獎碼。');
          if (!complete(user.id)) fail(409, '尚未集滿全部章，無法兌獎。');
          if (db.prepare('SELECT 1 FROM redemptions WHERE user_id=?').get(user.id))
            fail(409, '此帳號已兌獎，不能重複領取。');
          const record = {
            id: randomUUID(),
            username: user.username,
            redeemed_at: date(),
            reviewer: staff.username,
          };
          db.prepare('INSERT INTO redemptions VALUES (?,?,?,?,?)').run(
            record.id,
            user.id,
            record.redeemed_at,
            record.reviewer,
            PUBLIC_SPOTS.size,
          );
          return record;
        });
        return send(res, 201, receipt);
      }
      if (url.pathname === '/api/staff/redemptions' && req.method === 'GET')
        return send(
          res,
          200,
          db
            .prepare(
              'SELECT redemptions.id,users.username,redeemed_at,reviewer,stamp_count FROM redemptions JOIN users ON users.id=redemptions.user_id ORDER BY redeemed_at DESC LIMIT 100',
            )
            .all(),
        );
    }
    fail(404, '找不到此 API。');
  }

  const types = {
    '.html': 'text/html;charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain;charset=utf-8',
  };
  const server = createServer({ maxHeaderSize: 8192 }, async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    try {
      const url = new URL(req.url, origin);
      if (url.pathname.startsWith('/api/')) return await api(req, res, url);
      if (!['GET', 'HEAD'].includes(req.method)) fail(405, '不支援此操作。');
      if (url.pathname === '/healthz') {
        db.prepare('SELECT 1').get();
        res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
        return res.end(req.method === 'HEAD' ? undefined : 'ok');
      }
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.split('/').some((part) => part.startsWith('.')) || decoded.includes('\0'))
        fail(404, '找不到檔案。');
      let file = path.resolve(root, `.${decoded}`);
      if (!file.startsWith(root + path.sep) && file !== root) fail(404, '找不到檔案。');
      let info;
      try {
        info = await stat(file);
      } catch {}
      if (!info?.isFile()) {
        if (!/^\/(?:game|play|staff)?\/?$/.test(decoded) && !/^\/stamp\/[a-z-]+\/?$/.test(decoded))
          fail(404, '找不到檔案。');
        file = path.join(root, 'index.html');
        info = await stat(file);
      }
      const ext = path.extname(file);
      if (!types[ext]) fail(404, '找不到檔案。');
      res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream');
      res.setHeader(
        'Cache-Control',
        decoded.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      );
      if (req.method === 'HEAD') {
        res.setHeader('Content-Length', info.size);
        return res.end();
      }
      const stream = createReadStream(file);
      stream.on('error', () => res.destroy());
      if (
        /\b(gzip)\b/.test(req.headers['accept-encoding'] ?? '') &&
        ['.html', '.js', '.css', '.json', '.svg'].includes(ext)
      ) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
        stream
          .pipe(createGzip())
          .on('error', () => res.destroy())
          .pipe(res);
      } else {
        res.setHeader('Content-Length', info.size);
        stream.pipe(res);
      }
    } catch (error) {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      if (error.status === 429) res.setHeader('Retry-After', '60');
      if (!error.status) console.error('Request failed:', error.code ?? error.name);
      send(res, error.status ?? 500, {
        error: error.status ? error.message : '服務暫時無法使用，請稍後再試。',
      });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.maxRequestsPerSocket = 100;
  return {
    server,
    close: () => {
      clearInterval(cleanup);
      db.close();
    },
  };
}
