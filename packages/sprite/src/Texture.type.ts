export type TextureSource = CanvasImageSource;

export interface TextureOptions {
  readonly source: TextureSource;
  readonly width?: number;
  readonly height?: number;
}

export interface TextureSize {
  readonly width: number;
  readonly height: number;
}
