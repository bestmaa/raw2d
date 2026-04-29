import { BasicMaterial, Camera2D, Canvas, Circle, Line, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 480,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({
  x: 170,
  y: 110,
  width: 180,
  height: 110,
  origin: "center",
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
scene.add(new Circle({ x: 470, y: 180, radius: 58, material: new BasicMaterial({ fillColor: "#f45b69" }) }));
scene.add(new Line({ x: 190, y: 330, endX: 360, endY: 0, material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 }) }));

function animate(): void {
  rect.rotation += 0.012;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
