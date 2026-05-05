# Post-Release Audit Report

Raw2D version publish hone ke baad yeh report fill karo.

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

Fresh install me umbrella package, focused packages, `raw2d-mcp`, aur `raw2d-react` check hone chahiye.

## CDN Checks

```bash
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs
```

Agar npm publish ke turant baad jsDelivr late ho, report me CDN lag time likho.

## Browser Checks

`https://raw2d.com/doc` open karo aur Canvas, WebGL, Sprite, Texture Atlas, Interaction, aur React examples console errors ke bina verify karo.

`https://raw2d.com/studio`, `/doc#studio-demo-checklist`, aur `/readme#studio-demo-checklist` open karo. Studio demo, save/load/export, aur responsive checklist docs reachable hone chahiye.

## Release Decision

Release notes tabhi ready hain jab npm, CDN, docs, aur browser checks pass ho jaye.
