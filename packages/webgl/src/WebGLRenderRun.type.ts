import type { Object2D, RenderItem } from "raw2d-core";

export type WebGLRenderRunKind = "shape" | "sprite" | "unsupported";

export interface WebGLRenderRun {
  readonly kind: WebGLRenderRunKind;
  readonly items: readonly RenderItem<Object2D>[];
}

