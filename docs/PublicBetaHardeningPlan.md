# Public Beta Hardening Plan

This plan defines the release gates for Raw2D public beta work. The goal is not to add more features first. The goal is to prove that a new user can install, read, copy, run, and debug Raw2D without hidden repo knowledge.

## Scope

Public beta hardening covers:

- Fresh npm installs for umbrella and focused packages.
- CDN checks for pinned Raw2D builds.
- Docs snippets copied into new Vite apps.
- Browser checks for docs, examples, benchmark, and showcase.
- Mobile and dark UI overflow checks.
- Release notes and publish workflow checks.

Raw2D Studio is planned later. Studio should use the hardened public API instead of private internals.

## Fresh Install Gates

Every beta release must pass fresh app checks:

```bash
npm install raw2d
npm install raw2d-core raw2d-canvas
npm install raw2d-core raw2d-webgl
npm install raw2d-react react react-dom
```

Each app must run `npm run build` and render at least one visible Canvas, WebGL, or React scene in a real browser.

## CDN Gates

The CDN gate checks pinned jsDelivr assets, not only `latest`:

```bash
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.7.0/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.7.0/dist/raw2d.umd.cjs
```

The gate passes when both files return success and a browser CDN example can import Raw2D without local bundling.

## Docs Gates

Docs pass only when:

- `/doc` and `/readme` load without console errors.
- Search finds common terms like canvas, WebGL, sprite, React, MCP, and Studio.
- Code snippets use package imports, not `src/` paths.
- Beginner flow is clear: install, Canvas, scene, shape, texture, WebGL.
- Hinglish docs are readable and not mixed awkwardly with English verbs.

## Browser Gates

Manual browser verification is required for:

- `/doc`
- `/readme`
- all `/examples/*` routes
- benchmark page
- showcase page
- search behavior
- mobile viewport
- dark UI overflow and horizontal scroll

Automated tests support this gate, but they do not replace a real visual pass.

## Pass/Fail Rule

The phase passes only when all install, CDN, docs, browser, package, and release checks pass. If one gate fails, keep the task open, record the failing command or route, fix it, then rerun verification.
