import { Circle, Line, Rect, Sprite, Text2D } from "raw2d";
import { applyRaw2DFiberMaterialProps, applyRaw2DFiberObjectProps } from "./applyRaw2DFiberProps.js";
import type { Raw2DFiberHostInstance } from "./Raw2DFiberHostConfig.type.js";
import type { Raw2DFiberHostPropsByType, Raw2DFiberHostType } from "./Raw2DFiberProps.type.js";
import {
  resolveRaw2DFiberSpriteTexture,
  shouldDisposeRaw2DFiberTexture
} from "./resolveRaw2DFiberSpriteTexture.js";

export function updateRaw2DFiberInstance<TType extends Raw2DFiberHostType>(
  instance: Raw2DFiberHostInstance<TType>,
  nextProps: Raw2DFiberHostPropsByType[TType]
): void {
  const previousProps = instance.props;

  applyRaw2DFiberObjectProps(instance.object, nextProps);
  updateTypedInstance(instance, nextProps, previousProps);
  instance.props = nextProps;
}

function updateTypedInstance<TType extends Raw2DFiberHostType>(
  instance: Raw2DFiberHostInstance<TType>,
  nextProps: Raw2DFiberHostPropsByType[TType],
  previousProps: Raw2DFiberHostPropsByType[TType]
): void {
  switch (instance.type) {
    case "rawCircle":
      updateCircle(instance.object, nextProps as Raw2DFiberHostPropsByType["rawCircle"]);
      break;
    case "rawLine":
      updateLine(instance.object, nextProps as Raw2DFiberHostPropsByType["rawLine"]);
      break;
    case "rawRect":
      updateRect(instance.object, nextProps as Raw2DFiberHostPropsByType["rawRect"]);
      break;
    case "rawSprite":
      updateSprite(
        instance.object,
        nextProps as Raw2DFiberHostPropsByType["rawSprite"],
        previousProps as Raw2DFiberHostPropsByType["rawSprite"]
      );
      break;
    case "rawText2D":
      updateText2D(instance.object, nextProps as Raw2DFiberHostPropsByType["rawText2D"]);
      break;
    case "rawGroup2D":
      break;
  }
}

function updateCircle(object: object, props: Raw2DFiberHostPropsByType["rawCircle"]): void {
  if (object instanceof Circle) {
    object.setRadius(props.radius);
    applyRaw2DFiberMaterialProps(object.material, props);
  }
}

function updateLine(object: object, props: Raw2DFiberHostPropsByType["rawLine"]): void {
  if (object instanceof Line) {
    object.setPoints(props.startX ?? 0, props.startY ?? 0, props.endX, props.endY);
    applyRaw2DFiberMaterialProps(object.material, props);
  }
}

function updateRect(object: object, props: Raw2DFiberHostPropsByType["rawRect"]): void {
  if (object instanceof Rect) {
    object.setSize(props.width, props.height);
    applyRaw2DFiberMaterialProps(object.material, props);
  }
}

function updateSprite(
  object: object,
  props: Raw2DFiberHostPropsByType["rawSprite"],
  previousProps: Raw2DFiberHostPropsByType["rawSprite"]
): void {
  if (object instanceof Sprite) {
    const previousTexture = object.texture;
    const nextTexture = resolveRaw2DFiberSpriteTexture(props);

    object.setTexture(nextTexture, props.frame);
    object.setSize(props.width ?? props.frame?.width ?? nextTexture.width, props.height ?? props.frame?.height ?? nextTexture.height);
    object.setOpacity(props.opacity ?? 1);

    if (previousTexture !== nextTexture && shouldDisposeRaw2DFiberTexture(previousProps)) {
      previousTexture.dispose();
    }
  }
}

function updateText2D(object: object, props: Raw2DFiberHostPropsByType["rawText2D"]): void {
  if (object instanceof Text2D) {
    object.setText(props.text);
    object.setFont(props.font ?? "24px sans-serif");
    object.align = props.align ?? "start";
    object.baseline = props.baseline ?? "alphabetic";
    object.markDirty();
    applyRaw2DFiberMaterialProps(object.material, props);
  }
}
