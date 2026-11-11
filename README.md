# HerdKeeper — Public Interactive Demo

This is a public, **sample-data-only** demo for the farmer to explore. It does not connect to Supabase or the iPhone app. Browser-entered test animal records are local to that browser and are not shared.

## Local run

```sh
npm install
npm run dev
```

## Publish

Push this project to a public GitHub repo named `herdkeeper-demo` on `main`. In **Settings → Pages → Build and deployment**, set Source to **GitHub Actions**. The included workflow deploys the Vite build to `https://cycalona-villani.github.io/herdkeeper-demo/` once GitHub Actions succeeds.

Do not add real animal data or any `.env` files to this demo.
