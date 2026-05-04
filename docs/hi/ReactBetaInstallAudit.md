# React Beta Install Audit

Ye audit optional `raw2d-react` package ko fresh React/Vite TypeScript app me check karta hai. Isse prove hota hai ki current React bridge users ke liye build hota hai, aur future Fiber package alag plan rahta hai.

## Command

React consumer smoke run karo:

```bash
npm run test:consumer:react
```

Script temporary app banata hai, packed Raw2D packages plus React install karta hai, JSX usage typecheck karta hai, Vite build karta hai, aur runtime par `raw2d-react` import karta hai.

## Install Shape

User-facing install ye hai:

```bash
npm install raw2d raw2d-react react react-dom
```

`raw2d-react` ka peer dependency `raw2d` par hai aur ye low-level Raw2D API ko replace nahi karta.

## Component Requirement

Generated app current bridge ke through render kare:

```ts
import { Raw2DCanvas, RawCircle, RawRect, RawSprite, RawText2D } from "raw2d-react";
```

Smoke me shape, sprite, aur text components cover hone chahiye taaki package exports example app aur docs ke saath aligned rahein.

## Pass Criteria

Audit tab pass hai jab:

- temporary React app install ho.
- `npx tsc --noEmit` JSX usage accept kare.
- `npx vite build` pass ho.
- runtime import `react-runtime-ok` print kare.
- docs isko current adapter batayein, future Fiber package nahi.
