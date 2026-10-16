import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { createApp } from './app.mjs';

const database = process.env.DATABASE_PATH || '/data/game.sqlite';
mkdirSync(path.dirname(database), { recursive: true });
const app = await createApp({
  database,
  origin: process.env.APP_ORIGIN || 'http://localhost:8080',
  staffUsername: process.env.STAFF_USERNAME,
  staffPassword: process.env.STAFF_PASSWORD,
  stampKeys: JSON.parse(process.env.STAMP_KEYS || '{}'),
});
app.server.listen(8080, '0.0.0.0', () => console.log('Game server listening on :8080'));
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    app.server.close(() => {
      app.close();
      process.exit(0);
    });
  });
}
