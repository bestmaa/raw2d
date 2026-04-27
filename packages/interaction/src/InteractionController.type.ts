import type { Camera2D, Object2D, PickObjectOptions, Rect, SceneLike } from "raw2d-core";
import type { ObjectDragState } from "./ObjectDrag.type.js";
import type { ObjectResizeState } from "./ObjectResize.type.js";
import type { ResizeHandle } from "./ResizeHandle.type.js";
import type { SelectionManager } from "./SelectionManager.js";
import type { InteractionPoint, InteractionPointerInput } from "./InteractionPoint.type.js";

export type InteractionMode = "idle" | "dragging" | "resizing";

export interface InteractionControllerOptions {
  readonly canvas: HTMLCanvasElement;
  readonly scene: SceneLike;
  readonly camera?: Camera2D;
  readonly selection?: SelectionManager;
  readonly width?: number;
  readonly height?: number;
  readonly handleSize?: number;
  readonly minResizeWidth?: number;
  readonly minResizeHeight?: number;
  readonly pickTolerance?: number;
  readonly updateCursor?: boolean;
  readonly filter?: PickObjectOptions["filter"];
  readonly onChange?: (snapshot: InteractionControllerSnapshot) => void;
}

export interface InteractionControllerPointerEvent extends InteractionPointerInput {
  readonly pointerId?: number;
  readonly shiftKey?: boolean;
  preventDefault?(): void;
}

export interface InteractionControllerSnapshot {
  readonly mode: InteractionMode;
  readonly point: InteractionPoint | null;
  readonly selected: readonly Object2D[];
  readonly primary: Object2D | null;
  readonly hoveredHandle: ResizeHandle | null;
}

export interface InteractionControllerState {
  mode: InteractionMode;
  point: InteractionPoint | null;
  hoveredHandle: ResizeHandle | null;
  dragState: ObjectDragState | null;
  resizeState: ObjectResizeState | null;
}

export interface InteractionControllerFeatureFlags {
  selection: boolean;
  drag: boolean;
  resize: boolean;
}

export interface InteractionAttachOptions {
  readonly select?: boolean;
  readonly drag?: boolean;
  readonly resize?: boolean;
}

export interface InteractionObjectFeatures {
  readonly selection: boolean;
  readonly drag: boolean;
  readonly resize: boolean;
}

export type InteractionFeatureName = keyof InteractionControllerFeatureFlags;

export type ResizableInteractionObject = Rect;

export interface StartControllerResizeOptions {
  readonly state: InteractionControllerState;
  readonly object: ResizableInteractionObject | null;
  readonly handle: ResizeHandle;
  readonly pointerX: number;
  readonly pointerY: number;
  readonly minWidth?: number;
  readonly minHeight?: number;
  readonly updateCursor: () => void;
}

export interface EndControllerInteractionOptions {
  readonly state: InteractionControllerState;
  readonly updateCursor: () => void;
}
