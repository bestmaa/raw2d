---
name: raw2d-visual-check
description: Verify Raw2D docs, examples, Canvas output, WebGL output, controls, screenshots, and visual regression behavior in a browser. Use when Codex needs to open a Raw2D route, inspect rendered pixels, compare Canvas/WebGL behavior, validate docs live examples, or summarize visual test results.
---

# Raw2D Visual Check

Use this skill when a Raw2D change affects browser UI, docs pages, live controls, Canvas rendering, WebGL rendering, or visual regression fixtures.

## Workflow

1. Build or start the docs/example target needed for the route.
2. Open the exact route, including hash when relevant.
3. Confirm the page is not blank and the intended example is visible.
4. Interact with controls that the docs mention.
5. Check Canvas and WebGL outputs separately when both renderers are involved.
6. Run visual pixel tests when geometry, batching, textures, or WebGL changed.
7. Use generated showcase scenes for broad renderer demonstrations.
8. Record the route, viewport, command output, and any mismatch.

## Commands

Use focused commands first:

```bash
npm run build:docs
node --test tests/browser-smoke.test.mjs
node --test tests/webgl/visual-regression.test.mjs
node plugins/raw2d/scripts/create-raw2d-showcase.mjs --out /tmp/raw2d-showcase --renderer webgl
```

Use the full gate before release or broad UI changes:

```bash
npm run typecheck
npm test
npm run build:docs
npm run pack:check -- --silent
npm run test:consumer
```

## Browser Checks

- Use the in-app browser or Playwright for local routes.
- Test desktop and narrow/mobile widths when layout or docs navigation changed.
- Verify text does not overlap controls.
- Verify live examples match the nearby code snippet.
- Verify FPS or benchmark pages explain relative results instead of promising fixed numbers.

## Pixel Checks

- Prefer existing visual tests for WebGL geometry, sprites, and text.
- Add deterministic fixtures before relying on screenshots.
- Avoid brittle assertions on FPS, timing, or browser-specific antialiasing.
- Report draw calls, texture binds, and cache stats when checking WebGL performance pages.

## Summary

Report:

- route and viewport checked
- controls used
- pixel or browser tests run
- visible mismatch found or not found
- next fix if output is wrong
