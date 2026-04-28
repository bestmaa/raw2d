import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D skips render work while context is lost", () => {
  const gl = createFakeWebGL2Context();
  const canvas = createFakeCanvas(gl);
  const renderer = new WebGLRenderer2D({ canvas, width: 100, height: 100 });
  const scene = new Scene();

  scene.add(new Rect({ x: 10, y: 10, width: 20, height: 20 }));
  canvas.dispatch("webglcontextlost");
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.isContextLost(), true);
  assert.equal(renderer.getStats().objects, 0);
  assert.equal(canvas.events.webglcontextlost.defaultPrevented, true);
});

test("WebGLRenderer2D recreates resources after context restore", () => {
  const gl = createFakeWebGL2Context();
  const canvas = createFakeCanvas(gl);
  const renderer = new WebGLRenderer2D({ canvas, width: 100, height: 100 });
  const scene = new Scene();

  scene.add(new Rect({ x: 10, y: 10, width: 20, height: 20 }));
  canvas.dispatch("webglcontextlost");
  canvas.dispatch("webglcontextrestored");
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.isContextLost(), false);
  assert.equal(renderer.getStats().objects, 1);
  assert.equal(gl.calls.filter((call) => call === "createProgram").length, 4);
  assert.equal(gl.calls.some((call) => call.startsWith("drawArrays:")), true);
});

test("WebGLRenderer2D dispose removes context listeners", () => {
  const canvas = createFakeCanvas(createFakeWebGL2Context());
  const renderer = new WebGLRenderer2D({ canvas, width: 100, height: 100 });

  renderer.dispose();
  canvas.dispatch("webglcontextlost");

  assert.equal(renderer.isContextLost(), false);
});

function createFakeCanvas(gl) {
  const listeners = new Map();
  const events = {};

  return {
    clientWidth: 100,
    clientHeight: 100,
    width: 0,
    height: 0,
    events,
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) {
        listeners.delete(type);
      }
    },
    dispatch(type) {
      const event = createFakeEvent();
      events[type] = event;
      listeners.get(type)?.(event);
    },
    getContext(type) {
      return type === "webgl2" ? gl : null;
    }
  };
}

function createFakeEvent() {
  return {
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    }
  };
}

function createFakeWebGL2Context() {
  return {
    ARRAY_BUFFER: 34962,
    COLOR_BUFFER_BIT: 16384,
    COMPILE_STATUS: 35713,
    DYNAMIC_DRAW: 35048,
    STATIC_DRAW: 35044,
    FLOAT: 5126,
    FRAGMENT_SHADER: 35632,
    BLEND: 3042,
    CLAMP_TO_EDGE: 33071,
    LINK_STATUS: 35714,
    LINEAR: 9729,
    ONE_MINUS_SRC_ALPHA: 771,
    RGBA: 6408,
    SRC_ALPHA: 770,
    TEXTURE0: 33984,
    TEXTURE_2D: 3553,
    TEXTURE_MAG_FILTER: 10240,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TRIANGLES: 4,
    UNSIGNED_BYTE: 5121,
    VERTEX_SHADER: 35633,
    calls: [],
    activeTexture() {},
    attachShader() {},
    bindBuffer() {},
    bindTexture() {},
    blendFunc() {},
    bufferData() {},
    bufferSubData() {},
    clear() {},
    clearColor() {},
    compileShader() {},
    createBuffer() { return {}; },
    createProgram() { this.calls.push("createProgram"); return {}; },
    createShader() { return {}; },
    createTexture() { return {}; },
    deleteBuffer() {},
    deleteProgram() {},
    deleteShader() {},
    deleteTexture() {},
    drawArrays(mode, first, count) { this.calls.push(`drawArrays:${mode},${first},${count}`); },
    enable() {},
    enableVertexAttribArray() {},
    getAttribLocation(_program, name) {
      return { a_position: 0, a_color: 1, a_uv: 2, a_alpha: 3 }[name] ?? -1;
    },
    getProgramInfoLog() { return ""; },
    getProgramParameter() { return true; },
    getShaderInfoLog() { return ""; },
    getShaderParameter() { return true; },
    getUniformLocation() { return {}; },
    isContextLost() { return false; },
    linkProgram() {},
    shaderSource() {},
    texImage2D() {},
    texParameteri() {},
    uniform1i() {},
    useProgram() {},
    vertexAttribPointer() {},
    viewport() {}
  };
}
