ATProto Demo Labeler

Local default port: 8082

Endpoints
- `GET /health` — basic health check
- `POST /label` — JSON body `{ text: string }` -> `{ labels: [{label, reason}] }`

