# Final Package Install Smoke

Use this smoke test before v1 release to confirm Raw2D installs in a fresh app.

## Fresh App

```sh
npm create vite@latest raw2d-smoke -- --template vanilla-ts
cd raw2d-smoke
npm install raw2d
```

For a local release candidate, install the tarball from `npm pack` instead.

## Import Check

Import the umbrella package and focused packages without path aliases:

```ts
import { Scene, Camera2D, CanvasRenderer } from "raw2d";
import { Rect } from "raw2d-core";
import { CanvasRenderer as FocusedCanvasRenderer } from "raw2d-canvas";
```

## Build Check

```sh
npm run build
npm ls raw2d
npm ls raw2d-core raw2d-canvas raw2d-webgl
```

The consumer app must typecheck and build with Vite.

## Browser Check

Open the built app and confirm a tiny scene renders. This catches package export,
asset path, and browser runtime issues before release.
