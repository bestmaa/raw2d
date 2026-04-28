import type { Camera2D } from "./Camera2D.js";
import type { Object2D } from "./Object2D.js";
import type { Rectangle } from "./Rectangle.js";
import type { SceneLike } from "./Scene.type.js";

export interface RenderViewport {
  readonly width: number;
  readonly height: number;
}

export type RenderBoundsProvider<TObject extends Object2D = Object2D> = (object: TObject) => Rectangle | null;

export type RenderObjectFilter<TObject extends Object2D = Object2D> = (object: TObject) => boolean;

export interface RenderPipelineBuildOptions<TObject extends Object2D = Object2D> {
  readonly scene?: SceneLike;
  readonly objects?: readonly TObject[];
  readonly camera?: Camera2D;
  readonly viewport?: RenderViewport;
  readonly culling?: boolean;
  readonly includeInvisible?: boolean;
  readonly filter?: RenderObjectFilter<TObject>;
  readonly boundsProvider?: RenderBoundsProvider<TObject>;
}

export interface RenderPipelineOptions<TObject extends Object2D = Object2D> {
  readonly defaultFilter?: RenderObjectFilter<TObject>;
  readonly boundsProvider?: RenderBoundsProvider<TObject>;
}

