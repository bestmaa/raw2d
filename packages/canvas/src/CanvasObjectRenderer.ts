import { Arc, Circle, Ellipse, Line, Polygon, Polyline, Rect, ShapePath } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import type { CanvasObject } from "./Canvas.type.js";
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
} from "./canvas/index.js";
import type {
  CanvasObjectRendererLike,
  CanvasObjectRendererOptions
} from "./CanvasObjectRenderer.type.js";

export class CanvasObjectRenderer implements CanvasObjectRendererLike {
  private readonly context: CanvasRenderingContext2D;

  public constructor(options: CanvasObjectRendererOptions) {
    this.context = options.context;
  }

  public render(objects: readonly CanvasObject[]): void {
    for (const object of objects) {
      if (!object.visible) {
        continue;
      }

      if (object instanceof Rect) {
        drawRect({ context: this.context, rect: object });
      }

      if (object instanceof Circle) {
        drawCircle({ context: this.context, circle: object });
      }

      if (object instanceof Ellipse) {
        drawEllipse({ context: this.context, ellipse: object });
      }

      if (object instanceof Arc) {
        drawArc({ context: this.context, arc: object });
      }

      if (object instanceof Line) {
        drawLine({ context: this.context, line: object });
      }

      if (object instanceof Polyline) {
        drawPolyline({ context: this.context, polyline: object });
      }

      if (object instanceof Polygon) {
        drawPolygon({ context: this.context, polygon: object });
      }

      if (object instanceof ShapePath) {
        drawShapePath({ context: this.context, shapePath: object });
      }

      if (object instanceof Text2D) {
        drawText2D({ context: this.context, text: object });
      }

      if (object instanceof Sprite) {
        drawSprite({ context: this.context, sprite: object });
      }
    }
  }
}
