import { BasicMaterial, Camera2D, Canvas, Scene, Text2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Text2D({
  x: 90,
  y: 160,
  text: "Raw2D Text2D",
  font: "48px system-ui, sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
}));
scene.add(new Text2D({
  x: 92,
  y: 220,
  text: "Canvas first. WebGL supported.",
  font: "24px system-ui, sans-serif",
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

renderer.render(scene, camera);
