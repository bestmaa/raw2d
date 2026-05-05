import type { StudioRendererMode } from "./StudioRenderer.type";
import type { StudioRendererStatsLike, StudioStatsPanelModel, StudioStatsRow } from "./StudioStats.type";

export function createEmptyStudioStats(renderer: StudioRendererMode): StudioStatsPanelModel {
  return {
    renderer,
    rows: [
      { label: "Objects", value: "0" },
      { label: "Draw calls", value: "0" },
      { label: "Accepted", value: "0" },
      { label: "Culled", value: "0" }
    ]
  };
}

export function createStudioStatsPanel(
  renderer: StudioRendererMode,
  stats: StudioRendererStatsLike,
  note?: string
): StudioStatsPanelModel {
  const rows: StudioStatsRow[] = [
    { label: "Objects", value: String(stats.objects) },
    { label: "Draw calls", value: String(stats.drawCalls) },
    { label: "Accepted", value: String(stats.renderList.accepted) },
    { label: "Hidden", value: String(stats.renderList.hidden) },
    { label: "Culled", value: String(stats.renderList.culled) }
  ];

  if (renderer === "webgl") {
    rows.push(
      { label: "Batches", value: String(stats.batches ?? 0) },
      { label: "Vertices", value: String(stats.vertices ?? 0) },
      { label: "Texture binds", value: String(stats.textureBinds ?? 0) },
      { label: "Unsupported", value: String(stats.unsupported ?? 0) }
    );
  }

  return { renderer, rows, note };
}
