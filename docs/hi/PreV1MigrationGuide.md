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

## Upgrade Steps

1. `RELEASE_NOTES.md` padho.
2. `npm run typecheck` chalao.
3. App build run karo.
4. Apne renderer path wale docs examples browser me open karo.
