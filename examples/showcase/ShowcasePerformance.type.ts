import type { ShowcaseSceneResult } from "./ShowcaseScene.type";

export interface ShowcasePerformanceOptions {
  readonly atlasSorting: boolean;
  readonly culling: boolean;
  readonly staticBatches: boolean;
}

export interface ApplyShowcasePerformanceOptions {
  readonly scene: ShowcaseSceneResult;
  readonly options: ShowcasePerformanceOptions;
}
