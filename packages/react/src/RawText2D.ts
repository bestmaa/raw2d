import { useRef, type ReactElement } from "react";
import { Text2D } from "raw2d";
import { applyRawMaterialProps, createRawBasicMaterial } from "./applyRawMaterialProps.js";
import { applyRawObject2DProps } from "./applyRawObject2DProps.js";
import { useRaw2DSceneObject } from "./useRaw2DSceneObject.js";
import type { RawText2DProps } from "./RawText2D.type.js";

export function RawText2D(props: RawText2DProps): ReactElement | null {
  const objectRef = useRef<Text2D | null>(null);

  if (!objectRef.current) {
    objectRef.current = new Text2D({
      ...props,
      material: createRawBasicMaterial(props)
    });
  }

  const text = objectRef.current;
  useRaw2DSceneObject({
    object: text,
    update: (): void => {
      applyRawObject2DProps(text, props);
      applyRawMaterialProps(text.material, props);
      text.setText(props.text);
      text.setFont(props.font ?? "24px sans-serif");
      text.align = props.align ?? "start";
      text.baseline = props.baseline ?? "alphabetic";
    },
    dependencies: [
      props.x,
      props.y,
      props.text,
      props.font,
      props.align,
      props.baseline,
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
