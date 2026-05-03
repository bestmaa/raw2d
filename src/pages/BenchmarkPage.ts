import { createCanvasBenchmarkPanel } from "./CanvasBenchmarkPanel";
import { createWebGLBenchmarkPanel } from "./WebGLBenchmarkPanel";

export function renderBenchmarkPage(): HTMLElement {
  const page = document.createElement("main");
  const title = document.createElement("h1");
  const body = document.createElement("p");
  const grid = document.createElement("section");
  const canvasPanel = createCanvasBenchmarkPanel();
  const webglPanel = createWebGLBenchmarkPanel();

  page.className = "visual-test-page";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
  grid.style.gap = "16px";
  title.textContent = "Raw2D Benchmark";
  body.textContent = "Benchmark pages compare Canvas and WebGL with the same scene shape, object count, and timing report.";
  grid.append(canvasPanel, webglPanel);
  page.append(title, body, grid);
  return page;
}
