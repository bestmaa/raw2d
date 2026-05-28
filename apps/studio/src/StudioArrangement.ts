import { getStudioObjectBounds } from "./StudioObjectBounds";
import { flattenStudioSceneObjects, mapStudioSceneObjects } from "./StudioSceneGraph";
import { normalizeStudioSelection } from "./StudioSelection";
import type { StudioArrangementBounds, StudioArrangementEntry, StudioArrangementResult } from "./StudioArrangement.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

const duplicateOffset = 16;
const snapGridSize = 10;

export function duplicateStudioSelection(scene: StudioSceneState, selectedObjectIds: readonly string[]): StudioArrangementResult | undefined {
  const selection = normalizeStudioSelection({ scene, selectedObjectIds });
  if (selection.length === 0) return undefined;

  const ids = new Set(flattenStudioSceneObjects(scene).map((entry) => entry.object.id));
  const result = duplicateObjects(scene.objects, new Set(selection), ids);
  const assets = addDuplicateAssetReferences(scene, result.duplicates);
  return { scene: { ...scene, objects: result.objects, assets }, selectedObjectIds: result.duplicatedIds };
}

export function alignStudioSelection(scene: StudioSceneState, selectedObjectIds: readonly string[], alignment: string): StudioSceneState | undefined {
  const entries = getArrangementEntries(scene, selectedObjectIds, 2);
  if (!entries) return undefined;

  const bounds = getOuterBounds(entries.map((entry) => entry.bounds));
  return moveByEntries(scene, entries, (entry) => getAlignmentDelta(entry.bounds, bounds, alignment));
}

export function distributeStudioSelection(scene: StudioSceneState, selectedObjectIds: readonly string[], axis: "horizontal" | "vertical"): StudioSceneState | undefined {
  const entries = getArrangementEntries(scene, selectedObjectIds, 3);
  if (!entries) return undefined;

  const sorted = [...entries].sort((a, b) => getCenter(a.bounds, axis) - getCenter(b.bounds, axis));
  const first = getCenter(sorted[0].bounds, axis);
  const last = getCenter(sorted[sorted.length - 1].bounds, axis);
  const step = (last - first) / (sorted.length - 1);
  return moveByEntries(scene, sorted, (entry, index) => getAxisDelta(axis, first + step * index - getCenter(entry.bounds, axis)));
}

export function snapStudioSelection(scene: StudioSceneState, selectedObjectIds: readonly string[]): StudioSceneState | undefined {
  const selection = normalizeStudioSelection({ scene, selectedObjectIds });
  if (selection.length === 0) return undefined;

  const entries = flattenStudioSceneObjects(scene).filter((entry) => selection.includes(entry.object.id));
  return moveByEntries(scene, entries, (entry) => ({
    x: Math.round(entry.worldX / snapGridSize) * snapGridSize - entry.worldX,
    y: Math.round(entry.worldY / snapGridSize) * snapGridSize - entry.worldY
  }));
}

function duplicateObjects(
  objects: readonly StudioSceneObject[],
  selected: ReadonlySet<string>,
  ids: Set<string>
): { readonly objects: readonly StudioSceneObject[]; readonly duplicates: readonly StudioSceneObject[]; readonly duplicatedIds: readonly string[] } {
  const nextObjects: StudioSceneObject[] = [];
  const duplicates: StudioSceneObject[] = [];
  const duplicatedIds: string[] = [];

  for (const object of objects) {
    const childResult = object.type === "group" ? duplicateObjects(object.children, selected, ids) : undefined;
    const nextObject = childResult ? { ...object, children: childResult.objects } : object;
    nextObjects.push(nextObject);
    duplicates.push(...(childResult?.duplicates ?? []));
    duplicatedIds.push(...(childResult?.duplicatedIds ?? []));

    if (!selected.has(object.id)) continue;

    const duplicate = moveObject(cloneObject(object, ids), duplicateOffset, duplicateOffset);
    nextObjects.push(duplicate);
    duplicates.push(duplicate);
    duplicatedIds.push(duplicate.id);
  }

  return { objects: nextObjects, duplicates, duplicatedIds };
}

function cloneObject(object: StudioSceneObject, ids: Set<string>): StudioSceneObject {
  const id = createDuplicateId(object.id, ids);
  return object.type === "group"
    ? { ...object, id, name: `${object.name} Copy`, children: object.children.map((child) => cloneObject(child, ids)) }
    : { ...object, id, name: `${object.name} Copy` };
}

function createDuplicateId(baseId: string, ids: Set<string>): string {
  let index = 1;
  let id = `${baseId}-copy`;
  while (ids.has(id)) {
    index += 1;
    id = `${baseId}-copy-${index}`;
  }
  ids.add(id);
  return id;
}

function addDuplicateAssetReferences(scene: StudioSceneState, duplicates: readonly StudioSceneObject[]): StudioSceneState["assets"] {
  const refs = collectSpriteAssetRefs(duplicates);
  return scene.assets.map((asset) => {
    const objectIds = refs.get(asset.id) ?? [];
    return objectIds.length > 0 ? { ...asset, objectIds: [...asset.objectIds, ...objectIds] } : asset;
  });
}

function collectSpriteAssetRefs(objects: readonly StudioSceneObject[]): ReadonlyMap<string, readonly string[]> {
  const refs = new Map<string, string[]>();
  for (const object of flattenObjects(objects)) {
    if (object.type === "sprite" && object.assetSlot !== "empty") {
      refs.set(object.assetSlot, [...(refs.get(object.assetSlot) ?? []), object.id]);
    }
  }
  return refs;
}

function flattenObjects(objects: readonly StudioSceneObject[]): readonly StudioSceneObject[] {
  return objects.flatMap((object) => object.type === "group" ? [object, ...flattenObjects(object.children)] : [object]);
}

function getArrangementEntries(scene: StudioSceneState, selectedObjectIds: readonly string[], minimumCount: number): readonly StudioArrangementEntry[] | undefined {
  const selection = normalizeStudioSelection({ scene, selectedObjectIds });
  if (selection.length < minimumCount) return undefined;

  return flattenStudioSceneObjects(scene)
    .filter((entry) => selection.includes(entry.object.id))
    .map((entry) => ({ object: entry.object, bounds: getWorldBounds(entry) }));
}

function getWorldBounds(entry: ReturnType<typeof flattenStudioSceneObjects>[number]): StudioArrangementBounds {
  const local = getStudioObjectBounds(entry.object);
  return { ...local, x: local.x + entry.worldX - entry.object.x, y: local.y + entry.worldY - entry.object.y };
}

function getOuterBounds(bounds: readonly StudioArrangementBounds[]): StudioArrangementBounds {
  const minX = Math.min(...bounds.map((bound) => bound.x));
  const minY = Math.min(...bounds.map((bound) => bound.y));
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function moveByEntries<Entry extends { readonly object: StudioSceneObject }>(
  scene: StudioSceneState,
  entries: readonly Entry[],
  delta: (entry: Entry, index: number) => { readonly x: number; readonly y: number }
): StudioSceneState {
  const moves = new Map(entries.map((entry, index) => [entry.object.id, delta(entry, index)]));
  return { ...scene, objects: mapStudioSceneObjects(scene.objects, (object) => moveObject(object, moves.get(object.id)?.x ?? 0, moves.get(object.id)?.y ?? 0)) };
}

function getAlignmentDelta(bounds: StudioArrangementBounds, outer: StudioArrangementBounds, alignment: string): { readonly x: number; readonly y: number } {
  if (alignment === "align-left") return { x: outer.x - bounds.x, y: 0 };
  if (alignment === "align-center") return { x: outer.x + outer.width / 2 - (bounds.x + bounds.width / 2), y: 0 };
  if (alignment === "align-right") return { x: outer.x + outer.width - (bounds.x + bounds.width), y: 0 };
  if (alignment === "align-top") return { x: 0, y: outer.y - bounds.y };
  if (alignment === "align-middle") return { x: 0, y: outer.y + outer.height / 2 - (bounds.y + bounds.height / 2) };
  return { x: 0, y: outer.y + outer.height - (bounds.y + bounds.height) };
}

function getAxisDelta(axis: "horizontal" | "vertical", delta: number): { readonly x: number; readonly y: number } {
  return axis === "horizontal" ? { x: delta, y: 0 } : { x: 0, y: delta };
}

function getCenter(bounds: StudioArrangementBounds, axis: "horizontal" | "vertical"): number {
  return axis === "horizontal" ? bounds.x + bounds.width / 2 : bounds.y + bounds.height / 2;
}

function moveObject<ObjectType extends StudioSceneObject>(object: ObjectType, x: number, y: number): ObjectType {
  return { ...object, x: object.x + x, y: object.y + y };
}
