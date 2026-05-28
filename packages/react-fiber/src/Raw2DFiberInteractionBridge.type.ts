import type {
  Camera2D,
  CameraControls,
  CameraControlsOptions,
  CameraControlsSnapshot,
  InteractionAttachOptions,
  InteractionController,
  InteractionControllerOptions,
  InteractionControllerSnapshot,
  Object2D,
  SceneLike,
  SelectionManager
} from "raw2d";
import type { Raw2DFiberHostInstance } from "./Raw2DFiberHostConfig.type.js";

export interface Raw2DFiberInteractionBridgeOptions {
  readonly canvas: HTMLCanvasElement;
  readonly scene: SceneLike;
  readonly camera?: Camera2D;
  readonly selection?: SelectionManager;
  readonly width?: number;
  readonly height?: number;
  readonly interaction?: Omit<InteractionControllerOptions, "canvas" | "camera" | "scene" | "selection" | "width" | "height">;
  readonly cameraControls?: Omit<CameraControlsOptions, "camera" | "target" | "width" | "height">;
  readonly requestRender?: () => void;
}

export interface Raw2DFiberInteractionBridgeSnapshot {
  readonly interaction: InteractionControllerSnapshot;
  readonly camera: CameraControlsSnapshot | null;
  readonly selectedInstances: readonly Raw2DFiberHostInstance[];
}

export interface Raw2DFiberInteractionBridge {
  readonly interaction: InteractionController;
  readonly selection: SelectionManager;
  readonly cameraControls: CameraControls | null;
  attachInstance(instance: Raw2DFiberHostInstance, options?: InteractionAttachOptions): void;
  attachInstances(instances: readonly Raw2DFiberHostInstance[], options?: InteractionAttachOptions): void;
  detachInstance(instance: Raw2DFiberHostInstance): void;
  selectInstance(instance: Raw2DFiberHostInstance): void;
  getSelectedInstances(): readonly Raw2DFiberHostInstance[];
  getInteractionController(): InteractionController;
  getCameraControls(): CameraControls | null;
  enableSelection(): void;
  enableDrag(): void;
  enableResize(): void;
  enableCameraPan(button?: number): void;
  enableCameraZoom(): void;
  getAttachedObjects(): readonly Object2D[];
  getSnapshot(): Raw2DFiberInteractionBridgeSnapshot;
  dispose(): void;
}
