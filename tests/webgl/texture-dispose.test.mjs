import assert from "node:assert/strict";
import test from "node:test";
import { Camera2D, Scene } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D releases and skips disposed Sprite textures", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 100, height: 100 });
  const scene = new Scene();
  const texture = new Texture({ source: { width: 16, height: 16 }, width: 16, height: 16 });
  const sprite = new Sprite({ texture, x: 10, y: 10, width: 16, height: 16 });

  sprite.setRenderMode("static");
  scene.add(sprite);
  renderer.render(scene, new Camera2D());
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getStats().sprites, 1);
  assert.equal(renderer.getStats().staticCacheHits, 1);
  assert.equal(renderer.getTextureCacheSize(), 1);

  texture.dispose();
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getTextureCacheSize(), 0);
  assert.equal(renderer.getStats().sprites, 0);
  assert.equal(renderer.getStats().drawCalls, 0);
  assert.equal(renderer.getStats().textureBinds, 0);
  assert.equal(renderer.getStats().skippedSpriteTextures, 1);
  assert.equal(renderer.getStats().unsupported, 1);
  assert.equal(gl.calls.includes("deleteTexture"), true);
});

function createFakeCanvas(gl) {
  return {
    clientWidth: 100,
    clientHeight: 100,
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
    deleteBuffer() {},
    deleteProgram() {},
    deleteShader() {},
    deleteTexture() {
      this.calls.push("deleteTexture");
    },
    drawArrays() {},
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
