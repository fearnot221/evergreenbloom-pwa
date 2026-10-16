# 松櫻祭 · 集章 PWA

Independent game app extracted from the public website:
https://github.com/fearnot221/evergreenbloom . This repository deploys entirely with
Docker, not GitHub Pages. Owns the installation guide, QR entry and stamp book;
festival information and the map link to the official website.

## Run with Docker

```sh
docker compose up -d --build
```

Open http://localhost:8080 . `/game` explains installation in a browser tab; install
from `/play` and open from the home screen to collect stamps. `/stamp/lake?k=LAKE-26`
is a prototype QR entry. All spots, keys, tasks and placements are unconfirmed fixtures.
The HTTP listener binds to loopback by default; `PWA_PORT` changes its local port.

```sh
docker compose ps
docker compose logs -f
docker compose down
```

Nginx serves the built PWA and SPA deep links. `/healthz` is a health endpoint.
Missing hashed assets return 404; `sw.js`, the manifest and HTML use revalidation,
while hashed assets are immutable. No Node/Vite dev server runs in production.
The Docker build runs the full checks before producing the Nginx image.

## Production and URLs

Choose a dedicated HTTPS origin (for example `https://play.example.org`, not an
assigned address). Terminate HTTPS using the server's reverse proxy and forward to
this container's local port. HTTPS is required outside localhost for service workers
and installation. This image expects root deployment, not a URL subdirectory.
A remote proxy on a different host/network needs an explicitly configured port/network;
Compose's default loopback binding intentionally exposes only the local machine.

Copy `.env.example` to `.env` to set `VITE_WEBSITE_URL` if the official-site address
changes. It is a **build argument**: rebuild after changing it. The default website is
https://fearnot221.github.io/evergreenbloom/ . After choosing the game's origin, set
that origin as the official repository's `VITE_PWA_URL` Actions variable and redeploy
its Pages workflow. Print QR codes using the **game origin** and `/stamp/<spot>?k=<key>`.
Do not print new codes pointing to the official site.

## Development and checks

```sh
npm ci
npm run dev
npm run check
npm run build
```

`/game?standalone` allows browser-tab testing in development only. Production keeps
the installed-app gate. No packages, files or services from a sibling checkout are
needed. The copied design and typed content are independent snapshots; update both
repositories deliberately when shared copy/design changes. No shared package or API
was introduced for the split.

## Offline and existing installations

Use the existing footer save action to save game code and instructions. It does not
save the official map or festival pages. Existing service-worker update behavior is
retained: old clients close before activation; no forced reload. Unseen/evicted caches
cannot guarantee offline operation. Installation and QR handoff on real iOS/Android
still need device testing. A new origin cannot read old device-local stamps: reinstall
from the game URL; no record migration is implemented.

## Prototype limit

Docker provides deployment, not a game backend. Stamps still use localStorage, answers
and keys are client-side, and photo tasks check file presence without upload/review.
Login, trusted progress, database, abuse controls and prize redemption are **not
implemented**. This image is suitable for reviewing the existing prototype, not
operating a prize-bearing event. A future backend and its persistence belong here.

See docs/DESIGN.md for tokens, docs/ARCHITECTURE.md for boundaries and
 docs/PROTOTYPE-NOTES.md for actual verification. Historical combined-app docs are
retained as provenance; current boundary notes take precedence.
