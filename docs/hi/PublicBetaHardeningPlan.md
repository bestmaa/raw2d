# Public Beta Hardening Plan

Ye plan Raw2D public beta ke release gates define karta hai. Is phase ka goal naye features banana nahi hai. Goal ye prove karna hai ki naya user Raw2D install, read, copy, run, aur debug kar sake, bina repo ke hidden knowledge ke.

## Scope

Public beta hardening me ye checks aate hain:

- Umbrella aur focused packages ke fresh npm installs.
- Pinned Raw2D builds ke CDN checks.
- Docs snippets ko naye Vite apps me copy karke verify karna.
- Docs, examples, benchmark, aur showcase ke browser checks.
- Mobile aur dark UI overflow checks.
- Release notes aur publish workflow checks.

Raw2D Studio baad me planned hai. Studio ko hardened public API use karni chahiye, private internals nahi.

## Fresh Install Gates

Har beta release me fresh app checks pass hone chahiye:

```bash
npm install raw2d
npm install raw2d-core raw2d-canvas
npm install raw2d-core raw2d-webgl
npm install raw2d-react react react-dom
```

Har app me `npm run build` pass hona chahiye. Browser me kam se kam ek visible Canvas, WebGL, ya React scene render hona chahiye.

## CDN Gates

CDN gate pinned jsDelivr assets check karta hai, sirf `latest` nahi:

```bash
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.7.0/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.7.0/dist/raw2d.umd.cjs
```

Gate tab pass hai jab dono files success return karein aur browser CDN example local bundling ke bina Raw2D import kar sake.

## Docs Gates

Docs tab pass hain jab:

- `/doc` aur `/readme` console errors ke bina load hon.
- Search canvas, WebGL, sprite, React, MCP, aur Studio jaise common terms find kare.
- Code snippets package imports use karein, `src/` paths nahi.
- Beginner flow clear ho: install, Canvas, scene, shape, texture, WebGL.
- Hinglish docs readable hon aur awkward mixed verbs na hon.

## Browser Gates

In routes ke liye manual browser verification required hai:

- `/doc`
- `/readme`
- all `/examples/*` routes
- benchmark page
- showcase page
- search behavior
- mobile viewport
- dark UI overflow aur horizontal scroll

Automated tests is gate ko support karte hain, lekin real visual pass ko replace nahi karte.

## Pass/Fail Rule

Phase tabhi pass hai jab install, CDN, docs, browser, package, aur release checks sab pass hon. Agar ek gate fail hota hai, task open rakho, failing command ya route record karo, fix karo, phir verification rerun karo.
