import { Circle, Line, Rect, Text2D } from "../objects";
import type { CanvasObject } from "../core";
import { drawCircle, drawLine, drawRect, drawText2D } from "./canvas";
import type {
  CanvasObjectRendererLike,
  CanvasObjectRendererOptions
} from "./CanvasObjectRenderer.type";

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

      if (object instanceof Line) {
        drawLine({ context: this.context, line: object });
      }

      if (object instanceof Text2D) {
        drawText2D({ context: this.context, text: object });
      }
    }
  }
}
