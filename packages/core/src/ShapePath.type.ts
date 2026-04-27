import type { BasicMaterial } from "./BasicMaterial.js";
import type { Object2DOptions } from "./Object2D.type.js";
import type { PathCommand } from "./PathCommand.type.js";

export interface ShapePathOptions extends Object2DOptions {
  readonly commands?: readonly PathCommand[];
  readonly material?: BasicMaterial;
  readonly fill?: boolean;
  readonly stroke?: boolean;
}
