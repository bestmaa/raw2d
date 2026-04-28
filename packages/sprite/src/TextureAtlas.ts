import type { Texture } from "./Texture.js";
import type { TextureAtlasFrameOptions, TextureAtlasOptions, TextureFrame } from "./TextureAtlas.type.js";

export class TextureAtlas {
  public readonly texture: Texture;
  private readonly frames = new Map<string, TextureFrame>();
  private version = 0;

  public constructor(options: TextureAtlasOptions) {
    this.texture = options.texture;

    for (const [name, frame] of Object.entries(options.frames ?? {})) {
      this.frames.set(name, normalizeFrame(frame));
    }
  }

  public setFrame(options: TextureAtlasFrameOptions): void {
    this.frames.set(options.name, normalizeFrame(options));
    this.version += 1;
  }

  public getVersion(): number {
    return this.version;
  }

  public getFrame(name: string): TextureFrame {
    const frame = this.frames.get(name);

    if (!frame) {
      throw new Error(`TextureAtlas frame not found: ${name}`);
    }

    return frame;
  }

  public hasFrame(name: string): boolean {
    return this.frames.has(name);
  }

  public getFrameNames(): readonly string[] {
    return [...this.frames.keys()];
  }
}

function normalizeFrame(frame: TextureFrame): TextureFrame {
  return {
    x: Math.max(0, frame.x),
    y: Math.max(0, frame.y),
    width: Math.max(0, frame.width),
    height: Math.max(0, frame.height)
  };
}
