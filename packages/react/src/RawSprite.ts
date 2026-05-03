import { useRef, type ReactElement } from "react";
import { Sprite } from "raw2d";
import { applyRawObject2DProps } from "./applyRawObject2DProps.js";
import { useRaw2DSceneObject } from "./useRaw2DSceneObject.js";
import type { RawSpriteProps } from "./RawSprite.type.js";

export function RawSprite(props: RawSpriteProps): ReactElement | null {
  const objectRef = useRef<Sprite | null>(null);

  if (!objectRef.current) {
    objectRef.current = new Sprite(props);
  }

  const sprite = objectRef.current;
  useRaw2DSceneObject({
    object: sprite,
    update: (): void => {
      applyRawObject2DProps(sprite, props);
      sprite.setTexture(props.texture, props.frame);
      sprite.setSize(props.width ?? props.texture.width, props.height ?? props.texture.height);
      sprite.setOpacity(props.opacity ?? 1);
    },
    dependencies: [
      props.x,
      props.y,
      props.texture,
      props.frame,
      props.width,
      props.height,
      props.opacity,
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
