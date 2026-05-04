import type { StudioObjectFactoryOptions } from "./StudioObjectFactory.type";
import type { StudioRectState, StudioSceneState } from "./StudioSceneState.type";

export function addStudioRectObject(options: StudioObjectFactoryOptions): StudioSceneState {
  const rectCount = options.scene.objects.filter((object) => object.type === "rect").length;
  const rectIndex = rectCount + 1;
  const offset = rectCount * 24;
  const rect: StudioRectState = {
    id: `rect-${rectIndex}`,
    type: "rect",
    name: `Rect ${rectIndex}`,
    x: 120 + offset,
    y: 120 + offset,
    width: 160,
    height: 96,
    material: {
      fillColor: "#35c2ff",
      strokeColor: "#dff5ff",
      lineWidth: 2
    }
  };

  return {
    ...options.scene,
    objects: [...options.scene.objects, rect]
  };
}
