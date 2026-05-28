import type { StudioSceneGraphEntry, StudioSceneGraphOffset } from "./StudioSceneGraph.type";
import type { StudioGroupState, StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function flattenStudioSceneObjects(scene: StudioSceneState): readonly StudioSceneGraphEntry[] {
  return flattenObjects(scene.objects, 0, undefined, { x: 0, y: 0 });
}

export function findStudioSceneObject(scene: StudioSceneState, objectId: string | undefined): StudioSceneGraphEntry | undefined {
  return objectId ? flattenStudioSceneObjects(scene).find((entry) => entry.object.id === objectId) : undefined;
}

export function mapStudioSceneObjects(
  objects: readonly StudioSceneObject[],
  update: (object: StudioSceneObject) => StudioSceneObject
): readonly StudioSceneObject[] {
  return objects.map((object) => {
    const next = object.type === "group" ? { ...object, children: mapStudioSceneObjects(object.children, update) } : object;
    return update(next);
  });
}

export function insertStudioSceneObject(
  scene: StudioSceneState,
  object: StudioSceneObject,
  index: number,
  parentId: string | undefined
): StudioSceneState | undefined {
  if (!parentId) {
    const objects = [...scene.objects];
    objects.splice(clampIndex(index, objects.length), 0, object);
    return { ...scene, objects };
  }

  let handled = false;
  const objects = mapStudioSceneObjects(scene.objects, (candidate) => {
    if (candidate.id !== parentId || candidate.type !== "group") {
      return candidate;
    }

    const children = [...candidate.children];
    children.splice(clampIndex(index, children.length), 0, object);
    handled = true;
    return { ...candidate, children };
  });

  return handled ? { ...scene, objects } : undefined;
}

export function removeStudioSceneObject(scene: StudioSceneState, objectId: string): StudioSceneState | undefined {
  const result = removeObject(scene.objects, objectId);
  return result.removed ? { ...scene, objects: result.objects } : undefined;
}

function flattenObjects(
  objects: readonly StudioSceneObject[],
  depth: number,
  parentId: string | undefined,
  offset: StudioSceneGraphOffset
): readonly StudioSceneGraphEntry[] {
  return objects.flatMap((object, index) => {
    const entry = {
      object,
      index,
      depth,
      parentId,
      worldX: offset.x + object.x,
      worldY: offset.y + object.y
    };
    const childOffset = { x: entry.worldX, y: entry.worldY };
    const children = object.type === "group" ? flattenObjects(object.children, depth + 1, object.id, childOffset) : [];
    return [entry, ...children];
  });
}

function removeObject(objects: readonly StudioSceneObject[], objectId: string): {
  readonly objects: readonly StudioSceneObject[];
  readonly removed: boolean;
} {
  let removed = false;
  const nextObjects: StudioSceneObject[] = [];

  for (const object of objects) {
    if (object.id === objectId) {
      removed = true;
      continue;
    }

    if (object.type === "group") {
      const childResult = removeObject(object.children, objectId);
      removed = removed || childResult.removed;
      nextObjects.push({ ...object, children: childResult.objects } satisfies StudioGroupState);
      continue;
    }

    nextObjects.push(object);
  }

  return { objects: nextObjects, removed };
}

function clampIndex(index: number, maxIndex: number): number {
  return Math.max(0, Math.min(maxIndex, index));
}
