import { BasicMaterial, Camera2D, Canvas, Circle, Line, Rect, Scene, Text2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");

if (!canvasElement || !statsElement) {
  throw new Error("Canvas example elements not found.");
}

const statsOutput = statsElement;
const renderer = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 480,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  x: 210,
  y: 150,
  width: 180,
  height: 110,
  origin: "center",
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
const circle = new Circle({
  x: 520,
  y: 160,
  radius: 58,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(rect);
scene.add(circle);
scene.add(new Line({ x: 160, y: 330, endX: 480, endY: 0, material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 }) }));
scene.add(new Text2D({
  x: 70,
  y: 64,
  text: "Canvas renderer",
  font: "30px sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
}));

let frame = 0;

function animate(): void {
  frame += 1;
  rect.rotation += 0.012;
  circle.y = 160 + Math.sin(frame / 28) * 32;
  renderer.render(scene, camera);
  const stats = renderer.getStats();
  statsOutput.textContent = `renderer: Canvas | objects: ${stats.objects} | drawCalls: ${stats.drawCalls}`;
  requestAnimationFrame(animate);
}

animate();
