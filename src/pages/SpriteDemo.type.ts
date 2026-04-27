import type { Object2DOriginKeyword } from "raw2d";

export interface SpriteDemoState {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  origin: Object2DOriginKeyword;
}
