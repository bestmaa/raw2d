import { BasicMaterial, Camera2D, Canvas, Circle, InteractionController, Rect, Scene } from "raw2d";
import type { Object2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");
const selectCardButton = document.querySelector<HTMLButtonElement>("#raw2d-select-card");
const selectBadgeButton = document.querySelector<HTMLButtonElement>("#raw2d-select-badge");
const growCardButton = document.querySelector<HTMLButtonElement>("#raw2d-grow-card");
const resetButton = document.querySelector<HTMLButtonElement>("#raw2d-reset");

if (!canvasElement || !statsElement || !selectCardButton || !selectBadgeButton || !growCardButton || !resetButton) {
  throw new Error("Example DOM nodes not found.");
}

const canvas = canvasElement;
const statsOutput = statsElement;
const renderer = new Canvas({ canvas, width: 800, height: 440, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const card = new Rect({
  name: "card",
  x: 160,
  y: 120,
  width: 190,
  height: 110,
  material: new BasicMaterial({ fillColor: "#f45b69", strokeColor: "#ffd6dd", lineWidth: 2 })
});
const badge = new Circle({
  name: "badge",
  x: 520,
  y: 175,
  radius: 56,
  material: new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#dce9ff", lineWidth: 2 })
});

scene.add(card);
scene.add(badge);

const interaction = new InteractionController({
  canvas,
  scene,
  camera,
  width: 800,
  height: 440,
  minResizeWidth: 40,
  minResizeHeight: 40,
  onChange: () => render()
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
interaction.getSelection().select(card);

selectCardButton.addEventListener("click", (): void => {
  interaction.getSelection().select(card);
  render();
});

selectBadgeButton.addEventListener("click", (): void => {
  interaction.getSelection().select(badge);
  render();
});

growCardButton.addEventListener("click", (): void => {
  card.setSize(card.width + 24, card.height + 14);
  interaction.getSelection().select(card);
  render();
});

resetButton.addEventListener("click", (): void => {
  card.x = 160;
  card.y = 120;
  card.setSize(190, 110);
  badge.x = 520;
  badge.y = 175;
  interaction.getSelection().select(card);
  render();
});

render();

function render(): void {
  renderer.render(scene, camera);
  drawSelectionOverlay(renderer.getContext(), interaction.getSelection().getSelected());
  writeStats();
}

function drawSelectionOverlay(context: CanvasRenderingContext2D, selected: readonly Object2D[]): void {
  context.save();
  context.strokeStyle = "#facc15";
  context.fillStyle = "#10141c";
  context.lineWidth = 2;

  for (const object of selected) {
    if (object instanceof Rect) {
      context.strokeRect(object.x, object.y, object.width, object.height);
    } else if (object instanceof Circle) {
      context.beginPath();
      context.arc(object.x, object.y, object.radius + 5, 0, Math.PI * 2);
      context.stroke();
    }
  }

  for (const handle of interaction.getResizeHandles()) {
    context.fillRect(handle.x, handle.y, handle.width, handle.height);
    context.strokeRect(handle.x, handle.y, handle.width, handle.height);
  }

  context.restore();
}

function writeStats(): void {
  const selected = interaction.getSelection().getSelected();
  const primary = interaction.getSelection().getPrimary();
  statsOutput.textContent = [
    `mode: ${interaction.getMode()}`,
    `selected: ${selected.map((object) => object.name || object.id).join(", ") || "none"}`,
    `primary: ${primary?.name ?? "none"}`,
    `transform: ${getPrimaryTransform(primary)}`,
    `handles: ${interaction.getResizeHandles().length}`
  ].join(" | ");
}

function getPrimaryTransform(object: Object2D | null): string {
  if (object instanceof Rect) {
    return `x=${Math.round(object.x)}, y=${Math.round(object.y)}, w=${Math.round(object.width)}, h=${Math.round(object.height)}`;
  }

  if (object instanceof Circle) {
    return `x=${Math.round(object.x)}, y=${Math.round(object.y)}, r=${Math.round(object.radius)}`;
  }

  return "none";
}
