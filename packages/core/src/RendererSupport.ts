import type {
  RendererSupportEntry,
  RendererSupportName,
  RendererSupportNoteMap,
  RendererSupportObjectMap,
  RendererSupportProfile
} from "./RendererSupport.type.js";

export const rendererSupportMatrix: readonly RendererSupportEntry[] = [
  { kind: "Rect", canvas: "supported", webgl: "supported", note: "WebGL batches Rect as filled shape geometry.", priority: "done" },
  { kind: "Circle", canvas: "supported", webgl: "supported", note: "WebGL approximates Circle with triangles.", priority: "done" },
  { kind: "Ellipse", canvas: "supported", webgl: "supported", note: "WebGL approximates Ellipse with triangles.", priority: "done" },
  { kind: "Arc", canvas: "supported", webgl: "supported", note: "WebGL approximates Arc with segmented stroke or fan geometry.", priority: "done" },
  { kind: "Line", canvas: "supported", webgl: "supported", note: "WebGL writes stroked line geometry.", priority: "done" },
  { kind: "Polyline", canvas: "supported", webgl: "supported", note: "WebGL writes each segment as stroke geometry.", priority: "done" },
  { kind: "Polygon", canvas: "supported", webgl: "supported", note: "WebGL triangulates simple polygons with ear clipping.", priority: "done" },
  {
    kind: "ShapePath",
    canvas: "supported",
    webgl: "partial",
    note: "WebGL renders styled flattened strokes, simple closed fills, and optional rasterized complex fills.",
    limitation: "Complex fills need the opt-in rasterize fallback because they are not pure WebGL geometry yet.",
    nextStep: "Improve direct GPU fill rules after curve sampling controls and visual tests.",
    priority: "medium"
  },
  {
    kind: "Text2D",
    canvas: "supported",
    webgl: "partial",
    note: "WebGL rasterizes fill and optional stroke Text2D to cached textures; no glyph atlas yet.",
    limitation: "Large dynamic text scenes can still create many canvas textures.",
    nextStep: "Add glyph atlas or stronger text texture pooling after renderer parity is stable.",
    priority: "medium"
  },
  { kind: "Sprite", canvas: "supported", webgl: "supported", note: "WebGL batches consecutive Sprites by texture.", priority: "done" },
  { kind: "Group2D", canvas: "supported", webgl: "supported", note: "Groups are flattened by RenderPipeline before drawing.", priority: "done" }
];

export function getRendererSupportMatrix(): readonly RendererSupportEntry[] {
  return rendererSupportMatrix;
}

export function getRendererSupport(renderer: RendererSupportName): RendererSupportProfile {
  const objects: Partial<Record<keyof RendererSupportObjectMap, RendererSupportObjectMap[keyof RendererSupportObjectMap]>> = {};
  const notes: Partial<Record<keyof RendererSupportNoteMap, string>> = {};

  for (const entry of rendererSupportMatrix) {
    objects[entry.kind] = entry[renderer];
    notes[entry.kind] = entry.note;
  }

  return {
    renderer,
    objects: objects as RendererSupportObjectMap,
    notes: notes as RendererSupportNoteMap,
    matrix: rendererSupportMatrix
  };
}
