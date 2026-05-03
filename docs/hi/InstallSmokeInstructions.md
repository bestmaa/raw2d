# Final Package Install Smoke

v1 release se pehle ye smoke test use karo taki confirm ho ki Raw2D fresh app me install hota hai.

## Fresh App

```sh
npm create vite@latest raw2d-smoke -- --template vanilla-ts
cd raw2d-smoke
npm install raw2d
```

Local release candidate ke liye `npm pack` se bana tarball install karo.

## Import Check

Umbrella package aur focused packages bina path aliases ke import karo:

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

Consumer app TypeScript aur Vite ke saath build hona chahiye.

## Browser Check

Built app open karo aur confirm karo ki tiny scene render ho raha hai. Ye release
se pehle package export, asset path, aur browser runtime issues pakadta hai.
