import type { StudioObjectFactoryOptions } from "./StudioObjectFactory.type";
import type {
  StudioCircleState,
  StudioLineState,
  StudioRectState,
  StudioSceneState,
  StudioTextState
} from "./StudioSceneState.type";

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

export function addStudioLineObject(options: StudioObjectFactoryOptions): StudioSceneState {
  const lineCount = options.scene.objects.filter((object) => object.type === "line").length;
  const lineIndex = lineCount + 1;
  const offset = lineCount * 24;
  const line: StudioLineState = {
    id: `line-${lineIndex}`,
    type: "line",
    name: `Line ${lineIndex}`,
    x: 120 + offset,
    y: 300 + offset,
    startX: 0,
    startY: 0,
    endX: 240,
    endY: 0,
    material: {
      strokeColor: "#facc15",
      lineWidth: 5
    }
  };

  return {
    ...options.scene,
    objects: [...options.scene.objects, line]
  };
}

export function addStudioTextObject(options: StudioObjectFactoryOptions): StudioSceneState {
  const textCount = options.scene.objects.filter((object) => object.type === "text2d").length;
  const textIndex = textCount + 1;
  const offset = textCount * 24;
  const text: StudioTextState = {
    id: `text-${textIndex}`,
    type: "text2d",
    name: `Text ${textIndex}`,
    x: 160 + offset,
    y: 220 + offset,
    text: "Raw2D Text",
    font: "32px sans-serif",
    material: {
      fillColor: "#f8fafc"
    }
  };

  return {
    ...options.scene,
    objects: [...options.scene.objects, text]
  };
}
