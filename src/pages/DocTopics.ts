import type { DocTopic } from "./DocPage.type";
import { objectTopics } from "./DocObjectTopics";

const coreTopics: readonly DocTopic[] = [
  {
    id: "setup",
    label: "Install / Setup",
    title: "Install / Setup",
    description: "Start the project locally before using any Raw2D module.",
    sections: [
      {
        title: "Install Dependencies",
        body: "Install the Vite and TypeScript dependencies already defined in package.json.",
        code: `npm install`
      },
      {
        title: "Start Dev Server",
        body: "Run the local development server.",
        code: `npm run dev`
      },
      {
        title: "Open Docs",
        body: "Open the local docs route in the browser.",
        code: `http://localhost:5174/doc`
      }
    ]
  },
  {
    id: "canvas",
    label: "Canvas Init",
    title: "Canvas Init",
    description: "Create and control the low-level Raw2D Canvas wrapper.",
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

const rawCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});`
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

rawCanvas.render(scene, camera);`
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
        code: `const material = new BasicMaterial({
  fillColor: "#f45b69",
  strokeColor: "#facc15",
  lineWidth: 6
});`
      },
      {
        title: "BasicMaterial Parameters",
        body: "These fields can be passed when creating BasicMaterial.",
        code: `fillColor?: string    // fill color for Rect, Circle, Text2D
strokeColor?: string  // stroke color for Line
lineWidth?: number    // stroke width for Line`
      },
      {
        title: "Use With Rect",
        body: "Rect uses fillColor.",
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
        code: `material.setFillColor("#ffffff");
material.setStrokeColor("#111111");
material.setLineWidth(2);

rawCanvas.render(scene, camera);`
      }
    ]
  }
];

export const topics: readonly DocTopic[] = [...coreTopics, ...objectTopics];
