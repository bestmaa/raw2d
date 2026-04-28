import type { Object2D } from "./Object2D.js";
import type { Rectangle } from "./Rectangle.js";

export interface RenderItem<TObject extends Object2D = Object2D> {
  readonly object: TObject;
  readonly id: string;
  readonly parentId: string | null;
  readonly depth: number;
  readonly order: number;
  readonly zIndex: number;
  readonly visible: boolean;
  readonly culled: boolean;
  readonly bounds: Rectangle | null;
  readonly children: readonly RenderItem<TObject>[];
}

