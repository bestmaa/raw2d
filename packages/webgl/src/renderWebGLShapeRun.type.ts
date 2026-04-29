import type { Camera2D } from "raw2d-core";
import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLFloatBuffer } from "./WebGLFloatBuffer.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLRenderer2DOptions } from "./WebGLRenderer2D.type.js";
import type { WebGLRenderer2DResources } from "./WebGLRenderer2DResources.js";

export interface RenderWebGLShapeRunOptions {
  readonly gl: WebGL2RenderingContext;
  readonly run: WebGLRenderRun;
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
  readonly curveSegments: number;
  readonly resources: WebGLRenderer2DResources;
  readonly resourceOptions: WebGLRenderer2DOptions;
  readonly shapeFloatBuffer: WebGLFloatBuffer;
  readonly spriteFloatBuffer: WebGLFloatBuffer;
  readonly stats: MutableWebGLRenderStats;
}
