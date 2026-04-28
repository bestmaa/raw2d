export type WebGLMaterialPass = "fill" | "stroke";

export interface WebGLMaterialKeyParts {
  readonly pass: WebGLMaterialPass;
  readonly color: string;
  readonly lineWidth?: number;
}

