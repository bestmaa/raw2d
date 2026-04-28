export interface BasicMaterialOptions {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
}

export interface BasicMaterialDirtyState {
  readonly version: number;
  readonly dirty: boolean;
}
