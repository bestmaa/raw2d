export interface StudioAssetPanelItem {
  readonly id: string;
  readonly name: string;
  readonly sizeLabel: string;
  readonly previewSrc?: string;
  readonly selected: boolean;
}

export interface StudioAssetPanelModel {
  readonly selectedAssetId?: string;
  readonly items: readonly StudioAssetPanelItem[];
}
