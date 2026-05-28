import type { BasicMaterial, Object2D } from "raw2d";
import type { Raw2DFiberMaterialProps, Raw2DFiberObjectProps } from "./Raw2DFiberProps.type.js";

export function applyRaw2DFiberObjectProps(object: Object2D, props: Raw2DFiberObjectProps): void {
  object.name = props.name ?? "";
  object.setPosition(props.x ?? 0, props.y ?? 0);
  object.rotation = props.rotation ?? 0;
  object.setScale(props.scaleX ?? 1, props.scaleY ?? 1);
  object.zIndex = props.zIndex ?? 0;
  object.visible = props.visible ?? true;
  object.renderMode = props.renderMode ?? "dynamic";

  if (props.origin !== undefined) {
    object.setOrigin(props.origin);
  }
}

export function applyRaw2DFiberMaterialProps(material: BasicMaterial, props: Raw2DFiberMaterialProps): void {
  if (props.fillColor !== undefined) material.fillColor = props.fillColor;
  if (props.strokeColor !== undefined) material.strokeColor = props.strokeColor;
  if (props.lineWidth !== undefined) material.lineWidth = props.lineWidth;
  if (props.strokeCap !== undefined) material.strokeCap = props.strokeCap;
  if (props.strokeJoin !== undefined) material.strokeJoin = props.strokeJoin;
  if (props.miterLimit !== undefined) material.miterLimit = props.miterLimit;
}
