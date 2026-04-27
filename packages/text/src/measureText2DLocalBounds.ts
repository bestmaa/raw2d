import { Rectangle } from "raw2d-core";
import type { MeasureText2DBoundsOptions } from "./Text2DBounds.type.js";

export function measureText2DLocalBounds(options: MeasureText2DBoundsOptions): Rectangle {
  const { context, text } = options;

  context.save();
  context.font = text.font;
  context.textAlign = text.align;
  context.textBaseline = text.baseline;
  const metrics = context.measureText(text.text);
  context.restore();

  return new Rectangle({
    x: -metrics.actualBoundingBoxLeft,
    y: -metrics.actualBoundingBoxAscent,
    width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  });
}
