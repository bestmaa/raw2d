import type { Object2D, RenderItem } from "raw2d-core";
import type { WebGLRenderRun, WebGLRenderRunKind } from "./WebGLRenderRun.type.js";

export function createWebGLRenderRuns(
  items: readonly RenderItem<Object2D>[],
  getKind: (object: Object2D) => WebGLRenderRunKind
): readonly WebGLRenderRun[] {
  const runs: WebGLRenderRun[] = [];
  let currentKind: WebGLRenderRunKind | null = null;
  let currentItems: RenderItem<Object2D>[] = [];

  for (const item of items) {
    const kind = getKind(item.object);

    if (currentKind !== kind && currentItems.length > 0) {
      runs.push({ kind: currentKind ?? "unsupported", items: currentItems });
      currentItems = [];
    }

    currentKind = kind;
    currentItems.push(item);
  }

  if (currentItems.length > 0) {
    runs.push({ kind: currentKind ?? "unsupported", items: currentItems });
  }

  return runs;
}

