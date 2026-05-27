import type { ResizeStudioTextObjectOptions, StudioTextMetricsEstimate, StudioTextResizeState } from "./StudioTextResize.type";
import type { StudioTextState } from "./StudioSceneState.type";
import type { StudioResizeBounds } from "./StudioResize.type";

const defaultFont = "24px sans-serif";
const minimumFontSize = 8;
const textHeightRatio = 1.25;

export function getStudioTextResizeBounds(object: StudioTextState): StudioResizeBounds {
  const metrics = estimateTextMetrics(object);

  return {
    x: object.x,
    y: object.y - metrics.fontSize,
    width: Math.max(metrics.fontSize, metrics.fontSize * metrics.widthRatio),
    height: metrics.fontSize * textHeightRatio
  };
}

export function resizeStudioTextObject(options: ResizeStudioTextObjectOptions): StudioTextState {
  const metrics = estimateTextMetrics(options.object);
  const fontSize = Math.max(
    minimumFontSize,
    Math.round(Math.max(options.bounds.height / textHeightRatio, options.bounds.width / metrics.widthRatio))
  );

  return {
    ...options.object,
    x: Math.round(options.bounds.x),
    y: Math.round(options.bounds.y + fontSize),
    font: setFontSize(options.object.font, fontSize)
  };
}

export function getStudioTextResizeState(object: StudioTextState): StudioTextResizeState {
  return { x: object.x, y: object.y, font: object.font };
}

function estimateTextMetrics(object: StudioTextState): StudioTextMetricsEstimate {
  const fontSize = parseFontSize(object.font);
  const widthRatio = Math.max(1, object.text.length * 0.6);

  return { fontSize, widthRatio };
}

function parseFontSize(font: string | undefined): number {
  const match = font?.match(/(\d+(?:\.\d+)?)px/);
  const parsed = match ? Number(match[1]) : 24;

  return Number.isFinite(parsed) ? parsed : 24;
}

function setFontSize(font: string | undefined, size: number): string {
  const nextSize = `${Math.max(minimumFontSize, Math.round(size))}px`;

  return font?.match(/(\d+(?:\.\d+)?)px/) ? font.replace(/(\d+(?:\.\d+)?)px/, nextSize) : `${nextSize} ${defaultFont.split(" ").slice(1).join(" ")}`;
}
