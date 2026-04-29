import { Sprite } from "./Sprite.js";
import type {
  CreateSpriteFromAtlasOptions,
  CreateSpritesFromAtlasOptions,
  SpriteAtlasMap
} from "./createSpriteFromAtlas.type.js";

export function createSpriteFromAtlas(options: CreateSpriteFromAtlasOptions): Sprite {
  const frame = options.atlas.getFrame(options.frame);

  return new Sprite({
    name: options.name,
    x: options.x,
    y: options.y,
    origin: options.origin,
    rotation: options.rotation,
    scaleX: options.scaleX,
    scaleY: options.scaleY,
    zIndex: options.zIndex,
    visible: options.visible,
    renderMode: options.renderMode,
    texture: options.atlas.texture,
    frame,
    width: options.width,
    height: options.height,
    opacity: options.opacity
  });
}

export function createSpritesFromAtlas(options: CreateSpritesFromAtlasOptions): SpriteAtlasMap {
  return Object.fromEntries(Object.entries(options.sprites).map(([name, spriteOptions]) => {
    return [name, createSpriteFromAtlas({
      ...spriteOptions,
      name: spriteOptions.name ?? name,
      atlas: options.atlas
    })];
  }));
}
