import { BasicMaterial, Camera2D, CameraControls, Canvas, Line, Rect, Scene } from "raw2d";
import type { CameraControlsDemoRenderOptions } from "./CameraControlsDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createCameraControlsDemo(): HTMLElement {
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D({ x: -40, y: -30, zoom: 1 });
  let controls: CameraControls;

  title.textContent = "Live Camera Controls";
  body.textContent = "Wheel to zoom. Drag the canvas to pan.";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  addGrid(scene);
  addObjects(scene);
  controls = new CameraControls({
    target: canvasElement,
    camera,
    width: demoCanvasWidth,
    height: demoCanvasHeight,
    minZoom: 0.35,
    maxZoom: 4,
    onChange: () => renderDemo({ raw2dCanvas, scene, camera, controls, code })
  });
  controls.enableZoom();
  controls.enablePan(0);
  section.append(title, body, canvasElement, pre);
  renderDemo({ raw2dCanvas, scene, camera, controls, code });
  return section;
}

function addGrid(scene: Scene): void {
  for (let value = -200; value <= 700; value += 50) {
    const color = value === 0 ? "#64748b" : "rgba(148, 163, 184, 0.24)";
    scene.add(new Line({ x: value, y: -200, endX: 0, endY: 620, material: new BasicMaterial({ strokeColor: color, lineWidth: 1 }) }));
    scene.add(new Line({ x: -200, y: value, endX: 920, endY: 0, material: new BasicMaterial({ strokeColor: color, lineWidth: 1 }) }));
  }
}

function addObjects(scene: Scene): void {
  scene.add(new Rect({ x: 80, y: 70, width: 150, height: 90, material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.76)" }) }));
  scene.add(new Rect({ x: 300, y: 150, width: 140, height: 110, material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.72)" }) }));
  scene.add(new Rect({ x: 500, y: 40, width: 100, height: 170, material: new BasicMaterial({ fillColor: "rgba(52, 211, 153, 0.68)" }) }));
}

function renderDemo(options: CameraControlsDemoRenderOptions): void {
  options.raw2dCanvas.render(options.scene, options.camera);
  drawOverlay(options.raw2dCanvas.getContext(), options);
  options.code.textContent = createCode(options);
}

function drawOverlay(context: CanvasRenderingContext2D, options: CameraControlsDemoRenderOptions): void {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(`camera x: ${round(options.camera.x)} y: ${round(options.camera.y)} zoom: ${round(options.camera.zoom)}`, 16, 24);
  context.restore();
}

function createCode(options: CameraControlsDemoRenderOptions): string {
  return `const controls = new CameraControls({
  target: canvasElement,
  camera,
  minZoom: 0.35,
  maxZoom: 4,
  onChange: () => raw2dCanvas.render(scene, camera)
});

controls.enableZoom();
controls.enablePan(0);

// camera: x ${round(options.camera.x)}, y ${round(options.camera.y)}, zoom ${round(options.camera.zoom)}
// mode: ${options.controls.getSnapshot().mode}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
