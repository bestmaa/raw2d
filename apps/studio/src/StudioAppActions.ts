import { bindStudioActions } from "./StudioActions";
import type { StudioAction } from "./StudioActions.type";
import type { StudioAppActionBindingOptions } from "./StudioAppActions.type";
import { bindStudioSceneLoadInput, clickStudioSceneLoadInput } from "./StudioLoadBindings";
import { downloadStudioCanvasPng } from "./StudioPngExport";
import { downloadStudioScene } from "./StudioSave";
import { createStudioSampleSceneState } from "./StudioSceneState";

export function bindStudioAppActions(options: StudioAppActionBindingOptions): void {
  bindStudioActions({
    root: options.root,
    onAction: (action) => {
      handleAction(options, action);
    }
  });
  bindStudioSceneLoadInput({
    root: options.root,
    onSceneLoaded: (result) => {
      options.setScene(result.scene);
      options.setRendererMode(result.scene.rendererMode);
      options.setSelectedObjectId(undefined);
      options.setSelectedAssetId(undefined);
      options.setStatusMessage(createLoadStatusMessage(result.warnings));
      options.resetHistory();
      options.mount();
    },
    onLoadError: (error) => {
      options.setStatusMessage(`Import error: ${error.message}`);
      options.mount();
    }
  });
}

function handleAction(options: StudioAppActionBindingOptions, action: StudioAction): void {
  if (action === "sample-scene") {
    const scene = createStudioSampleSceneState();
    options.setScene(scene);
    options.setRendererMode(scene.rendererMode);
    options.setSelectedObjectId(undefined);
    options.setSelectedAssetId(undefined);
    options.setStatusMessage("Loaded sample scene");
    options.resetHistory();
    options.mount();
    return;
  }

  if (action === "undo") {
    options.onUndo();
    return;
  }

  if (action === "redo") {
    options.onRedo();
    return;
  }

  if (action === "save-scene") {
    downloadStudioScene({ scene: options.getScene() });
    return;
  }

  if (action === "load-scene") {
    clickStudioSceneLoadInput(options.root);
    return;
  }

  if (action === "export-png") {
    downloadStudioCanvasPng({ root: options.root, sceneName: options.getScene().name });
    return;
  }

  options.onCreateObject(action);
}

function createLoadStatusMessage(warnings: readonly string[]): string {
  return warnings.length === 0 ? "Loaded scene" : `Loaded scene with warnings: ${warnings.join(" ")}`;
}
