import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
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

const documentJson = addRaw2DSceneObject({
  document: createRaw2DSceneJson({ camera: { x: 0, y: 0, zoom: 1 } }),
  object: {
    type: "rect",
    id: "hero-card",
    x: 180,
    y: 120,
    width: 220,
    height: 130,
    material: { fillColor: "#35c2ff" }
  }
});
const validation = validateRaw2DScene({ document: documentJson });
const inspection = inspectRaw2DScene({ document: documentJson });
const snippet = generateRaw2DDocsSnippet({ document: documentJson, title: "MCP Scene" });
const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 420, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D(documentJson.camera);

scene.add(
  new Rect({
    x: 180,
    y: 120,
    width: 220,
    height: 130,
    material: new BasicMaterial({ fillColor: "#35c2ff" })
  })
);

renderer.render(scene, camera);

outputElement.textContent = JSON.stringify(
  {
    valid: validation.valid,
    objectCount: inspection.objectCount,
    markdownPreview: snippet.markdown.slice(0, 160)
  },
  null,
  2
);
