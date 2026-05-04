import type { StudioSceneState } from "./StudioSceneState.type";

export function createStudioSceneState(): StudioSceneState {
  return {
    version: 1,
    name: "Untitled Scene",
    rendererMode: "canvas",
    camera: {
      x: 0,
      y: 0,
      zoom: 1
    },
    objects: []
  };
}
