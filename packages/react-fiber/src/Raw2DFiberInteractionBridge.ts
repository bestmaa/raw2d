import { CameraControls, InteractionController, SelectionManager } from "raw2d";
import type { InteractionAttachOptions } from "raw2d";
import type { Raw2DFiberHostInstance } from "./Raw2DFiberHostConfig.type.js";
import type {
  Raw2DFiberInteractionBridge,
  Raw2DFiberInteractionBridgeOptions,
  Raw2DFiberInteractionBridgeSnapshot
} from "./Raw2DFiberInteractionBridge.type.js";

export function createRaw2DFiberInteractionBridge(
  options: Raw2DFiberInteractionBridgeOptions
): Raw2DFiberInteractionBridge {
  const selection = options.selection ?? new SelectionManager();
  const instanceByObject = new Map<object, Raw2DFiberHostInstance>();
  const emitRender = (): void => options.requestRender?.();
  const interaction = new InteractionController({
    ...options.interaction,
    canvas: options.canvas,
    camera: options.camera,
    height: options.height,
    onChange: (snapshot) => {
      options.interaction?.onChange?.(snapshot);
      emitRender();
    },
    scene: options.scene,
    selection,
    width: options.width
  });
  const cameraControls = options.camera
    ? new CameraControls({
      ...options.cameraControls,
      camera: options.camera,
      height: options.height,
      onChange: (snapshot) => {
        options.cameraControls?.onChange?.(snapshot);
        emitRender();
      },
      target: options.canvas,
      width: options.width
    })
    : null;

  return {
    interaction,
    selection,
    cameraControls,
    attachInstance(instance, attachOptions = {}) {
      instanceByObject.set(instance.object, instance);
      interaction.attach(instance.object, attachOptions);
      emitRender();
    },
    attachInstances(instances, attachOptions = {}) {
      for (const instance of instances) {
        this.attachInstance(instance, attachOptions);
      }
    },
    detachInstance(instance) {
      interaction.detach(instance.object);
      selection.remove(instance.object);
      instanceByObject.delete(instance.object);
      emitRender();
    },
    selectInstance(instance) {
      selection.select(instance.object);
      emitRender();
    },
    getSelectedInstances() {
      return selection.getSelected().flatMap((object) => {
        const instance = instanceByObject.get(object);
        return instance ? [instance] : [];
      });
    },
    getInteractionController() {
      return interaction;
    },
    getCameraControls() {
      return cameraControls;
    },
    enableSelection() {
      interaction.enableSelection();
    },
    enableDrag() {
      interaction.enableDrag();
    },
    enableResize() {
      interaction.enableResize();
    },
    enableCameraPan(button?: number) {
      cameraControls?.enablePan(button);
    },
    enableCameraZoom() {
      cameraControls?.enableZoom();
    },
    getAttachedObjects() {
      return interaction.getAttachedObjects();
    },
    getSnapshot() {
      return createSnapshot(interaction, cameraControls, this.getSelectedInstances());
    },
    dispose() {
      interaction.dispose();
      cameraControls?.dispose();
      selection.clear();
      instanceByObject.clear();
      emitRender();
    }
  };
}

function createSnapshot(
  interaction: InteractionController,
  cameraControls: CameraControls | null,
  selectedInstances: readonly Raw2DFiberHostInstance[]
): Raw2DFiberInteractionBridgeSnapshot {
  return {
    selectedInstances,
    interaction: interaction.getSnapshot(),
    camera: cameraControls?.getSnapshot() ?? null
  };
}

export function attachRaw2DFiberInteractionInstances(
  bridge: Raw2DFiberInteractionBridge,
  instances: readonly Raw2DFiberHostInstance[],
  options: InteractionAttachOptions = {}
): void {
  bridge.attachInstances(instances, options);
}
