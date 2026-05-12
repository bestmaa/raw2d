import { applyStudioLayerAction } from "./StudioLayers";
import { createStudioReorderCommand, createStudioVisibilityCommand, findStudioObject } from "./StudioCommandFactory";
import type { StudioLayerAction } from "./StudioLayers.type";
import type { StudioLayerBindingOptions } from "./StudioLayerBindings.type";

export function bindStudioLayerButtons(options: StudioLayerBindingOptions): void {
  const layerButtons = options.root.querySelectorAll<HTMLButtonElement>("[data-layer-action]");

  for (const button of layerButtons) {
    button.addEventListener("click", () => {
      const action = button.dataset.layerAction as StudioLayerAction | undefined;
      const objectId = button.dataset.layerId;

      if (!objectId || !action) return;
      const scene = options.getScene();
      const result = applyStudioLayerAction({
        scene,
        selectedObjectId: options.getSelectedObjectId(),
        objectId,
        action
      });

      if (!result.handled) return;
      if (action === "select") {
        options.setSelectedObjectId(result.selectedObjectId);
        options.mount();
        return;
      }

      const before = findStudioObject(scene, objectId);
      const after = findStudioObject(result.scene, objectId);
      const command = action === "toggle-visibility" && before && after
        ? createStudioVisibilityCommand(before, after)
        : createStudioReorderCommand(scene, result.scene, objectId);

      if (command) {
        options.applyCommand(command, { selectedObjectId: result.selectedObjectId, statusMessage: "Layer updated" });
        return;
      }

      options.setScene(result.scene);
      options.setSelectedObjectId(result.selectedObjectId);
      options.mount();
    });
  }
}
