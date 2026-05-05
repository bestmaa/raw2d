import type { StudioPropertyBindingOptions } from "./StudioPropertyBindings.type";
import { applyStudioPropertyEdit, hasStudioPropertyId } from "./StudioProperties";

export function bindStudioPropertyInputs(options: StudioPropertyBindingOptions): void {
  const inputs = options.root.querySelectorAll<HTMLInputElement>("[data-property-id]");

  for (const input of inputs) {
    input.addEventListener("input", () => {
      if (!hasStudioPropertyId(input.dataset.propertyId)) {
        return;
      }

      const result = applyStudioPropertyEdit({
        scene: options.getScene(),
        selectedObjectId: options.getSelectedObjectId(),
        propertyId: input.dataset.propertyId,
        value: input.value
      });

      if (!result.handled) {
        return;
      }

      options.setScene(result.scene);
      options.renderRuntimeScene();
    });
  }
}
