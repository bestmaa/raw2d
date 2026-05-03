export type Raw2DMcpSceneObjectType = "rect" | "circle" | "line" | "text2d" | "sprite";
export type Raw2DMcpRenderModeJson = "dynamic" | "static";

export type Raw2DMcpOriginKeyword =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export interface Raw2DMcpPointJson {
  readonly x: number;
  readonly y: number;
}

export interface Raw2DMcpMaterialJson {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
  readonly opacity?: number;
}

export interface Raw2DMcpObjectBaseJson {
  readonly id: string;
  readonly type: Raw2DMcpSceneObjectType;
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly origin?: Raw2DMcpOriginKeyword | Raw2DMcpPointJson;
  readonly visible?: boolean;
  readonly zIndex?: number;
  readonly renderMode?: Raw2DMcpRenderModeJson;
  readonly material?: Raw2DMcpMaterialJson;
}

export interface Raw2DMcpRectJson extends Raw2DMcpObjectBaseJson {
  readonly type: "rect";
  readonly width: number;
  readonly height: number;
}

export interface Raw2DMcpCircleJson extends Raw2DMcpObjectBaseJson {
  readonly type: "circle";
  readonly radius: number;
}

export interface Raw2DMcpLineJson extends Raw2DMcpObjectBaseJson {
  readonly type: "line";
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface Raw2DMcpText2DJson extends Raw2DMcpObjectBaseJson {
  readonly type: "text2d";
  readonly text: string;
  readonly font?: string;
}

export interface Raw2DMcpSpriteJson extends Raw2DMcpObjectBaseJson {
  readonly type: "sprite";
  readonly textureId: string;
  readonly frameName?: string;
  readonly width?: number;
  readonly height?: number;
}

export type Raw2DMcpSceneObjectJson =
  | Raw2DMcpRectJson
  | Raw2DMcpCircleJson
  | Raw2DMcpLineJson
  | Raw2DMcpText2DJson
  | Raw2DMcpSpriteJson;
