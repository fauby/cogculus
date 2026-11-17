# COGCULUS

**Driven by Ratios. Defined by Rotation.**

A fixed gear ratio site: gear inches, development, speed and skid patches for any chainring and cog, with setups to explore, A/B comparison, a skid patch matrix, a cadence chart and a saved-setups garage.

- `ratio/` — calculations and JSON API handlers (shared)
- `main.go` — Go server for Docker: API plus the embedded frontend
- `api/` — Vercel serverless functions for `/api/ratio` and `/api/ratios`
- `web/` — React (Vite) frontend using `@material/web`

## API

- `GET /api/ratio?chainring=48&cog=17&tire=25&cadence=90`
- `GET /api/ratios?combos=46x16,48x17&tire=25&cadence=90` (up to 120 combos)

Limits: chainring 28–60, cog 9–24, tire 18–60 mm (700c), cadence 20–200 rpm.

## Run

```bash
docker build -t cogculus .
docker run -p 8090:8080 cogculus
```

Open http://localhost:8090. Go tests run during the image build.

## Develop

```bash
cd web && npm install && npm run build && cd .. && go run .
```

For live reload, run `npm run dev` in `web/`; it proxies `/api` to `localhost:8090`.

## Deploy

Vercel is connected to this repo: every push to `main` deploys to production, other branches get preview URLs. `vercel.json` builds `web/` and serves `web/dist`.
