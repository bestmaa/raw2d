import { createBoundsDemo } from "./BoundsDemo";
import { createArcDemo } from "./ArcDemo";
import { createCircleDemo } from "./CircleDemo";
import { createDragDemo } from "./DragDemo";
import { createEllipseDemo } from "./EllipseDemo";
import { createHitTestingDemo } from "./HitTestingDemo";
import { createLineDemo } from "./LineDemo";
import { createOriginDemo } from "./OriginDemo";
import { createPolygonDemo } from "./PolygonDemo";
import { createPolylineDemo } from "./PolylineDemo";
import { createRectDemo } from "./RectDemo";
import { createSelectionDemo } from "./SelectionDemo";
import { createShapePathDemo } from "./ShapePathDemo";
import { createSpriteDemo } from "./SpriteDemo";
import { createText2DDemo } from "./Text2DDemo";

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
  "hit-testing",
  "dragging",
  "selection"
] as const;

export function hasDemoId(demoId: string): boolean {
  return demoIds.includes(demoId as (typeof demoIds)[number]);
}

export function createDemoForId(demoId: string): HTMLElement | null {
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

  if (demoId === "dragging") {
    return createDragDemo();
  }

  if (demoId === "selection") {
    return createSelectionDemo();
  }

  return null;
}
