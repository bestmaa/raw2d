import { Camera2D, Canvas, Scene, Texture } from "raw2d";
import {
  createRaw2DFiberHostConfig,
  createRaw2DFiberInteractionBridge,
  type Raw2DFiberHostInstance
} from "raw2d-react-fiber";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("React Fiber example root not found.");
}

const canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 360;
canvas.setAttribute("aria-label", "Raw2D React Fiber host config canvas");
app.append(createLayout(canvas));

const scene = new Scene();
const camera = new Camera2D();
const renderer = new Canvas({ canvas, width: 640, height: 360, backgroundColor: "#10141c" });
const host = createRaw2DFiberHostConfig();
const texture = new Texture({ source: createSpriteSource(), width: 32, height: 32 });
const instances = createSceneInstances();

for (const instance of instances) {
  host.appendChild(scene, instance);
}

const bridge = createRaw2DFiberInteractionBridge({
  canvas,
  camera,
  requestRender: render,
  scene,
  width: 640,
  height: 360
});

bridge.enableSelection();
bridge.enableDrag();
bridge.attachInstances(instances, { drag: true, select: true });
bridge.selectInstance(instances[0]);
render();

document.querySelector<HTMLButtonElement>("#fiber-shift")?.addEventListener("click", () => {
  const rect = instances[0];
  host.commitUpdate(rect, {
    fillColor: "#f45b69",
    height: 88,
    strokeColor: "#ffd6df",
    width: 150,
    x: rect.object.x === 80 ? 132 : 80,
    y: 78
  });
  bridge.selectInstance(rect);
  render();
});

document.querySelector<HTMLButtonElement>("#fiber-reset")?.addEventListener("click", () => {
  host.commitUpdate(instances[0], {
    fillColor: "#35c2ff",
    height: 88,
    strokeColor: "#dce9ff",
    width: 140,
    x: 80,
    y: 78
  });
  bridge.selectInstance(instances[0]);
  render();
});

function createSceneInstances(): readonly Raw2DFiberHostInstance[] {
  return [
    host.createInstance("rawRect", {
      fillColor: "#35c2ff",
      height: 88,
      strokeColor: "#dce9ff",
      width: 140,
      x: 80,
      y: 78
    }),
    host.createInstance("rawCircle", {
      fillColor: "#facc15",
      radius: 38,
      x: 312,
      y: 122
    }),
    host.createInstance("rawLine", {
      endX: 210,
      endY: 0,
      lineWidth: 5,
      strokeColor: "#f5f7fb",
      x: 80,
      y: 224
    }),
    host.createInstance("rawSprite", {
      texture,
      textureOwnership: "external",
      x: 430,
      y: 96
    }),
    host.createInstance("rawText2D", {
      fillColor: "#f5f7fb",
      font: "28px sans-serif",
      text: "Fiber host config",
      x: 80,
      y: 304
    })
  ];
}

function render(): void {
  renderer.render(scene, camera);
  const selected = bridge.getSelectedInstances().map((instance) => instance.type).join(", ") || "none";
  const stats = document.querySelector<HTMLElement>("#raw2d-stats");

  if (stats) {
    stats.textContent = `renderer: canvas | package: raw2d-react-fiber\nobjects: ${scene.getObjects().length} | selected: ${selected}`;
  }
}

function createLayout(stage: HTMLCanvasElement): HTMLElement {
  const runtime = document.createElement("div");
  runtime.className = "example-runtime";
  runtime.innerHTML = `
    <div id="fiber-stage"></div>
    <aside class="example-info">
      <h2>Fiber bridge</h2>
      <pre>npm install raw2d raw2d-react-fiber react react-dom</pre>
      <pre>import { createRaw2DFiberHostConfig } from "raw2d-react-fiber";</pre>
      <div class="example-actions">
        <button id="fiber-shift" type="button">Move host rect</button>
        <button id="fiber-reset" type="button">Reset</button>
      </div>
      <pre id="raw2d-stats">renderer: canvas | package: raw2d-react-fiber</pre>
    </aside>
  `;
  runtime.querySelector("#fiber-stage")?.append(stage);
  return runtime;
}

function createSpriteSource(): HTMLCanvasElement {
  const source = document.createElement("canvas");
  const context = source.getContext("2d");
  source.width = 32;
  source.height = 32;

  if (!context) {
    throw new Error("Sprite source context not found.");
  }

  context.fillStyle = "#10b981";
  context.fillRect(0, 0, 32, 32);
  context.strokeStyle = "#d1fae5";
  context.lineWidth = 4;
  context.strokeRect(2, 2, 28, 28);
  return source;
}
