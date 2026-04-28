import type { DocTopic } from "./DocPage.type";

export const canvasCullingTopics: readonly DocTopic[] = [
  {
    id: "canvas-culling",
    label: "Canvas Culling",
    title: "Canvas Culling",
    description: "Let Canvas skip objects whose world bounds are outside the camera viewport. This is useful when the world is larger than the screen.",
    sections: [
      {
        title: "What It Does",
        body: "Canvas culling checks object bounds against camera bounds before drawing. Objects outside the viewport are skipped for that render call.",
        liveDemoId: "visible-objects",
        code: `// Normal render draws every visible scene object.
raw2dCanvas.render(scene, camera);

// Culling render skips off-screen objects first.
raw2dCanvas.render(scene, camera, { culling: true });`
      },
      {
        title: "Why It Exists",
        body: "It gives Canvas a simple performance path for bigger worlds while keeping Raw2D transparent. The object data stays unchanged; only the renderer decides what to draw.",
        liveDemoId: "visible-objects",
        code: `// Scene still stores all objects.
scene.add(player);
scene.add(enemy);
scene.add(backgroundTile);

// Renderer decides what is visible this frame.
raw2dCanvas.render(scene, camera, { culling: true });`
      },
      {
        title: "Enable Culling",
        body: "Pass culling: true to Canvas.render. Raw2D clears the canvas, applies the camera, then draws only visible objects.",
        liveDemoId: "visible-objects",
        code: `raw2dCanvas.render(scene, camera, {
  culling: true
});`
      },
      {
        title: "Full Render Example",
        body: "Create a normal scene and enable culling only at render time.",
        liveDemoId: "visible-objects",
        code: `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });

scene.add(new Rect({
  x: 40,
  y: 80,
  width: 120,
  height: 90,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

scene.add(new Rect({
  x: 1200,
  y: 80,
  width: 120,
  height: 90,
  material: new BasicMaterial({ fillColor: "#f45b69" })
}));

raw2dCanvas.render(scene, camera, { culling: true });`
      },
      {
        title: "Filter Before Drawing",
        body: "Use cullingFilter when only some objects should be considered renderable for this pass.",
        liveDemoId: "visible-objects",
        code: `raw2dCanvas.render(scene, camera, {
  culling: true,
  cullingFilter: (object) => object.name.startsWith("enemy")
});`
      },
      {
        title: "When To Use It",
        body: "Use Canvas culling for large scenes where many objects are outside the camera. For tiny scenes, leaving it off is also fine because culling also has a small bounds-check cost.",
        liveDemoId: "visible-objects",
        code: `// Small scene: normal render is fine.
raw2dCanvas.render(scene, camera);

// Larger scene: skip off-screen objects.
raw2dCanvas.render(scene, camera, { culling: true });`
      }
    ]
  }
];
