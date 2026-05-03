import { BasicMaterial } from "raw2d";
import type { RawMaterialProps } from "./RawMaterialProps.type.js";

export function createRawBasicMaterial(props: RawMaterialProps): BasicMaterial {
  return new BasicMaterial({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    lineWidth: props.lineWidth,
    strokeCap: props.strokeCap,
    strokeJoin: props.strokeJoin,
    miterLimit: props.miterLimit
  });
}

export function applyRawMaterialProps(material: BasicMaterial, props: RawMaterialProps): void {
  material.fillColor = props.fillColor ?? material.fillColor;
  material.strokeColor = props.strokeColor ?? material.strokeColor;
  material.lineWidth = props.lineWidth ?? material.lineWidth;
  material.strokeCap = props.strokeCap ?? material.strokeCap;
  material.strokeJoin = props.strokeJoin ?? material.strokeJoin;
  material.miterLimit = props.miterLimit ?? material.miterLimit;
}
