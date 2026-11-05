# agent-swap-web

Homepage for [agent-swap](https://github.com/woorichicken/agent-swap) — https://agent-swap-web.vercel.app

Built from an open-source landing template: every word, link, and image lives in `site.config.ts`.
Stars, contributors, and release versions are read from the GitHub API at build time.

```bash
pnpm install
cp .env.example .env.local   # DATABASE_URL, ADMIN_API_KEY
pnpm db:migrate
pnpm dev
```

Changelog, roadmap, and feedback are stored in Postgres (Neon) and written through
key-protected API routes (`ADMIN_API_KEY`).

MIT
