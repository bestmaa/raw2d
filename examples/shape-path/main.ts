import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Scene,
  ShapePath,
  WebGLRenderer2D,
  flattenShapePath,
  isWebGL2Available
} from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const webglElement = document.querySelector<HTMLCanvasElement>("#raw2d-webgl");
const canvasStats = document.querySelector<HTMLPreElement>("#raw2d-canvas-stats");
const webglStats = document.querySelector<HTMLPreElement>("#raw2d-webgl-stats");

if (!canvasElement || !webglElement || !canvasStats || !webglStats) {
  throw new Error("Example DOM nodes not found.");
}

const camera = new Camera2D();
const canvasScene = createScene();
const canvasRenderer = new Canvas({ canvas: canvasElement, width: 420, height: 300, backgroundColor: "#10141c" });
canvasRenderer.render(canvasScene, camera);

const canvasPath = canvasScene.getObjects()[0];
const canvasPoints = canvasPath instanceof ShapePath ? flattenShapePath(canvasPath, { curveSegments: 18 }) : null;
canvasStats.textContent = [
  "renderer: Canvas",
  `objects: ${canvasRenderer.getStats().objects}`,
  `subpaths: ${canvasPoints?.subpaths.length ?? 0}`
].join(" | ");

if (isWebGL2Available({ canvas: webglElement })) {
  const webglScene = createScene();
  const webglRenderer = new WebGLRenderer2D({ canvas: webglElement, width: 420, height: 300, backgroundColor: "#10141c" });
  webglRenderer.render(webglScene, camera, { curveSegments: 18 });
  const stats = webglRenderer.getStats();
  webglStats.textContent = [
    "renderer: WebGL2",
    `shapePaths: ${stats.shapePaths}`,
    `drawCalls: ${stats.drawCalls}`,
    `vertices: ${stats.vertices}`
  ].join(" | ");
} else {
  webglStats.textContent = "renderer: WebGL2 unavailable in this browser";
}

function createScene(): Scene {
  const scene = new Scene();
  scene.add(createShapePath());
  return scene;
}

function createShapePath(): ShapePath {
  const material = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#facc15", lineWidth: 5 });

  return new ShapePath({ x: 120, y: 70, material })
    .moveTo(95, 0)
    .bezierCurveTo(160, 0, 190, 44, 165, 92)
    .quadraticCurveTo(140, 142, 95, 168)
    .quadraticCurveTo(50, 142, 25, 92)
    .bezierCurveTo(0, 44, 30, 0, 95, 0)
    .closePath();
}
