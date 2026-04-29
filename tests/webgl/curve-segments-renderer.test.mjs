import assert from "node:assert/strict";
import test from "node:test";
import { Arc, Camera2D, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D applies renderer and render curveSegments", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 200,
    height: 120,
    curveSegments: 64
  });
  const scene = new Scene();

  scene.add(createClosedArc());
  renderer.render(scene, new Camera2D());
  assert.equal(gl.calls.includes("drawArrays:4,0,48"), true);

  gl.calls.length = 0;
  renderer.render(scene, new Camera2D(), { curveSegments: 8 });
  assert.equal(gl.calls.includes("drawArrays:4,0,6"), true);
});

test("WebGLRenderer2D static shape cache keys include curveSegments", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const arc = createClosedArc();

  arc.setRenderMode("static");
  scene.add(arc);
  renderer.render(scene, new Camera2D(), { curveSegments: 8 });
  renderer.render(scene, new Camera2D(), { curveSegments: 64 });

  assert.equal(renderer.getStats().staticCacheMisses, 1);
  assert.equal(renderer.getStats().staticCacheHits, 0);
});

function createClosedArc() {
  return new Arc({
    x: 80,
    y: 60,
    radiusX: 30,
    radiusY: 20,
    startAngle: 0,
    endAngle: Math.PI / 2,
    closed: true
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
    createProgram() { return {}; },
    createShader() { return {}; },
    createTexture() { return {}; },
    deleteProgram() {},
    deleteShader() {},
    drawArrays(mode, first, count) { this.calls.push(`drawArrays:${mode},${first},${count}`); },
    enable() {},
    enableVertexAttribArray() {},
    getAttribLocation(_program, name) { return name === "a_position" ? 0 : name === "a_color" ? 1 : -1; },
    getProgramInfoLog() { return ""; },
    getProgramParameter() { return true; },
    getShaderInfoLog() { return ""; },
    getShaderParameter() { return true; },
    getUniformLocation() { return {}; },
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
