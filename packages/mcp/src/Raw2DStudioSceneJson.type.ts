export type Raw2DMcpStudioRendererMode = "canvas" | "webgl";
export type Raw2DMcpStudioObjectType = "rect" | "circle" | "line" | "text2d" | "sprite";

export interface Raw2DMcpStudioCameraJson {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
}

export interface Raw2DMcpStudioMaterialJson {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
}

export interface Raw2DMcpStudioObjectBaseJson {
  readonly id: string;
  readonly type: Raw2DMcpStudioObjectType;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly visible?: boolean;
  readonly material?: Raw2DMcpStudioMaterialJson;
}

export interface Raw2DMcpStudioRectJson extends Raw2DMcpStudioObjectBaseJson {
  readonly type: "rect";
  readonly width: number;
  readonly height: number;
}

export interface Raw2DMcpStudioCircleJson extends Raw2DMcpStudioObjectBaseJson {
  readonly type: "circle";
  readonly radius: number;
}

export interface Raw2DMcpStudioLineJson extends Raw2DMcpStudioObjectBaseJson {
  readonly type: "line";
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface Raw2DMcpStudioTextJson extends Raw2DMcpStudioObjectBaseJson {
  readonly type: "text2d";
  readonly text: string;
  readonly font?: string;
}

export interface Raw2DMcpStudioSpriteJson extends Raw2DMcpStudioObjectBaseJson {
  readonly type: "sprite";
  readonly width: number;
  readonly height: number;
  readonly assetSlot: string;
}

export type Raw2DMcpStudioObjectJson =
  | Raw2DMcpStudioRectJson
  | Raw2DMcpStudioCircleJson
  | Raw2DMcpStudioLineJson
  | Raw2DMcpStudioTextJson
  | Raw2DMcpStudioSpriteJson;

export interface Raw2DMcpStudioImageAssetJson {
  readonly id: string;
  readonly type: "image";
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly src?: string;
  readonly mimeType?: string;
  readonly objectIds: readonly string[];
}

export type Raw2DMcpStudioAssetJson = Raw2DMcpStudioImageAssetJson;

export interface Raw2DMcpStudioSceneJson {
  readonly version: 1;
  readonly name: string;
  readonly rendererMode: Raw2DMcpStudioRendererMode;
  readonly camera: Raw2DMcpStudioCameraJson;
  readonly assets: readonly Raw2DMcpStudioAssetJson[];
  readonly objects: readonly Raw2DMcpStudioObjectJson[];
}
