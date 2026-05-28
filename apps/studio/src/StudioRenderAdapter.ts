import { BasicMaterial, Camera2D, Circle, Group2D, Line, Rect, Scene, Sprite, Text2D, Texture } from "raw2d";
import type { Object2D } from "raw2d";
import type { StudioImageAssetState } from "./StudioAssets.type";
import type {
  StudioCircleState,
  StudioGroupState,
  StudioLineState,
  StudioMaterialState,
  StudioRectState,
  StudioSceneObject,
  StudioSceneState,
  StudioSpriteState,
  StudioTextState
} from "./StudioSceneState.type";
import type { StudioRuntimeScene } from "./StudioRenderAdapter.type";
import type { StudioRenderAdapterOptions } from "./StudioRenderAdapter.type";

export function createRuntimeSceneFromStudioState(state: StudioSceneState, options: StudioRenderAdapterOptions = {}): StudioRuntimeScene {
  const scene = new Scene({ name: state.name });
  const camera = new Camera2D(state.camera);
  const objects = state.objects.map((object) => createRuntimeObject(object, state, options));

  for (const object of objects) {
    scene.add(object);
  }

  return { scene, camera, objects };
}

function createRuntimeObject(
  object: StudioSceneObject,
  state: StudioSceneState,
  options: StudioRenderAdapterOptions
): Object2D {
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
      return createSprite(object, state, options);
    case "group":
      return createGroup(object, state, options);
  }
}

function createGroup(object: StudioGroupState, state: StudioSceneState, options: StudioRenderAdapterOptions): Group2D {
  const group = new Group2D({
    name: object.name,
    x: object.x,
    y: object.y,
    visible: object.visible ?? true
  });

  for (const child of object.children) {
    group.add(createRuntimeObject(child, state, options));
  }

  return group;
}

function createRect(object: StudioRectState): Rect {
  return new Rect({
    name: object.name,
    x: object.x,
    y: object.y,
    visible: object.visible ?? true,
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
    visible: object.visible ?? true,
    radius: object.radius,
    material: createMaterial(object.material)
  });
}

function createLine(object: StudioLineState): Line {
  return new Line({
    name: object.name,
    x: object.x,
    y: object.y,
    visible: object.visible ?? true,
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
    visible: object.visible ?? true,
    text: object.text,
    font: object.font,
    material: createMaterial(object.material)
  });
}

function createSprite(object: StudioSpriteState, state: StudioSceneState, options: StudioRenderAdapterOptions): Sprite | Rect {
  const asset = (state.assets ?? []).find((candidate) => candidate.id === object.assetSlot && candidate.type === "image");

  if (asset?.src) {
    const source = options.imageFactory?.(asset.src, asset.width, asset.height) ?? createImageSource(asset);

    if (source) {
      return new Sprite({
        name: object.name,
        x: object.x,
        y: object.y,
        visible: object.visible ?? true,
        width: object.width,
        height: object.height,
        texture: new Texture({ id: asset.id, source, width: asset.width, height: asset.height, url: asset.src })
      });
    }
  }

  return createSpritePlaceholder(object);
}

function createSpritePlaceholder(object: StudioSpriteState): Rect {
  return new Rect({
    name: object.name,
    x: object.x,
    y: object.y,
    visible: object.visible ?? true,
    width: object.width,
    height: object.height,
    material: createMaterial(object.material)
  });
}

function createMaterial(material: StudioMaterialState = {}): BasicMaterial {
  return new BasicMaterial(material);
}

function createImageSource(asset: StudioImageAssetState): CanvasImageSource | undefined {
  if (typeof Image === "undefined") {
    return undefined;
  }

  const image = new Image(asset.width, asset.height);
  image.src = asset.src ?? "";
  return image;
}
