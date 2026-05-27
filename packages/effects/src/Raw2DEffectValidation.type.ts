export interface Raw2DEffectValidationIssue {
  readonly path: string;
  readonly message: string;
}

export interface Raw2DEffectValidationResult {
  readonly valid: boolean;
  readonly issues: readonly Raw2DEffectValidationIssue[];
}
