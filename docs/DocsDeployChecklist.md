# Cloudflare Docs Deploy Checklist

Use this checklist after pushing docs changes to Cloudflare.

## Build Settings

- Build command: `npm run build:docs`.
- Deploy command: `npx wrangler deploy`.
- Output assets directory: `dist`.
- Build must run from the repository root.

## Route Verification

- Open `https://raw2d.bestemplin.workers.dev/doc`.
- Open `https://raw2d.com/doc`.
- Open `https://raw2d.com/readme`.
- Open `https://raw2d.com/benchmark`.
- Open `https://raw2d.com/visual-test`.
- Confirm production does not show the old placeholder page.

## Redirects And Assets

- `/doc` should load without an infinite redirect loop.
- Deep hash routes such as `/doc#webgl-performance` should work after refresh.
- Static assets under `/assets/` should return 200.
- Example routes such as `/examples/canvas-basic/` should load.

## Failure Checks

If deployment fails, inspect the Cloudflare log for workspace-root detection,
invalid `_redirects`, stale commit deploys, wrong custom domain, or wrong route
binding.
