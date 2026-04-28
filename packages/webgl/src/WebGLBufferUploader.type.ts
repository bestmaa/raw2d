export interface WebGLBufferUploaderOptions {
  readonly gl: WebGL2RenderingContext;
  readonly target: number;
  readonly usage: number;
  readonly buffer?: WebGLBuffer;
}

export type WebGLBufferUploadMode = "bufferData" | "bufferSubData";

export interface WebGLBufferUploadResult {
  readonly mode: WebGLBufferUploadMode;
  readonly byteLength: number;
  readonly capacity: number;
}

export interface WebGLBufferUploaderSnapshot {
  readonly capacity: number;
}
