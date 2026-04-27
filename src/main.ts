import "./style.css";
import "./docs.css";
import { Camera2D, Canvas, Scene } from "./core";
import { BasicMaterial } from "./materials";
import { Rect } from "./objects";
import { renderDocPage } from "./pages/DocPage";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

if (window.location.pathname === "/doc") {
  app.replaceChildren(renderDocPage());
} else {
  renderCanvasPreview(app);
}

function renderCanvasPreview(root: HTMLElement): void {
  root.innerHTML = `
    <a class="doc-link" href="/doc">Docs</a>
    <canvas id="raw2d-canvas" aria-label="Raw2D canvas preview"></canvas>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

  if (!canvas) {
    throw new Error("Canvas element not found.");
  }

  const rawCanvas = new Canvas({ canvas, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const { width, height } = rawCanvas.getSize();
  const rect = new Rect({
    x: width / 2 - 50,
    y: height / 2 - 35,
    width: 100,
    height: 70,
    material: new BasicMaterial({ fillColor: "#f45b69" })
  });

  scene.add(rect);
  rawCanvas.render(scene, camera);
}
