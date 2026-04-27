import { Object2D } from "raw2d-core";
import type { SpriteOptions, SpriteSize } from "./Sprite.type.js";
import type { Texture } from "./Texture.js";

export class Sprite extends Object2D {
  public texture: Texture;
  public width: number;
  public height: number;
  public opacity: number;

  public constructor(options: SpriteOptions) {
    super(options);
    this.texture = options.texture;
    this.width = Math.max(0, options.width ?? options.texture.width);
    this.height = Math.max(0, options.height ?? options.texture.height);
    this.opacity = clampOpacity(options.opacity ?? 1);
  }

  public setTexture(texture: Texture): void {
    this.texture = texture;
  }

  public setSize(width: number, height: number): void {
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
  }

  public setOpacity(opacity: number): void {
    this.opacity = clampOpacity(opacity);
  }

  public getSize(): SpriteSize {
    return {
      width: this.width,
      height: this.height
    };
  }
}

function clampOpacity(opacity: number): number {
  return Math.min(1, Math.max(0, opacity));
}
