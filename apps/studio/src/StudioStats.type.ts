import type { StudioRendererMode } from "./StudioRenderer.type";

export interface StudioStatsRow {
  readonly label: string;
  readonly value: string;
}

export interface StudioStatsPanelModel {
  readonly renderer: StudioRendererMode;
  readonly rows: readonly StudioStatsRow[];
  readonly note?: string;
}

export interface StudioRenderListStatsLike {
  readonly accepted: number;
  readonly culled: number;
  readonly filtered: number;
  readonly hidden: number;
  readonly total: number;
}

export interface StudioRendererStatsLike {
  readonly objects: number;
  readonly drawCalls: number;
  readonly renderList: StudioRenderListStatsLike;
  readonly batches?: number;
  readonly unsupported?: number;
  readonly vertices?: number;
  readonly textureBinds?: number;
}
