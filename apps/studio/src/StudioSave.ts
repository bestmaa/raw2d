import type { StudioSceneDownloadOptions, StudioSceneSaveDocument } from "./StudioSave.type";
import type { StudioSceneState } from "./StudioSceneState.type";

export function createStudioSceneSaveDocument(scene: StudioSceneState): StudioSceneSaveDocument {
  return {
    version: scene.version,
    name: scene.name,
    rendererMode: scene.rendererMode,
    camera: scene.camera,
    objects: scene.objects
  };
}

export function serializeStudioScene(scene: StudioSceneState): string {
  return `${JSON.stringify(createStudioSceneSaveDocument(scene), null, 2)}\n`;
}

export function createStudioSceneFilename(scene: StudioSceneState): string {
  const safeName = scene.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeName || "raw2d-scene"}.raw2d.json`;
}

export function downloadStudioScene(options: StudioSceneDownloadOptions): void {
  const documentRef = options.documentRef ?? document;
  const urlRef = options.urlRef ?? URL;
  const blob = new Blob([serializeStudioScene(options.scene)], { type: "application/json" });
  const objectUrl = urlRef.createObjectURL(blob);
  const anchor = documentRef.createElement("a");

  anchor.href = objectUrl;
  anchor.download = createStudioSceneFilename(options.scene);
  anchor.click();
  urlRef.revokeObjectURL(objectUrl);
}
