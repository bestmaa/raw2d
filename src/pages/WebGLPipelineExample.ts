import {
  BasicMaterial,
  Camera2D,
  Rect,
  Scene,
  Text2D,
  WebGLRenderer2D,
  type WebGLDiagnostics
} from "raw2d";

const width = 640;
const height = 360;

export function renderWebGLPipelineExample(root: HTMLElement): void {
  const page = document.createElement("main");
  const title = document.createElement("h1");
  const body = document.createElement("p");
  const canvas = document.createElement("canvas");
  const output = document.createElement("pre");

  page.className = "visual-test-page";
  title.textContent = "Raw2D WebGL Pipeline Example";
  body.textContent = "Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall, shown with live renderer diagnostics.";
  canvas.width = width;
  canvas.height = height;
  output.className = "visual-test-results";
  page.append(title, body, canvas, output);
  root.replaceChildren(page);

  try {
    renderExample(canvas, output);
  } catch (error) {
    output.textContent = `WebGL2 unavailable: ${getErrorMessage(error)}`;
  }
}

function renderExample(canvas: HTMLCanvasElement, output: HTMLElement): void {
  const renderer = new WebGLRenderer2D({ canvas, width, height, backgroundColor: "#10141c" });
  const scene = createScene();
  const camera = new Camera2D();
  const renderList = renderer.createRenderList(scene, camera, { culling: true });

  renderer.render(scene, camera, { renderList, spriteSorting: "texture" });
  output.textContent = formatPipelineReport(renderer.getDiagnostics());
}

function createScene(): Scene {
  const scene = new Scene();
  const material = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#e5f7ff", lineWidth: 2 });

  scene.add(new Rect({ x: 80, y: 80, width: 150, height: 90, material, renderMode: "static" }));
  scene.add(new Rect({ x: 260, y: 110, width: 190, height: 70, material: new BasicMaterial({ fillColor: "#f45b69" }) }));
  scene.add(new Text2D({
    x: 80,
    y: 245,
    text: "WebGL diagnostics",
    font: "28px sans-serif",
    material: new BasicMaterial({ fillColor: "#f5f7fb" })
  }));
  return scene;
}

function formatPipelineReport(diagnostics: WebGLDiagnostics): string {
  const { stats } = diagnostics;

  return [
    `renderer: ${diagnostics.renderer}`,
    `contextLost: ${diagnostics.contextLost}`,
    `renderList.accepted: ${stats.renderList.accepted}`,
    `staticBatches: ${stats.staticBatches}`,
    `dynamicBatches: ${stats.dynamicBatches}`,
    `vertices: ${stats.vertices}`,
    `drawCalls: ${stats.drawCalls}`,
    `textureBinds: ${stats.textureBinds}`,
    `uploadedBytes: ${stats.uploadedBytes}`
  ].join("\n");
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}
