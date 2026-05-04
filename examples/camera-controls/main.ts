import { BasicMaterial, Camera2D, CameraControls, Canvas, Line, Rect, Scene, Text2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");
const panRightButton = document.querySelector<HTMLButtonElement>("#raw2d-pan-right");
const zoomInButton = document.querySelector<HTMLButtonElement>("#raw2d-zoom-in");
const zoomOutButton = document.querySelector<HTMLButtonElement>("#raw2d-zoom-out");
const resetButton = document.querySelector<HTMLButtonElement>("#raw2d-reset");

if (!canvasElement || !statsElement || !panRightButton || !zoomInButton || !zoomOutButton || !resetButton) {
  throw new Error("Example DOM nodes not found.");
}

const canvas = canvasElement;
const statsOutput = statsElement;
const renderer = new Canvas({ canvas, width: 800, height: 440, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
const gridMaterial = new BasicMaterial({ strokeColor: "#263243", lineWidth: 1 });

for (let value = -400; value <= 900; value += 80) {
  scene.add(new Line({ x: value, y: -320, endX: 0, endY: 960, material: gridMaterial }));
  scene.add(new Line({ x: -480, y: value, endX: 1440, endY: 0, material: gridMaterial }));
}

scene.add(new Rect({
  name: "world-card",
  x: 120,
  y: 110,
  width: 180,
  height: 110,
  material: new BasicMaterial({ fillColor: "#f45b69", strokeColor: "#ffd6dd", lineWidth: 2 })
}));
scene.add(new Rect({
  name: "world-panel",
  x: 420,
  y: 210,
  width: 220,
  height: 140,
  material: new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#dce9ff", lineWidth: 2 })
}));
scene.add(new Text2D({
  x: 120,
  y: 72,
  text: "World space stays stable while Camera2D moves.",
  font: "18px sans-serif",
  material: new BasicMaterial({ fillColor: "#eef6ff" })
}));

const controls = new CameraControls({
  target: canvas,
  camera,
  width: 800,
  height: 440,
  minZoom: 0.4,
  maxZoom: 4,
  panButton: 0,
  onChange: () => render()
});

controls.enablePan(0);
controls.enableZoom();

panRightButton.addEventListener("click", (): void => {
  camera.setPosition(camera.x + 80, camera.y);
  render();
});

zoomInButton.addEventListener("click", (): void => {
  camera.setZoom(Math.min(camera.zoom * 1.2, 4));
  render();
});

zoomOutButton.addEventListener("click", (): void => {
  camera.setZoom(Math.max(camera.zoom / 1.2, 0.4));
  render();
});

resetButton.addEventListener("click", (): void => {
  camera.setPosition(0, 0);
  camera.setZoom(1);
  render();
});
render();

function render(): void {
  renderer.render(scene, camera);
  const snapshot = controls.getSnapshot();
  statsOutput.textContent = [
    `mode: ${snapshot.mode}`,
    `camera.x: ${snapshot.camera.x.toFixed(1)}`,
    `camera.y: ${snapshot.camera.y.toFixed(1)}`,
    `zoom: ${snapshot.camera.zoom.toFixed(2)}`,
    `objects: ${renderer.getStats().objects}`
  ].join(" | ");
}
