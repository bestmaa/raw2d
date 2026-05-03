export interface ValidateRaw2DSceneOptions {
  readonly document: unknown;
}

export interface Raw2DMcpValidationError {
  readonly path: string;
  readonly message: string;
}

export interface Raw2DMcpValidationResult {
  readonly valid: boolean;
  readonly errors: readonly Raw2DMcpValidationError[];
}
