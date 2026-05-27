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
  const undoButton = options.root.querySelector<HTMLButtonElement>('[data-action="undo"]');
  const redoButton = options.root.querySelector<HTMLButtonElement>('[data-action="redo"]');
  const saveButton = options.root.querySelector<HTMLButtonElement>('[data-action="save-scene"]');
  const loadButton = options.root.querySelector<HTMLButtonElement>('[data-action="load-scene"]');
  const exportButton = options.root.querySelector<HTMLButtonElement>('[data-action="export-png"]');
  const copyCanvasButton = options.root.querySelector<HTMLButtonElement>('[data-action="copy-canvas-code"]');
  const copyWebGLButton = options.root.querySelector<HTMLButtonElement>('[data-action="copy-webgl-code"]');

  sampleButton?.addEventListener("click", () => {
    options.onAction("sample-scene");
  });

  undoButton?.addEventListener("click", () => {
    options.onAction("undo");
  });

  redoButton?.addEventListener("click", () => {
    options.onAction("redo");
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

  copyCanvasButton?.addEventListener("click", () => {
    options.onAction("copy-canvas-code");
  });

  copyWebGLButton?.addEventListener("click", () => {
    options.onAction("copy-webgl-code");
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
    case "undo":
    case "redo":
    case "save-scene":
    case "load-scene":
    case "export-png":
    case "copy-canvas-code":
    case "copy-webgl-code":
      return scene;
  }
}
