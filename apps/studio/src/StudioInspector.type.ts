import type { StudioLayerItem, StudioPropertyRow } from "./StudioLayout.type";
import type { StudioPropertyField } from "./StudioProperties.type";

export interface StudioInspectorModel {
  readonly layers: readonly StudioLayerItem[];
  readonly properties: readonly StudioPropertyRow[];
  readonly propertyFields: readonly StudioPropertyField[];
}

export interface StudioInspectorOptions {
  readonly selectedObjectId?: string;
}
