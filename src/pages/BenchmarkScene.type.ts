export type BenchmarkObjectKind = "rect" | "circle";

export interface BenchmarkSceneOptions {
  objectCount: number;
  objectKind: BenchmarkObjectKind;
}

export interface BenchmarkPanelController {
  readonly element: HTMLElement;
  updateScene(options: BenchmarkSceneOptions): void;
}
