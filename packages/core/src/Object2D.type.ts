export type Object2DOriginKeyword =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export interface Object2DOrigin {
  readonly x: number;
  readonly y: number;
}

export type Object2DOriginValue = Object2DOriginKeyword | Object2DOrigin;

export interface Object2DOptions {
  readonly name?: string;
  readonly x?: number;
  readonly y?: number;
  readonly origin?: Object2DOriginValue;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly zIndex?: number;
  readonly visible?: boolean;
}

export interface Object2DTransform {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly originX: number;
  readonly originY: number;
}

export interface Object2DMatrixState {
  readonly localMatrixDirty: boolean;
  readonly worldMatrixDirty: boolean;
}
