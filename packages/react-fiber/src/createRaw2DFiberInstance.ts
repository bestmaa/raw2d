import { BasicMaterial, Circle, Group2D, Line, Rect, Sprite, Text2D } from "raw2d";
import { applyRaw2DFiberMaterialProps, applyRaw2DFiberObjectProps } from "./applyRaw2DFiberProps.js";
import type { Raw2DFiberHostInstance } from "./Raw2DFiberHostConfig.type.js";
import type { Raw2DFiberHostPropsByType, Raw2DFiberHostType } from "./Raw2DFiberProps.type.js";

export function createRaw2DFiberInstance<TType extends Raw2DFiberHostType>(
  type: TType,
  props: Raw2DFiberHostPropsByType[TType]
): Raw2DFiberHostInstance<TType> {
  const instance = createTypedInstance(type, props);
  applyRaw2DFiberObjectProps(instance.object, props);
  return instance;
}

function createTypedInstance<TType extends Raw2DFiberHostType>(
  type: TType,
  props: Raw2DFiberHostPropsByType[TType]
): Raw2DFiberHostInstance<TType> {
  switch (type) {
    case "rawCircle": {
      const circleProps = props as Raw2DFiberHostPropsByType["rawCircle"];
      const material = createMaterial(circleProps);
      const object = new Circle({ ...circleProps, material });
      return { type, object, props };
    }
    case "rawGroup2D":
      return { type, object: new Group2D(props), props };
    case "rawLine": {
      const lineProps = props as Raw2DFiberHostPropsByType["rawLine"];
      const material = createMaterial(lineProps);
      const object = new Line({ ...lineProps, startX: lineProps.startX ?? 0, startY: lineProps.startY ?? 0, material });
      return { type, object, props };
    }
    case "rawRect": {
      const rectProps = props as Raw2DFiberHostPropsByType["rawRect"];
      const material = createMaterial(rectProps);
      const object = new Rect({ ...rectProps, material });
      return { type, object, props };
    }
    case "rawSprite": {
      const spriteProps = props as Raw2DFiberHostPropsByType["rawSprite"];
      return { type, object: new Sprite(spriteProps), props };
    }
    case "rawText2D": {
      const textProps = props as Raw2DFiberHostPropsByType["rawText2D"];
      const material = createMaterial(textProps);
      const object = new Text2D({ ...textProps, material });
      return { type, object, props };
    }
  }
}

function createMaterial(props: Raw2DFiberHostPropsByType["rawCircle" | "rawLine" | "rawRect" | "rawText2D"]): BasicMaterial {
  const material = new BasicMaterial();
  applyRaw2DFiberMaterialProps(material, props);
  return material;
}
