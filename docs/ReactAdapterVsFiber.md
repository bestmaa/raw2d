# React Adapter Vs Future Fiber

Raw2D currently has `raw2d-react` as a simple React bridge. A future Fiber package should be more advanced and should use a custom reconciler.

## Current Package

Use `raw2d-react` when you want a small React wrapper around Raw2D.

```tsx
import { Raw2DCanvas, RawRect } from "raw2d-react";

<Raw2DCanvas renderer="canvas" width={800} height={480}>
  <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
</Raw2DCanvas>;
```

This package is intentionally simple:

- easy to understand
- good for examples and small React apps
- no custom reconciler requirement
- no hidden renderer internals

It is the right package for the current beta when you want React components without changing Raw2D's low-level API.

## Future Fiber Package

Future `raw2d-react-fiber` should use a custom reconciler when Raw2D needs deeper React integration.

```tsx
<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawScene>
    <rawRect x={80} y={80} width={160} height={96} />
    <rawSprite x={320} y={96} texture={texture} />
  </rawScene>
</Raw2DCanvas>
```

Fiber is useful when Raw2D needs host nodes, commit batching, stable object identity, and large JSX scene updates.

Fiber should stay separate from `raw2d-react` so the current adapter remains easy to audit.

## When To Use Which

Use `raw2d-react` now:

- you want React components quickly
- your scene is small or medium
- you prefer explicit props and simple rendering
- you do not need custom reconciliation

Wait for Fiber later:

- you need large JSX scenes
- object identity and update batching matter
- you want a deeper React-style scene graph
- lifecycle hooks and renderer APIs are stable

## Core Rule

Both packages must wrap public Raw2D APIs. Neither package should make React required for non-React Raw2D users.

`raw2d-core`, `raw2d-canvas`, and `raw2d-webgl` stay React-free.

React support must not hide renderer choice. Users should still choose Canvas or WebGL explicitly.
