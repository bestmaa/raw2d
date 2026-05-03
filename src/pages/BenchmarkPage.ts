import { createCanvasBenchmarkPanel } from "./CanvasBenchmarkPanel";
import { createWebGLBenchmarkPanel } from "./WebGLBenchmarkPanel";
import type { BenchmarkObjectKind, BenchmarkSceneOptions } from "./BenchmarkScene.type";

export function renderBenchmarkPage(): HTMLElement {
  const page = document.createElement("main");
  const title = document.createElement("h1");
  const body = document.createElement("p");
  const controls = document.createElement("section");
  const grid = document.createElement("section");
  const options: BenchmarkSceneOptions = {
    objectCount: 140,
    objectKind: "rect",
    staticRatio: 0.72,
    cullingEnabled: false,
    atlasEnabled: true
  };
  const canvasPanel = createCanvasBenchmarkPanel(options);
  const webglPanel = createWebGLBenchmarkPanel(options);
  const countControl = createCountControl(options);
  const kindControl = createKindControl(options);
  const staticControl = createStaticRatioControl(options);
  const cullingControl = createToggleControl("Culling", options.cullingEnabled);
  const atlasControl = createToggleControl("Atlas", options.atlasEnabled);
  const pauseButton = document.createElement("button");
  const copyButton = document.createElement("button");
  const status = document.createElement("strong");
  let paused = false;
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
  pauseButton.type = "button";
  pauseButton.textContent = "Pause";
  copyButton.type = "button";
  copyButton.textContent = "Copy result";
  status.textContent = "running";
  countControl.input.addEventListener("input", () => {
    options.objectCount = Number(countControl.input.value);
    countControl.value.textContent = String(options.objectCount);
    update();
  });
  kindControl.input.addEventListener("change", () => {
    options.objectKind = kindControl.input.value as BenchmarkObjectKind;
    update();
  });
  staticControl.input.addEventListener("input", () => {
    options.staticRatio = Number(staticControl.input.value) / 100;
    staticControl.value.textContent = `${staticControl.input.value}%`;
    update();
  });
  cullingControl.input.addEventListener("change", () => {
    options.cullingEnabled = cullingControl.input.checked;
    update();
  });
  atlasControl.input.addEventListener("change", () => {
    options.atlasEnabled = atlasControl.input.checked;
    update();
  });
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    canvasPanel.setPaused(paused);
    webglPanel.setPaused(paused);
    pauseButton.textContent = paused ? "Resume" : "Pause";
    status.textContent = paused ? "paused" : "running";
  });
  copyButton.addEventListener("click", () => {
    void copyBenchmarkResult([canvasPanel.getStatsText(), webglPanel.getStatsText()], status);
  });
  controls.append(countControl.element, kindControl.element, staticControl.element, cullingControl.element, atlasControl.element, pauseButton, copyButton, status);
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

function createStaticRatioControl(options: BenchmarkSceneOptions): { readonly element: HTMLElement; readonly input: HTMLInputElement; readonly value: HTMLElement } {
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

function createToggleControl(labelText: string, checked: boolean): { readonly element: HTMLElement; readonly input: HTMLInputElement } {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const text = document.createElement("span");

  input.type = "checkbox";
  input.checked = checked;
  text.textContent = labelText;
  label.append(input, text);
  return { element: label, input };
}

async function copyBenchmarkResult(results: readonly string[], status: HTMLElement): Promise<void> {
  const text = results.filter((result) => result.length > 0).join("\n\n");

  if (!navigator.clipboard) {
    status.textContent = "copy unavailable";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "copied";
  } catch {
    status.textContent = "copy blocked";
  }
}
