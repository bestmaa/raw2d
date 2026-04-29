import type { Camera2D } from "./Camera2D.js";
import type { Object2D } from "./Object2D.js";
import type { RenderList } from "./RenderList.js";
import type { RenderListStats } from "./RenderList.type.js";
import type { Scene } from "./Scene.js";

export interface Renderer2DStats {
  readonly objects: number;
  readonly drawCalls: number;
  readonly renderList: RenderListStats;
}

export interface Renderer2DSize {
  readonly width: number;
  readonly height: number;
}

export interface Renderer2DRenderOptions<TObject extends Object2D = Object2D> {
  readonly culling?: boolean;
  readonly renderList?: RenderList<TObject>;
}

export interface Renderer2DLike<
  TObject extends Object2D = Object2D,
  TRenderOptions extends Renderer2DRenderOptions<TObject> = Renderer2DRenderOptions<TObject>,
  TStats extends Renderer2DStats = Renderer2DStats,
  TSize extends Renderer2DSize = Renderer2DSize
> {
  render(scene: Scene, camera: Camera2D, options?: TRenderOptions): void;
  createRenderList(scene?: Scene, camera?: Camera2D, options?: TRenderOptions): RenderList<TObject>;
  clear(color?: string): void;
  setSize(width: number, height: number): void;
  getSize(): TSize;
  getStats(): TStats;
  setBackgroundColor(color: string): void;
  dispose(): void;
}
