# Scene

Scene Raw2D ka object container hai. Isme aap `Rect`, `Circle`, `Line`, `Sprite`, `Text2D`, group, ya future objects add karte ho.

Scene draw nahi karta. Scene sirf batata hai ki render ke waqt kaun se objects available hain.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const raw2dCanvas = new Canvas({ canvas: canvasElement });

const rect = new Rect({
  x: 100,
  y: 80,
  width: 160,
  height: 90,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
raw2dCanvas.render(scene, camera);
```

## Add Aur Remove

```ts
scene.add(rect);
scene.remove(rect);
scene.clear();
```

`scene.clear()` scene ke objects hata deta hai. Canvas ya camera delete nahi hota.

## Scene Ka Role

Raw2D ka normal render flow ye hai:

```text
Scene -> Renderer -> Canvas/WebGL output
```

Scene object order preserve karta hai. Isse draw order predictable rehta hai.

## Kab Use Karein

- jab ek hi canvas me multiple objects draw karne hon
- jab object add/remove runtime me karna ho
- jab future me picking, culling, batching, ya editor tools chahiye hon

## English Reference

Detailed English version: `docs/Scene.md`
