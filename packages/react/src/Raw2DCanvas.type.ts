import type { CSSProperties, ReactNode } from "react";
import type { Camera2D, Canvas, Scene, WebGLRenderer2D } from "raw2d";

export type Raw2DReactRendererKind = "canvas" | "webgl";
export type Raw2DReactRenderer = Canvas | WebGLRenderer2D;

export interface Raw2DCanvasReadyEvent {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: Raw2DReactRenderer;
  readonly rendererKind: Raw2DReactRendererKind;
  readonly scene: Scene;
  readonly camera: Camera2D;
}

export interface Raw2DCanvasProps {
  readonly renderer?: Raw2DReactRendererKind;
  readonly width?: number;
  readonly height?: number;
  readonly pixelRatio?: number;
  readonly backgroundColor?: string;
  readonly fallbackToCanvas?: boolean;
  readonly scene?: Scene;
  readonly camera?: Camera2D;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly ariaLabel?: string;
  readonly children?: ReactNode;
  readonly onReady?: (event: Raw2DCanvasReadyEvent) => void;
}
