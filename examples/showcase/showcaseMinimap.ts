import type { DrawShowcaseMinimapOptions } from "./ShowcaseMinimap.type";

export function drawShowcaseMinimap(options: DrawShowcaseMinimapOptions): void {
  const context = options.canvas.getContext("2d");

  if (!context) {
    return;
  }

  const scale = Math.min(options.canvas.width / options.worldWidth, options.canvas.height / options.worldHeight);
  const width = options.worldWidth * scale;
  const height = options.worldHeight * scale;
  const offsetX = (options.canvas.width - width) / 2;
  const offsetY = (options.canvas.height - height) / 2;
  const viewWidth = (options.viewportWidth / options.camera.zoom) * scale;
  const viewHeight = (options.viewportHeight / options.camera.zoom) * scale;
  const viewX = offsetX + options.camera.x * scale;
  const viewY = offsetY + options.camera.y * scale;

  context.clearRect(0, 0, options.canvas.width, options.canvas.height);
  context.fillStyle = "#10141c";
  context.fillRect(0, 0, options.canvas.width, options.canvas.height);
  context.strokeStyle = "#263243";
  context.strokeRect(offsetX, offsetY, width, height);
  context.fillStyle = "rgba(53, 194, 255, 0.18)";
  context.fillRect(viewX, viewY, viewWidth, viewHeight);
  context.strokeStyle = "#35c2ff";
  context.lineWidth = 2;
  context.strokeRect(viewX, viewY, viewWidth, viewHeight);
}
