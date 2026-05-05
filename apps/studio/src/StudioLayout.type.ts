import type { StudioPropertyField } from "./StudioProperties.type";

export interface StudioToolItem {
  readonly id: string;
  readonly label: string;
  readonly shortcut: string;
}

export interface StudioLayerItem {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly visible: boolean;
}

export interface StudioPropertyRow {
  readonly label: string;
  readonly value: string;
}

export interface StudioLayoutOptions {
  readonly rendererLabel: string;
  readonly sceneName: string;
  readonly objectCount: number;
  readonly layers: readonly StudioLayerItem[];
  readonly properties: readonly StudioPropertyRow[];
  readonly propertyFields: readonly StudioPropertyField[];
  readonly selectedLayerId?: string;
}
