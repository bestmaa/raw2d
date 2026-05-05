import { applyStudioLayerAction } from "./StudioLayers";
import type { StudioLayerAction } from "./StudioLayers.type";
import type { StudioLayerBindingOptions } from "./StudioLayerBindings.type";

export function bindStudioLayerButtons(options: StudioLayerBindingOptions): void {
  const layerButtons = options.root.querySelectorAll<HTMLButtonElement>("[data-layer-action]");

  for (const button of layerButtons) {
    button.addEventListener("click", () => {
      const action = button.dataset.layerAction as StudioLayerAction | undefined;
      const objectId = button.dataset.layerId;

      if (!objectId || !action) return;
      const result = applyStudioLayerAction({
        scene: options.getScene(),
        selectedObjectId: options.getSelectedObjectId(),
        objectId,
        action
      });

      if (!result.handled) return;
      options.setScene(result.scene);
      options.setSelectedObjectId(result.selectedObjectId);
      options.mount();
    });
  }
}
