import type { Camera2D, Scene } from "raw2d";
import type { Raw2DReactRenderer } from "./Raw2DCanvas.type.js";

export interface Raw2DReactContextValue {
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly renderer: Raw2DReactRenderer | null;
  readonly requestRender: () => void;
}
