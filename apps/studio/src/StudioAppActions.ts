import { bindStudioActions, createStudioActionObject } from "./StudioActions";
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
    onSceneLoaded: (scene) => {
      options.setScene(scene);
      options.setRendererMode(scene.rendererMode);
      options.setSelectedObjectId(undefined);
      options.setStatusMessage("Loaded scene");
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
    options.setStatusMessage("Loaded sample scene");
    options.mount();
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

  const scene = createStudioActionObject(options.getScene(), action);
  options.setScene(scene);
  options.setSelectedObjectId(scene.objects.at(-1)?.id);
  options.setStatusMessage("Scene updated");
  options.mount();
}
