import {
  Camera2D,
  RenderPipeline,
  type Object2D,
  type Object2DRenderMode,
  type RenderList,
  type Scene
} from "raw2d-core";
import { createWebGLProgram } from "./createWebGLProgram.js";
import { createWebGLRenderRuns } from "./createWebGLRenderRuns.js";
import { createWebGLShapeBatch } from "./createWebGLShapeBatch.js";
import { createWebGLSpriteBatch } from "./createWebGLSpriteBatch.js";
import { createMutableWebGLRenderStats } from "./createMutableWebGLRenderStats.js";
import { getWebGLBounds } from "./getWebGLBounds.js";
import { getWebGLRenderRunKind } from "./getWebGLRenderRunKind.js";
import { parseWebGLColor } from "./parseWebGLColor.js";
import { WebGLTextureCache } from "./WebGLTextureCache.js";
import { WebGLFloatBuffer } from "./WebGLFloatBuffer.js";
import { finalizeWebGLRenderStats } from "./finalizeWebGLRenderStats.js";
import { createWebGLBufferUploaders } from "./createWebGLBufferUploaders.js";
import { trackWebGLRunModeStats } from "./trackWebGLRunModeStats.js";
import { trackWebGLUploadStats } from "./trackWebGLUploadStats.js";
import { shapeFragmentSource, shapeVertexSource, spriteFragmentSource, spriteVertexSource } from "./WebGLRenderer2DShaders.js";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLBufferUploaderMap } from "./WebGLBufferUploaderMap.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLRenderStats } from "./WebGLRenderStats.type.js";
import type {
  WebGLRenderer2DLike,
  WebGLRenderer2DOptions,
  WebGLRenderer2DRenderOptions,
  WebGLRenderer2DSize
} from "./WebGLRenderer2D.type.js";

export class WebGLRenderer2D implements WebGLRenderer2DLike {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;
  private readonly pipeline = new RenderPipeline<Object2D>({
    boundsProvider: (object) => getWebGLBounds(object)
  });
  private readonly shapeProgram: WebGLProgram;
  private readonly spriteProgram: WebGLProgram;
  private readonly shapeUploaders: WebGLBufferUploaderMap;
  private readonly spriteUploaders: WebGLBufferUploaderMap;
  private readonly textureCache: WebGLTextureCache;
  private readonly shapeFloatBuffer = new WebGLFloatBuffer();
  private readonly spriteFloatBuffer = new WebGLFloatBuffer();
  private readonly defaultCamera = new Camera2D();
  private width: number;
  private height: number;
  private backgroundColor: string;
  private stats: WebGLRenderStats = {
    objects: 0,
    rects: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    sprites: 0,
    textures: 0,
    batches: 0,
    staticBatches: 0,
    dynamicBatches: 0,
    staticObjects: 0,
    dynamicObjects: 0,
    vertices: 0,
    drawCalls: 0,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 0,
    unsupported: 0
  };

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
    this.shapeProgram = createWebGLProgram(gl, shapeVertexSource, shapeFragmentSource);
    this.spriteProgram = createWebGLProgram(gl, spriteVertexSource, spriteFragmentSource);
    this.shapeUploaders = createWebGLBufferUploaders(gl);
    this.spriteUploaders = createWebGLBufferUploaders(gl);
    this.textureCache = new WebGLTextureCache(gl);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
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
    const renderList = options.renderList ?? this.createRenderList(scene, camera, options);
    const items = renderList.getFlatItems();
    const runs = createWebGLRenderRuns(items, getWebGLRenderRunKind);
    const stats = createMutableWebGLRenderStats(items.length);

    this.clear();

    for (const run of runs) {
      if (run.kind === "shape") {
        this.renderShapeRun(run, camera, stats);
      } else if (run.kind === "sprite") {
        this.renderSpriteRun(run, camera, stats);
      } else {
        trackWebGLRunModeStats(run, 0, stats);
        stats.unsupported += run.items.length;
      }
    }

    this.stats = finalizeWebGLRenderStats(stats);
  }

  private renderShapeRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): void {
    const batch = createWebGLShapeBatch({ items: run.items, camera, width: this.width, height: this.height, floatBuffer: this.shapeFloatBuffer });
    this.configureShapeProgram(run.mode);
    trackWebGLUploadStats(this.shapeUploaders[run.mode].upload(batch.vertices), stats);

    for (const drawBatch of batch.drawBatches) {
      this.gl.drawArrays(this.gl.TRIANGLES, drawBatch.firstVertex, drawBatch.vertexCount);
    }

    stats.rects += batch.rects;
    stats.circles += batch.circles;
    stats.ellipses += batch.ellipses;
    stats.lines += batch.lines;
    stats.polylines += batch.polylines;
    stats.polygons += batch.polygons;
    trackWebGLRunModeStats(run, batch.drawBatches.length, stats);
    stats.vertices += batch.vertices.length / 6;
    stats.drawCalls += batch.drawBatches.length;
    stats.unsupported += batch.unsupported;
  }

  private renderSpriteRun(run: WebGLRenderRun, camera: Camera2D, stats: MutableWebGLRenderStats): void {
    const batch = createWebGLSpriteBatch({
      items: run.items,
      camera,
      width: this.width,
      height: this.height,
      floatBuffer: this.spriteFloatBuffer,
      getTextureKey: (texture) => this.textureCache.getKey(texture)
    });

    this.configureSpriteProgram(run.mode);
    trackWebGLUploadStats(this.spriteUploaders[run.mode].upload(batch.vertices), stats);

    for (const drawBatch of batch.drawBatches) {
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureCache.get(drawBatch.texture));
      this.gl.drawArrays(this.gl.TRIANGLES, drawBatch.firstVertex, drawBatch.vertexCount);
      stats.textures.add(drawBatch.key);
    }

    stats.sprites += batch.sprites;
    trackWebGLRunModeStats(run, batch.drawBatches.length, stats);
    stats.vertices += batch.vertices.length / 5;
    stats.drawCalls += batch.drawBatches.length;
    stats.unsupported += batch.unsupported;
  }

  private configureShapeProgram(mode: Object2DRenderMode): void {
    const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
    this.gl.useProgram(this.shapeProgram);
    this.shapeUploaders[mode].bind();
    this.enableAttribute(this.shapeProgram, "a_position", 2, stride, 0);
    this.enableAttribute(this.shapeProgram, "a_color", 4, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  }

  private configureSpriteProgram(mode: Object2DRenderMode): void {
    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
    const textureLocation = this.gl.getUniformLocation(this.spriteProgram, "u_texture");

    if (!textureLocation) {
      throw new Error("WebGL uniform not found: u_texture");
    }

    this.gl.useProgram(this.spriteProgram);
    this.spriteUploaders[mode].bind();
    this.enableAttribute(this.spriteProgram, "a_position", 2, stride, 0);
    this.enableAttribute(this.spriteProgram, "a_uv", 2, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
    this.enableAttribute(this.spriteProgram, "a_alpha", 1, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
    this.gl.uniform1i(textureLocation, 0);
  }

  private enableAttribute(program: WebGLProgram, name: string, size: number, stride: number, offset: number): void {
    const location = this.gl.getAttribLocation(program, name);

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
