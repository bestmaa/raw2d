import { createCanvasBenchmarkPanel } from "./CanvasBenchmarkPanel";
import {
  applyBenchmarkPreset,
  createCountControl,
  createKindControl,
  createPresetControls,
  createStaticRatioControl,
  createToggleControl,
  defaultBenchmarkOptions,
  syncBenchmarkControls
} from "./BenchmarkPageControls";
import { createWebGLBenchmarkPanel } from "./WebGLBenchmarkPanel";
import type { BenchmarkObjectKind, BenchmarkSceneOptions } from "./BenchmarkScene.type";

export function renderBenchmarkPage(): HTMLElement {
  const page = document.createElement("main");
  const title = document.createElement("h1");
  const body = document.createElement("p");
  const controls = document.createElement("section");
  const grid = document.createElement("section");
  const options: BenchmarkSceneOptions = defaultBenchmarkOptions();
  const canvasPanel = createCanvasBenchmarkPanel(options);
  const webglPanel = createWebGLBenchmarkPanel(options);
  const countControl = createCountControl(options);
  const kindControl = createKindControl(options);
  const staticControl = createStaticRatioControl(options);
  const cullingControl = createToggleControl("Culling", options.cullingEnabled);
  const atlasControl = createToggleControl("Atlas", options.atlasEnabled);
  const presetControls = createPresetControls();
  const pauseButton = document.createElement("button");
  const resetButton = document.createElement("button");
  const copyButton = document.createElement("button");
  const guidance = createBenchmarkGuidance();
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
  resetButton.type = "button";
  resetButton.textContent = "Reset";
  copyButton.type = "button";
  copyButton.textContent = "Copy result";
  status.dataset.benchmarkStatus = "true";
  status.textContent = "running";
  countControl.input.addEventListener("input", () => {
    options.objectCount = Number(countControl.input.value);
    countControl.value?.replaceChildren(String(options.objectCount));
    update();
  });
  kindControl.input.addEventListener("change", () => {
    options.objectKind = kindControl.input.value as BenchmarkObjectKind;
    update();
  });
  staticControl.input.addEventListener("input", () => {
    options.staticRatio = Number(staticControl.input.value) / 100;
    staticControl.value?.replaceChildren(`${staticControl.input.value}%`);
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
  resetButton.addEventListener("click", () => {
    applyBenchmarkPreset(options, defaultBenchmarkOptions());
    syncBenchmarkControls({ countControl, kindControl, staticControl, cullingControl, atlasControl, options });
    update();
    status.textContent = "reset";
  });
  copyButton.addEventListener("click", () => {
    void copyBenchmarkResult([canvasPanel.getStatsText(), webglPanel.getStatsText()], status);
  });
  for (const preset of presetControls.buttons) {
    preset.button.addEventListener("click", () => {
      applyBenchmarkPreset(options, preset.options);
      syncBenchmarkControls({ countControl, kindControl, staticControl, cullingControl, atlasControl, options });
      update();
      status.textContent = preset.label;
    });
  }

  controls.append(
    countControl.element,
    kindControl.element,
    staticControl.element,
    cullingControl.element,
    atlasControl.element,
    presetControls.element,
    pauseButton,
    resetButton,
    copyButton,
    status
  );
  page.append(title, body, controls, guidance, grid);
  grid.append(canvasPanel.element, webglPanel.element);
  return page;
}

function createBenchmarkGuidance(): HTMLElement {
  const element = document.createElement("aside");

  element.className = "visual-test-card";
  element.innerHTML = [
    "<h2>How to read this</h2>",
    "<p>Use Canvas as the simple reference renderer for small scenes, debugging, and editor tooling.</p>",
    "<p>Use WebGL when object count, atlas packing, static batches, or texture bind reduction start to matter.</p>",
    "<p>Numbers are local signals. Compare frameMs, drawCalls, batches, textureBinds, and culled objects on your device.</p>"
  ].join("");
  return element;
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
