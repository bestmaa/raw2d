import { createStudioImageAssetInputFromFile } from "./StudioAssetImport";
import type { StudioAssetBindingOptions } from "./StudioAssetBindings.type";
import { addStudioImageAsset, getStudioAssetById, removeStudioAsset } from "./StudioAssets";

export function bindStudioAssetPanel(options: StudioAssetBindingOptions): void {
  const importButton = options.root.querySelector<HTMLButtonElement>('[data-asset-action="import"]');
  const removeButton = options.root.querySelector<HTMLButtonElement>('[data-asset-action="remove"]');
  const input = options.root.querySelector<HTMLInputElement>("[data-asset-import-input]");

  importButton?.addEventListener("click", () => {
    input?.click();
  });
  removeButton?.addEventListener("click", () => {
    removeSelectedAsset(options);
  });
  input?.addEventListener("change", () => {
    void importSelectedFile(options, input);
  });

  for (const button of options.root.querySelectorAll<HTMLButtonElement>('[data-asset-action="select"]')) {
    button.addEventListener("click", () => {
      options.setSelectedAssetId(button.dataset.assetId);
      options.setStatusMessage("Selected asset");
      options.mount();
    });
  }
}

async function importSelectedFile(options: StudioAssetBindingOptions, input: HTMLInputElement): Promise<void> {
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  try {
    const assetInput = await createStudioImageAssetInputFromFile({
      file,
      createObjectUrl: options.urlRef?.createObjectURL
    });
    const scene = addStudioImageAsset({ scene: options.getScene(), asset: assetInput });
    const asset = scene.assets.at(-1);

    options.setScene(scene);
    options.setSelectedAssetId(asset?.id);
    options.setStatusMessage("Imported asset");
    input.value = "";
    options.mount();
  } catch (error) {
    options.setStatusMessage(`Asset import error: ${error instanceof Error ? error.message : "unknown"}`);
    input.value = "";
    options.mount();
  }
}

function removeSelectedAsset(options: StudioAssetBindingOptions): void {
  const assetId = options.getSelectedAssetId();

  if (!assetId) {
    return;
  }

  const asset = getStudioAssetById({ scene: options.getScene(), assetId });
  const scene = removeStudioAsset({ scene: options.getScene(), assetId });

  if (asset?.src?.startsWith("blob:")) {
    (options.urlRef ?? URL).revokeObjectURL(asset.src);
  }

  options.setScene(scene);
  options.setSelectedAssetId(undefined);
  options.setStatusMessage("Removed asset");
  options.mount();
}
