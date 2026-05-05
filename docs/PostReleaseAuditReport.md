# Post-Release Audit Report

Use this report after publishing a Raw2D version.

## Result

```text
Version: v1.1.x
npm package: pass / fail
CDN UMD: pass / fail
Docs route: pass / fail
Browser examples: pass / fail
Studio docs/demo: pass / fail
Decision: pass / fail
```

## NPM Checks

```bash
npm view raw2d version
npm view raw2d-core version
npm view raw2d-webgl version
npm install raw2d
```

Fresh install checks must cover the umbrella package, focused packages, `raw2d-mcp`, and `raw2d-react`.

## CDN Checks

```bash
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs
```

Record CDN lag when npm is published but jsDelivr has not refreshed yet.

## Browser Checks

Open `https://raw2d.com/doc` and verify Canvas, WebGL, Sprite, Texture Atlas, Interaction, and React examples without console errors.

Open `https://raw2d.com/studio`, `/doc#studio-demo-checklist`, and `/readme#studio-demo-checklist`. Confirm Studio demo, save/load/export, and responsive checklist docs are reachable.

## Release Decision

Release notes are ready only when npm, CDN, docs, and browser checks pass.
