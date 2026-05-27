import type { StudioAssetPanelModel } from "./StudioAssetPanel.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export function createStudioAssetPanelModel(
  scene: StudioSceneState,
  selectedAssetId: string | undefined,
  selectedObjectId?: string
): StudioAssetPanelModel {
  const selectedObject = scene.objects.find((object) => object.id === selectedObjectId);

  return {
    selectedAssetId,
    bindEnabled: Boolean(selectedAssetId && selectedObject?.type === "sprite"),
    items: scene.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      sizeLabel: `${asset.width} x ${asset.height}`,
      previewSrc: asset.src,
      selected: asset.id === selectedAssetId
    }))
  };
}

export function renderStudioAssetPanel(model: StudioAssetPanelModel): string {
  const selectedAsset = model.items.find((item) => item.id === model.selectedAssetId);

  return `
    <div class="studio-assets">
      <div class="studio-asset-actions">
        <button type="button" data-asset-action="import">Import</button>
        <button type="button" data-asset-action="bind" ${model.bindEnabled ? "" : "disabled"}>Use</button>
        <button type="button" data-asset-action="remove" ${selectedAsset ? "" : "disabled"}>Remove</button>
        <input type="file" accept="image/*" data-asset-import-input hidden>
      </div>
      <div class="studio-asset-list">
        ${model.items.map(renderAssetItem).join("") || `<p class="studio-empty">No assets</p>`}
      </div>
      ${selectedAsset ? renderAssetPreview(selectedAsset) : ""}
    </div>
  `;
}

function renderAssetItem(item: StudioAssetPanelModel["items"][number]): string {
  return `
    <button class="studio-asset-item${item.selected ? " is-selected" : ""}" type="button" data-asset-action="select" data-asset-id="${item.id}">
      <span>${item.name}</span>
      <small>${item.sizeLabel}</small>
    </button>
  `;
}

function renderAssetPreview(item: StudioAssetPanelModel["items"][number]): string {
  const preview = item.previewSrc
    ? `<img src="${item.previewSrc}" alt="${item.name} preview">`
    : `<div class="studio-asset-preview-empty">${item.name}</div>`;

  return `
    <div class="studio-asset-preview" data-asset-preview="${item.id}">
      ${preview}
      <small>${item.sizeLabel}</small>
    </div>
  `;
}
