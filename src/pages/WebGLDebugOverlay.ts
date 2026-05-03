import type { WebGLDiagnostics } from "raw2d";

export function createWebGLDebugOverlay(): HTMLElement {
  const overlay = document.createElement("code");
  overlay.className = "raw2d-webgl-debug-overlay";
  overlay.style.position = "absolute";
  overlay.style.left = "10px";
  overlay.style.top = "10px";
  overlay.style.padding = "6px 8px";
  overlay.style.background = "rgba(5, 10, 18, 0.82)";
  overlay.style.border = "1px solid rgba(125, 211, 252, 0.45)";
  overlay.style.color = "#e5f7ff";
  overlay.style.fontSize = "12px";
  overlay.style.lineHeight = "1.45";
  overlay.style.pointerEvents = "none";
  overlay.style.whiteSpace = "pre";
  overlay.textContent = "WebGL diagnostics pending";
  return overlay;
}

export function createDebugCanvasLayer(canvas: HTMLCanvasElement, overlay: HTMLElement): HTMLElement {
  const layer = document.createElement("div");
  layer.style.position = "relative";
  layer.style.width = "fit-content";
  layer.append(canvas, overlay);
  return layer;
}

export function updateWebGLDebugOverlay(overlay: HTMLElement, diagnostics: WebGLDiagnostics | null): void {
  if (!diagnostics) {
    overlay.textContent = "renderer: unavailable";
    return;
  }

  overlay.textContent = [
    `renderer: ${diagnostics.renderer}`,
    `lost: ${diagnostics.contextLost ? "yes" : "no"}`,
    `objects: ${diagnostics.stats.objects}`,
    `drawCalls: ${diagnostics.stats.drawCalls}`,
    `textureBinds: ${diagnostics.stats.textureBinds}`,
    `textureCache: ${diagnostics.textureCacheSize}`,
    `textCache: ${diagnostics.textTextureCacheSize}`
  ].join("\n");
}
