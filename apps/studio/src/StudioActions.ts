import type { StudioAction, StudioActionBindingOptions } from "./StudioActions.type";
import {
  addStudioCircleObject,
  addStudioLineObject,
  addStudioRectObject,
  addStudioSpriteObject,
  addStudioTextObject
} from "./StudioObjectFactory";
import type { StudioSceneState } from "./StudioSceneState.type";

const toolActions: readonly StudioAction[] = ["rect", "circle", "line", "text", "sprite"];

export function bindStudioActions(options: StudioActionBindingOptions): void {
  const sampleButton = options.root.querySelector<HTMLButtonElement>('[data-action="sample-scene"]');
  const saveButton = options.root.querySelector<HTMLButtonElement>('[data-action="save-scene"]');
  const loadButton = options.root.querySelector<HTMLButtonElement>('[data-action="load-scene"]');
  const exportButton = options.root.querySelector<HTMLButtonElement>('[data-action="export-png"]');

  sampleButton?.addEventListener("click", () => {
    options.onAction("sample-scene");
  });

  saveButton?.addEventListener("click", () => {
    options.onAction("save-scene");
  });

  loadButton?.addEventListener("click", () => {
    options.onAction("load-scene");
  });

  exportButton?.addEventListener("click", () => {
    options.onAction("export-png");
  });

  for (const action of toolActions) {
    const button = options.root.querySelector<HTMLButtonElement>(`[data-tool="${action}"]`);
    button?.addEventListener("click", () => {
      options.onAction(action);
    });
  }
}

export function createStudioActionObject(scene: StudioSceneState, action: StudioAction): StudioSceneState {
  switch (action) {
    case "rect":
      return addStudioRectObject({ scene });
    case "circle":
      return addStudioCircleObject({ scene });
    case "line":
      return addStudioLineObject({ scene });
    case "text":
      return addStudioTextObject({ scene });
    case "sprite":
      return addStudioSpriteObject({ scene });
    case "sample-scene":
    case "save-scene":
    case "load-scene":
    case "export-png":
      return scene;
  }
}
