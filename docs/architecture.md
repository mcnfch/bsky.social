AT Protocol Demo — Architecture

Components
- Web (`apps/web`): Next.js app on `http://localhost:7777`.
- Feed Generator (`apps/feed-generator`): Express on `http://localhost:8081`.
- Labeler (`apps/labeler`): Express on `http://localhost:8082`.
- Firehose Worker (`apps/firehose-worker`): Node worker; connects to Postgres.
- Postgres (Docker): `localhost:5434` -> `postgres:15-alpine`.

Notes
- Uses pnpm workspaces in this repo; no separate showcase repo.
- Prefer OAuth for auth; app-password fallback for dev.

