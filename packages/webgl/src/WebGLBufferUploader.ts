import type {
  WebGLBufferUploadResult,
  WebGLBufferUploaderOptions,
  WebGLBufferUploaderSnapshot
} from "./WebGLBufferUploader.type.js";

export class WebGLBufferUploader {
  public readonly buffer: WebGLBuffer;
  private readonly gl: WebGL2RenderingContext;
  private readonly target: number;
  private readonly usage: number;
  private capacity = 0;

  public constructor(options: WebGLBufferUploaderOptions) {
    this.gl = options.gl;
    this.target = options.target;
    this.usage = options.usage;
    this.buffer = options.buffer ?? createBuffer(options.gl);
  }

  public bind(): void {
    this.gl.bindBuffer(this.target, this.buffer);
  }

  public upload(data: Float32Array): WebGLBufferUploadResult {
    this.bind();

    if (data.byteLength > this.capacity) {
      this.gl.bufferData(this.target, data, this.usage);
      this.capacity = data.byteLength;
      return this.createResult("bufferData", data.byteLength);
    }

    this.gl.bufferSubData(this.target, 0, data);
    return this.createResult("bufferSubData", data.byteLength);
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public getSnapshot(): WebGLBufferUploaderSnapshot {
    return {
      capacity: this.capacity
    };
  }

  public dispose(): void {
    this.gl.deleteBuffer(this.buffer);
    this.capacity = 0;
  }

  private createResult(mode: WebGLBufferUploadResult["mode"], byteLength: number): WebGLBufferUploadResult {
    return {
      mode,
      byteLength,
      capacity: this.capacity
    };
  }
}

function createBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error("Unable to create WebGL buffer.");
  }

  return buffer;
}
