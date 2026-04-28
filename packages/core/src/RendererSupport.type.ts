export type RendererSupportObjectKind =
  | "Arc"
  | "Circle"
  | "Ellipse"
  | "Group2D"
  | "Line"
  | "Polygon"
  | "Polyline"
  | "Rect"
  | "ShapePath"
  | "Sprite"
  | "Text2D";

export type RendererSupportLevel = "supported" | "partial" | "unsupported";

export type RendererSupportName = "canvas" | "webgl";

export interface RendererSupportEntry {
  readonly kind: RendererSupportObjectKind;
  readonly canvas: RendererSupportLevel;
  readonly webgl: RendererSupportLevel;
  readonly note: string;
}
