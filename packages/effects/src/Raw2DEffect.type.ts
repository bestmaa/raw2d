export type Raw2DEffectType = "opacity" | "blur" | "grayscale" | "shadow";

export interface Raw2DEffectBase {
  readonly type: Raw2DEffectType;
  readonly id?: string;
  readonly enabled?: boolean;
}

export interface Raw2DOpacityEffect extends Raw2DEffectBase {
  readonly type: "opacity";
  readonly opacity: number;
}

export interface Raw2DBlurEffect extends Raw2DEffectBase {
  readonly type: "blur";
  readonly radius: number;
}

export interface Raw2DGrayscaleEffect extends Raw2DEffectBase {
  readonly type: "grayscale";
  readonly amount: number;
}

export interface Raw2DShadowEffect extends Raw2DEffectBase {
  readonly type: "shadow";
  readonly color: string;
  readonly blur: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export type Raw2DEffect =
  | Raw2DOpacityEffect
  | Raw2DBlurEffect
  | Raw2DGrayscaleEffect
  | Raw2DShadowEffect;
