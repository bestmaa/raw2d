import { bindStudioActions } from "./StudioActions";
import type { StudioAction } from "./StudioActions.type";
import type { StudioArrangementAction } from "./StudioArrangement.type";
import type { StudioAppActionBindingOptions } from "./StudioAppActions.type";
import { copyStudioCanvasCode } from "./StudioCanvasCodeExport";
import { bindStudioSceneLoadInput, clickStudioSceneLoadInput } from "./StudioLoadBindings";
import { downloadStudioCanvasPng } from "./StudioPngExport";
import { downloadStudioScene } from "./StudioSave";
import { createStudioSampleSceneState } from "./StudioSceneState";
import { copyStudioWebGLCode, createStudioWebGLCodeWarnings } from "./StudioWebGLCodeExport";

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

  if (action === "group") {
    options.onGroup();
    return;
  }

  if (action === "ungroup") {
    options.onUngroup();
    return;
  }

  if (isArrangementAction(action)) {
    options.onArrange(action);
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

  if (action === "copy-canvas-code") {
    void copyStudioCanvasCode({ scene: options.getScene() })
      .then(() => { options.setStatusMessage("Copied Canvas code"); options.mount(); })
      .catch((error: unknown) => { options.setStatusMessage(`Copy error: ${getErrorMessage(error)}`); options.mount(); });
    return;
  }

  if (action === "copy-webgl-code") {
    const scene = options.getScene();
    const warnings = createStudioWebGLCodeWarnings(scene);
    void copyStudioWebGLCode({ scene })
      .then(() => { options.setStatusMessage(`Copied WebGL code with warnings: ${warnings.join(" ")}`); options.mount(); })
      .catch((error: unknown) => { options.setStatusMessage(`Copy error: ${getErrorMessage(error)}`); options.mount(); });
    return;
  }

  options.onCreateObject(action);
}

function createLoadStatusMessage(warnings: readonly string[]): string {
  return warnings.length === 0 ? "Loaded scene" : `Loaded scene with warnings: ${warnings.join(" ")}`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Clipboard unavailable";
}

function isArrangementAction(action: StudioAction): action is StudioArrangementAction {
  return action === "duplicate" || action.startsWith("align-") || action.startsWith("distribute-") || action === "snap-grid";
}
