# npm Publish Verification Checklist

Ye checklist sirf tab use karo jab task me clearly Raw2D release publish karna ho.

## Before Publish

- Version change intentional hai ye confirm karo.
- Release notes update karo.
- `npm run typecheck` run karo.
- `npm test` run karo.
- `npm run pack:check -- --silent` run karo.
- `npm run audit:package` run karo.
- `npm run test:consumer` run karo.
- Commit se pehle `git status --short` me sirf intended changes hone chahiye.

## GitHub Workflow

Raw2D GitHub Actions se publish hota hai. Local `npm publish` default path
nahi hona chahiye, kyunki workflow npm token handle karta hai.

- Release commit karo.
- Matching git tag create karo.
- `main` push karo.
- Tag push karo.
- Publish workflow finish hone tak status monitor karein.

## npm Verification

- `npm view raw2d version` check karo.
- Har focused package check karein: `raw2d-core`, `raw2d-canvas`,
  `raw2d-webgl`, `raw2d-sprite`, `raw2d-text`, `raw2d-effects`,
  `raw2d-interaction`, `raw2d-mcp`, `raw2d-react`, aur
  `raw2d-react-fiber`.
- npm par package README aur metadata sahi render ho rahe hain ye confirm karo.

## CDN Verification

npm update ke baad jsDelivr check karo:

```sh
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.umd.cjs
curl -I https://cdn.jsdelivr.net/npm/raw2d-core@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-canvas@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-webgl@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-sprite@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-text@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-effects@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-interaction@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-mcp@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-react@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-react-fiber@VERSION/dist/index.js
```
