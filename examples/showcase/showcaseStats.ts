import type { ShowcaseStatsInput } from "./ShowcaseStats.type";

export function buildShowcaseStatsReport(input: ShowcaseStatsInput): string {
  const lines = [
    `renderer: ${input.rendererLabel}`,
    `camera: ${input.cameraX.toFixed(1)}, ${input.cameraY.toFixed(1)}`,
    `zoom: ${input.zoom.toFixed(2)}`,
    `interaction: ${input.interactionMode}`,
    `atlasSort: ${input.atlasSorting ? "on" : "off"}`,
    `staticBatches: ${input.staticBatches ? "on" : "off"}`,
    `culling: ${input.culling ? "on" : "off"}`,
    `objects: ${input.objectCount}`,
    `sprites: ${input.spriteCount}`,
    `shapes: ${input.shapeCount}`,
    `animated: ${input.animatedCount}`
  ];

  if (input.drawCalls !== null) {
    lines.push(`drawCalls: ${input.drawCalls}`);
  }

  if (input.textureBinds !== null) {
    lines.push(`textureBinds: ${input.textureBinds}`);
  }

  return lines.join(" | ");
}
