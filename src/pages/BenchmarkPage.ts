export function renderBenchmarkPage(): HTMLElement {
  const page = document.createElement("main");
  const title = document.createElement("h1");
  const body = document.createElement("p");
  const grid = document.createElement("section");
  const canvasPanel = createPlaceholderPanel("Canvas Benchmark", "T042 will add the Canvas loop and stats.");
  const webglPanel = createPlaceholderPanel("WebGL Benchmark", "T043 will add the WebGL loop and stats.");

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

function createPlaceholderPanel(titleText: string, bodyText: string): HTMLElement {
  const panel = document.createElement("article");
  const title = document.createElement("h2");
  const body = document.createElement("p");

  panel.className = "visual-test-card";
  title.textContent = titleText;
  body.textContent = bodyText;
  panel.append(title, body);
  return panel;
}
