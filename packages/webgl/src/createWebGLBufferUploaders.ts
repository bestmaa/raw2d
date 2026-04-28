import { WebGLBufferUploader } from "./WebGLBufferUploader.js";
import type { WebGLBufferUploaderMap } from "./WebGLBufferUploaderMap.type.js";

export function createWebGLBufferUploaders(gl: WebGL2RenderingContext): WebGLBufferUploaderMap {
  return {
    dynamic: new WebGLBufferUploader({ gl, target: gl.ARRAY_BUFFER, usage: gl.DYNAMIC_DRAW }),
    static: new WebGLBufferUploader({ gl, target: gl.ARRAY_BUFFER, usage: gl.STATIC_DRAW })
  };
}
