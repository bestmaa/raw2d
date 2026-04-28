import {
  Camera2D,
  Rect,
  RenderPipeline,
  getCoreLocalBounds,
  getWorldBounds,
  type Object2D,
  type RenderList,
  type Scene
} from "raw2d-core";
import { createWebGLProgram } from "./createWebGLProgram.js";
import { createWebGLRectBatch } from "./createWebGLRectBatch.js";
import { parseWebGLColor } from "./parseWebGLColor.js";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";
import type {
  WebGLRenderer2DLike,
  WebGLRenderer2DOptions,
  WebGLRenderer2DRenderOptions,
  WebGLRenderer2DSize
} from "./WebGLRenderer2D.type.js";

const vertexSource = `#version 300 es
in vec2 a_position;
in vec4 a_color;
out vec4 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`;

const fragmentSource = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;

void main() {
  outColor = v_color;
}`;

export class WebGLRenderer2D implements WebGLRenderer2DLike {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;
  private readonly pipeline = new RenderPipeline<Object2D>({
    boundsProvider: (object) => (object instanceof Rect ? getWorldBounds({ object, localBounds: getCoreLocalBounds(object) }) : null)
  });
  private readonly program: WebGLProgram;
  private readonly buffer: WebGLBuffer;
  private readonly defaultCamera = new Camera2D();
  private width: number;
  private height: number;
  private backgroundColor: string;
  private stats: WebGLRenderStats = { objects: 0, rects: 0, vertices: 0, drawCalls: 0, unsupported: 0 };

  public constructor(options: WebGLRenderer2DOptions) {
    this.canvas = options.canvas;
    this.width = options.width ?? this.canvas.clientWidth;
    this.height = options.height ?? this.canvas.clientHeight;
    this.backgroundColor = options.backgroundColor ?? "#000000";

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 context is not available.");
    }

    this.gl = gl;
    this.program = createWebGLProgram(gl, vertexSource, fragmentSource);
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error("Unable to create WebGL buffer.");
    }

    this.buffer = buffer;
    this.configureProgram();
    this.setSize(this.width, this.height);
  }

  public setSize(width: number, height: number): void {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.gl.viewport(0, 0, this.width, this.height);
  }

  public getSize(): WebGLRenderer2DSize {
    return { width: this.width, height: this.height };
  }

  public getStats(): WebGLRenderStats {
    return this.stats;
  }

  public setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  public createRenderList(
    scene?: Scene,
    camera = this.defaultCamera,
    options: WebGLRenderer2DRenderOptions = {}
  ): RenderList<Object2D> {
    return this.pipeline.build({
      scene,
      camera,
      viewport: { width: this.width, height: this.height },
      culling: options.culling
    });
  }

  public render(scene: Scene, camera = this.defaultCamera, options: WebGLRenderer2DRenderOptions = {}): void {
    // TODO: batch rendering beyond Rect.
    // TODO: shaders for sprites, paths, and text.
    // TODO: texture atlas
    // TODO: typed arrays reuse
    // TODO: draw call reduction by material and texture
    // TODO: static/dynamic batches
    const renderList = options.renderList ?? this.createRenderList(scene, camera, options);
    const batch = createWebGLRectBatch({
      items: renderList.getFlatItems(),
      camera,
      width: this.width,
      height: this.height
    });

    this.clear();
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, batch.vertices, this.gl.DYNAMIC_DRAW);

    if (batch.rects > 0) {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, batch.rects * 6);
    }

    this.stats = {
      objects: renderList.getFlatItems().length,
      rects: batch.rects,
      vertices: batch.rects * 6,
      drawCalls: batch.rects > 0 ? 1 : 0,
      unsupported: batch.unsupported
    };
  }

  private configureProgram(): void {
    const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.enableAttribute("a_position", 2, stride, 0);
    this.enableAttribute("a_color", 4, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  }

  private enableAttribute(name: string, size: number, stride: number, offset: number): void {
    const location = this.gl.getAttribLocation(this.program, name);

    if (location < 0) {
      throw new Error(`WebGL attribute not found: ${name}`);
    }

    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, stride, offset);
  }

  private clear(): void {
    const color = parseWebGLColor(this.backgroundColor);
    this.gl.clearColor(color.r, color.g, color.b, color.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
