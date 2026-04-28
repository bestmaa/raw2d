import type { DocTopic } from "./DocPage.type";

export const visibleObjectsTopics: readonly DocTopic[] = [
  {
    id: "visible-objects",
    label: "Visible Objects",
    title: "Visible Objects",
    description: "Use camera bounds to find which scene objects are currently inside the viewport.",
    sections: [
      {
        title: "Why Use It",
        body: "getVisibleObjects is the first culling helper. It does not draw anything by itself; it returns the objects that intersect the camera viewport.",
        liveDemoId: "visible-objects",
        code: `const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600
});`
      },
      {
        title: "Full Example",
        body: "Create a scene, move the camera, then ask Raw2D which objects are visible.",
        liveDemoId: "visible-objects",
        code: `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Rect,
  Scene,
  getVisibleObjects
} from "raw2d";

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

const rectA = new Rect({
  name: "A",
  x: 40,
  y: 80,
  width: 120,
  height: 90,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

const rectB = new Rect({
  name: "B",
  x: 900,
  y: 80,
  width: 120,
  height: 90,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(rectA);
scene.add(rectB);

const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600
});

console.log(visibleObjects.map((object) => object.name));
raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Use With Camera Pan",
        body: "When the camera moves, the visible list changes because the viewport rectangle changes in world space.",
        liveDemoId: "visible-objects",
        code: `camera.setPosition(400, 0);

const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600
});`
      },
      {
        title: "Filter Objects",
        body: "Use filter when only a subset of objects should participate in culling.",
        liveDemoId: "visible-objects",
        code: `const visibleEnemies = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600,
  filter: (object) => object.name.startsWith("enemy")
});`
      },
      {
        title: "Include Hidden Objects",
        body: "Hidden objects are skipped by default. Set includeInvisible when tooling needs to inspect hidden objects too.",
        liveDemoId: "visible-objects",
        code: `rect.visible = false;

const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600,
  includeInvisible: true
});`
      }
    ]
  }
];
