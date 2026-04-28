import type { WebGLBufferUploader } from "./WebGLBufferUploader.js";

export interface WebGLStaticBatchWithVertices {
  readonly vertices: Float32Array;
}

export interface WebGLStaticBatchCacheEntry<TBatch extends WebGLStaticBatchWithVertices> {
  readonly key: string;
  readonly uploader: WebGLBufferUploader;
  readonly batch: TBatch;
}
