import type { DocSection } from "./DocPage.type";

export function getInteractionLiveCode(section: DocSection): string {
  return `import { BasicMaterial, Camera2D, Canvas, Circle, InteractionController, Line, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const rectA = new Rect({
  name: "rectA",
  x: 70,
  y: 74,
  width: 128,
  height: 86,
  material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.74)" })
});
const rectB = new Rect({
  name: "rectB",
  x: 224,
  y: 74,
  width: 118,
  height: 86,
  material: new BasicMaterial({ fillColor: "rgba(125, 211, 252, 0.66)" })
});
const circle = new Circle({
  name: "circle",
  x: 405,
  y: 116,
  radius: 44,
  material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.54)" })
});
const line = new Line({
  name: "line",
  x: 84,
  y: 204,
  endX: 340,
  endY: 0,
  material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 })
});

scene.add(rectA);
scene.add(rectB);
scene.add(circle);
scene.add(line);

const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => raw2dCanvas.render(scene, camera)
});

${getInteractionFocusCode(section)}

raw2dCanvas.render(scene, camera);`;
}

function getInteractionFocusCode(section: DocSection): string {
  const title = section.title;

  if (title === "Global Scene Mode") {
    return `interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();`;
  }

  if (title === "Single Object") {
    return "interaction.attach(rectA);";
  }

  if (title === "Single Object Custom") {
    return `interaction.attach(rectA, {
  select: true,
  drag: true,
  resize: false
});`;
  }

  if (title === "Many Objects") {
    return `interaction.attachMany([rectA, circle, line], {
  select: true,
  drag: true
});`;
  }

  if (title === "Current Selection") {
    return `interaction.getSelection().select(rectA);
interaction.getSelection().select(rectB, { append: true });

interaction.attachSelection({
  drag: true,
  resize: true
});`;
  }

  if (title === "Detach Objects") {
    return `interaction.attach(rectA);
interaction.detach(rectA);`;
  }

  if (title === "Read State") {
    return `interaction.attach(rectA);
interaction.getSelection().select(rectA);

const selected = interaction.getSelection().getPrimary();
const mode = interaction.getMode();
const handles = interaction.getResizeHandles();

console.log({ selected, mode, handles });`;
  }

  if (title === "Renderer Independent") {
    return `// InteractionController only mutates object state.
// Canvas renders scene objects into pixels.
interaction.attach(rectA);`;
  }

  return "// Create the controller first, then enable or attach interaction behavior.";
}
