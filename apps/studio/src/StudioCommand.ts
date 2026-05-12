import type {
  ApplyStudioCommandOptions,
  StudioCommand,
  StudioCommandResult,
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
    case "set-visibility":
      return updateObject(scene, command.objectId, (object) => ({ ...object, visible: command.after }));
    case "reorder-object":
      return applyReorderObject(scene, command.objectId, command.toIndex);
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
    case "set-visibility":
      return { ...command, before: command.after, after: command.before };
    case "reorder-object":
      return { ...command, fromIndex: command.toIndex, toIndex: command.fromIndex };
  }
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

  return { ...object, x, y };
}

function clampIndex(index: number, maxIndex: number): number {
  return Math.max(0, Math.min(maxIndex, index));
}
