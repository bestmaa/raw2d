# CameraControls

CameraControls is an optional interaction helper for moving a `Camera2D`.

It does not render anything. It only updates camera data, then calls `onChange` so your app can render with Canvas or WebGL.

## Basic Setup

```ts
import { Camera2D, CameraControls } from "raw2d";

const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });

const controls = new CameraControls({
  target: canvasElement,
  camera,
  minZoom: 0.25,
  maxZoom: 4,
  onChange: () => raw2dCanvas.render(scene, camera)
});

controls.enableZoom();
controls.enablePan();
```

## Controls

- Mouse wheel zooms the camera.
- Zoom keeps the world point under the cursor stable.
- Middle-button drag pans by default.
- Use `enablePan(0)` for primary-button pan or `enablePan(2)` for right-button pan.
- `dispose()` removes all listeners.

## Why Separate

CameraControls lives in `raw2d-interaction` because it is editor/input behavior, not rendering behavior.
