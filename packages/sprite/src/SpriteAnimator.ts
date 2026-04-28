import type { Sprite } from "./Sprite.js";
import type { SpriteAnimationClip } from "./SpriteAnimationClip.js";
import type { SpriteAnimatorOptions, SpriteAnimatorSnapshot } from "./SpriteAnimator.type.js";

export class SpriteAnimator {
  public readonly sprite: Sprite;
  private clip: SpriteAnimationClip;
  private playing: boolean;
  private elapsed = 0;
  private frameIndex = 0;

  public constructor(options: SpriteAnimatorOptions) {
    this.sprite = options.sprite;
    this.clip = options.clip;
    this.playing = options.autoplay ?? true;
    this.applyFrame();
  }

  public update(deltaSeconds: number): void {
    if (!this.playing) {
      return;
    }

    this.elapsed += Math.max(0, deltaSeconds);
    this.setFrameIndex(this.getFrameIndexAtTime(this.elapsed));
  }

  public play(): void {
    this.playing = true;
  }

  public pause(): void {
    this.playing = false;
  }

  public stop(): void {
    this.playing = false;
    this.elapsed = 0;
    this.frameIndex = 0;
    this.applyFrame();
  }

  public reset(): void {
    this.elapsed = 0;
    this.frameIndex = 0;
    this.applyFrame();
  }

  public setClip(clip: SpriteAnimationClip, autoplay = this.playing): void {
    this.clip = clip;
    this.playing = autoplay;
    this.reset();
  }

  public getClip(): SpriteAnimationClip {
    return this.clip;
  }

  public getFrameIndex(): number {
    return this.frameIndex;
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public getSnapshot(): SpriteAnimatorSnapshot {
    return {
      playing: this.playing,
      frameIndex: this.frameIndex,
      elapsed: this.elapsed,
      clip: this.clip
    };
  }

  private getFrameIndexAtTime(time: number): number {
    const rawIndex = Math.floor(time * this.clip.fps);

    if (this.clip.loop) {
      return rawIndex % this.clip.frameCount;
    }

    const lastIndex = this.clip.frameCount - 1;

    if (rawIndex >= lastIndex) {
      this.playing = false;
      return lastIndex;
    }

    return rawIndex;
  }

  private setFrameIndex(index: number): void {
    if (index === this.frameIndex) {
      return;
    }

    this.frameIndex = index;
    this.applyFrame();
  }

  private applyFrame(): void {
    this.sprite.setFrame(this.clip.getFrame(this.frameIndex));
  }
}
