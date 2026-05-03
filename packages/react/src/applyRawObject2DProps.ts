import type { Object2D } from "raw2d";
import type { RawObject2DProps } from "./RawObject2DProps.type.js";

export function applyRawObject2DProps(object: Object2D, props: RawObject2DProps): void {
  object.name = props.name ?? "";
  object.x = props.x ?? 0;
  object.y = props.y ?? 0;
  object.rotation = props.rotation ?? 0;
  object.scaleX = props.scaleX ?? 1;
  object.scaleY = props.scaleY ?? 1;
  object.zIndex = props.zIndex ?? 0;
  object.visible = props.visible ?? true;
  object.renderMode = props.renderMode ?? "dynamic";

  if (props.origin) {
    object.setOrigin(props.origin);
  }
}
