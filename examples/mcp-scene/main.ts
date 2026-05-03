import { BasicMaterial, Camera2D, Canvas, Circle, Rect, Scene, Text2D } from "raw2d";
import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  generateRaw2DDocsSnippet,
  inspectRaw2DScene,
  validateRaw2DScene
} from "raw2d-mcp";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const outputElement = document.querySelector<HTMLElement>("#raw2d-output");

if (!canvasElement || !outputElement) {
  throw new Error("MCP example elements not found.");
}

const firstDocument = addRaw2DSceneObject({
  document: createRaw2DSceneJson({ camera: { x: 0, y: 0, zoom: 1 } }),
  object: {
    type: "rect",
    id: "hero-card",
    x: 170,
    y: 120,
    width: 220,
    height: 130,
    material: { fillColor: "#35c2ff" }
  }
});
const secondDocument = addRaw2DSceneObject({
  document: firstDocument,
  object: {
    type: "circle",
    id: "hero-badge",
    x: 500,
    y: 185,
    radius: 58,
    material: { fillColor: "#f45b69" }
  }
});
const documentJson = addRaw2DSceneObject({
  document: secondDocument,
  object: {
    type: "text2d",
    id: "hero-label",
    x: 210,
    y: 198,
    text: "MCP Scene",
    material: { fillColor: "#10141c" }
  }
});
const validation = validateRaw2DScene({ document: documentJson });
const inspection = inspectRaw2DScene({ document: documentJson });
const snippet = generateRaw2DDocsSnippet({ document: documentJson, title: "MCP Scene" });
const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 420, backgroundColor: "#10141c" });
const scene = createSceneFromExample();
const camera = new Camera2D(documentJson.camera);

renderer.render(scene, camera);
outputElement.textContent = JSON.stringify({
  valid: validation.valid,
  objectCount: inspection.objectCount,
  objectTypes: inspection.objectTypes,
  markdownPreview: snippet.markdown.slice(0, 180)
}, null, 2);

function createSceneFromExample(): Scene {
  const scene = new Scene();
  scene.add(new Rect({
    x: 170,
    y: 120,
    width: 220,
    height: 130,
    material: new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#dce9ff", lineWidth: 2 })
  }));
  scene.add(new Circle({
    x: 500,
    y: 185,
    radius: 58,
    material: new BasicMaterial({ fillColor: "#f45b69", strokeColor: "#ffd6dd", lineWidth: 2 })
  }));
  scene.add(new Text2D({
    x: 210,
    y: 198,
    text: "MCP Scene",
    font: "28px sans-serif",
    material: new BasicMaterial({ fillColor: "#10141c" })
  }));
  return scene;
}
