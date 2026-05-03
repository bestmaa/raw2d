export interface Raw2DMcpCameraJson {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
}

export type Raw2DMcpSceneObjectJson = never;

export interface Raw2DMcpSceneJson {
  readonly objects: readonly Raw2DMcpSceneObjectJson[];
}

export interface Raw2DMcpSceneDocument {
  readonly scene: Raw2DMcpSceneJson;
  readonly camera: Raw2DMcpCameraJson;
}

export interface CreateRaw2DSceneJsonOptions {
  readonly camera?: Partial<Raw2DMcpCameraJson>;
}
