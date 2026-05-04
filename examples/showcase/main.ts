import { CameraControls, WebGLRenderer2D } from "raw2d";
import { createShowcaseScene } from "./showcaseScene";
import { createShowcaseInteraction } from "./showcaseInteraction";
import { drawShowcaseMinimap } from "./showcaseMinimap";
import { drawShowcaseOverlay } from "./showcaseOverlay";
import { applyShowcasePerformance } from "./showcasePerformance";
import { createShowcaseRenderer } from "./showcaseRenderer";
import type { ShowcasePerformanceOptions } from "./ShowcasePerformance.type";
import { buildShowcaseStatsReport } from "./showcaseStats";
import type { ShowcaseRendererMode, ShowcaseRendererResult } from "./ShowcaseRenderer.type";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const atlasToggle = document.querySelector<HTMLInputElement>("#raw2d-toggle-atlas");
const cullingToggle = document.querySelector<HTMLInputElement>("#raw2d-toggle-culling");
const minimapElement = document.querySelector<HTMLCanvasElement>("#raw2d-minimap");
const overlayElement = document.querySelector<HTMLCanvasElement>("#raw2d-overlay");
const copyReportButton = document.querySelector<HTMLButtonElement>("#raw2d-copy-report");
const focusSelectionButton = document.querySelector<HTMLButtonElement>("#raw2d-focus-selection");
const rendererSelect = document.querySelector<HTMLSelectElement>("#raw2d-renderer");
const resetButton = document.querySelector<HTMLButtonElement>("#raw2d-reset");
const staticToggle = document.querySelector<HTMLInputElement>("#raw2d-toggle-static");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");
const statusElement = document.querySelector<HTMLPreElement>("#raw2d-showcase-status");

if (!atlasToggle || !canvasElement || !cullingToggle || !minimapElement || !overlayElement || !copyReportButton || !focusSelectionButton || !rendererSelect || !resetButton || !staticToggle || !statsElement || !statusElement) {
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
const copyButton = copyReportButton;
const focusButton = focusSelectionButton;
const atlasInput = atlasToggle;
const cullingInput = cullingToggle;
const staticInput = staticToggle;
const statusOutput = statusElement;
let rendererState = createRenderer(rendererInput.value);
let latestReport = "";
let latestAction = "running";
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
  updateShowcaseAction("renderer changed");
});
resetButton.addEventListener("click", () => {
  showcase.camera.setPosition(0, 0);
  showcase.camera.setZoom(1);
  updateShowcaseAction("camera reset");
});
focusButton.addEventListener("click", () => {
  showcase.camera.setPosition(0, 180);
  showcase.camera.setZoom(1.45);
  interaction.getSelection().select(showcase.interactiveRect);
  updateShowcaseAction("selection focused");
});
copyButton.addEventListener("click", () => {
  void navigator.clipboard?.writeText(latestReport);
  updateShowcaseAction("report copied");
});

function animate(): void {
  frame += 1;
  const performance = readPerformanceOptions();
  applyShowcasePerformance({ scene: showcase, options: performance });

  for (const sprite of showcase.animatedSprites) {
    sprite.rotation += 0.018;
    sprite.y += Math.sin(frame / 24 + sprite.x / 40) * 0.08;
  }

  const webglRenderer = rendererState.renderer instanceof WebGLRenderer2D ? rendererState.renderer : null;

  if (webglRenderer) {
    rendererState.renderer.render(showcase.scene, showcase.camera, {
      culling: performance.culling,
      spriteSorting: performance.atlasSorting ? "texture" : "none"
    });
  } else {
    rendererState.renderer.render(showcase.scene, showcase.camera, { culling: performance.culling });
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
  const webglStats = webglRenderer?.getStats() ?? null;
  latestReport = buildShowcaseStatsReport({
    atlasSorting: performance.atlasSorting,
    animatedCount: showcase.animatedSprites.length,
    cameraX: showcase.camera.x,
    cameraY: showcase.camera.y,
    culling: performance.culling,
    drawCalls: webglStats?.drawCalls ?? null,
    interactionMode: interaction.getMode(),
    objectCount: showcase.objectCount,
    rendererLabel: rendererState.label,
    shapeCount: showcase.shapeCount,
    spriteCount: showcase.spriteCount,
    staticBatches: performance.staticBatches,
    textureBinds: webglStats?.spriteTextureBinds ?? null,
    zoom: showcase.camera.zoom
  });
  statsOutput.textContent = latestReport;
  updateShowcaseStatus();

  requestAnimationFrame(animate);
}

function readPerformanceOptions(): ShowcasePerformanceOptions {
  return {
    atlasSorting: atlasInput.checked,
    culling: cullingInput.checked,
    staticBatches: staticInput.checked
  };
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

function updateShowcaseAction(action: string): void {
  latestAction = action;
  updateShowcaseStatus();
}

function updateShowcaseStatus(): void {
  statusOutput.textContent = [
    `status: ${latestAction}`,
    `renderer: ${rendererState.label}`,
    `objects: ${showcase.objectCount}`,
    `selected: ${interaction.getSelection().getSelected().length}`
  ].join("\n");
}

animate();
