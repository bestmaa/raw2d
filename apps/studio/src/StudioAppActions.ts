import { bindStudioActions, createStudioActionObject } from "./StudioActions";
import type { StudioAction } from "./StudioActions.type";
import type { StudioAppActionBindingOptions } from "./StudioAppActions.type";
import { bindStudioSceneLoadInput, clickStudioSceneLoadInput } from "./StudioLoadBindings";
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

  const scene = createStudioActionObject(options.getScene(), action);
  options.setScene(scene);
  options.setSelectedObjectId(scene.objects.at(-1)?.id);
  options.mount();
}
