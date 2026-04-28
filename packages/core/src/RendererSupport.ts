import type { RendererSupportEntry } from "./RendererSupport.type.js";

export const rendererSupportMatrix: readonly RendererSupportEntry[] = [
  { kind: "Rect", canvas: "supported", webgl: "supported", note: "WebGL batches Rect as filled shape geometry." },
  { kind: "Circle", canvas: "supported", webgl: "supported", note: "WebGL approximates Circle with triangles." },
  { kind: "Ellipse", canvas: "supported", webgl: "supported", note: "WebGL approximates Ellipse with triangles." },
  { kind: "Arc", canvas: "supported", webgl: "supported", note: "WebGL approximates Arc with segmented stroke or fan geometry." },
  { kind: "Line", canvas: "supported", webgl: "supported", note: "WebGL writes stroked line geometry." },
  { kind: "Polyline", canvas: "supported", webgl: "supported", note: "WebGL writes each segment as stroke geometry." },
  { kind: "Polygon", canvas: "supported", webgl: "partial", note: "WebGL uses a simple fan, so convex polygons are the safe target." },
  { kind: "ShapePath", canvas: "supported", webgl: "unsupported", note: "Custom paths remain Canvas-only for now." },
  { kind: "Text2D", canvas: "supported", webgl: "partial", note: "WebGL rasterizes Text2D to texture; no glyph atlas yet." },
  { kind: "Sprite", canvas: "supported", webgl: "supported", note: "WebGL batches consecutive Sprites by texture." },
  { kind: "Group2D", canvas: "supported", webgl: "supported", note: "Groups are flattened by RenderPipeline before drawing." }
];

export function getRendererSupportMatrix(): readonly RendererSupportEntry[] {
  return rendererSupportMatrix;
}
