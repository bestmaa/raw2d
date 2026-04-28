import type { Object2D, Object2DRenderMode, RenderItem } from "raw2d-core";
import type { WebGLRenderRun, WebGLRenderRunKind } from "./WebGLRenderRun.type.js";

export function createWebGLRenderRuns(
  items: readonly RenderItem<Object2D>[],
  getKind: (object: Object2D) => WebGLRenderRunKind
): readonly WebGLRenderRun[] {
  const runs: WebGLRenderRun[] = [];
  let currentKind: WebGLRenderRunKind | null = null;
  let currentMode: Object2DRenderMode | null = null;
  let currentItems: RenderItem<Object2D>[] = [];

  for (const item of items) {
    const kind = getKind(item.object);
    const mode = item.object.renderMode;

    if ((currentKind !== kind || currentMode !== mode) && currentItems.length > 0) {
      runs.push({ kind: currentKind ?? "unsupported", mode: currentMode ?? "dynamic", items: currentItems });
      currentItems = [];
    }

    currentKind = kind;
    currentMode = mode;
    currentItems.push(item);
  }

  if (currentItems.length > 0) {
    runs.push({ kind: currentKind ?? "unsupported", mode: currentMode ?? "dynamic", items: currentItems });
  }

  return runs;
}
