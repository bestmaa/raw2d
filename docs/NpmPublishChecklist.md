# npm Publish Verification Checklist

Use this checklist only when a task explicitly says to publish a Raw2D release.

## Before Publish

- Confirm the version change is intentional.
- Update release notes.
- Run `npm run typecheck`.
- Run `npm test`.
- Run `npm run pack:check -- --silent`.
- Run `npm run audit:package`.
- Run `npm run test:consumer`.
- Confirm `git status --short` only shows intended changes before committing.

## GitHub Workflow

Raw2D publishes from GitHub Actions. Local `npm publish` should not be the
default path because the workflow already handles the npm token.

- Commit the release.
- Create the matching git tag.
- Push `main`.
- Push the tag.
- Wait for the Publish workflow to finish.

## npm Verification

- Check `npm view raw2d version`.
- Check every focused package: `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`,
  `raw2d-sprite`, `raw2d-text`, `raw2d-effects`, `raw2d-interaction`,
  `raw2d-mcp`, `raw2d-react`, and `raw2d-react-fiber`.
- Confirm package README and metadata render correctly on npm.

## CDN Verification

Check jsDelivr after npm updates:

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
