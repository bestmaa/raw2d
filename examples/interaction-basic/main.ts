import { BasicMaterial, Camera2D, Canvas, Circle, InteractionController, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  name: "card",
  x: 180,
  y: 120,
  width: 190,
  height: 110,
  material: new BasicMaterial({ fillColor: "#f45b69" })
}));
scene.add(new Circle({ name: "dot", x: 520, y: 170, radius: 56, material: new BasicMaterial({ fillColor: "#35c2ff" }) }));

const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  width: 800,
  height: 480,
  onChange: () => renderer.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
renderer.render(scene, camera);
