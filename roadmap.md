# AT Protocol Showcase — Roadmap

A practical, end‑to‑end plan to build a public demo site that proves proficiency with Bluesky’s AT Protocol (TypeScript reference implementation) and the surrounding ecosystem.

> **Outcomes**
>
> 1. A live **demo site** (Next.js/TypeScript) showing real atproto features end‑to‑end. 2) Two **federated services** (custom feed + labeler) deployed publicly. 3) A **self‑hosted PDS** running in dev and (optionally) federation. 4) **Code + docs** that are portfolio‑ready and interview‑ready.

---

## 0) Success Criteria (what “done” looks like)

* **Live URL** with working login (OAuth priority; app‐password fallback), profile, timeline, composer, and post interactions (reply/repost/like/upload image).
* **Custom Feed Generator** published (e.g., “Chattanooga Tech”), visible in Bluesky.
* **Labeler Service** applying a visible label (e.g., “demo\:music” for posts matching rules) and rendered in UI.
* **Dev PDS** runs locally (Docker) and can federate with main network; optional **account portability demo** (handle + DID link, simple migration walkthrough).
* **Firehose listener** stores events in Postgres and powers a small analytics page.
* **Custom Lexicon** (your namespace) + records written & read by the app.
* **Automation**: tests + CI, one‑click deploys, observability, and docs.

---

## 1) Project Structure

```
repo/
  apps/
    web/                 # Next.js 14/15 app (TypeScript)
    feed-generator/      # Custom feed service (Node/TypeScript)
    labeler/             # Simple labeler service (Node/TypeScript)
    firehose-worker/     # Firehose -> Postgres ingestor
  packages/
    shared/              # Shared types, utilities, AT helpers
  infra/
    docker/              # docker-compose for local PDS, db, services
    k8s/                 # optional: manifests/helm for prod
  docs/
    architecture.md
    operations.md
    CONTRIBUTING.md
  .github/workflows/
```

---

## 2) Milestones & Timeline

### M0 — Orientation & Local Dev (0.5–1 day)

* Clone **bluesky‑social/atproto** and scan `README`, `lexicons/`, and `services/*`.
* Install Node 18 + pnpm; run `make nvm-setup && make deps && make build` in the reference repo to understand the toolchain.
* Create a fresh mono‑repo with **Turborepo** or **pnpm workspaces**.

**Deliverables**

* Repo bootstrapped; CI lint/test passing.

---

### M1 — Web App Skeleton (1–2 days)

* Next.js app with: auth flow shell, baseline pages (Home, Profile, Feeds, Admin, Analytics).
* Add `@atproto/api` client wrapper in `packages/shared` (centralized API access, token storage).
* Implement **OAuth first**, **app‑password** fallback (for CLI/dev).

**Acceptance**

* Can sign in with a Bluesky account; token securely stored; logout works.

---

### M2 — Core Social Flows (1–2 days)

* **Read**: user profile, timeline, notifications.
* **Write**: create post, reply, quote, repost, like; **image upload** via blob API.
* **Search**: people/posts; **graph**: follow/unfollow, lists.
* Polished UI/UX with optimistic updates + error toasts.

**Acceptance**

* Demo video/gif of full create‑reply‑like loop; images render; pagination works.

---

### M3 — Custom Feed Generator (1–2 days)

* Start from Bluesky’s **feed‑generator** template.
* Implement *Topic Feeds* (e.g., Chattanooga/AI/EDM): keyword rules + ranking (freshness, engagement, author whitelist/blacklist).
* Publish feed; expose metadata; provide a **Feed ID** users can add in the Bluesky app.
* Add a **Feed Explorer** page in the web app.

**Acceptance**

* Feed appears in Bluesky; web app lists and previews feed items.

---

### M4 — Labeler Service (1 day)

* Simple rules engine (regex/keyword/list) → apply labels (e.g., `demo:music`, `demo:tech`).
* Ensure labels are visible in client views; add a toggle to show/hide labeled content.

**Acceptance**

* Posts matching rules display labels consistently in web app.

---

### M5 — Firehose & Analytics (1–2 days)

* Subscribe to the **firehose**; ingest commit events into Postgres.
* Compute small metrics (posts/day, popular hashtags, author counts, label counts).
* Analytics page with charts + basic filters.

**Acceptance**

* Live dashboard updates (interval or websockets) from ingested data.

---

### M6 — Self‑Hosted PDS (Dev) (0.5–1 day)

* Dockerized PDS for local development; configure handle as `did:web` for your domain in dev docs.
* (Optional) Federate with main network using test account; document DNS TXT / `.well‑known` steps.

**Acceptance**

* `docker compose up` runs PDS; you can resolve DID/handle locally.

---

### M7 — Custom Lexicon + Records (0.5–1 day)

* Define `com.yourname.note` (or `com.yourname.bookmark`) lexicon JSON.
* Write/read records from the app; render on Profile; add basic moderation (delete/edit).
* Document lexicon design choices.

**Acceptance**

* Round‑trip record CRUD works and validates against the lexicon.

---

### M8 — Hardening, Tests, & CI/CD (1–2 days)

* Unit + integration tests for auth, posting, feed endpoints.
* GitHub Actions: type‑check, lint, test, build, container publish, deploy.
* Security: secrets in env/CI, audit deps, rate‑limit, basic abuse checks.

**Acceptance**

* Green CI; one‑click deploy to prod (Render/Fly/OVH/Vercel + Docker services).

---

### M9 — Docs, Demos, & DevRel Angle (0.5–1 day)

* `docs/architecture.md`: diagrams (PDS ↔ AppView ↔ Services ↔ Client).
* `docs/operations.md`: runbooks (migrations, outages, keys, DNS, backups).
* Short **demo video** and **blog post** explaining trade‑offs and lessons learned.

**Acceptance**

* Public README with badges, screenshots, and quick‑start.

---

## 3) Feature Backlog (prioritized)

1. **OAuth auth** (PKCE SPA + server exchange) with persisted sessions.
2. **Post composer** with rich text facets (links/mentions) + image uploads.
3. **Timeline** (home + custom feed switcher) w/ infinite scroll.
4. **Profile** (posts, likes, media, lists), **follow** controls.
5. **Custom feed** (topic ranking, admin rules UI, pagination).
6. **Labeler** (rules editor, label visibility toggles, audit log).
7. **Firehose** (cursor checkpointing, retry logic, idempotent upserts).
8. **Custom lexicon** (schema, validator, CRUD UI).
9. **Settings** (app passwords management UI for dev; token revoke).
10. **Observability** (structured logs, request timing, minimal traces).

---

## 4) Technical Notes & Implementation Hints

### Identity & Handles

* Use `@atproto/identity` helpers to resolve **handle → DID** and back.
* Support `did:web` for dev/testing; document DNS TXT + `/.well-known/atproto-did`.

### XRPC & Lexicons

* Centralize all XRPC calls in a thin client module; generate types from lexicons.
* Keep your own lexicons in `packages/shared/lexicons/` and validate payloads.

### Custom Feeds

* Implement `app.bsky.feed.getFeedSkeleton` endpoint in feed‑generator.
* Ranking inputs: recency, author trust lists, keyword boosts, engagement.

### Labeler

* Start with deterministic keyword/regex rules; provide a simple admin UI.
* Persist decisions (postURI, label, reason, timestamp, ruleId) for audits.

### Firehose

* Consume commit stream; store minimal normalized tables (actors, posts, labels, links).
* Use cursors and retries; keep ingestion idempotent.

### Security & Abuse

* Prefer **OAuth** for end‑users; use **App Passwords** only for dev/CLI.
* Guard writes with rate limiting; sanitize uploads; validate all records.

---

## 5) Local & Prod Environments

### Local (Docker Compose)

* **Services**: PDS, Postgres, feed‑generator, labeler, firehose‑worker, MinIO (blobs), web.
* Seed with a test account + fixtures; include `make up`, `make logs`, `make down` targets.

### Production

* One of: Fly.io, Render, OVH, or Kubernetes on your hypervisor.
* Separate Postgres + object storage; add managed TLS; HTTP/2 or HTTP/3.

---

## 6) Example Tasks (Checklists)

### A) OAuth Sign‑in (SPA → API)

* [ ] Register OAuth client; configure redirect URIs.
* [ ] Implement PKCE in web app; exchange code → tokens server‑side.
* [ ] Store access/refresh tokens (HTTP‑only cookie); rotate on refresh.
* [ ] Fallback: dev‑only app‑password login for CLI tools.

### B) Post Composer

* [ ] Text + facets (mentions, links) editor.
* [ ] Image upload → blob; attach to record; thumbnail preview.
* [ ] Error handling & optimistic UI; retry on transient failures.

### C) Custom Feed

* [ ] Bootstrap from template; add rules; rank & paginate.
* [ ] Publish feed; capture Feed URI/ID; document how to add in app.
* [ ] Health endpoint + logs; pinned example queries.

### D) Labeler

* [ ] Rule engine MVP; label application endpoint.
* [ ] UI toggle; moderation badge in post card.
* [ ] Metrics: labeled posts/day, top labels.

### E) Firehose

* [ ] Consumer with cursor; backoff/retry.
* [ ] Normalize and persist events; minimal indexes.
* [ ] Analytics page with top authors/tags in last 24h/7d.

---

## 7) Documentation Plan

* **README**: elevator pitch, screenshots, quick start, links to live demo & feeds.
* **Architecture**: sequence diagrams (auth, posting, feed fetch, label application).
* **Operations**: playbooks for DNS, DID/handle, secrets, backups.
* **API**: list of XRPCs used + your custom lexicons.

---

## 8) Stretch Goals

* **Account Portability Demo**: migrate account between PDS instances.
* **Advanced Ranking**: RRF/BM25 hybrid ranking for feeds.
* **Realtime UI**: SSE/WebSocket updates from feed/label events.
* **Federation Experiments**: interop tests with alternate PDS implementations.

---

## 9) Talking Points for Interviews / README Highlights

* Why OAuth > app passwords for end‑users; how tokens/refresh flow are handled.
* How custom feeds and labelers compose with AppView and PDS.
* Safety & abuse trade‑offs (labels, rate limits, auditability).
* Lexicon design rationale and future extension plan.
* Migration & portability story (DID & handle control).

---

## 10) References to Include in Docs (add links)

* AT Protocol overview/specs, OAuth docs, XRPC API reference, custom feeds starter, PDS self‑hosting, handle/DID guides.

---

### Appendix: Minimal "@atproto/api" Usage Snippets (pseudo‑code)

```ts
// login (OAuth access token already acquired on server)
import { AtpAgent } from '@atproto/api'

export async function makeAgent(accessJwt: string, service = 'https://api.bsky.app') {
  const agent = new AtpAgent({ service })
  agent.setHeader('Authorization', `Bearer ${accessJwt}`)
  return agent
}

// create a post
export async function createPost(agent: AtpAgent, text: string, facets?: any) {
  return agent.post.create({
    repo: 'did:example:yourdid',
    collection: 'app.bsky.feed.post',
  }, {
    $type: 'app.bsky.feed.post',
    text,
    facets,
    createdAt: new Date().toISOString(),
  })
}

// get a timeline page
export async function getTimeline(agent: AtpAgent, cursor?: string) {
  return agent.app.bsky.feed.getTimeline({ cursor, limit: 30 })
}
```

> Keep real code in `packages/shared/at.ts` and wrap all XRPC calls centrally. Add Zod/valibot validation on IO boundaries.
