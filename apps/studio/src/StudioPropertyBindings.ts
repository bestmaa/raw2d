import type { StudioPropertyBindingOptions } from "./StudioPropertyBindings.type";
import { createStudioMaterialCommand, createStudioTextCommand, createStudioTransformCommand, findStudioObject } from "./StudioCommandFactory";
import { applyStudioPropertyEdit, hasStudioPropertyId } from "./StudioProperties";

export function bindStudioPropertyInputs(options: StudioPropertyBindingOptions): void {
  const inputs = options.root.querySelectorAll<HTMLInputElement>("[data-property-id]");

  for (const input of inputs) {
    input.addEventListener("input", () => {
      if (!hasStudioPropertyId(input.dataset.propertyId)) {
        return;
      }

      const scene = options.getScene();
      const selectedObjectId = options.getSelectedObjectId();
      const before = findStudioObject(scene, selectedObjectId);
      const result = applyStudioPropertyEdit({
        scene,
        selectedObjectId,
        propertyId: input.dataset.propertyId,
        value: input.value
      });

      if (!result.handled) {
        return;
      }

      const after = findStudioObject(result.scene, selectedObjectId);
      const command = before && after
        ? createStudioTransformCommand(before, after) ?? createStudioMaterialCommand(before, after) ?? createStudioTextCommand(before, after)
        : undefined;

      if (command) {
        options.applyCommand(command, { renderRuntimeOnly: true, statusMessage: "Property updated" });
        return;
      }

      options.setScene(result.scene);
      options.renderRuntimeScene();
    });
  }
}
