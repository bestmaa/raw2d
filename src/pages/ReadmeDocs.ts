import basicMaterial from "../../docs/BasicMaterial.md?raw";
import camera2d from "../../docs/Camera2D.md?raw";
import cameraControls from "../../docs/CameraControls.md?raw";
import cameraWorldBounds from "../../docs/CameraWorldBounds.md?raw";
import canvas from "../../docs/Canvas.md?raw";
import canvasApi from "../../docs/Canvas-api.md?raw";
import canvasCulling from "../../docs/CanvasCulling.md?raw";
import canvasObjects from "../../docs/Canvas-objects.md?raw";
import circle from "../../docs/Circle.md?raw";
import dragging from "../../docs/Dragging.md?raw";
import group2d from "../../docs/Group2D.md?raw";
import hitTesting from "../../docs/HitTesting.md?raw";
import interactionController from "../../docs/InteractionController.md?raw";
import keyboardController from "../../docs/KeyboardController.md?raw";
import license from "../../docs/License.md?raw";
import line from "../../docs/Line.md?raw";
import objectResize from "../../docs/ObjectResize.md?raw";
import picking from "../../docs/Picking.md?raw";
import polygon from "../../docs/Polygon.md?raw";
import polyline from "../../docs/Polyline.md?raw";
import rect from "../../docs/Rect.md?raw";
import renderOrder from "../../docs/RenderOrder.md?raw";
import renderPipeline from "../../docs/RenderPipeline.md?raw";
import resizeHandles from "../../docs/ResizeHandles.md?raw";
import scene from "../../docs/Scene.md?raw";
import selection from "../../docs/Selection.md?raw";
import shapePath from "../../docs/ShapePath.md?raw";
import text2d from "../../docs/Text2D.md?raw";
import visibleObjects from "../../docs/VisibleObjects.md?raw";
import type { ReadmeDoc } from "./ReadmePage.type";

export const readmeDocs: readonly ReadmeDoc[] = [
  { id: "license", label: "License", filename: "License.md", content: license },
  { id: "canvas", label: "Canvas", filename: "Canvas.md", content: canvas },
  { id: "canvas-api", label: "Canvas API", filename: "Canvas-api.md", content: canvasApi },
  { id: "canvas-objects", label: "Canvas Objects", filename: "Canvas-objects.md", content: canvasObjects },
  { id: "canvas-culling", label: "Canvas Culling", filename: "CanvasCulling.md", content: canvasCulling },
  { id: "scene", label: "Scene", filename: "Scene.md", content: scene },
  { id: "camera2d", label: "Camera2D", filename: "Camera2D.md", content: camera2d },
  { id: "camera-world-bounds", label: "Camera World Bounds", filename: "CameraWorldBounds.md", content: cameraWorldBounds },
  { id: "visible-objects", label: "Visible Objects", filename: "VisibleObjects.md", content: visibleObjects },
  { id: "render-order", label: "Render Order", filename: "RenderOrder.md", content: renderOrder },
  { id: "render-pipeline", label: "Render Pipeline", filename: "RenderPipeline.md", content: renderPipeline },
  { id: "group2d", label: "Group2D", filename: "Group2D.md", content: group2d },
  { id: "camera-controls", label: "CameraControls", filename: "CameraControls.md", content: cameraControls },
  { id: "basic-material", label: "BasicMaterial", filename: "BasicMaterial.md", content: basicMaterial },
  { id: "rect", label: "Rect", filename: "Rect.md", content: rect },
  { id: "circle", label: "Circle", filename: "Circle.md", content: circle },
  { id: "line", label: "Line", filename: "Line.md", content: line },
  { id: "polyline", label: "Polyline", filename: "Polyline.md", content: polyline },
  { id: "polygon", label: "Polygon", filename: "Polygon.md", content: polygon },
  { id: "shape-path", label: "ShapePath", filename: "ShapePath.md", content: shapePath },
  { id: "text2d", label: "Text2D", filename: "Text2D.md", content: text2d },
  { id: "hit-testing", label: "Hit Testing", filename: "HitTesting.md", content: hitTesting },
  { id: "picking", label: "Picking", filename: "Picking.md", content: picking },
  { id: "selection", label: "Selection", filename: "Selection.md", content: selection },
  { id: "dragging", label: "Dragging", filename: "Dragging.md", content: dragging },
  { id: "resize-handles", label: "Resize Handles", filename: "ResizeHandles.md", content: resizeHandles },
  { id: "object-resize", label: "Object Resize", filename: "ObjectResize.md", content: objectResize },
  { id: "interaction-controller", label: "InteractionController", filename: "InteractionController.md", content: interactionController },
  { id: "keyboard-controller", label: "KeyboardController", filename: "KeyboardController.md", content: keyboardController }
];
