# Post-Release Audit Report

Use this report after publishing a Raw2D version.

## Result

```text
Version: v1.25.5
npm package: pass
registry install smoke: pass
CDN pinned live: pass
Docs route: pass
Browser examples: pass
Studio docs/demo: pass
Decision: pass
```

## NPM Checks

```bash
npm view raw2d version
npm view raw2d-core version
npm view raw2d-canvas version
npm view raw2d-webgl version
npm view raw2d-react-fiber version
npm run test:consumer:registry
```

Fresh install checks covered the umbrella package, focused packages, `raw2d-mcp`, `raw2d-react`, and `raw2d-react-fiber`.

## CDN Checks

```bash
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs
npm run test:cdn:pinned -- --live
```

No CDN lag was observed for pinned `1.25.5` package URLs.

## Browser Checks

Checked `https://raw2d.com/doc`, `/readme`, `/examples/`, `/studio`, `/cdn-smoke`, `/doc#studio-demo-checklist`, and `/readme#studio-demo-checklist`; each route returned `200`.

The browser bug bash and mobile/dark docs checks had already passed for the published build, including Canvas, WebGL, Sprite, Texture Atlas, Interaction, React, and Studio coverage.

## Release Decision

Release notes are ready: npm, CDN, docs, examples, and Studio route checks passed for `1.25.5`.
