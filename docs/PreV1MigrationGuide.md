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

## Upgrade Steps

1. Read `RELEASE_NOTES.md`.
2. Run `npm run typecheck`.
3. Run your app build.
4. Open the docs examples that match your renderer path.
