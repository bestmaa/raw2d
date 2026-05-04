# React Beta Install Audit

This audit checks the optional `raw2d-react` package in a fresh React/Vite TypeScript app. It proves the current React bridge builds for users while the future Fiber package remains a separate plan.

## Command

Run the React consumer smoke:

```bash
npm run test:consumer:react
```

The script creates a temporary app, installs packed Raw2D packages plus React, typechecks JSX usage, builds with Vite, and imports `raw2d-react` at runtime.

## Install Shape

The user-facing install is:

```bash
npm install raw2d raw2d-react react react-dom
```

`raw2d-react` has a peer dependency on `raw2d` and does not replace the low-level Raw2D API.

## Component Requirement

The generated app must render through the current bridge:

```ts
import { Raw2DCanvas, RawCircle, RawRect, RawSprite, RawText2D } from "raw2d-react";
```

The smoke must cover shape, sprite, and text components so package exports stay aligned with the example app and docs.

## Pass Criteria

The audit passes when:

- the temporary React app installs.
- `npx tsc --noEmit` accepts JSX usage.
- `npx vite build` passes.
- runtime import prints `react-runtime-ok`.
- docs still describe this as the current adapter, not the future Fiber package.
