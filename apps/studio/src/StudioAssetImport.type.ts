import type { StudioImageAssetInput } from "./StudioAssets.type";

export interface StudioImageAssetImportOptions {
  readonly file: File;
  readonly createObjectUrl?: (file: File) => string;
  readonly imageFactory?: () => HTMLImageElement;
}

export type StudioImageAssetImportResult = StudioImageAssetInput;
