# React Fiber Migration

Use `raw2d-react` when you want ready React components. Use `raw2d-react-fiber` when you need lower-level host config control and want to build a custom reconciler path.

## Install

```bash
npm install raw2d raw2d-react-fiber react react-dom
```

## What Changes

`raw2d-react` owns component wrappers:

```tsx
import { Raw2DCanvas, RawRect } from "raw2d-react";

<Raw2DCanvas renderer="canvas" width={640} height={360}>
  <RawRect x={80} y={80} width={140} height={88} fillColor="#35c2ff" />
</Raw2DCanvas>;
```

`raw2d-react-fiber` owns host instances:

```ts
import { Scene } from "raw2d";
import { createRaw2DFiberHostConfig } from "raw2d-react-fiber";

const scene = new Scene();
const host = createRaw2DFiberHostConfig();
const rect = host.createInstance("rawRect", {
  x: 80,
  y: 80,
  width: 140,
  height: 88,
  fillColor: "#35c2ff"
});

host.appendChild(scene, rect);
```

## Interaction

Interaction remains optional and explicit.

```ts
import { createRaw2DFiberInteractionBridge } from "raw2d-react-fiber";

const bridge = createRaw2DFiberInteractionBridge({
  canvas,
  scene,
  camera,
  requestRender: () => renderer.render(scene, camera)
});

bridge.enableSelection();
bridge.enableDrag();
bridge.attachInstance(rect, { select: true, drag: true });
```

## Migration Rules

- Keep `raw2d-react` for component-first React apps.
- Move to `raw2d-react-fiber` when you need host instances, custom reconciliation, or explicit interaction bridge control.
- Keep Canvas/WebGL renderer choice explicit.
- Do not depend on private renderer caches or batch buffers.
- Treat textures as external unless `textureOwnership: "owned"` is set.
