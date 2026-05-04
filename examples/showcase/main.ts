import { Canvas } from "raw2d";
import { createShowcaseScene } from "./showcaseScene";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");

if (!canvasElement || !statsElement) {
  throw new Error("Showcase elements not found.");
}

const showcase = createShowcaseScene();
const statsOutput = statsElement;
const renderer = new Canvas({
  canvas: canvasElement,
  width: 960,
  height: 600,
  backgroundColor: "#10141c"
});
let frame = 0;

function animate(): void {
  frame += 1;

  for (const sprite of showcase.animatedSprites) {
    sprite.rotation += 0.018;
    sprite.y += Math.sin(frame / 24 + sprite.x / 40) * 0.08;
  }

  renderer.render(showcase.scene, showcase.camera);
  statsOutput.textContent = [
    "renderer: Canvas",
    `objects: ${showcase.objectCount}`,
    `sprites: ${showcase.spriteCount}`,
    `shapes: ${showcase.shapeCount}`,
    `animated: ${showcase.animatedSprites.length}`
  ].join(" | ");

  requestAnimationFrame(animate);
}

animate();
