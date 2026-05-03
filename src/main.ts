import "./style.css";
import "./docs.css";
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

void renderRoute(app);

async function renderRoute(root: HTMLElement): Promise<void> {
  if (window.location.pathname === "/doc") {
    const { renderDocPage } = await import("./pages/DocPage");
    root.replaceChildren(renderDocPage());
    return;
  }

  if (window.location.pathname === "/readme") {
    const { renderReadmePage } = await import("./pages/ReadmePage");
    root.replaceChildren(renderReadmePage());
    return;
  }

  if (window.location.pathname === "/visual-test") {
    const { renderVisualPixelTestPage } = await import("./pages/VisualPixelTest");
    root.replaceChildren(renderVisualPixelTestPage());
    return;
  }

  if (window.location.pathname === "/benchmark") {
    const { renderBenchmarkPage } = await import("./pages/BenchmarkPage");
    root.replaceChildren(renderBenchmarkPage());
    return;
  }

  if (window.location.pathname === "/examples/webgl-pipeline") {
    const { renderWebGLPipelineExample } = await import("./pages/WebGLPipelineExample");
    renderWebGLPipelineExample(root);
    return;
  }

  renderCanvasPreview(root);
}

function renderCanvasPreview(root: HTMLElement): void {
  root.innerHTML = `
    <nav class="home-links" aria-label="Raw2D links">
      <a href="/doc">Docs</a>
      <a href="/readme">Readme</a>
      <a href="/benchmark">Benchmark</a>
      <a href="/examples/webgl-pipeline">WebGL Pipeline Example</a>
    </nav>
    <canvas id="raw2d-canvas" aria-label="Raw2D canvas preview"></canvas>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

  if (!canvas) {
    throw new Error("Canvas element not found.");
  }

  const raw2dCanvas = new Canvas({ canvas, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const { width, height } = raw2dCanvas.getSize();
  const rect = new Rect({
    x: width / 2 - 50,
    y: height / 2 - 35,
    width: 100,
    height: 70,
    material: new BasicMaterial({ fillColor: "#f45b69" })
  });

  scene.add(rect);
  raw2dCanvas.render(scene, camera);
}
