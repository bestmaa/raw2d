import { WebGLBufferUploader } from "./WebGLBufferUploader.js";
import type {
  WebGLStaticBatchCacheEntry,
  WebGLStaticBatchWithVertices
} from "./WebGLStaticBatchCache.type.js";

interface MutableEntry<TBatch extends WebGLStaticBatchWithVertices> extends WebGLStaticBatchCacheEntry<TBatch> {
  lastFrame: number;
}

export class WebGLStaticBatchCache<TBatch extends WebGLStaticBatchWithVertices> {
  private readonly entries = new Map<string, MutableEntry<TBatch>>();
  private readonly gl: WebGL2RenderingContext;
  private frame = 0;

  public constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  public beginFrame(): void {
    this.frame += 1;
  }

  public get(runId: string, key: string): WebGLStaticBatchCacheEntry<TBatch> | null {
    const entry = this.entries.get(runId);

    if (!entry || entry.key !== key) {
      return null;
    }

    entry.lastFrame = this.frame;
    return entry;
  }

  public set(runId: string, key: string, batch: TBatch): WebGLStaticBatchCacheEntry<TBatch> {
    const previous = this.entries.get(runId);
    const uploader = previous?.uploader ?? new WebGLBufferUploader({
      gl: this.gl,
      target: this.gl.ARRAY_BUFFER,
      usage: this.gl.STATIC_DRAW
    });
    const entry: MutableEntry<TBatch> = { key, uploader, batch, lastFrame: this.frame };

    this.entries.set(runId, entry);
    return entry;
  }

  public sweep(): void {
    for (const [runId, entry] of this.entries) {
      if (entry.lastFrame !== this.frame) {
        entry.uploader.dispose();
        this.entries.delete(runId);
      }
    }
  }

  public clear(): void {
    for (const entry of this.entries.values()) {
      entry.uploader.dispose();
    }

    this.entries.clear();
  }

  public dispose(): void {
    this.clear();
  }
}
