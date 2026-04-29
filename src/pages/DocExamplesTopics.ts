import type { DocTopic } from "./DocPage.type";

export const exampleTopics: readonly DocTopic[] = [
  {
    id: "examples",
    label: "Examples",
    title: "Examples",
    description: "Small install-style examples that use the same imports a package user will use.",
    sections: [
      {
        title: "Run Local Examples",
        body: "Each example is a standalone Vite page under examples/. Start the dev server, then open the example path.",
        code: `npm run dev

http://localhost:5174/examples/canvas-basic/
http://localhost:5174/examples/webgl-basic/
http://localhost:5174/examples/sprite-atlas/
http://localhost:5174/examples/interaction-basic/
http://localhost:5174/examples/text-basic/`
      },
      {
        title: "Canvas Basic",
        body: "Use this first when checking that scene, camera, material, objects, and Canvas rendering work.",
        code: `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

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

renderer.render(scene, camera);`
      },
      {
        title: "WebGL Basic",
        body: "Use WebGLRenderer2D for supported objects when batching stats and lower draw call pressure matter.",
        code: `import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";

const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 480 })
  : new Canvas({ canvas: canvasElement, width: 800, height: 480 });

renderer.render(scene, camera);`
      },
      {
        title: "Sprite Atlas",
        body: "Pack separate image sources into one atlas, then reuse the same texture with different frames.",
        code: `import { Sprite, TextureAtlasPacker } from "raw2d";

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
}));`
      },
      {
        title: "Interaction Basic",
        body: "Use InteractionController when a scene needs optional selection, dragging, and Rect resizing.",
        code: `import { InteractionController } from "raw2d";

const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => renderer.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();`
      },
      {
        title: "Text Basic",
        body: "Text2D is a scene object. Canvas draws it directly, and WebGL can rasterize it into a texture.",
        code: `import { BasicMaterial, Text2D } from "raw2d";

scene.add(new Text2D({
  x: 90,
  y: 160,
  text: "Raw2D Text2D",
  font: "48px system-ui, sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
}));`
      },
      {
        title: "Package Smoke Tests",
        body: "Raw2D keeps import smoke tests so the umbrella package and focused packages stay consumable after build.",
        code: `import { Canvas, Scene, Rect } from "raw2d";
import { WebGLRenderer2D } from "raw2d-webgl";
import { TextureAtlasPacker } from "raw2d-sprite";

console.log(Canvas, Scene, Rect, WebGLRenderer2D, TextureAtlasPacker);`
      }
    ]
  }
];
