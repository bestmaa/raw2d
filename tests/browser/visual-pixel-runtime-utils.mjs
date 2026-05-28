import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { createFakeWebGL2Context } from "../webgl/texture-stats-utils.mjs";

export async function importVisualPixelPage(t, root) {
  const directory = await mkdtemp(join(root, ".tmp-visual-pixel-"));

  t.after(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  await writeTranspiledModule(directory, "VisualPixelCoverage");
  await writeTranspiledModule(directory, "VisualPixelTest", {
    "./VisualPixelCoverage": "./VisualPixelCoverage.js"
  });

  return import(pathToFileURL(join(directory, "VisualPixelTest.js")).href);
}

export function runVisualPixelPage(pageModule) {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const previousWebGL2 = globalThis.WebGL2RenderingContext;
  const environment = createFakeBrowserEnvironment();

  globalThis.window = environment.window;
  globalThis.document = environment.document;
  globalThis.WebGL2RenderingContext = environment.WebGL2RenderingContext;

  try {
    pageModule.renderVisualPixelTestPage();
    return environment.window.__raw2dPixelResult;
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    globalThis.WebGL2RenderingContext = previousWebGL2;
  }
}

async function writeTranspiledModule(directory, name, replacements = {}) {
  let output = ts.transpileModule(await readFile(`src/pages/${name}.ts`, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;

  for (const [from, to] of Object.entries(replacements)) {
    output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  }

  await writeFile(join(directory, `${name}.js`), output);
}

function createFakeBrowserEnvironment() {
  const window = { devicePixelRatio: 1 };

  return {
    window,
    document: {
      createElement(tagName) {
        return tagName === "canvas" ? createCanvasElement() : createElement(tagName);
      }
    },
    WebGL2RenderingContext: function WebGL2RenderingContext() {}
  };
}

function createElement(tagName) {
  return {
    tagName: tagName.toUpperCase(),
    className: "",
    textContent: "",
    children: [],
    append(...children) {
      this.children.push(...children);
    }
  };
}

function createCanvasElement() {
  const element = createElement("canvas");
  const context2d = createFake2DContext();
  const gl = createReadableWebGL2Context();

  return {
    ...element,
    clientWidth: 240,
    clientHeight: 160,
    width: 0,
    height: 0,
    style: {},
    getContext(type) {
      if (type === "2d") return context2d;
      if (type === "webgl2") return gl;
      return null;
    }
  };
}

function createFake2DContext() {
  const state = { fillStyle: "#000000", drewContent: false };

  return {
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    lineWidth: 1,
    strokeStyle: "#ffffff",
    get fillStyle() { return state.fillStyle; },
    set fillStyle(value) { state.fillStyle = value; },
    save() {},
    restore() {},
    setTransform() {},
    scale() {},
    translate() {},
    rotate() {},
    beginPath() {},
    closePath() {},
    rect() {},
    arc() {},
    ellipse() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    bezierCurveTo() {},
    clearRect() {},
    fillRect() { if (state.fillStyle !== "#10141c") state.drewContent = true; },
    fill() { state.drewContent = true; },
    stroke() { state.drewContent = true; },
    drawImage() { state.drewContent = true; },
    fillText() { state.drewContent = true; },
    strokeText() { state.drewContent = true; },
    measureText(text) {
      const width = text.length * 10;
      return { width, actualBoundingBoxLeft: 0, actualBoundingBoxRight: width, actualBoundingBoxAscent: 16, actualBoundingBoxDescent: 4 };
    },
    getImageData(_x, _y, width, height) {
      return { data: createPixels(width, height, state.drewContent) };
    }
  };
}

function createReadableWebGL2Context() {
  const gl = createFakeWebGL2Context();
  const originalDrawArrays = gl.drawArrays.bind(gl);

  gl.drawArrays = function drawArrays(...args) {
    this.calls.push("drawArrays");
    originalDrawArrays(...args);
  };
  gl.readPixels = function readPixels(_x, _y, width, height, _format, _type, pixels) {
    pixels.set(createPixels(width, height, this.calls.includes("drawArrays")));
  };

  return gl;
}

function createPixels(width, height, hasContent) {
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = 16;
    pixels[index + 1] = 20;
    pixels[index + 2] = 28;
    pixels[index + 3] = 255;
  }

  if (hasContent) {
    for (let index = 0; index < Math.min(256, width * height) * 4; index += 4) {
      pixels[index] = 53;
      pixels[index + 1] = 194;
      pixels[index + 2] = 255;
      pixels[index + 3] = 255;
    }
  }

  return pixels;
}
