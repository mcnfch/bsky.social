ATProto Demo Web App

Local dev target: http://localhost:7777

Scripts
- `pnpm dev`: run Next.js dev server on 7777
- `pnpm build`: build production bundle
- `pnpm start`: start production server on 7777

Notes
- OAuth is preferred for end users; app-password fallback for dev.
- The API client is centralized in `packages/shared` (to be added).

