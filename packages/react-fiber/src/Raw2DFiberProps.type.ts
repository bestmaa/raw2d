import type {
  BasicMaterialStrokeCap,
  BasicMaterialStrokeJoin,
  Object2DOriginValue,
  Object2DRenderMode,
  Texture,
  TextureFrame
} from "raw2d";

export type Raw2DFiberHostType = "rawCircle" | "rawGroup2D" | "rawLine" | "rawRect" | "rawSprite" | "rawText2D";

export interface Raw2DFiberObjectProps {
  readonly name?: string;
  readonly x?: number;
  readonly y?: number;
  readonly origin?: Object2DOriginValue;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly zIndex?: number;
  readonly visible?: boolean;
  readonly renderMode?: Object2DRenderMode;
}

export interface Raw2DFiberMaterialProps {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
  readonly strokeCap?: BasicMaterialStrokeCap;
  readonly strokeJoin?: BasicMaterialStrokeJoin;
  readonly miterLimit?: number;
}

export interface Raw2DFiberRectProps extends Raw2DFiberObjectProps, Raw2DFiberMaterialProps {
  readonly width: number;
  readonly height: number;
}

export interface Raw2DFiberCircleProps extends Raw2DFiberObjectProps, Raw2DFiberMaterialProps {
  readonly radius: number;
}

export interface Raw2DFiberLineProps extends Raw2DFiberObjectProps, Raw2DFiberMaterialProps {
  readonly startX?: number;
  readonly startY?: number;
  readonly endX: number;
  readonly endY: number;
}

export interface Raw2DFiberText2DProps extends Raw2DFiberObjectProps, Raw2DFiberMaterialProps {
  readonly text: string;
  readonly font?: string;
  readonly align?: CanvasTextAlign;
  readonly baseline?: CanvasTextBaseline;
}

export interface Raw2DFiberSpriteProps extends Raw2DFiberObjectProps {
  readonly texture: Texture;
  readonly frame?: TextureFrame | null;
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}

export type Raw2DFiberGroup2DProps = Raw2DFiberObjectProps;

export interface Raw2DFiberHostPropsByType {
  readonly rawCircle: Raw2DFiberCircleProps;
  readonly rawGroup2D: Raw2DFiberGroup2DProps;
  readonly rawLine: Raw2DFiberLineProps;
  readonly rawRect: Raw2DFiberRectProps;
  readonly rawSprite: Raw2DFiberSpriteProps;
  readonly rawText2D: Raw2DFiberText2DProps;
}

export type Raw2DFiberHostProps = Raw2DFiberHostPropsByType[Raw2DFiberHostType];
