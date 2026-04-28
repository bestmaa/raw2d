import type { Camera2D } from "./Camera2D.js";
import type { Object2D } from "./Object2D.js";
import type { RenderList } from "./RenderList.js";
import type { Scene } from "./Scene.js";

export interface Renderer2DStats {
  readonly objects: number;
  readonly drawCalls: number;
}

export interface Renderer2DSize {
  readonly width: number;
  readonly height: number;
}

export interface Renderer2DLike<
  TObject extends Object2D = Object2D,
  TRenderOptions = unknown,
  TStats extends Renderer2DStats = Renderer2DStats,
  TSize extends Renderer2DSize = Renderer2DSize
> {
  render(scene: Scene, camera: Camera2D, options?: TRenderOptions): void;
  createRenderList(scene?: Scene, camera?: Camera2D, options?: TRenderOptions): RenderList<TObject>;
  setSize(width: number, height: number): void;
  getSize(): TSize;
  getStats(): TStats;
  setBackgroundColor(color: string): void;
  dispose(): void;
}
