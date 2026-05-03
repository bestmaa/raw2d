import { useRef, type ReactElement } from "react";
import { Line } from "raw2d";
import { applyRawMaterialProps, createRawBasicMaterial } from "./applyRawMaterialProps.js";
import { applyRawObject2DProps } from "./applyRawObject2DProps.js";
import { useRaw2DSceneObject } from "./useRaw2DSceneObject.js";
import type { RawLineProps } from "./RawLine.type.js";

export function RawLine(props: RawLineProps): ReactElement | null {
  const objectRef = useRef<Line | null>(null);

  if (!objectRef.current) {
    objectRef.current = new Line({
      ...props,
      material: createRawBasicMaterial(props)
    });
  }

  const line = objectRef.current;
  useRaw2DSceneObject({
    object: line,
    update: (): void => {
      applyRawObject2DProps(line, props);
      applyRawMaterialProps(line.material, props);
      line.setPoints(props.startX ?? 0, props.startY ?? 0, props.endX, props.endY);
    },
    dependencies: [
      props.x,
      props.y,
      props.startX,
      props.startY,
      props.endX,
      props.endY,
      props.strokeColor,
      props.lineWidth,
      props.strokeCap,
      props.strokeJoin,
      props.miterLimit,
      props.rotation,
      props.scaleX,
      props.scaleY,
      props.zIndex,
      props.visible,
      props.renderMode,
      props.origin,
      props.name
    ]
  });

  return null;
}
