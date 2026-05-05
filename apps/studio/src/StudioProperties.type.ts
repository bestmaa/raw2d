import type { StudioSceneState } from "./StudioSceneState.type";

export type StudioPropertyInputType = "color" | "number" | "text";

export type StudioPropertyId =
  | "x"
  | "y"
  | "width"
  | "height"
  | "radius"
  | "fillColor"
  | "strokeColor"
  | "lineWidth"
  | "text"
  | "font";

export interface StudioPropertyField {
  readonly id: StudioPropertyId;
  readonly label: string;
  readonly value: string;
  readonly inputType: StudioPropertyInputType;
  readonly min?: number;
  readonly step?: number;
}

export interface StudioPropertyEditOptions {
  readonly scene: StudioSceneState;
  readonly selectedObjectId?: string;
  readonly propertyId: StudioPropertyId;
  readonly value: string;
}

export interface StudioPropertyEditResult {
  readonly handled: boolean;
  readonly scene: StudioSceneState;
}
