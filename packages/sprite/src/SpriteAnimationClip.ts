import type { SpriteAnimationClipOptions, SpriteAnimationClipSnapshot } from "./SpriteAnimationClip.type.js";
import type { TextureFrame } from "./TextureAtlas.type.js";

export class SpriteAnimationClip {
  public readonly name: string | null;
  public readonly fps: number;
  public readonly loop: boolean;
  private readonly frames: readonly TextureFrame[];

  public constructor(options: SpriteAnimationClipOptions) {
    if (options.frames.length === 0) {
      throw new Error("SpriteAnimationClip requires at least one frame.");
    }

    this.name = options.name ?? null;
    this.fps = Math.max(0.001, options.fps);
    this.loop = options.loop ?? true;
    this.frames = options.frames.map((frame) => normalizeFrame(frame));
  }

  public get frameCount(): number {
    return this.frames.length;
  }

  public get duration(): number {
    return this.frameCount / this.fps;
  }

  public getFrame(index: number): TextureFrame {
    const frame = this.frames[clampIndex(index, this.frameCount)];
    return normalizeFrame(frame);
  }

  public getFrames(): readonly TextureFrame[] {
    return this.frames.map((frame) => normalizeFrame(frame));
  }

  public getSnapshot(): SpriteAnimationClipSnapshot {
    return {
      name: this.name,
      frameCount: this.frameCount,
      fps: this.fps,
      loop: this.loop,
      duration: this.duration
    };
  }
}

function clampIndex(index: number, frameCount: number): number {
  return Math.min(frameCount - 1, Math.max(0, Math.floor(index)));
}

function normalizeFrame(frame: TextureFrame): TextureFrame {
  return {
    x: Math.max(0, frame.x),
    y: Math.max(0, frame.y),
    width: Math.max(0, frame.width),
    height: Math.max(0, frame.height)
  };
}
