export interface ShowcaseStatsInput {
  readonly animatedCount: number;
  readonly cameraX: number;
  readonly cameraY: number;
  readonly drawCalls: number | null;
  readonly interactionMode: string;
  readonly objectCount: number;
  readonly rendererLabel: string;
  readonly shapeCount: number;
  readonly spriteCount: number;
  readonly textureBinds: number | null;
  readonly zoom: number;
}
