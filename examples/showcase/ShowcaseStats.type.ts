export interface ShowcaseStatsInput {
  readonly atlasSorting: boolean;
  readonly animatedCount: number;
  readonly cameraX: number;
  readonly cameraY: number;
  readonly culling: boolean;
  readonly drawCalls: number | null;
  readonly interactionMode: string;
  readonly objectCount: number;
  readonly rendererLabel: string;
  readonly shapeCount: number;
  readonly spriteCount: number;
  readonly staticBatches: boolean;
  readonly textureBinds: number | null;
  readonly zoom: number;
}
