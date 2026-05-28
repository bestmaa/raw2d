# Pre-v1 Migration Guide

Raw2D is still pre-v1. APIs are stabilizing, but public names are now audited
before release.

## Canvas Naming

Existing code can keep using `Canvas`.

```ts
import { Canvas } from "raw2d";
```

New renderer-focused examples should prefer `CanvasRenderer` so Canvas and
WebGL naming line up.

```ts
import { CanvasRenderer, WebGLRenderer2D } from "raw2d";
```

`Canvas` is not scheduled for removal in the v1 freeze. Treat it as a
compatibility alias; use `CanvasRenderer` when teaching renderer choice or
writing new renderer-focused code.

## Focused Packages

Use `raw2d` for app-level code. Use focused packages for engine-level helpers.

```ts
import { Rect, Scene, WebGLRenderer2D } from "raw2d";
import { createWebGLShapeBatch } from "raw2d-webgl";
```

## Object Options

Prefer explicit option objects. Constructor option names are treated as public
API and protected by type tests.

```ts
new Rect({ x: 40, y: 40, width: 120, height: 80 });
```

## React Bridge

`raw2d-react` is a bridge package. It should not change core object APIs,
renderer APIs, or focused package boundaries.

`raw2d-react-fiber` is a separate reconciler package, not a rename of
`raw2d-react`. Existing bridge users can stay on `raw2d-react`; choose
`raw2d-react-fiber` only when you want the host-config workflow.

## Deprecated Or Aliased Names

Raw2D v1.25.0 does not remove runtime exports. The only documented alias in the
app-level renderer path is:

```ts
import { Canvas, CanvasRenderer } from "raw2d";

console.log(Canvas === CanvasRenderer); // true
```

If a future release deprecates a public name, its migration note should list the
old import, the preferred import, and the first version where the alias can be
removed.

## Upgrade Steps

1. Read `RELEASE_NOTES.md`.
2. Run `npm run typecheck`.
3. Run `node --test tests/package/public-surface-audit.test.mjs` if you depend
   on focused packages.
4. Run your app build.
5. Open the docs examples that match your renderer path.
