export type BenchmarkObjectKind = "rect" | "circle" | "mixed";

export interface BenchmarkSceneOptions {
  objectCount: number;
  objectKind: BenchmarkObjectKind;
  staticRatio: number;
  cullingEnabled: boolean;
  atlasEnabled: boolean;
}

export interface BenchmarkPanelController {
  readonly element: HTMLElement;
  updateScene(options: BenchmarkSceneOptions): void;
  setPaused(paused: boolean): void;
  getStatsText(): string;
}
