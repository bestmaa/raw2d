import { Camera2D, Scene } from "raw2d-core";
import { Texture } from "raw2d-sprite";
import { WebGLRenderer2D } from "raw2d-webgl";

export function renderSprites(sprites, options = {}) {
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(createFakeWebGL2Context()),
    width: 100,
    height: 100
  });
  const scene = new Scene();

  for (const sprite of sprites) {
    scene.add(sprite);
  }

  renderer.render(scene, new Camera2D(), options);
  return renderer.getStats();
}

export function createTexture(width, height) {
  return new Texture({ source: { width, height }, width, height });
}

export function createCanvas(width, height) {
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
    strokeStyle: "#10141c",
    lineWidth: 1,
    clearRect() {},
    drawImage() {},
    fillText() {},
    strokeText() {},
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

export function createFakeCanvas(gl) {
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

export function createFakeWebGL2Context() {
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
