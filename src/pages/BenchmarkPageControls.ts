import type { BenchmarkSceneOptions } from "./BenchmarkScene.type";
import type { BenchmarkControls, BenchmarkInputControl, BenchmarkPresetControl, BenchmarkPresetControls } from "./BenchmarkPageControls.type";

export function defaultBenchmarkOptions(): BenchmarkSceneOptions {
  return {
    objectCount: 140,
    objectKind: "rect",
    staticRatio: 0.72,
    cullingEnabled: false,
    atlasEnabled: true
  };
}

export function createCountControl(options: BenchmarkSceneOptions): BenchmarkInputControl<HTMLInputElement> {
  const label = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  const value = document.createElement("strong");

  text.textContent = "Objects";
  input.type = "range";
  input.min = "20";
  input.max = "400";
  input.step = "20";
  input.value = String(options.objectCount);
  value.textContent = String(options.objectCount);
  label.append(text, input, value);
  return { element: label, input, value };
}

export function createKindControl(options: BenchmarkSceneOptions): BenchmarkInputControl<HTMLSelectElement> {
  const label = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("select");

  text.textContent = "Object type";
  input.append(new Option("Rect", "rect"), new Option("Circle", "circle"), new Option("Mixed", "mixed"));
  input.value = options.objectKind;
  label.append(text, input);
  return { element: label, input };
}

export function createStaticRatioControl(options: BenchmarkSceneOptions): BenchmarkInputControl<HTMLInputElement> {
  const label = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  const value = document.createElement("strong");

  text.textContent = "Static ratio";
  input.type = "range";
  input.min = "0";
  input.max = "100";
  input.step = "10";
  input.value = String(Math.round(options.staticRatio * 100));
  value.textContent = `${input.value}%`;
  label.append(text, input, value);
  return { element: label, input, value };
}

export function createToggleControl(labelText: string, checked: boolean): BenchmarkInputControl<HTMLInputElement> {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const text = document.createElement("span");

  input.type = "checkbox";
  input.checked = checked;
  text.textContent = labelText;
  label.append(input, text);
  return { element: label, input };
}

export function createPresetControls(): BenchmarkPresetControls {
  const element = document.createElement("div");
  const buttons = [
    createPresetButton("Canvas reference", { objectCount: 80, objectKind: "mixed", staticRatio: 0.2, cullingEnabled: false, atlasEnabled: false }),
    createPresetButton("WebGL batch", { objectCount: 320, objectKind: "rect", staticRatio: 0.9, cullingEnabled: false, atlasEnabled: true }),
    createPresetButton("Culling stress", { objectCount: 400, objectKind: "mixed", staticRatio: 0.6, cullingEnabled: true, atlasEnabled: true })
  ];

  element.className = "example-actions";
  element.append(...buttons.map((preset) => preset.button));
  return { element, buttons };
}

export function applyBenchmarkPreset(target: BenchmarkSceneOptions, source: BenchmarkSceneOptions): void {
  target.objectCount = source.objectCount;
  target.objectKind = source.objectKind;
  target.staticRatio = source.staticRatio;
  target.cullingEnabled = source.cullingEnabled;
  target.atlasEnabled = source.atlasEnabled;
}

export function syncBenchmarkControls(controls: BenchmarkControls & { readonly options: BenchmarkSceneOptions }): void {
  controls.countControl.input.value = String(controls.options.objectCount);
  controls.countControl.value?.replaceChildren(String(controls.options.objectCount));
  controls.kindControl.input.value = controls.options.objectKind;
  controls.staticControl.input.value = String(Math.round(controls.options.staticRatio * 100));
  controls.staticControl.value?.replaceChildren(`${controls.staticControl.input.value}%`);
  controls.cullingControl.input.checked = controls.options.cullingEnabled;
  controls.atlasControl.input.checked = controls.options.atlasEnabled;
}

function createPresetButton(label: string, options: BenchmarkSceneOptions): BenchmarkPresetControl {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;
  return { button, label, options };
}
