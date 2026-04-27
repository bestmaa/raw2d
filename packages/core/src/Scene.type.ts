import type { Object2D } from "./Object2D.js";

export type SceneObject = Object2D;

export interface SceneOptions {
  readonly name?: string;
  readonly objects?: readonly SceneObject[];
}

export interface SceneLike {
  add(object: SceneObject): this;
  remove(object: SceneObject): this;
  getObjects(): readonly SceneObject[];
}
