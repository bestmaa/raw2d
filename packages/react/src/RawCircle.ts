import { useRef, type ReactElement } from "react";
import { Circle } from "raw2d";
import { applyRawMaterialProps, createRawBasicMaterial } from "./applyRawMaterialProps.js";
import { applyRawObject2DProps } from "./applyRawObject2DProps.js";
import { useRaw2DSceneObject } from "./useRaw2DSceneObject.js";
import type { RawCircleProps } from "./RawCircle.type.js";

export function RawCircle(props: RawCircleProps): ReactElement | null {
  const objectRef = useRef<Circle | null>(null);

  if (!objectRef.current) {
    objectRef.current = new Circle({
      ...props,
      material: createRawBasicMaterial(props)
    });
  }

  const circle = objectRef.current;
  useRaw2DSceneObject({
    object: circle,
    update: (): void => {
      applyRawObject2DProps(circle, props);
      applyRawMaterialProps(circle.material, props);
      circle.setRadius(props.radius);
    },
    dependencies: [
      props.x,
      props.y,
      props.radius,
      props.fillColor,
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
