# Cloudflare Docs Deploy Checklist

Docs changes Cloudflare par push karne ke baad ye checklist follow karo.

## Build Settings

- Build command: `npm run build:docs`.
- Deploy command: `npx wrangler deploy`.
- Output assets directory: `dist`.
- Build repository root se run hona chahiye.

## Route Verification

- `https://raw2d.bestemplin.workers.dev/doc` open karo.
- `https://raw2d.com/doc` open karo.
- `https://raw2d.com/readme` open karo.
- `https://raw2d.com/benchmark` open karo.
- `https://raw2d.com/visual-test` open karo.
- Confirm karo production par old placeholder page nahi aa raha.

## Redirects And Assets

- `/doc` infinite redirect loop ke bina load hona chahiye.
- `/doc#webgl-performance` jaise deep hash routes refresh ke baad work karein.
- `/assets/` ke static assets 200 return karein.
- `/examples/canvas-basic/` jaise example routes load hone chahiye.

## Failure Checks

Deploy fail ho to Cloudflare log me workspace-root detection, invalid
`_redirects`, stale commit deploys, wrong custom domain, ya wrong route binding
check karo.
