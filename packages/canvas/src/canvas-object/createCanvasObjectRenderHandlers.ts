import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect, ShapePath } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import {
  drawArc,
  drawCircle,
  drawEllipse,
  drawLine,
  drawPolygon,
  drawPolyline,
  drawRect,
  drawShapePath,
  drawSprite,
  drawText2D
} from "../canvas/index.js";
import type { CanvasObjectRenderHandler } from "./CanvasObjectRenderHandler.type.js";

export function createCanvasObjectRenderHandlers(): readonly CanvasObjectRenderHandler[] {
  return [
    { canRender: (object) => object instanceof Rect, render: (context, object) => drawRect({ context, rect: object as Rect }) },
    { canRender: (object) => object instanceof Circle, render: (context, object) => drawCircle({ context, circle: object as Circle }) },
    { canRender: (object) => object instanceof Ellipse, render: (context, object) => drawEllipse({ context, ellipse: object as Ellipse }) },
    { canRender: (object) => object instanceof Arc, render: (context, object) => drawArc({ context, arc: object as Arc }) },
    { canRender: (object) => object instanceof Line, render: (context, object) => drawLine({ context, line: object as Line }) },
    { canRender: (object) => object instanceof Polyline, render: (context, object) => drawPolyline({ context, polyline: object as Polyline }) },
    { canRender: (object) => object instanceof Polygon, render: (context, object) => drawPolygon({ context, polygon: object as Polygon }) },
    { canRender: (object) => object instanceof ShapePath, render: (context, object) => drawShapePath({ context, shapePath: object as ShapePath }) },
    { canRender: (object) => object instanceof Text2D, render: (context, object) => drawText2D({ context, text: object as Text2D }) },
    { canRender: (object) => object instanceof Sprite, render: (context, object) => drawSprite({ context, sprite: object as Sprite }) }
  ];
}
