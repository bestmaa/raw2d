import type { Camera2D, Scene } from "raw2d-core";
import type { WebGLRenderer2DLike, WebGLRenderer2DOptions } from "./WebGLRenderer2D.type.js";

export class WebGLRenderer2D implements WebGLRenderer2DLike {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;

  public constructor(options: WebGLRenderer2DOptions) {
    this.canvas = options.canvas;

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 context is not available.");
    }

    this.gl = gl;
  }

  public setSize(width: number, height: number): void {
    this.canvas.width = Math.max(1, Math.floor(width));
    this.canvas.height = Math.max(1, Math.floor(height));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public render(_scene: Scene, _camera: Camera2D): void {
    // TODO: batch rendering
    // TODO: shaders
    // TODO: texture atlas
    // TODO: typed arrays
    // TODO: draw call reduction
    // TODO: static/dynamic batches
    throw new Error("WebGLRenderer2D is a skeleton and cannot render yet.");
  }
}
