# raw2d-react-fiber

React Fiber reconciler package scaffold for Raw2D.

This package is the future custom reconciler boundary for apps that want React to own a Raw2D scene graph directly. It stays separate from `raw2d-react`, which remains the simple component bridge, and it does not add React or reconciler dependencies to the runtime renderer packages.

```bash
npm install raw2d raw2d-react-fiber react
```

## Current Status

- package metadata, export map, and TypeScript build
- explicit host boundary descriptor for the future reconciler
- host config helpers for create, update, append, and remove operations
- explicit sprite texture ownership for update and unmount cleanup
- sprite texture lookup from `AssetGroup` with `textureName`
- no Canvas, WebGL, or core API changes
- no external `react-reconciler` dependency yet

## Host Boundary

The Fiber package boundary is intentionally narrow:

- React Fiber creates and updates Raw2D scene objects.
- Raw2D renderers keep drawing responsibility.
- `raw2d-core` keeps scene graph and object data ownership.
- `raw2d-canvas` and `raw2d-webgl` stay renderer-only and do not import React.
- Asset lifecycle hooks stay explicit so texture cleanup is debuggable.
- User-passed textures are external by default. Set `textureOwnership: "owned"` only when Fiber should dispose the texture after replacement or unmount.

The first host config supports `Rect`, `Circle`, `Line`, `Text2D`, `Sprite`, `Group2D`, and material props.
