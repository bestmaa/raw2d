import type {
  ApplyStudioCommandOptions,
  StudioCommand,
  StudioCommandResult,
  StudioTextContentState,
  StudioTransformState
} from "./StudioCommand.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function applyStudioCommand(options: ApplyStudioCommandOptions): StudioCommandResult {
  const { command, scene } = options;

  switch (command.kind) {
    case "create-object":
      return applyCreateObject(scene, command.object, command.index);
    case "delete-object":
      return updateObjects(scene, (objects) => objects.filter((object) => object.id !== command.objectId));
    case "update-transform":
      return updateObject(scene, command.objectId, (object) => updateTransform(object, command.after));
    case "update-material":
      return updateObject(scene, command.objectId, (object) => ({ ...object, material: command.after }));
    case "update-text":
      return updateObject(scene, command.objectId, (object) => updateTextContent(object, command.after));
    case "set-visibility":
      return updateObject(scene, command.objectId, (object) => ({ ...object, visible: command.after }));
    case "reorder-object":
      return applyReorderObject(scene, command.objectId, command.toIndex);
    case "update-sprite-asset":
      return applySpriteAsset(scene, command.objectId, command.afterAssetSlot, command.beforeAssetSlot);
    case "batch":
      return applyBatchCommand(scene, command.commands);
  }
}

export function invertStudioCommand(command: StudioCommand): StudioCommand {
  switch (command.kind) {
    case "create-object":
      return { kind: "delete-object", objectId: command.object.id, object: command.object, index: command.index ?? Number.MAX_SAFE_INTEGER };
    case "delete-object":
      return { kind: "create-object", object: command.object, index: command.index };
    case "update-transform":
      return { ...command, before: command.after, after: command.before };
    case "update-material":
      return { ...command, before: command.after, after: command.before };
    case "update-text":
      return { ...command, before: command.after, after: command.before };
    case "set-visibility":
      return { ...command, before: command.after, after: command.before };
    case "reorder-object":
      return { ...command, fromIndex: command.toIndex, toIndex: command.fromIndex };
    case "update-sprite-asset":
      return { ...command, beforeAssetSlot: command.afterAssetSlot, afterAssetSlot: command.beforeAssetSlot };
    case "batch":
      return { kind: "batch", commands: [...command.commands].reverse().map((child) => invertStudioCommand(child)) };
  }
}

function applyBatchCommand(scene: StudioSceneState, commands: readonly StudioCommand[]): StudioCommandResult {
  if (commands.length === 0) {
    return { scene, handled: false };
  }

  let nextScene = scene;

  for (const command of commands) {
    const result = applyStudioCommand({ scene: nextScene, command });

    if (!result.handled) {
      return { scene, handled: false };
    }

    nextScene = result.scene;
  }

  return { scene: nextScene, handled: true };
}

function applyCreateObject(scene: StudioSceneState, object: StudioSceneObject, index: number | undefined): StudioCommandResult {
  if (scene.objects.some((candidate) => candidate.id === object.id)) {
    return { scene, handled: false };
  }

  const objects = [...scene.objects];
  objects.splice(clampIndex(index ?? objects.length, objects.length), 0, object);

  return { scene: { ...scene, objects }, handled: true };
}

function applyReorderObject(scene: StudioSceneState, objectId: string, toIndex: number): StudioCommandResult {
  const fromIndex = scene.objects.findIndex((object) => object.id === objectId);

  if (fromIndex === -1) {
    return { scene, handled: false };
  }

  const targetIndex = clampIndex(toIndex, scene.objects.length - 1);

  if (fromIndex === targetIndex) {
    return { scene, handled: false };
  }

  const objects = [...scene.objects];
  const [object] = objects.splice(fromIndex, 1);

  if (!object) {
    return { scene, handled: false };
  }

  objects.splice(targetIndex, 0, object);
  return { scene: { ...scene, objects }, handled: true };
}

function updateObject(
  scene: StudioSceneState,
  objectId: string,
  update: (object: StudioSceneObject) => StudioSceneObject
): StudioCommandResult {
  let handled = false;
  const objects = scene.objects.map((object) => {
    if (object.id !== objectId) {
      return object;
    }

    handled = true;
    return update(object);
  });

  return handled ? { scene: { ...scene, objects }, handled } : { scene, handled };
}

function updateObjects(
  scene: StudioSceneState,
  update: (objects: readonly StudioSceneObject[]) => readonly StudioSceneObject[]
): StudioCommandResult {
  const objects = update(scene.objects);
  return objects.length === scene.objects.length ? { scene, handled: false } : { scene: { ...scene, objects }, handled: true };
}

function applySpriteAsset(
  scene: StudioSceneState,
  objectId: string,
  assetSlot: string,
  previousAssetSlot: string
): StudioCommandResult {
  let handled = false;
  const objects = scene.objects.map((object) => {
    if (object.id !== objectId || object.type !== "sprite" || object.assetSlot === assetSlot) {
      return object;
    }

    handled = true;
    return { ...object, assetSlot };
  });

  if (!handled) {
    return { scene, handled: false };
  }

  return { scene: { ...scene, objects, assets: updateAssetReferences(scene, objectId, previousAssetSlot, assetSlot) }, handled: true };
}

function updateAssetReferences(
  scene: StudioSceneState,
  objectId: string,
  previousAssetSlot: string,
  assetSlot: string
): StudioSceneState["assets"] {
  return scene.assets.map((asset) => {
    if (asset.id === previousAssetSlot) {
      return { ...asset, objectIds: asset.objectIds.filter((id) => id !== objectId) };
    }

    if (asset.id === assetSlot && !asset.objectIds.includes(objectId)) {
      return { ...asset, objectIds: [...asset.objectIds, objectId] };
    }

    return asset;
  });
}

function updateTransform(object: StudioSceneObject, transform: StudioTransformState): StudioSceneObject {
  const x = transform.x ?? object.x;
  const y = transform.y ?? object.y;

  if (object.type === "rect") {
    return { ...object, x, y, width: transform.width ?? object.width, height: transform.height ?? object.height };
  }

  if (object.type === "sprite") {
    return { ...object, x, y, width: transform.width ?? object.width, height: transform.height ?? object.height };
  }

  if (object.type === "circle") {
    return { ...object, x, y, radius: transform.radius ?? object.radius };
  }

  if (object.type === "line") {
    return {
      ...object,
      x,
      y,
      startX: transform.startX ?? object.startX,
      startY: transform.startY ?? object.startY,
      endX: transform.endX ?? object.endX,
      endY: transform.endY ?? object.endY
    };
  }

  if (object.type === "text2d") {
    return { ...object, x, y, font: transform.font };
  }

  return assertNeverObject(object);
}

function updateTextContent(object: StudioSceneObject, content: StudioTextContentState): StudioSceneObject {
  return object.type === "text2d" ? { ...object, text: content.text ?? object.text, font: content.font } : object;
}

function clampIndex(index: number, maxIndex: number): number {
  return Math.max(0, Math.min(maxIndex, index));
}

function assertNeverObject(object: never): never {
  throw new Error(`Unsupported Studio object transform: ${JSON.stringify(object)}`);
}
