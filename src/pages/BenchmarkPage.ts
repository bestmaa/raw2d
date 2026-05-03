import { createCanvasBenchmarkPanel } from "./CanvasBenchmarkPanel";
import { createWebGLBenchmarkPanel } from "./WebGLBenchmarkPanel";
import type { BenchmarkObjectKind, BenchmarkSceneOptions } from "./BenchmarkScene.type";

export function renderBenchmarkPage(): HTMLElement {
  const page = document.createElement("main");
  const title = document.createElement("h1");
  const body = document.createElement("p");
  const controls = document.createElement("section");
  const grid = document.createElement("section");
  const options: BenchmarkSceneOptions = { objectCount: 140, objectKind: "rect" };
  const canvasPanel = createCanvasBenchmarkPanel(options);
  const webglPanel = createWebGLBenchmarkPanel(options);
  const countControl = createCountControl(options);
  const kindControl = createKindControl(options);
  const update = (): void => {
    canvasPanel.updateScene(options);
    webglPanel.updateScene(options);
  };

  page.className = "visual-test-page";
  controls.className = "visual-test-card";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
  grid.style.gap = "16px";
  title.textContent = "Raw2D Benchmark";
  body.textContent = "Benchmark pages compare Canvas and WebGL with the same scene shape, object count, and timing report.";
  countControl.input.addEventListener("input", () => {
    options.objectCount = Number(countControl.input.value);
    countControl.value.textContent = String(options.objectCount);
    update();
  });
  kindControl.input.addEventListener("change", () => {
    options.objectKind = kindControl.input.value as BenchmarkObjectKind;
    update();
  });
  controls.append(countControl.element, kindControl.element);
  grid.append(canvasPanel.element, webglPanel.element);
  page.append(title, body, controls, grid);
  return page;
}

function createCountControl(options: BenchmarkSceneOptions): { readonly element: HTMLElement; readonly input: HTMLInputElement; readonly value: HTMLElement } {
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

function createKindControl(options: BenchmarkSceneOptions): { readonly element: HTMLElement; readonly input: HTMLSelectElement } {
  const label = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("select");

  text.textContent = "Object type";
  input.append(new Option("Rect", "rect"), new Option("Circle", "circle"), new Option("Mixed", "mixed"));
  input.value = options.objectKind;
  label.append(text, input);
  return { element: label, input };
}
