export type TextureSource = CanvasImageSource;

export type TextureStatus = "ready" | "disposed";

export interface TextureOptions {
  readonly source: TextureSource;
  readonly width?: number;
  readonly height?: number;
  readonly id?: string;
  readonly url?: string;
}

export interface TextureSize {
  readonly width: number;
  readonly height: number;
}

export interface TextureSnapshot extends TextureSize {
  readonly id: string;
  readonly url: string | null;
  readonly status: TextureStatus;
}
