export type Raw2DMcpStudioCommandKind =
  | "batch"
  | "create-object"
  | "delete-object"
  | "reorder-object"
  | "set-visibility"
  | "update-material"
  | "update-sprite-asset"
  | "update-text"
  | "update-transform";

export interface Raw2DMcpStudioValidationIssue {
  readonly path: string;
  readonly message: string;
}

export interface Raw2DMcpStudioRendererWarning {
  readonly path: string;
  readonly message: string;
}

export type Raw2DMcpStudioValidationWarning = Raw2DMcpStudioRendererWarning;

export interface ValidateRaw2DStudioSceneOptions {
  readonly document: unknown;
  readonly commands?: readonly unknown[];
}

export interface Raw2DMcpStudioValidationResult {
  readonly valid: boolean;
  readonly errors: readonly Raw2DMcpStudioValidationIssue[];
  readonly warnings: readonly Raw2DMcpStudioValidationWarning[];
}
