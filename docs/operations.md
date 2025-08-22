Operations — Local Dev

Prereqs
- Node 18+, pnpm, Docker.

Start Postgres
- `cd infra/docker && docker compose up -d postgres`
- Connection: host `localhost`, port `5434`, db `atproto`, user `atproto`, password `atproto`.

Run services (development)
- Web: `cd apps/web && pnpm dev` (serves on 7777)
- Feed generator: `cd apps/feed-generator && pnpm dev` (serves on 8081)
- Labeler: `cd apps/labeler && pnpm dev` (serves on 8082)
- Firehose worker: `cd apps/firehose-worker && pnpm dev`

Environment
- Configure service URLs and secrets via `.env.local` files per app.

