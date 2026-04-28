import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLBufferUploadResult } from "./WebGLBufferUploader.type.js";

export function trackWebGLUploadStats(
  upload: WebGLBufferUploadResult,
  stats: MutableWebGLRenderStats
): void {
  stats.uploadedBytes += upload.byteLength;

  if (upload.mode === "bufferData") {
    stats.uploadBufferDataCalls += 1;
  } else {
    stats.uploadBufferSubDataCalls += 1;
  }
}
