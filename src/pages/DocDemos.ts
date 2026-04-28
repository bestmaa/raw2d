import { createBoundsDemo } from "./BoundsDemo";
import { createArcDemo } from "./ArcDemo";
import { createCameraBoundsDemo } from "./CameraBoundsDemo";
import { createCameraControlsDemo } from "./CameraControlsDemo";
import { createCircleDemo } from "./CircleDemo";
import { createDragDemo } from "./DragDemo";
import { createEllipseDemo } from "./EllipseDemo";
import { createGroup2DDemo } from "./Group2DDemo";
import { createHitTestingDemo } from "./HitTestingDemo";
import { createInteractionControllerDemo } from "./InteractionControllerDemo";
import { createKeyboardDemo } from "./KeyboardDemo";
import { createLineDemo } from "./LineDemo";
import { createOriginDemo } from "./OriginDemo";
import { createPolygonDemo } from "./PolygonDemo";
import { createPolylineDemo } from "./PolylineDemo";
import { createRectDemo } from "./RectDemo";
import { createRenderOrderDemo } from "./RenderOrderDemo";
import { createRenderPipelineDemo } from "./RenderPipelineDemo";
import { createResizeDemo } from "./ResizeDemo";
import { createSelectionDemo } from "./SelectionDemo";
import { createShapePathDemo } from "./ShapePathDemo";
import { createSpriteDemo } from "./SpriteDemo";
import { createSpriteAnimationDemo } from "./SpriteAnimationDemo";
import { createText2DDemo } from "./Text2DDemo";
import { createTextureAtlasDemo } from "./TextureAtlasDemo";
import { createVisibleObjectsDemo } from "./VisibleObjectsDemo";
import { createWebGLRendererDemo } from "./WebGLRendererDemo";
import type { DocSection } from "./DocPage.type";
import type { InteractionControllerDemoVariant } from "./InteractionControllerDemo.type";

const demoIds = [
  "rect",
  "circle",
  "ellipse",
  "arc",
  "line",
  "polyline",
  "polygon",
  "shape-path",
  "text2d",
  "sprite",
  "texture-atlas",
  "sprite-animation",
  "group2d",
  "origin",
  "origin-keywords",
  "origin-rect",
  "origin-custom",
  "origin-defaults",
  "bounds",
  "bounds-rectangle",
  "bounds-local",
  "bounds-world",
  "bounds-sprite",
  "bounds-text2d",
  "camera-bounds",
  "visible-objects",
  "render-order",
  "render-pipeline",
  "webgl-renderer",
  "hit-testing",
  "interaction-controller",
  "camera-controls",
  "keyboard",
  "dragging",
  "selection",
  "resize"
] as const;

export function hasDemoId(demoId: string): boolean {
  return demoIds.includes(demoId as (typeof demoIds)[number]);
}

export function createDemoForId(demoId: string, section?: DocSection): HTMLElement | null {
  if (demoId === "rect") {
    return createRectDemo();
  }

  if (demoId === "circle") {
    return createCircleDemo();
  }

  if (demoId === "ellipse") {
    return createEllipseDemo();
  }

  if (demoId === "arc") {
    return createArcDemo();
  }

  if (demoId === "line") {
    return createLineDemo();
  }

  if (demoId === "polyline") {
    return createPolylineDemo();
  }

  if (demoId === "polygon") {
    return createPolygonDemo();
  }

  if (demoId === "shape-path") {
    return createShapePathDemo();
  }

  if (demoId === "text2d" || demoId === "bounds-text2d") {
    return createText2DDemo();
  }

  if (demoId === "sprite" || demoId === "bounds-sprite") {
    return createSpriteDemo();
  }

  if (demoId === "texture-atlas") {
    return createTextureAtlasDemo();
  }

  if (demoId === "sprite-animation") {
    return createSpriteAnimationDemo();
  }

  if (demoId === "group2d") {
    return createGroup2DDemo();
  }

  if (demoId === "origin" || demoId === "origin-keywords") {
    return createOriginDemo({ variant: "keywords" });
  }

  if (demoId === "origin-rect") {
    return createOriginDemo({ variant: "rect" });
  }

  if (demoId === "origin-custom") {
    return createOriginDemo({ variant: "custom" });
  }

  if (demoId === "origin-defaults") {
    return createOriginDemo({ variant: "defaults" });
  }

  if (demoId === "bounds" || demoId === "bounds-world") {
    return createBoundsDemo({ variant: "world" });
  }

  if (demoId === "bounds-rectangle") {
    return createBoundsDemo({ variant: "rectangle" });
  }

  if (demoId === "bounds-local") {
    return createBoundsDemo({ variant: "local" });
  }

  if (demoId === "hit-testing") {
    return createHitTestingDemo();
  }

  if (demoId === "camera-bounds") {
    return createCameraBoundsDemo();
  }

  if (demoId === "visible-objects") {
    return createVisibleObjectsDemo();
  }

  if (demoId === "render-order") {
    return createRenderOrderDemo();
  }

  if (demoId === "render-pipeline") {
    return createRenderPipelineDemo();
  }

  if (demoId === "webgl-renderer") {
    return createWebGLRendererDemo();
  }

  if (demoId === "interaction-controller") {
    return createInteractionControllerDemo({ variant: getInteractionControllerVariant(section) });
  }

  if (demoId === "camera-controls") {
    return createCameraControlsDemo();
  }

  if (demoId === "keyboard") {
    return createKeyboardDemo();
  }

  if (demoId === "dragging") {
    return createDragDemo();
  }

  if (demoId === "selection") {
    return createSelectionDemo();
  }

  if (demoId === "resize") {
    return createResizeDemo();
  }

  return null;
}

function getInteractionControllerVariant(section?: DocSection): InteractionControllerDemoVariant {
  const title = section?.title ?? "";

  if (title === "Create Controller") {
    return "create";
  }

  if (title === "Single Object") {
    return "single";
  }

  if (title === "Single Object Custom") {
    return "single-custom";
  }

  if (title === "Many Objects") {
    return "many";
  }

  if (title === "Current Selection") {
    return "selection";
  }

  if (title === "Detach Objects") {
    return "detach";
  }

  if (title === "Read State") {
    return "state";
  }

  if (title === "Renderer Independent") {
    return "renderer";
  }

  return "global";
}
