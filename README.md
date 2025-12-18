# ContentOS

Production-ready MVP SaaS for generating and scheduling viral content.

## Structure
- `apps/web`: Next.js frontend.
- `packages/`: Shared packages (db, workers, ai, connectors).

## Quick Start

1. `npm install`
2. `docker compose up -d`
3. `npx turbo run db:push`
4. `npx turbo run db:seed`
5. `npm run dev` (Web)
6. `cd packages/workers && npm run dev` (Workers)

## Environment
See `.env.example`. Copy to `.env` (managed by monorepo or individual packages).
