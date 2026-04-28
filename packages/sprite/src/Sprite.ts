import { Object2D } from "raw2d-core";
import type { SpriteOptions, SpriteSize } from "./Sprite.type.js";
import type { Texture } from "./Texture.js";
import type { TextureFrame } from "./TextureAtlas.type.js";

export class Sprite extends Object2D {
  public texture: Texture;
  public frame: TextureFrame | null;
  public width: number;
  public height: number;
  public opacity: number;

  public constructor(options: SpriteOptions) {
    super(options);
    this.texture = options.texture;
    this.frame = options.frame ? normalizeFrame(options.frame) : null;
    this.width = Math.max(0, options.width ?? this.frame?.width ?? options.texture.width);
    this.height = Math.max(0, options.height ?? this.frame?.height ?? options.texture.height);
    this.opacity = clampOpacity(options.opacity ?? 1);
  }

  public setTexture(texture: Texture, frame?: TextureFrame | null): void {
    this.texture = texture;

    if (frame !== undefined) {
      this.setFrame(frame);
    }
  }

  public setFrame(frame: TextureFrame | null): void {
    this.frame = frame ? normalizeFrame(frame) : null;
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

function normalizeFrame(frame: TextureFrame): TextureFrame {
  return {
    x: Math.max(0, frame.x),
    y: Math.max(0, frame.y),
    width: Math.max(0, frame.width),
    height: Math.max(0, frame.height)
  };
}
