import { useRef, type ReactElement } from "react";
import { Rect } from "raw2d";
import { applyRawMaterialProps, createRawBasicMaterial } from "./applyRawMaterialProps.js";
import { applyRawObject2DProps } from "./applyRawObject2DProps.js";
import { useRaw2DSceneObject } from "./useRaw2DSceneObject.js";
import type { RawRectProps } from "./RawRect.type.js";

export function RawRect(props: RawRectProps): ReactElement | null {
  const objectRef = useRef<Rect | null>(null);

  if (!objectRef.current) {
    objectRef.current = new Rect({
      ...props,
      material: createRawBasicMaterial(props)
    });
  }

  const rect = objectRef.current;
  useRaw2DSceneObject({
    object: rect,
    update: (): void => {
      applyRawObject2DProps(rect, props);
      applyRawMaterialProps(rect.material, props);
      rect.setSize(props.width, props.height);
    },
    dependencies: [
      props.x,
      props.y,
      props.width,
      props.height,
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
