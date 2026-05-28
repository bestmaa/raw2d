import { getStudioObjectBounds } from "./StudioObjectBounds";
import { flattenStudioSceneObjects } from "./StudioSceneGraph";
import type { StudioGroupObjectsResult, StudioUngroupObjectResult } from "./StudioGrouping.type";
import type { StudioGroupState, StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function groupStudioObjects(scene: StudioSceneState, selectedObjectIds: readonly string[]): StudioGroupObjectsResult | undefined {
  const selected = scene.objects
    .map((object, index) => ({ object, index }))
    .filter((entry) => selectedObjectIds.includes(entry.object.id));

  if (selected.length < 2) {
    return undefined;
  }

  const groupBounds = getGroupBounds(selected.map((entry) => entry.object));
  const groupId = createNextGroupId(scene);
  const group: StudioGroupState = {
    id: groupId,
    type: "group",
    name: `Group ${getGroupCount(scene) + 1}`,
    x: groupBounds.x,
    y: groupBounds.y,
    children: selected.map((entry) => moveObject(entry.object, -groupBounds.x, -groupBounds.y))
  };
  const selectedIds = new Set(selected.map((entry) => entry.object.id));
  const objects = scene.objects.filter((object) => !selectedIds.has(object.id));
  objects.splice(selected[0]?.index ?? 0, 0, group);

  return { scene: { ...scene, objects }, groupId };
}

export function ungroupStudioObject(scene: StudioSceneState, objectId: string | undefined): StudioUngroupObjectResult | undefined {
  if (!objectId) {
    return undefined;
  }

  const result = ungroupObjects(scene.objects, objectId);
  return result.ungrouped ? { scene: { ...scene, objects: result.objects }, childIds: result.childIds } : undefined;
}

function getGroupBounds(objects: readonly StudioSceneObject[]): { readonly x: number; readonly y: number } {
  const bounds = objects.map(getStudioObjectBounds);
  return {
    x: Math.min(...bounds.map((bound) => bound.x)),
    y: Math.min(...bounds.map((bound) => bound.y))
  };
}

function moveObject<ObjectType extends StudioSceneObject>(object: ObjectType, x: number, y: number): ObjectType {
  return { ...object, x: object.x + x, y: object.y + y };
}

function createNextGroupId(scene: StudioSceneState): string {
  let index = getGroupCount(scene) + 1;

  while (flattenStudioSceneObjects(scene).some((entry) => entry.object.id === `group-${index}`)) {
    index += 1;
  }

  return `group-${index}`;
}

function getGroupCount(scene: StudioSceneState): number {
  return flattenStudioSceneObjects(scene).filter((entry) => entry.object.type === "group").length;
}

function ungroupObjects(objects: readonly StudioSceneObject[], objectId: string): {
  readonly objects: readonly StudioSceneObject[];
  readonly childIds: readonly string[];
  readonly ungrouped: boolean;
} {
  let childIds: readonly string[] = [];
  let ungrouped = false;
  const nextObjects: StudioSceneObject[] = [];

  for (const object of objects) {
    if (object.id === objectId && object.type === "group") {
      const children = object.children.map((child) => moveObject(child, object.x, object.y));
      nextObjects.push(...children);
      childIds = children.map((child) => child.id);
      ungrouped = true;
      continue;
    }

    if (!ungrouped && object.type === "group") {
      const childResult = ungroupObjects(object.children, objectId);
      if (childResult.ungrouped) {
        nextObjects.push({ ...object, children: childResult.objects });
        childIds = childResult.childIds;
        ungrouped = true;
        continue;
      }
    }

    nextObjects.push(object);
  }

  return { objects: nextObjects, childIds, ungrouped };
}
