# AT Protocol Showcase — Full‑Stack Demo

An end‑to‑end demonstration of building with Bluesky’s AT Protocol. It includes a Next.js web app, two federated services (custom feed + labeler), and a firehose worker backed by Postgres — all wired to a real PDS and AppView.

**Highlights**
- Web app (Next.js/TypeScript) with login (App Password), timeline, profile, and posting.
- Uses the correct split of concerns: writes to the PDS, reads timeline from AppView.
- Custom feed generator and labeler service skeletons with health endpoints.
- Firehose listener that ingests commit events and tracks simple metrics in Postgres.
- Monorepo with pnpm workspaces, shared helpers, Dockerized Postgres, and concise docs.

## Skills Demonstrated

- AT Protocol & Bluesky APIs: XRPC, `@atproto/api` (`BskyAgent`), app‑password sessions, PDS vs AppView separation, labelers, and lexicon‑typed calls.
- Full‑stack TypeScript: Next.js 14 + React 18 pages and components, basic session handling and error states.
- Backend services: Node/Express microservices (feed generator, labeler) with simple rules, health checks, and JSON endpoints.
- Streaming & data: `@atproto/sync` firehose consumer with cursor handling, idempotent upserts, and Postgres storage.
- Infrastructure & tooling: pnpm workspaces, shared package, Docker Compose for Postgres, environment configuration, and operational docs.
- Practical concerns: CORS with PDS/AppView, token storage for demo use, incremental rollout plan toward OAuth and CI/CD.

## What’s Included

- `apps/web`: Next.js demo on `http://localhost:7777`
  - Login (App Password against PDS), Timeline (reads from AppView), Profile lookup
  - Posts are created against the user’s PDS session
- `apps/feed-generator`: custom feed skeleton (Express), `GET /health`, placeholder `getFeedSkeleton`
- `apps/labeler`: labeler skeleton (Express), `GET /health`, simple keyword rule via `POST /label`
- `apps/firehose-worker`: ingests firehose events into Postgres (e.g., daily `post_counts`)
- `packages/shared`: shared ATProto helpers (composition point for richer clients)
- `infra/docker/docker-compose.yml`: Postgres on host port `5434`
- `docs/architecture.md`, `docs/operations.md`: architecture and local ops notes

## Quick Start

Prereqs: Node 18+, pnpm, Docker.

1) Start Postgres
- `cd infra/docker && docker compose up -d postgres`
- Connection: host `localhost`, port `5434`, db `atproto`, user `atproto`, password `atproto`.

2) Run the web app
- `cd apps/web && pnpm install && pnpm dev`
- Open `http://localhost:7777`

3) Sign in (App Password)
- Service: `https://bsky.social` (or your PDS)
- Handle: your.handle.bsky.social (or DID)
- App Password: from Bluesky Settings → App Passwords
- After login: timeline loads from `https://api.bsky.app`; posting writes via your PDS session.

Optional services
- Feed generator: `cd apps/feed-generator && pnpm install && pnpm dev` → `http://localhost:8081/health`
- Labeler: `cd apps/labeler && pnpm install && pnpm dev` → `http://localhost:8082/health`
- Firehose worker: `cd apps/firehose-worker && pnpm install && pnpm dev` (writes basic metrics into Postgres)

## Implementation Notes

- Auth: prioritizes App Passwords for demo; OAuth is the next step (PKCE + server exchange).
- PDS vs AppView: login and writes target the PDS; timeline reads from AppView.
- Sessions: stored in browser storage for demo purposes; can be swapped for cookie‑backed sessions.
- Firehose: uses `@atproto/sync` subscription with a persisted cursor; minimal schema for analytics.
- Extensibility: a custom lexicon and CRUD UI can be added following the same patterns.

## Next Steps (Roadmap)

- OAuth (PKCE), persisted sessions, and token rotation.
- Publish custom feeds and surface feed IDs in the UI; add a feed explorer.
- Labeler rules editor, on/off toggles, and label audits in the UI.
- Expand firehose analytics (hashtags, authors, labels) with charts.
- Add CI: type‑check, lint, test, build, and deploy workflows.
- Custom lexicon + CRUD views (validation against lexicons).
