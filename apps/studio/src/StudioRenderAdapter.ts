import { BasicMaterial, Camera2D, Circle, Line, Rect, Scene, Text2D } from "raw2d";
import type { Object2D } from "raw2d";
import type {
  StudioCircleState,
  StudioLineState,
  StudioMaterialState,
  StudioRectState,
  StudioSceneObject,
  StudioSceneState,
  StudioSpriteState,
  StudioTextState
} from "./StudioSceneState.type";
import type { StudioRuntimeScene } from "./StudioRenderAdapter.type";

export function createRuntimeSceneFromStudioState(state: StudioSceneState): StudioRuntimeScene {
  const scene = new Scene({ name: state.name });
  const camera = new Camera2D(state.camera);
  const objects = state.objects.map(createRuntimeObject);

  for (const object of objects) {
    scene.add(object);
  }

  return { scene, camera, objects };
}

function createRuntimeObject(object: StudioSceneObject): Object2D {
  switch (object.type) {
    case "rect":
      return createRect(object);
    case "circle":
      return createCircle(object);
    case "line":
      return createLine(object);
    case "text2d":
      return createText(object);
    case "sprite":
      return createSpritePlaceholder(object);
  }
}

function createRect(object: StudioRectState): Rect {
  return new Rect({
    name: object.name,
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    material: createMaterial(object.material)
  });
}

function createCircle(object: StudioCircleState): Circle {
  return new Circle({
    name: object.name,
    x: object.x,
    y: object.y,
    radius: object.radius,
    material: createMaterial(object.material)
  });
}

function createLine(object: StudioLineState): Line {
  return new Line({
    name: object.name,
    x: object.x,
    y: object.y,
    startX: object.startX,
    startY: object.startY,
    endX: object.endX,
    endY: object.endY,
    material: createMaterial(object.material)
  });
}

function createText(object: StudioTextState): Text2D {
  return new Text2D({
    name: object.name,
    x: object.x,
    y: object.y,
    text: object.text,
    font: object.font,
    material: createMaterial(object.material)
  });
}

function createSpritePlaceholder(object: StudioSpriteState): Rect {
  return new Rect({
    name: object.name,
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    material: createMaterial(object.material)
  });
}

function createMaterial(material: StudioMaterialState = {}): BasicMaterial {
  return new BasicMaterial(material);
}
