import type { BenchmarkSceneOptions } from "./BenchmarkScene.type";

export interface BenchmarkInputControl<TInput extends HTMLInputElement | HTMLSelectElement> {
  readonly element: HTMLElement;
  readonly input: TInput;
  readonly value?: HTMLElement;
}

export interface BenchmarkControls {
  readonly countControl: BenchmarkInputControl<HTMLInputElement>;
  readonly kindControl: BenchmarkInputControl<HTMLSelectElement>;
  readonly staticControl: BenchmarkInputControl<HTMLInputElement>;
  readonly cullingControl: BenchmarkInputControl<HTMLInputElement>;
  readonly atlasControl: BenchmarkInputControl<HTMLInputElement>;
}

export interface BenchmarkPresetControl {
  readonly button: HTMLButtonElement;
  readonly label: string;
  readonly options: BenchmarkSceneOptions;
}

export interface BenchmarkPresetControls {
  readonly element: HTMLElement;
  readonly buttons: readonly BenchmarkPresetControl[];
}
