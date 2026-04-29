# Examples

Raw2D me chhote browser examples `examples/` folder me rakhe gaye hain, taaki docs UI ke bahar bhi package usage check ho sake.

Ye examples package-style imports use karte hain, jaise `import { Canvas } from "raw2d"`. Isse npm package API ka real smoke check ho jata hai.

## Examples Chalayein

```bash
npm run dev
```

Phir koi ek path open karein:

```text
http://localhost:5174/examples/canvas-basic/
http://localhost:5174/examples/webgl-basic/
http://localhost:5174/examples/sprite-atlas/
http://localhost:5174/examples/interaction-basic/
http://localhost:5174/examples/text-basic/
```

## Canvas Basic

Normal scene flow verify karne ke liye:

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 480 });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 170,
  y: 110,
  width: 180,
  height: 110,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);
```

## WebGL Basic

WebGL import, fallback, rendering aur stats verify karne ke liye:

```ts
import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";

const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 480 })
  : new Canvas({ canvas: canvasElement, width: 800, height: 480 });

renderer.render(scene, camera);
```

## Sprite Atlas

`TextureAtlasPacker`, `TextureAtlas` aur `Sprite` ko ek saath verify karne ke liye:

```ts
import { Sprite, TextureAtlasPacker } from "raw2d";

const result = new TextureAtlasPacker({ padding: 2, edgeBleed: 1 }).packWithStats([
  { name: "idle", source: idleCanvas },
  { name: "run", source: runCanvas }
]);
const atlas = result.atlas;

scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle"),
  width: 56,
  height: 56
}));
```

## Interaction Basic

Pointer selection, dragging aur Rect resize wiring verify karne ke liye:

```ts
import { InteractionController } from "raw2d";

const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => renderer.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
```

## Text Basic

Same scene aur renderer flow ke saath `Text2D` verify karne ke liye:

```ts
import { BasicMaterial, Text2D } from "raw2d";

scene.add(new Text2D({
  x: 90,
  y: 160,
  text: "Raw2D Text2D",
  font: "48px system-ui, sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
}));
```

## Test Coverage

`tests/package/imports.test.mjs` build ke baad umbrella package aur focused packages ke installable entry points check karta hai.
