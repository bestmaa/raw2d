import type { CanvasObject } from "./Canvas.type";

export interface SceneOptions {
  readonly name?: string;
  readonly objects?: readonly CanvasObject[];
}

export interface SceneLike {
  add(object: CanvasObject): this;
  remove(object: CanvasObject): this;
  getObjects(): readonly CanvasObject[];
}
