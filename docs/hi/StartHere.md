# Yahan Se Start

Ye Raw2D ka sabse short beginner path hai.

## Sabse Pehle Kya Install Karein

Pehle umbrella package install karein:

```bash
npm install raw2d
```

Focused packages baad me use karein, jab public API clear ho jaye.

## First Render Goal

Ek canvas, ek scene, ek camera, ek object banayein, phir render call karein.

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);
```

## Beginner Order

Seekhne ke liye ye order follow karein:

1. Install / Setup
2. Canvas Init
3. Scene
4. Camera2D
5. Rect ya Circle
6. Texture aur Sprite
7. Canvas / WebGL
8. Interaction Path
9. React Later ya MCP, sirf jab zarurat ho

## Canvas First

Canvas reference renderer hai. Correctness, debugging, simple scenes, aur full feature coverage ke liye use karein.

## WebGL Jab Zarurat Ho

WebGL batch-first renderer hai. Bahut saare sprites, texture atlas scenes, aur draw-call pressure ke liye use karein.

## Next

`/doc#beginner-path`, phir `/examples/canvas-basic/`, phir `/examples/webgl-basic/` open karein.
