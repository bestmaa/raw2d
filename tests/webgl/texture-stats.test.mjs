import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Scene } from "raw2d-core";
import { Sprite, Texture, TextureAtlasPacker } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D reports texture upload and cache hit stats", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 100, height: 100 });
  const scene = new Scene();
  const texture = createTexture(16, 16);

  scene.add(new Sprite({ texture, x: 10, y: 10, width: 16, height: 16 }));
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getStats().textureBinds, 1);
  assert.equal(renderer.getStats().textureUploads, 1);
  assert.equal(renderer.getStats().textureCacheHits, 0);

  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getStats().textureBinds, 1);
  assert.equal(renderer.getStats().textureUploads, 0);
  assert.equal(renderer.getStats().textureCacheHits, 1);
});

test("packed atlas reduces WebGL texture binds versus separate textures", () => {
  const separateStats = renderSprites([
    new Sprite({ texture: createTexture(16, 16), x: 10, y: 10, width: 16, height: 16 }),
    new Sprite({ texture: createTexture(20, 10), x: 32, y: 10, width: 20, height: 10 })
  ]);
  const atlas = new TextureAtlasPacker({ createCanvas }).pack([
    { name: "idle", source: { width: 16, height: 16 } },
    { name: "run", source: { width: 20, height: 10 } }
  ]);
  const packedStats = renderSprites([
    new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle"), x: 10, y: 10 }),
    new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run"), x: 32, y: 10 })
  ]);

  assert.equal(separateStats.textures, 2);
  assert.equal(separateStats.textureBinds, 2);
  assert.equal(separateStats.textureUploads, 2);
  assert.equal(packedStats.textures, 1);
  assert.equal(packedStats.textureBinds, 1);
  assert.equal(packedStats.textureUploads, 1);
});

test("WebGLRenderer2D can clear texture caches", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 100,
    height: 100,
    createTextCanvas: createCanvas
  });
  const scene = new Scene();

  scene.add(new Text2D({ x: 10, y: 20, text: "Raw2D" }));
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getTextureCacheSize(), 1);
  assert.equal(renderer.getTextTextureCacheSize(), 1);

  renderer.clearTextureCache();

  assert.equal(renderer.getTextureCacheSize(), 0);
  assert.equal(renderer.getTextTextureCacheSize(), 0);
  assert.equal(gl.calls.includes("deleteTexture"), true);
});

test("WebGLRenderer2D retires stale text textures when text changes", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 100,
    height: 100,
    createTextCanvas: createCanvas
  });
  const scene = new Scene();
  const text = new Text2D({
    x: 10,
    y: 20,
    text: "Old",
    material: new BasicMaterial({ fillColor: "#ffffff" })
  });

  scene.add(text);
  renderer.render(scene, new Camera2D());
  text.setText("New");
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getTextTextureCacheSize(), 1);
  assert.equal(gl.calls.filter((call) => call === "deleteTexture").length, 1);
});

test("WebGLRenderer2D dispose releases WebGL resources", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 100, height: 100 });
  const scene = new Scene();

  scene.add(new Sprite({ texture: createTexture(16, 16), x: 10, y: 10, width: 16, height: 16 }));
  renderer.render(scene, new Camera2D());
  renderer.dispose();

  assert.equal(gl.calls.filter((call) => call === "deleteBuffer").length >= 4, true);
  assert.equal(gl.calls.includes("deleteTexture"), true);
  assert.equal(gl.calls.filter((call) => call === "deleteProgram").length, 2);
});

function renderSprites(sprites) {
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(createFakeWebGL2Context()),
    width: 100,
    height: 100
  });
  const scene = new Scene();

  for (const sprite of sprites) {
    scene.add(sprite);
  }

  renderer.render(scene, new Camera2D());
  return renderer.getStats();
}

function createTexture(width, height) {
  return new Texture({ source: { width, height }, width, height });
}

function createCanvas(width, height) {
  return {
    width,
    height,
    getContext(type) {
      return type === "2d" ? createFake2DContext() : null;
    }
  };
}

function createFake2DContext() {
  return {
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    fillStyle: "#ffffff",
    clearRect() {},
    drawImage() {},
    fillText() {},
    measureText(text) {
      const width = text.length * 10;
      return {
        width,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: width,
        actualBoundingBoxAscent: 16,
        actualBoundingBoxDescent: 4
      };
    }
  };
}

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
    deleteBuffer() {
      this.calls.push("deleteBuffer");
    },
    deleteProgram() {
      this.calls.push("deleteProgram");
    },
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
