import type {
  RendererSupportEntry,
  RendererSupportName,
  RendererSupportNoteMap,
  RendererSupportObjectMap,
  RendererSupportProfile
} from "./RendererSupport.type.js";

export const rendererSupportMatrix: readonly RendererSupportEntry[] = [
  { kind: "Rect", canvas: "supported", webgl: "supported", note: "WebGL batches Rect as filled shape geometry." },
  { kind: "Circle", canvas: "supported", webgl: "supported", note: "WebGL approximates Circle with triangles." },
  { kind: "Ellipse", canvas: "supported", webgl: "supported", note: "WebGL approximates Ellipse with triangles." },
  { kind: "Arc", canvas: "supported", webgl: "supported", note: "WebGL approximates Arc with segmented stroke or fan geometry." },
  { kind: "Line", canvas: "supported", webgl: "supported", note: "WebGL writes stroked line geometry." },
  { kind: "Polyline", canvas: "supported", webgl: "supported", note: "WebGL writes each segment as stroke geometry." },
  { kind: "Polygon", canvas: "supported", webgl: "supported", note: "WebGL triangulates simple polygons with ear clipping." },
  { kind: "ShapePath", canvas: "supported", webgl: "partial", note: "WebGL renders flattened strokes and simple closed fills." },
  { kind: "Text2D", canvas: "supported", webgl: "partial", note: "WebGL rasterizes Text2D to texture; no glyph atlas yet." },
  { kind: "Sprite", canvas: "supported", webgl: "supported", note: "WebGL batches consecutive Sprites by texture." },
  { kind: "Group2D", canvas: "supported", webgl: "supported", note: "Groups are flattened by RenderPipeline before drawing." }
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
