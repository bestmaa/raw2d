import type { StudioAssetPanelModel } from "./StudioAssetPanel.type";
import type { StudioMinimapModel } from "./StudioNavigation.type";
import type { StudioPropertyField } from "./StudioProperties.type";
import type { StudioStatsPanelModel } from "./StudioStats.type";

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
  readonly depth?: number;
}

export interface StudioPropertyRow {
  readonly label: string;
  readonly value: string;
}

export interface StudioLayoutOptions {
  readonly rendererLabel: string;
  readonly sceneName: string;
  readonly statusMessage: string;
  readonly objectCount: number;
  readonly layers: readonly StudioLayerItem[];
  readonly properties: readonly StudioPropertyRow[];
  readonly propertyFields: readonly StudioPropertyField[];
  readonly selectedLayerId?: string;
  readonly selectedLayerIds?: readonly string[];
  readonly assets: StudioAssetPanelModel;
  readonly minimap: StudioMinimapModel;
  readonly stats: StudioStatsPanelModel;
}
