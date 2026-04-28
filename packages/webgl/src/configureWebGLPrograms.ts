import type { WebGLBufferUploader } from "./WebGLBufferUploader.js";

export function configureWebGLShapeProgram(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uploader: WebGLBufferUploader
): void {
  const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
  gl.useProgram(program);
  uploader.bind();
  enableAttribute(gl, program, "a_position", 2, stride, 0);
  enableAttribute(gl, program, "a_color", 4, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
}

export function configureWebGLSpriteProgram(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uploader: WebGLBufferUploader
): void {
  const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
  const textureLocation = gl.getUniformLocation(program, "u_texture");

  if (!textureLocation) {
    throw new Error("WebGL uniform not found: u_texture");
  }

  gl.useProgram(program);
  uploader.bind();
  enableAttribute(gl, program, "a_position", 2, stride, 0);
  enableAttribute(gl, program, "a_uv", 2, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  enableAttribute(gl, program, "a_alpha", 1, stride, 4 * Float32Array.BYTES_PER_ELEMENT);
  gl.uniform1i(textureLocation, 0);
}

function enableAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  size: number,
  stride: number,
  offset: number
): void {
  const location = gl.getAttribLocation(program, name);

  if (location < 0) {
    throw new Error(`WebGL attribute not found: ${name}`);
  }

  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
}
