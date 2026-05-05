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

  sampleButton?.addEventListener("click", () => {
    options.onAction("sample-scene");
  });

  saveButton?.addEventListener("click", () => {
    options.onAction("save-scene");
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
      return scene;
  }
}
