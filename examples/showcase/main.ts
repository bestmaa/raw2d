import { WebGLRenderer2D } from "raw2d";
import { createShowcaseScene } from "./showcaseScene";
import { createShowcaseRenderer } from "./showcaseRenderer";
import type { ShowcaseRendererMode, ShowcaseRendererResult } from "./ShowcaseRenderer.type";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const rendererSelect = document.querySelector<HTMLSelectElement>("#raw2d-renderer");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");

if (!canvasElement || !rendererSelect || !statsElement) {
  throw new Error("Showcase elements not found.");
}

const showcase = createShowcaseScene();
const canvasInput = canvasElement;
const statsOutput = statsElement;
const rendererInput = rendererSelect;
let rendererState = createRenderer(rendererInput.value);
let frame = 0;

rendererInput.addEventListener("change", () => {
  rendererState.renderer.dispose();
  rendererState = createRenderer(rendererInput.value);
});

function animate(): void {
  frame += 1;

  for (const sprite of showcase.animatedSprites) {
    sprite.rotation += 0.018;
    sprite.y += Math.sin(frame / 24 + sprite.x / 40) * 0.08;
  }

  if (rendererState.renderer instanceof WebGLRenderer2D) {
    rendererState.renderer.render(showcase.scene, showcase.camera, { spriteSorting: "texture" });
  } else {
    rendererState.renderer.render(showcase.scene, showcase.camera);
  }

  statsOutput.textContent = [
    `renderer: ${rendererState.label}`,
    `objects: ${showcase.objectCount}`,
    `sprites: ${showcase.spriteCount}`,
    `shapes: ${showcase.shapeCount}`,
    `animated: ${showcase.animatedSprites.length}`
  ].join(" | ");

  requestAnimationFrame(animate);
}

function createRenderer(value: string): ShowcaseRendererResult {
  const mode: ShowcaseRendererMode = value === "webgl" ? "webgl" : "canvas";

  return createShowcaseRenderer({
    canvas: canvasInput,
    height: 600,
    mode,
    width: 960
  });
}

animate();
