export interface StudioToolItem {
  readonly id: string;
  readonly label: string;
  readonly shortcut: string;
}

export interface StudioLayerItem {
  readonly id: string;
  readonly label: string;
  readonly type: string;
}

export interface StudioPropertyRow {
  readonly label: string;
  readonly value: string;
}

export interface StudioLayoutOptions {
  readonly rendererLabel: string;
}
