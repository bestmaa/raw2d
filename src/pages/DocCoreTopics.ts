import type { DocTopic } from "./DocPage.type";

export const coreTopics: readonly DocTopic[] = [
  {
    id: "canvas",
    label: "Canvas Init",
    title: "Canvas Init",
    description: "Create and control the public low-level Raw2D Canvas renderer.",
    sections: [
      {
        title: "Add A Canvas Element",
        body: "Canvas needs a real HTMLCanvasElement. Raw2D does not create hidden DOM for you.",
        code: `<canvas id="raw2d-canvas"></canvas>`
      },
      {
        title: "Create The Canvas Class",
        body: "Pass the DOM canvas element into the Raw2D Canvas wrapper.",
        code: `import { Canvas } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});`
      }
    ]
  },
  {
    id: "renderers",
    label: "Canvas / WebGL",
    title: "Canvas / WebGL",
    description: "Choose the renderer package directly. These APIs are public, not internal-only.",
    sections: [
      {
        title: "Recommended Start",
        body: "Use Canvas first. It is the stable renderer path and supports the current object set.",
        code: `import { Canvas } from "raw2d";

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Focused Canvas Package",
        body: "Advanced users can install and import only the Canvas renderer package.",
        code: `npm install raw2d-core raw2d-canvas

import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";`
      },
      {
        title: "WebGL Package",
        body: "WebGLRenderer2D is public and renders supported primitives, Sprites, and Text2D through the WebGL2 batch path. Canvas is still the broadest renderer.",
        code: `npm install raw2d-core raw2d-webgl

import { Camera2D, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";

const renderer = new WebGLRenderer2D({ canvas: canvasElement });
renderer.setSize(800, 600);
renderer.render(scene, camera);

console.log(renderer.getStats());`
      },
      {
        title: "Shared Renderer Contract",
        body: "Canvas and WebGLRenderer2D both implement Renderer2DLike from raw2d-core. Use it when a tool should accept either renderer.",
        code: `import type { Renderer2DLike } from "raw2d-core";

function draw(renderer: Renderer2DLike): void {
  renderer.render(scene, camera);
}`
      },
      {
        title: "Renderer Responsibility",
        body: "Objects store data and scene graph behavior. Canvas and WebGL renderer packages decide how objects are drawn.",
        code: `const scene = new Scene();
const camera = new Camera2D();

scene.add(rect);

// Canvas path works now.
raw2dCanvas.render(scene, camera);

// WebGL path:
// Scene -> RenderPipeline -> RectBatch -> Buffer -> Shader -> DrawCall`
      }
    ]
  },
  {
    id: "scene",
    label: "Scene",
    title: "Scene",
    description: "Scene stores objects that should be rendered together.",
    sections: [
      {
        title: "Create A Scene",
        body: "Add objects to the scene, then pass the scene into Canvas.render().",
        code: `const scene = new Scene();

scene.add(rect);
scene.add(circle);

raw2dCanvas.render(scene, camera);`
      }
    ]
  },
  {
    id: "camera",
    label: "Camera2D",
    title: "Camera2D",
    description: "Camera2D controls which part of the 2D world is visible.",
    sections: [
      {
        title: "Create A Camera",
        body: "Use x and y for pan. Use zoom for scale.",
        code: `const camera = new Camera2D({
  x: 0,
  y: 0,
  zoom: 1
});

camera.setPosition(100, 80);
camera.setZoom(2);`
      },
      {
        title: "Camera World Bounds",
        body: "Use getCameraWorldBounds to read the world-space rectangle currently visible through the camera.",
        liveDemoId: "camera-bounds",
        code: `const bounds = getCameraWorldBounds({
  camera,
  width: 800,
  height: 600
});`
      },
      {
        title: "Culling Foundation",
        body: "Compare object world bounds with camera bounds before drawing or processing large scenes. Use the Visible Objects page for the full helper.",
        liveDemoId: "camera-bounds",
        code: `const cameraBounds = getCameraWorldBounds({
  camera,
  width,
  height
});

const isVisible = objectBounds.intersects(cameraBounds);`
      }
    ]
  },
  {
    id: "basic-material",
    label: "BasicMaterial",
    title: "BasicMaterial",
    description: "BasicMaterial stores fill, stroke, and line width style data.",
    sections: [
      {
        title: "Create BasicMaterial",
        body: "Use BasicMaterial to control simple drawing styles.",
        liveDemoId: "rect",
        code: `const material = new BasicMaterial({
  fillColor: "#f45b69",
  strokeColor: "#facc15",
  lineWidth: 6,
  strokeCap: "round",
  strokeJoin: "round",
  miterLimit: 8
});`
      },
      {
        title: "BasicMaterial Parameters",
        body: "These fields can be passed when creating BasicMaterial.",
        liveDemoId: "rect",
        code: `fillColor?: string    // fill color for Rect, Circle, Text2D
strokeColor?: string  // stroke color for Line
lineWidth?: number    // stroke width for Line
strokeCap?: "butt" | "round" | "square"
strokeJoin?: "bevel" | "miter" | "round"
miterLimit?: number`
      },
      {
        title: "Use With Rect",
        body: "Rect uses fillColor.",
        liveDemoId: "rect",
        code: `const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});`
      },
      {
        title: "Use With Line",
        body: "Line uses strokeColor and lineWidth.",
        liveDemoId: "line",
        code: `const line = new Line({
  x: 100,
  y: 120,
  endX: 260,
  endY: 80,
  material: new BasicMaterial({
    strokeColor: "#facc15",
    lineWidth: 6,
    strokeCap: "round",
    strokeJoin: "round"
  })
});`
      },
      {
        title: "Update Material",
        body: "Material values can be updated after creation.",
        liveDemoId: "rect",
        code: `material.setFillColor("#ffffff");
material.setStrokeColor("#111111");
material.setLineWidth(2);
material.setStrokeCap("square");
material.setStrokeJoin("bevel");
material.setMiterLimit(6);

raw2dCanvas.render(scene, camera);`
      }
    ]
  }
];
