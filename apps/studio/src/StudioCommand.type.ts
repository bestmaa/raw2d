import type { StudioMaterialState, StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export interface StudioTransformState {
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  readonly startX?: number;
  readonly startY?: number;
  readonly endX?: number;
  readonly endY?: number;
}

export interface StudioTextContentState {
  readonly text?: string;
  readonly font?: string;
}

export interface StudioCreateObjectCommand {
  readonly kind: "create-object";
  readonly object: StudioSceneObject;
  readonly index?: number;
}

export interface StudioDeleteObjectCommand {
  readonly kind: "delete-object";
  readonly objectId: string;
  readonly object: StudioSceneObject;
  readonly index: number;
}

export interface StudioUpdateTransformCommand {
  readonly kind: "update-transform";
  readonly objectId: string;
  readonly before: StudioTransformState;
  readonly after: StudioTransformState;
}

export interface StudioUpdateMaterialCommand {
  readonly kind: "update-material";
  readonly objectId: string;
  readonly before?: StudioMaterialState;
  readonly after?: StudioMaterialState;
}

export interface StudioUpdateTextCommand {
  readonly kind: "update-text";
  readonly objectId: string;
  readonly before: StudioTextContentState;
  readonly after: StudioTextContentState;
}

export interface StudioSetVisibilityCommand {
  readonly kind: "set-visibility";
  readonly objectId: string;
  readonly before?: boolean;
  readonly after?: boolean;
}

export interface StudioReorderObjectCommand {
  readonly kind: "reorder-object";
  readonly objectId: string;
  readonly fromIndex: number;
  readonly toIndex: number;
}

export interface StudioUpdateSpriteAssetCommand {
  readonly kind: "update-sprite-asset";
  readonly objectId: string;
  readonly beforeAssetSlot: string;
  readonly afterAssetSlot: string;
}

export type StudioCommand =
  | StudioCreateObjectCommand
  | StudioDeleteObjectCommand
  | StudioUpdateTransformCommand
  | StudioUpdateMaterialCommand
  | StudioUpdateTextCommand
  | StudioSetVisibilityCommand
  | StudioReorderObjectCommand
  | StudioUpdateSpriteAssetCommand;

export interface ApplyStudioCommandOptions {
  readonly scene: StudioSceneState;
  readonly command: StudioCommand;
}

export interface StudioCommandResult {
  readonly scene: StudioSceneState;
  readonly handled: boolean;
}

export interface StudioCommandApplyOptions {
  readonly selectedObjectId?: string;
  readonly statusMessage?: string;
  readonly renderRuntimeOnly?: boolean;
}

export type ApplyStudioEditorCommand = (command: StudioCommand, options?: StudioCommandApplyOptions) => void;
