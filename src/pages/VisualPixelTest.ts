import { Arc, BasicMaterial, Camera2D, Canvas, Circle, Rect, Scene, ShapePath, Text2D, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { VisualPixelRendererResult, VisualPixelTestResult } from "./VisualPixelTest.type";

type ResultWindow = Window & { __raw2dPixelResult?: VisualPixelTestResult };

const width = 240;
const height = 160;
const background = { red: 16, green: 20, blue: 28 };
const backgroundColor = "#10141c";

export function renderVisualPixelTestPage(): HTMLElement {
  const root = document.createElement("main");
  const title = document.createElement("h1");
  const grid = document.createElement("div");
  const canvasPanel = createPanel("Canvas");
  const webglPanel = createPanel("WebGL");

  root.className = "visual-test-page";
  title.textContent = "Raw2D Visual Pixel Test";
  grid.className = "visual-test-grid";
  grid.append(canvasPanel.panel, webglPanel.panel);
  root.append(title, grid);

  const result = {
    canvas: runCanvasTest(canvasPanel.canvas, canvasPanel.output),
    webgl: runWebGLTest(webglPanel.canvas, webglPanel.output)
  };
  (window as ResultWindow).__raw2dPixelResult = result;
  return root;
}

function createPanel(titleText: string): { readonly panel: HTMLElement; readonly canvas: HTMLCanvasElement; readonly output: HTMLElement } {
  const panel = document.createElement("section");
  const title = document.createElement("h2");
  const canvas = document.createElement("canvas");
  const output = document.createElement("pre");

  panel.className = "visual-test-panel";
  title.textContent = titleText;
  canvas.width = width;
  canvas.height = height;
  output.className = "visual-test-output";
  panel.append(title, canvas, output);
  return { panel, canvas, output };
}

function runCanvasTest(canvas: HTMLCanvasElement, output: HTMLElement): VisualPixelRendererResult {
  const renderer = new Canvas({ canvas, width, height, backgroundColor });
  renderer.render(createScene(), new Camera2D());
  const result = createResult("canvas", canvas);
  writeResult(output, result);
  return result;
}

function runWebGLTest(canvas: HTMLCanvasElement, output: HTMLElement): VisualPixelRendererResult {
  if (!isWebGL2Available({ canvas })) {
    const result = createUnavailableResult("webgl", "WebGL2 is not available.");
    writeResult(output, result);
    return result;
  }

  const renderer = new WebGLRenderer2D({
    canvas,
    width,
    height,
    backgroundColor,
    shapePathFillFallback: "rasterize",
    curveSegments: 24
  });
  renderer.render(createScene(), new Camera2D());
  const result = createWebGLResult(canvas, renderer.gl);
  renderer.dispose();
  writeResult(output, result);
  return result;
}

function createScene(): Scene {
  const scene = new Scene();
  const cyan = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#f5f7fb", lineWidth: 3, strokeJoin: "round" });
  const pink = new BasicMaterial({ fillColor: "#f45b69", strokeColor: "#10141c", lineWidth: 2 });

  scene.add(new Rect({ x: 18, y: 22, width: 54, height: 38, material: pink }));
  scene.add(new Circle({ x: 108, y: 44, radius: 22, material: cyan }));
  scene.add(new Arc({ x: 154, y: 32, radiusX: 32, radiusY: 24, startAngle: 0, endAngle: Math.PI * 1.25, closed: true, material: pink }));
  scene.add(createShapePath(cyan));
  scene.add(new Text2D({ x: 18, y: 138, text: "Raw2D", font: "24px sans-serif", material: new BasicMaterial({ fillColor: "#f5f7fb" }) }));
  return scene;
}

function createShapePath(material: BasicMaterial): ShapePath {
  return new ShapePath({ x: 124, y: 92, material })
    .moveTo(0, 0)
    .quadraticCurveTo(36, -26, 78, 0)
    .lineTo(62, 34)
    .lineTo(12, 34)
    .closePath();
}

function createResult(renderer: "canvas", canvas: HTMLCanvasElement): VisualPixelRendererResult {
  const context = canvas.getContext("2d");

  if (!context) {
    return createUnavailableResult(renderer, "2D context is not available.");
  }

  return createPixelResult(renderer, context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
}

function createWebGLResult(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): VisualPixelRendererResult {
  const pixels = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return createPixelResult("webgl", pixels, canvas.width, canvas.height);
}

function createPixelResult(renderer: "canvas" | "webgl", pixels: ArrayLike<number>, resultWidth: number, resultHeight: number): VisualPixelRendererResult {
  const coloredPixels = countNonBackgroundPixels(pixels);
  return {
    renderer,
    status: coloredPixels > 0 ? "passed" : "failed",
    hash: hashPixels(pixels),
    coloredPixels,
    width: resultWidth,
    height: resultHeight,
    message: coloredPixels > 0 ? "Rendered non-background pixels." : "Only background pixels were rendered."
  };
}

function createUnavailableResult(renderer: "canvas" | "webgl", message: string): VisualPixelRendererResult {
  return { renderer, status: "unavailable", hash: "", coloredPixels: 0, width, height, message };
}

function countNonBackgroundPixels(pixels: ArrayLike<number>): number {
  let count = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    if (isNonBackgroundPixel(pixels, index)) {
      count += 1;
    }
  }

  return count;
}

function isNonBackgroundPixel(pixels: ArrayLike<number>, index: number): boolean {
  const red = pixels[index] ?? 0;
  const green = pixels[index + 1] ?? 0;
  const blue = pixels[index + 2] ?? 0;
  const alpha = pixels[index + 3] ?? 0;
  return alpha > 0 && (Math.abs(red - background.red) > 6 || Math.abs(green - background.green) > 6 || Math.abs(blue - background.blue) > 6);
}

function hashPixels(pixels: ArrayLike<number>): string {
  let hash = 2166136261;

  for (let index = 0; index < pixels.length; index += 1) {
    hash ^= pixels[index] ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function writeResult(output: HTMLElement, result: VisualPixelRendererResult): void {
  output.textContent = JSON.stringify(result, null, 2);
}
