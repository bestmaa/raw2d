# Examples

Raw2D keeps small browser examples in `examples/` so package usage can be checked outside the docs UI.

These examples use package-style imports like `import { Canvas } from "raw2d"`. That makes them useful smoke checks for the npm package API.

## Run Examples

```bash
npm run dev
```

Open one example path:

```text
http://localhost:5174/examples/canvas-basic/
http://localhost:5174/examples/webgl-basic/
http://localhost:5174/examples/sprite-atlas/
http://localhost:5174/examples/interaction-basic/
http://localhost:5174/examples/text-basic/
```

## Canvas Basic

Use this to verify the normal scene flow:

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

Use this to verify WebGL import, fallback, rendering, and stats:

```ts
import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";

const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 480 })
  : new Canvas({ canvas: canvasElement, width: 800, height: 480 });

renderer.render(scene, camera);
```

## Sprite Atlas

Use this to verify `TextureAtlasPacker`, `TextureAtlas`, and `Sprite` together:

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

Use this to verify pointer selection, dragging, and Rect resize wiring:

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

Use this to verify `Text2D` with the same scene and renderer flow:

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

`tests/package/imports.test.mjs` checks that the umbrella package and focused packages expose installable entry points after build.
