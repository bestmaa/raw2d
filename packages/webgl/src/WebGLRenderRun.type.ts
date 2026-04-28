import type { Object2D, Object2DRenderMode, RenderItem } from "raw2d-core";

export type WebGLRenderRunKind = "shape" | "sprite" | "unsupported";

export interface WebGLRenderRun {
  readonly kind: WebGLRenderRunKind;
  readonly mode: Object2DRenderMode;
  readonly items: readonly RenderItem<Object2D>[];
}
