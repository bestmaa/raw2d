export type WebGLMaterialPass = "fill" | "stroke";

export interface WebGLMaterialKeyParts {
  readonly pass: WebGLMaterialPass;
  readonly color: string;
  readonly lineWidth?: number;
  readonly strokeCap?: string;
  readonly strokeJoin?: string;
  readonly miterLimit?: number;
}
