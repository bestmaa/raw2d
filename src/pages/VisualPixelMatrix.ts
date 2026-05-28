import {
  Arc,
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Ellipse,
  Group2D,
  Line,
  Polygon,
  Polyline,
  Rect,
  Scene,
  ShapePath,
  Sprite,
  Text2D,
  Texture,
  WebGLRenderer2D,
  getRendererSupportMatrix,
  isWebGL2Available
} from "raw2d";
import type { RendererSupportObjectKind } from "raw2d";
import type { VisualPixelMatrixCell, VisualPixelMatrixRow, VisualPixelRendererName } from "./VisualPixelTest.type";

const matrixWidth = 128;
const matrixHeight = 96;
const background = { red: 16, green: 20, blue: 28 };
const backgroundColor = "#10141c";

export function runVisualPixelMatrix(output: HTMLElement): readonly VisualPixelMatrixRow[] {
  const rows = getRendererSupportMatrix().map((entry) => ({
    kind: entry.kind,
    canvasSupport: entry.canvas,
    webglSupport: entry.webgl,
    canvas: runRendererCase("canvas", entry.kind),
    webgl: runRendererCase("webgl", entry.kind)
  }));

  output.textContent = JSON.stringify(
    {
      cases: rows.length,
      rows: rows.map((row) => ({
        kind: row.kind,
        canvas: row.canvas.status,
        webgl: row.webgl.status,
        canvasPixels: row.canvas.coloredPixels,
        webglPixels: row.webgl.coloredPixels
      }))
    },
    null,
    2
  );
  return rows;
}

function runRendererCase(renderer: VisualPixelRendererName, kind: RendererSupportObjectKind): VisualPixelMatrixCell {
  const canvas = createMatrixCanvas();
  const scene = createMatrixScene(kind);
  const camera = new Camera2D();

  if (renderer === "canvas") {
    const canvasRenderer = new Canvas({ canvas, width: matrixWidth, height: matrixHeight, backgroundColor });
    canvasRenderer.render(scene, camera);
    return createCanvasCell(renderer, canvas);
  }

  if (!isWebGL2Available({ canvas })) {
    return createUnavailableCell(renderer, "WebGL2 is not available.");
  }

  const webglRenderer = new WebGLRenderer2D({
    canvas,
    width: matrixWidth,
    height: matrixHeight,
    backgroundColor,
    shapePathFillFallback: "rasterize",
    curveSegments: 24
  });
  webglRenderer.render(scene, camera);
  const result = createWebGLCell(renderer, canvas, webglRenderer.gl);
  webglRenderer.dispose();
  return result;
}

function createMatrixScene(kind: RendererSupportObjectKind): Scene {
  const scene = new Scene();
  scene.add(createMatrixObject(kind));
  return scene;
}

function createMatrixObject(kind: RendererSupportObjectKind): Group2D | Arc | Circle | Ellipse | Line | Polygon | Polyline | Rect | ShapePath | Sprite | Text2D {
  const fill = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#f5f7fb", lineWidth: 4, strokeJoin: "round" });
  const stroke = new BasicMaterial({ strokeColor: "#facc15", lineWidth: 5, strokeJoin: "round" });

  switch (kind) {
    case "Arc":
      return new Arc({ x: 64, y: 48, radiusX: 34, radiusY: 24, startAngle: 0, endAngle: Math.PI * 1.35, closed: true, material: fill });
    case "Circle":
      return new Circle({ x: 64, y: 48, radius: 28, material: fill });
    case "Ellipse":
      return new Ellipse({ x: 64, y: 48, radiusX: 38, radiusY: 22, material: fill });
    case "Group2D":
      return createGroupObject(fill);
    case "Line":
      return new Line({ x: 20, y: 28, startX: 0, startY: 0, endX: 88, endY: 44, material: stroke });
    case "Polygon":
      return new Polygon({ x: 22, y: 18, points: [{ x: 42, y: 0 }, { x: 88, y: 30 }, { x: 56, y: 66 }, { x: 0, y: 52 }], material: fill });
    case "Polyline":
      return new Polyline({ x: 18, y: 24, points: [{ x: 0, y: 50 }, { x: 32, y: 0 }, { x: 70, y: 34 }, { x: 96, y: 8 }], material: stroke });
    case "Rect":
      return new Rect({ x: 28, y: 24, width: 72, height: 48, material: fill });
    case "ShapePath":
      return createShapePath(fill);
    case "Sprite":
      return new Sprite({ texture: createSpriteTexture(), x: 64, y: 48, width: 48, height: 48, origin: "center" });
    case "Text2D":
      return new Text2D({ x: 20, y: 56, text: "Raw2D", font: "26px sans-serif", material: fill });
  }
}

function createGroupObject(material: BasicMaterial): Group2D {
  const group = new Group2D({ x: 64, y: 48, rotation: 0.25 });
  group.add(new Rect({ x: -38, y: -24, width: 48, height: 34, material }));
  group.add(new Circle({ x: 24, y: 8, radius: 20, material }));
  return group;
}

function createShapePath(material: BasicMaterial): ShapePath {
  return new ShapePath({ x: 24, y: 30, material })
    .moveTo(0, 0)
    .quadraticCurveTo(32, -18, 70, 0)
    .lineTo(58, 44)
    .lineTo(12, 44)
    .closePath();
}

function createSpriteTexture(): Texture {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 32;
  canvas.height = 32;

  if (context) {
    context.fillStyle = "#f45b69";
    context.fillRect(0, 0, 32, 32);
    context.fillStyle = "#10141c";
    context.fillRect(8, 8, 16, 16);
    context.fillStyle = "#35c2ff";
    context.fillRect(12, 12, 8, 8);
  }

  return new Texture({ source: canvas, width: 32, height: 32 });
}

function createMatrixCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = matrixWidth;
  canvas.height = matrixHeight;
  return canvas;
}

function createCanvasCell(renderer: VisualPixelRendererName, canvas: HTMLCanvasElement): VisualPixelMatrixCell {
  const context = canvas.getContext("2d");

  if (!context) {
    return createUnavailableCell(renderer, "2D context is not available.");
  }

  return createCell(renderer, context.getImageData(0, 0, canvas.width, canvas.height).data);
}

function createWebGLCell(renderer: VisualPixelRendererName, canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): VisualPixelMatrixCell {
  const pixels = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return createCell(renderer, pixels);
}

function createCell(renderer: VisualPixelRendererName, pixels: ArrayLike<number>): VisualPixelMatrixCell {
  const coloredPixels = countNonBackgroundPixels(pixels);
  return {
    renderer,
    status: coloredPixels > 0 ? "passed" : "failed",
    hash: hashPixels(pixels),
    coloredPixels,
    message: coloredPixels > 0 ? "Rendered non-background pixels." : "Only background pixels were rendered."
  };
}

function createUnavailableCell(renderer: VisualPixelRendererName, message: string): VisualPixelMatrixCell {
  return { renderer, status: "unavailable", hash: "", coloredPixels: 0, message };
}

function countNonBackgroundPixels(pixels: ArrayLike<number>): number {
  let count = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index] ?? 0;
    const green = pixels[index + 1] ?? 0;
    const blue = pixels[index + 2] ?? 0;
    const alpha = pixels[index + 3] ?? 0;

    if (alpha > 0 && (Math.abs(red - background.red) > 6 || Math.abs(green - background.green) > 6 || Math.abs(blue - background.blue) > 6)) {
      count += 1;
    }
  }

  return count;
}

function hashPixels(pixels: ArrayLike<number>): string {
  let hash = 2166136261;

  for (let index = 0; index < pixels.length; index += 1) {
    hash ^= pixels[index] ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}
