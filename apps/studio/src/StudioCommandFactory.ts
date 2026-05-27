import type { StudioCommand, StudioTextContentState, StudioTransformState } from "./StudioCommand.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function createStudioCreateObjectCommand(object: StudioSceneObject, index: number): StudioCommand {
  return { kind: "create-object", object, index };
}

export function createStudioDeleteObjectCommand(scene: StudioSceneState, objectId: string | undefined): StudioCommand | undefined {
  if (!objectId) {
    return undefined;
  }

  const index = scene.objects.findIndex((object) => object.id === objectId);
  const object = scene.objects[index];

  return object ? { kind: "delete-object", objectId, object, index } : undefined;
}

export function createStudioTransformCommand(before: StudioSceneObject, after: StudioSceneObject): StudioCommand | undefined {
  const beforeTransform = getTransformState(before);
  const afterTransform = getTransformState(after);

  return areTransformsEqual(beforeTransform, afterTransform)
    ? undefined
    : { kind: "update-transform", objectId: before.id, before: beforeTransform, after: afterTransform };
}

export function createStudioMaterialCommand(before: StudioSceneObject, after: StudioSceneObject): StudioCommand | undefined {
  return JSON.stringify(before.material) === JSON.stringify(after.material)
    ? undefined
    : { kind: "update-material", objectId: before.id, before: before.material, after: after.material };
}

export function createStudioTextCommand(before: StudioSceneObject, after: StudioSceneObject): StudioCommand | undefined {
  if (before.type !== "text2d" || after.type !== "text2d") {
    return undefined;
  }

  const beforeContent = getTextContent(before);
  const afterContent = getTextContent(after);

  return JSON.stringify(beforeContent) === JSON.stringify(afterContent)
    ? undefined
    : { kind: "update-text", objectId: before.id, before: beforeContent, after: afterContent };
}

export function createStudioVisibilityCommand(before: StudioSceneObject, after: StudioSceneObject): StudioCommand | undefined {
  return before.visible === after.visible
    ? undefined
    : { kind: "set-visibility", objectId: before.id, before: before.visible, after: after.visible };
}

export function createStudioReorderCommand(
  before: StudioSceneState,
  after: StudioSceneState,
  objectId: string
): StudioCommand | undefined {
  const fromIndex = before.objects.findIndex((object) => object.id === objectId);
  const toIndex = after.objects.findIndex((object) => object.id === objectId);

  return fromIndex === -1 || toIndex === -1 || fromIndex === toIndex
    ? undefined
    : { kind: "reorder-object", objectId, fromIndex, toIndex };
}

export function createStudioSpriteAssetCommand(
  scene: StudioSceneState,
  objectId: string | undefined,
  assetId: string | undefined
): StudioCommand | undefined {
  const object = findStudioObject(scene, objectId);

  if (!assetId || object?.type !== "sprite" || object.assetSlot === assetId) {
    return undefined;
  }

  return {
    kind: "update-sprite-asset",
    objectId: object.id,
    beforeAssetSlot: object.assetSlot,
    afterAssetSlot: assetId
  };
}

export function findStudioObject(scene: StudioSceneState, objectId: string | undefined): StudioSceneObject | undefined {
  return objectId ? scene.objects.find((object) => object.id === objectId) : undefined;
}

function getTextContent(object: StudioSceneObject): StudioTextContentState {
  return object.type === "text2d" ? { text: object.text, font: object.font } : {};
}

function getTransformState(object: StudioSceneObject): StudioTransformState {
  if (object.type === "rect" || object.type === "sprite") {
    return { x: object.x, y: object.y, width: object.width, height: object.height };
  }

  if (object.type === "circle") {
    return { x: object.x, y: object.y, radius: object.radius };
  }

  if (object.type === "line") {
    return {
      x: object.x,
      y: object.y,
      startX: object.startX,
      startY: object.startY,
      endX: object.endX,
      endY: object.endY
    };
  }

  if (object.type === "text2d") {
    return { x: object.x, y: object.y, font: object.font };
  }

  return assertNeverObject(object);
}

function areTransformsEqual(before: StudioTransformState, after: StudioTransformState): boolean {
  return JSON.stringify(before) === JSON.stringify(after);
}

function assertNeverObject(object: never): never {
  throw new Error(`Unsupported Studio object transform: ${JSON.stringify(object)}`);
}
