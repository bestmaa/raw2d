import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Circle, Ellipse, Line, Polygon, Polyline, Rect, Scene, ShapePath } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D batches Rect objects into one draw call", () => {
  const gl = createFakeWebGL2Context();
  const canvas = createFakeCanvas(gl);
  const renderer = new WebGLRenderer2D({ canvas, width: 200, height: 120, backgroundColor: "#10141c" });
  const scene = new Scene();
  const rectA = createRect(20, "#35c2ff");
  const rectB = createRect(80, "#f45b69");

  scene.add(rectA);
  scene.add(rectB);
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,12"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 2,
    rects: 2,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    vertices: 12,
    drawCalls: 1,
    unsupported: 0
  });
});

test("WebGLRenderer2D batches Rect, Circle, and Ellipse objects into one draw call", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect(20, "#35c2ff"));
  scene.add(new Circle({ x: 80, y: 40, radius: 20 }));
  scene.add(new Ellipse({ x: 130, y: 50, radiusX: 22, radiusY: 12 }));
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,198"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 3,
    rects: 1,
    circles: 1,
    ellipses: 1,
    lines: 0,
    polylines: 0,
    polygons: 0,
    vertices: 198,
    drawCalls: 1,
    unsupported: 0
  });
});

test("WebGLRenderer2D batches Line, Polyline, and Polygon objects into one draw call", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(new Line({ x: 20, y: 20, startX: 0, startY: 0, endX: 50, endY: 0 }));
  scene.add(
    new Polyline({
      x: 20,
      y: 50,
      points: [
        { x: 0, y: 0 },
        { x: 30, y: 12 },
        { x: 60, y: 0 }
      ]
    })
  );
  scene.add(
    new Polygon({
      x: 100,
      y: 30,
      points: [
        { x: 0, y: 0 },
        { x: 40, y: 0 },
        { x: 40, y: 30 },
        { x: 0, y: 30 }
      ]
    })
  );
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,24"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 3,
    rects: 0,
    circles: 0,
    ellipses: 0,
    lines: 1,
    polylines: 1,
    polygons: 1,
    vertices: 24,
    drawCalls: 1,
    unsupported: 0
  });
});

test("WebGLRenderer2D reports unsupported objects outside the shape batch", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect(20, "#35c2ff"));
  scene.add(new ShapePath().moveTo(0, 0).lineTo(50, 0));
  renderer.render(scene, new Camera2D());

  assert.deepEqual(renderer.getStats(), {
    objects: 2,
    rects: 1,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    vertices: 6,
    drawCalls: 1,
    unsupported: 1
  });
});

function createRect(x, fillColor) {
  return new Rect({
    x,
    y: 20,
    width: 40,
    height: 30,
    material: new BasicMaterial({ fillColor })
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
    FLOAT: 5126,
    FRAGMENT_SHADER: 35632,
    LINK_STATUS: 35714,
    TRIANGLES: 4,
    VERTEX_SHADER: 35633,
    calls: [],
    attachShader() {},
    bindBuffer(target) {
      this.calls.push(`bindBuffer:${target}`);
    },
    bufferData(target, data, usage) {
      this.calls.push(`bufferData:${target},${data.length},${usage}`);
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
    deleteProgram() {},
    deleteShader() {},
    drawArrays(mode, first, count) {
      this.calls.push(`drawArrays:${mode},${first},${count}`);
    },
    enableVertexAttribArray(location) {
      this.calls.push(`enableVertexAttribArray:${location}`);
    },
    getAttribLocation(_program, name) {
      return name === "a_position" ? 0 : 1;
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
