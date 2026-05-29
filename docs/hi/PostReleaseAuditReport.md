# Post-Release Audit Report

Raw2D version publish hone ke baad yeh report fill karo.

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

Fresh install me umbrella package, focused packages, `raw2d-mcp`, `raw2d-react`, aur `raw2d-react-fiber` check hue.

## CDN Checks

```bash
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs
npm run test:cdn:pinned -- --live
```

Pinned `1.25.5` package URLs par CDN lag observe nahi hua.

## Browser Checks

`https://raw2d.com/doc`, `/readme`, `/examples/`, `/studio`, `/cdn-smoke`, `/doc#studio-demo-checklist`, aur `/readme#studio-demo-checklist` check hue; har route ne `200` return kiya.

Published build ke liye browser bug bash aur mobile/dark docs checks pehle pass ho chuke hain, including Canvas, WebGL, Sprite, Texture Atlas, Interaction, React, aur Studio coverage.

## Release Decision

Release notes ready hain: npm, CDN, docs, examples, aur Studio route checks `1.25.5` ke liye pass hain.
