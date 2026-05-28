# React Fiber Migration

`raw2d-react` tab use karein jab ready React components chahiye. `raw2d-react-fiber` tab use karein jab lower-level host config control ya custom reconciler path banana ho.

## Install

```bash
npm install raw2d raw2d-react-fiber react react-dom
```

## Kya Badalta Hai

`raw2d-react` component wrappers own karta hai:

```tsx
import { Raw2DCanvas, RawRect } from "raw2d-react";

<Raw2DCanvas renderer="canvas" width={640} height={360}>
  <RawRect x={80} y={80} width={140} height={88} fillColor="#35c2ff" />
</Raw2DCanvas>;
```

`raw2d-react-fiber` host instances own karta hai:

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

Interaction optional aur explicit rahega.

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

- Component-first React apps ke liye `raw2d-react` rakhein.
- Host instances, custom reconciliation, ya explicit interaction bridge control ke liye `raw2d-react-fiber` use karein.
- Canvas/WebGL renderer choice explicit rakhein.
- Private renderer caches ya batch buffers par depend na karein.
- Textures external maan kar chalti hain jab tak `textureOwnership: "owned"` set na ho.
