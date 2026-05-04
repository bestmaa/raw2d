import type { StudioObjectFactoryOptions } from "./StudioObjectFactory.type";
import type { StudioCircleState, StudioRectState, StudioSceneState } from "./StudioSceneState.type";

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

export function addStudioCircleObject(options: StudioObjectFactoryOptions): StudioSceneState {
  const circleCount = options.scene.objects.filter((object) => object.type === "circle").length;
  const circleIndex = circleCount + 1;
  const offset = circleCount * 24;
  const circle: StudioCircleState = {
    id: `circle-${circleIndex}`,
    type: "circle",
    name: `Circle ${circleIndex}`,
    x: 220 + offset,
    y: 180 + offset,
    radius: 56,
    material: {
      fillColor: "#f472b6",
      strokeColor: "#ffe4f1",
      lineWidth: 2
    }
  };

  return {
    ...options.scene,
    objects: [...options.scene.objects, circle]
  };
}
