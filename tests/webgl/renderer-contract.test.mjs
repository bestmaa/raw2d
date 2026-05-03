import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D exposes the shared renderer lifecycle surface", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120, backgroundColor: "#10141c" });
  const scene = new Scene();

  scene.add(createRect());
  renderer.setSize(100, 80);
  renderer.setBackgroundColor("#000000");
  renderer.render(scene, new Camera2D());
  renderer.clear("#ffffff");
  renderer.dispose();

  assert.deepEqual(renderer.getSize(), { width: 100, height: 80 });
  assert.equal(renderer.getStats().objects, 1);
  assert.equal(renderer.getStats().drawCalls, 1);
  assert.equal(renderer.getSupport().renderer, "webgl");
  assert.equal(renderer.getSupport().objects.ShapePath, "partial");
  assert.deepEqual(renderer.getStats().renderList, { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 });
  assert.equal(gl.calls.includes("viewport:0,0,100,80"), true);
  assert.equal(gl.calls.includes("clearColor:1,1,1,1"), true);
});

test("WebGLRenderer2D diagnostics keep stable public field names", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect());
  renderer.render(scene, new Camera2D());
  const diagnostics = renderer.getDiagnostics();

  assert.deepEqual(Object.keys(diagnostics), [
    "renderer",
    "contextLost",
    "textureCacheSize",
    "textTextureCacheSize",
    "shapePathTextureCacheSize",
    "stats"
  ]);
  assert.equal(diagnostics.renderer, "webgl2");
  assert.equal(diagnostics.contextLost, false);
  assert.equal(diagnostics.stats.objects, 1);
  assert.equal(diagnostics.stats.drawCalls, 1);
});

function createRect() {
  return new Rect({
    x: 20,
    y: 20,
    width: 40,
    height: 30,
    material: new BasicMaterial({ fillColor: "#35c2ff" })
  });
}

function createFakeCanvas(gl) {
  return {
    clientWidth: 200,
    clientHeight: 120,
    width: 0,
    height: 0,
    getContext(type) {
      return type === "webgl2" ? gl : null;
    }
  };
}

function createFakeWebGL2Context() {
  return {
    ARRAY_BUFFER: 34962,
    BLEND: 3042,
    COLOR_BUFFER_BIT: 16384,
    COMPILE_STATUS: 35713,
    DYNAMIC_DRAW: 35048,
    FLOAT: 5126,
    FRAGMENT_SHADER: 35632,
    LINK_STATUS: 35714,
    ONE_MINUS_SRC_ALPHA: 771,
    SRC_ALPHA: 770,
    STATIC_DRAW: 35044,
    TRIANGLES: 4,
    VERTEX_SHADER: 35633,
    calls: [],
    attachShader() {},
    bindBuffer(target) {
      this.calls.push(`bindBuffer:${target}`);
    },
    blendFunc(source, destination) {
      this.calls.push(`blendFunc:${source},${destination}`);
    },
    bufferData(target, data, usage) {
      this.calls.push(`bufferData:${target},${data.length},${usage}`);
    },
    bufferSubData(target, offset, data) {
      this.calls.push(`bufferSubData:${target},${offset},${data.length}`);
    },
    clear(mask) {
      this.calls.push(`clear:${mask}`);
    },
    clearColor(r, g, b, a) {
      this.calls.push(`clearColor:${r},${g},${b},${a}`);
    },
    compileShader() {},
    createBuffer() {
      return {};
    },
    createProgram() {
      return {};
    },
    createShader() {
      return {};
    },
    deleteBuffer() {},
    deleteProgram() {},
    deleteShader() {},
    deleteTexture() {},
    drawArrays(mode, first, count) {
      this.calls.push(`drawArrays:${mode},${first},${count}`);
    },
    enable(capability) {
      this.calls.push(`enable:${capability}`);
    },
    enableVertexAttribArray(location) {
      this.calls.push(`enableVertexAttribArray:${location}`);
    },
    getAttribLocation(_program, name) {
      return name === "a_position" ? 0 : name === "a_color" ? 1 : -1;
    },
    getProgramInfoLog() {
      return "";
    },
    getProgramParameter() {
      return true;
    },
    getShaderInfoLog() {
      return "";
    },
    getShaderParameter() {
      return true;
    },
    getUniformLocation() {
      return {};
    },
    linkProgram() {},
    shaderSource() {},
    useProgram() {},
    vertexAttribPointer(location, size, type, normalized, stride, offset) {
      this.calls.push(`vertexAttribPointer:${location},${size},${type},${normalized},${stride},${offset}`);
    },
    viewport(x, y, width, height) {
      this.calls.push(`viewport:${x},${y},${width},${height}`);
    }
  };
}
