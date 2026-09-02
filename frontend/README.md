# Frontend — Heights Real Estate

Next.js 16 (App Router) UI for the house price predictor. See the
[root README](../README.md) for the full project overview and architecture.

## Setup

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | Purpose                      |
| --------------- | ---------------------------- |
| `npm run dev`   | Development server           |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | ESLint                       |

## Configuration

| Variable              | Description                                     |
| --------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend, no trailing slash |

Falls back to `http://localhost:8000` when unset.
