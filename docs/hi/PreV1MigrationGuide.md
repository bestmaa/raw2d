# Pre-v1 Migration Guide

Raw2D abhi pre-v1 hai. API stable ho rahi hai, isliye release notes padhna
zaruri hai.

## Canvas Naming

Purana code `Canvas` use karta rahe to chalega.

```ts
import { Canvas } from "raw2d";
```

Naye renderer-focused code me `CanvasRenderer` prefer karo, taaki naming
`WebGLRenderer2D` ke sath clear rahe.

```ts
import { CanvasRenderer, WebGLRenderer2D } from "raw2d";
```

`Canvas` v1 freeze me removal ke liye scheduled nahi hai. Isko compatibility
alias maana ja sakta hai; renderer choice sikhate waqt ya naye renderer-focused
code me `CanvasRenderer` use karo.

## Focused Packages

App code ke liye `raw2d` use karo. Engine-level helper ke liye focused package
use karo.

```ts
import { Rect, Scene, WebGLRenderer2D } from "raw2d";
import { createWebGLShapeBatch } from "raw2d-webgl";
```

## Object Options

Explicit option objects use karo. Constructor option names public API ki tarah
guard kiye ja rahe hain.

```ts
new Rect({ x: 40, y: 40, width: 120, height: 80 });
```

## React Bridge

`raw2d-react` bridge package hai. Isko core object API ya renderer API change
nahi karni chahiye.

`raw2d-react-fiber` alag reconciler package hai, `raw2d-react` ka rename nahi.
Existing bridge users `raw2d-react` par reh sakte hain; host-config workflow
chahiye tab `raw2d-react-fiber` choose karo.

## Deprecated Or Aliased Names

Raw2D v1.25.0 runtime exports remove nahi karta. App-level renderer path me ek
documented alias hai:

```ts
import { Canvas, CanvasRenderer } from "raw2d";

console.log(Canvas === CanvasRenderer); // true
```

Future release agar public name deprecate kare to migration note old import,
preferred import, aur alias kab remove ho sakta hai ye clear bataye.

## Upgrade Steps

1. `RELEASE_NOTES.md` padho.
2. `npm run typecheck` chalao.
3. Focused packages use karte ho to
   `node --test tests/package/public-surface-audit.test.mjs` chalao.
4. App build run karo.
5. Apne renderer path wale docs examples browser me open karo.
