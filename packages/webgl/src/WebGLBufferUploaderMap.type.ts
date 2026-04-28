import type { Object2DRenderMode } from "raw2d-core";
import type { WebGLBufferUploader } from "./WebGLBufferUploader.js";

export type WebGLBufferUploaderMap = Record<Object2DRenderMode, WebGLBufferUploader>;
