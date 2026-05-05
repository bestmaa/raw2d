import type { StudioPngExportOptions } from "./StudioPngExport.type";

export function createStudioPngFilename(sceneName: string): string {
  const safeName = sceneName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeName || "raw2d-scene"}.png`;
}

export function getStudioCanvasPngDataUrl(root: HTMLElement): string {
  const canvas = root.querySelector<HTMLCanvasElement>(".studio-canvas");

  if (!canvas) {
    throw new Error("Studio canvas not found.");
  }

  return canvas.toDataURL("image/png");
}

export function downloadStudioCanvasPng(options: StudioPngExportOptions): void {
  const documentRef = options.documentRef ?? document;
  const anchor = documentRef.createElement("a");

  anchor.href = getStudioCanvasPngDataUrl(options.root);
  anchor.download = createStudioPngFilename(options.sceneName);
  anchor.click();
}
