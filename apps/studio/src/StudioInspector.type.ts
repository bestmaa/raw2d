import type { StudioLayerItem, StudioPropertyRow } from "./StudioLayout.type";

export interface StudioInspectorModel {
  readonly layers: readonly StudioLayerItem[];
  readonly properties: readonly StudioPropertyRow[];
}
