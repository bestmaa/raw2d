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
  readonly limitation?: string;
  readonly nextStep?: string;
  readonly priority?: "done" | "high" | "medium" | "low";
}

export type RendererSupportObjectMap = Readonly<Record<RendererSupportObjectKind, RendererSupportLevel>>;

export type RendererSupportNoteMap = Readonly<Record<RendererSupportObjectKind, string>>;

export interface RendererSupportProfile {
  readonly renderer: RendererSupportName;
  readonly objects: RendererSupportObjectMap;
  readonly notes: RendererSupportNoteMap;
  readonly matrix: readonly RendererSupportEntry[];
}
