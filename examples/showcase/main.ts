import { CameraControls, WebGLRenderer2D } from "raw2d";
import { createShowcaseScene } from "./showcaseScene";
import { createShowcaseInteraction } from "./showcaseInteraction";
import { drawShowcaseMinimap } from "./showcaseMinimap";
import { drawShowcaseOverlay } from "./showcaseOverlay";
import { createShowcaseRenderer } from "./showcaseRenderer";
import type { ShowcaseRendererMode, ShowcaseRendererResult } from "./ShowcaseRenderer.type";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const minimapElement = document.querySelector<HTMLCanvasElement>("#raw2d-minimap");
const overlayElement = document.querySelector<HTMLCanvasElement>("#raw2d-overlay");
const rendererSelect = document.querySelector<HTMLSelectElement>("#raw2d-renderer");
const resetButton = document.querySelector<HTMLButtonElement>("#raw2d-reset");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");

if (!canvasElement || !minimapElement || !overlayElement || !rendererSelect || !resetButton || !statsElement) {
  throw new Error("Showcase elements not found.");
}

const viewportWidth = 960;
const viewportHeight = 600;
const showcase = createShowcaseScene();
const canvasInput = canvasElement;
const minimapInput = minimapElement;
const overlayInput = overlayElement;
const statsOutput = statsElement;
const rendererInput = rendererSelect;
let rendererState = createRenderer(rendererInput.value);
let frame = 0;
const controls = new CameraControls({
  target: canvasInput,
  camera: showcase.camera,
  width: viewportWidth,
  height: viewportHeight,
  minZoom: 0.45,
  maxZoom: 3,
  panButton: 1
});
const interaction = createShowcaseInteraction({
  canvas: canvasInput,
  camera: showcase.camera,
  height: viewportHeight,
  scene: showcase.scene,
  width: viewportWidth
}).controller;

overlayInput.width = viewportWidth;
overlayInput.height = viewportHeight;
interaction.getSelection().select(showcase.interactiveRect);
controls.enablePan(1);
controls.enableZoom();
rendererInput.addEventListener("change", () => {
  rendererState.renderer.dispose();
  rendererState = createRenderer(rendererInput.value);
});
resetButton.addEventListener("click", () => {
  showcase.camera.setPosition(0, 0);
  showcase.camera.setZoom(1);
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

  drawShowcaseMinimap({
    camera: showcase.camera,
    canvas: minimapInput,
    viewportHeight,
    viewportWidth,
    worldHeight: showcase.worldHeight,
    worldWidth: showcase.worldWidth
  });
  drawShowcaseOverlay({
    camera: showcase.camera,
    canvas: overlayInput,
    interaction
  });
  statsOutput.textContent = [
    `renderer: ${rendererState.label}`,
    `camera: ${showcase.camera.x.toFixed(1)}, ${showcase.camera.y.toFixed(1)}`,
    `zoom: ${showcase.camera.zoom.toFixed(2)}`,
    `interaction: ${interaction.getMode()}`,
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
    height: viewportHeight,
    mode,
    width: viewportWidth
  });
}

animate();
