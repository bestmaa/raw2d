import { boundsTopics } from "./DocBoundsTopics";
import { curveTopics } from "./DocCurveTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionTopics } from "./DocInteractionTopics";
import type { DocTopic } from "./DocPage.type";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { setupTopics } from "./DocSetupTopics";
import { transformTopics } from "./DocTransformTopics";

const coreTopics: readonly DocTopic[] = [
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
        body: "WebGLRenderer2D is public, but it is a skeleton right now. It is present so the future batch-first API has a stable place.",
        code: `npm install raw2d-core raw2d-webgl

import { Camera2D, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";

const renderer = new WebGLRenderer2D({ canvas: canvasElement });
renderer.setSize(800, 600);

// Not render-ready yet.
// renderer.render(scene, camera);`
      },
      {
        title: "Renderer Responsibility",
        body: "Objects store data and scene graph behavior. Canvas and WebGL renderer packages decide how objects are drawn.",
        code: `const scene = new Scene();
const camera = new Camera2D();

scene.add(rect);

// Canvas path works now.
raw2dCanvas.render(scene, camera);

// WebGL path will later use:
// Scene -> Batcher -> Buffer -> Shader -> DrawCall`
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
        body: "Compare object world bounds with camera bounds before drawing or processing large scenes.",
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
  lineWidth: 6
});`
      },
      {
        title: "BasicMaterial Parameters",
        body: "These fields can be passed when creating BasicMaterial.",
        liveDemoId: "rect",
        code: `fillColor?: string    // fill color for Rect, Circle, Text2D
strokeColor?: string  // stroke color for Line
lineWidth?: number    // stroke width for Line`
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
    lineWidth: 6
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

raw2dCanvas.render(scene, camera);`
      }
    ]
  }
];

export const topics: readonly DocTopic[] = [
  ...setupTopics,
  ...coreTopics,
  ...transformTopics,
  ...boundsTopics,
  ...hitTestingTopics,
  ...pickingTopics,
  ...interactionTopics,
  ...curveTopics,
  ...pathTopics,
  ...objectTopics
];
