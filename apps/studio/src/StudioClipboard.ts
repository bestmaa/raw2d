import type { StudioAssetState } from "./StudioAssets.type";
import type { StudioClipboardPasteResult, StudioClipboardPayload } from "./StudioClipboard.type";
import { parseStudioClipboardPayload } from "./StudioClipboardSchema";
import { flattenStudioSceneObjects } from "./StudioSceneGraph";
import type { StudioSceneObject, StudioSceneState, StudioSpriteState } from "./StudioSceneState.type";
import { normalizeStudioSelection } from "./StudioSelection";

const clipboardFormat = "raw2d-studio-clipboard";
const pasteOffset = 16;

export function serializeStudioClipboard(scene: StudioSceneState, selectedObjectIds: readonly string[]): string | undefined {
  const objects = createClipboardObjects(scene, selectedObjectIds);
  if (objects.length === 0) return undefined;

  const spriteIds = new Set(flattenObjects(objects).filter(isSpriteWithAsset).map((object) => object.id));
  const assets = scene.assets
    .map((asset) => ({ ...asset, objectIds: asset.objectIds.filter((id) => spriteIds.has(id)) }))
    .filter((asset) => asset.objectIds.length > 0);
  return `${JSON.stringify({ format: clipboardFormat, version: 1, objects, assets } satisfies StudioClipboardPayload, null, 2)}\n`;
}

export function pasteStudioClipboard(scene: StudioSceneState, text: string): StudioClipboardPasteResult | undefined {
  const payload = parseStudioClipboardPayload(text);
  if (!payload || payload.objects.length === 0) return undefined;

  const ids = new Set(flattenStudioSceneObjects(scene).map((entry) => entry.object.id));
  const idMap = new Map<string, string>();
  const assetMap = createAssetIdMap(scene.assets, payload.assets);
  const objects = payload.objects.map((object) => moveObject(remapSpriteAssets(cloneObject(object, ids, idMap), assetMap), pasteOffset, pasteOffset));
  const assets = mergeClipboardAssets(scene.assets, payload.assets, objects, assetMap);
  return { scene: { ...scene, objects: [...scene.objects, ...objects], assets }, selectedObjectIds: objects.map((object) => object.id) };
}

function createClipboardObjects(scene: StudioSceneState, selectedObjectIds: readonly string[]): readonly StudioSceneObject[] {
  const selection = normalizeStudioSelection({ scene, selectedObjectIds });
  return flattenStudioSceneObjects(scene)
    .filter((entry) => selection.includes(entry.object.id))
    .map((entry) => ({ ...entry.object, x: entry.worldX, y: entry.worldY }));
}

function cloneObject(object: StudioSceneObject, ids: Set<string>, idMap: Map<string, string>): StudioSceneObject {
  const id = createPasteId(object.id, ids);
  idMap.set(object.id, id);
  return object.type === "group"
    ? { ...object, id, name: `${object.name} Paste`, children: object.children.map((child) => cloneObject(child, ids, idMap)) }
    : { ...object, id, name: `${object.name} Paste` };
}

function createPasteId(baseId: string, ids: Set<string>): string {
  let index = 1;
  let id = `${baseId}-paste`;
  while (ids.has(id)) {
    index += 1;
    id = `${baseId}-paste-${index}`;
  }
  ids.add(id);
  return id;
}

function mergeClipboardAssets(
  currentAssets: readonly StudioAssetState[],
  payloadAssets: readonly StudioAssetState[],
  objects: readonly StudioSceneObject[],
  assetMap: ReadonlyMap<string, string>
): readonly StudioAssetState[] {
  const refs = collectSpriteRefs(objects);
  const assets = currentAssets.map((asset) => refs.has(asset.id) ? { ...asset, objectIds: [...asset.objectIds, ...refs.get(asset.id)!] } : asset);
  const existingIds = new Set(assets.map((asset) => asset.id));
  return [
    ...assets,
    ...payloadAssets
      .map((asset) => ({ ...asset, id: assetMap.get(asset.id) ?? asset.id }))
      .filter((asset) => !existingIds.has(asset.id))
      .map((asset) => ({ ...asset, objectIds: refs.get(asset.id) ?? [], src: undefined }))
      .filter((asset) => asset.objectIds.length > 0)
  ];
}

function createAssetIdMap(currentAssets: readonly StudioAssetState[], payloadAssets: readonly StudioAssetState[]): ReadonlyMap<string, string> {
  const ids = new Set(currentAssets.map((asset) => asset.id));
  return new Map(payloadAssets.map((asset) => {
    const current = currentAssets.find((candidate) => candidate.id === asset.id);
    return [asset.id, current && areAssetMetadataEqual(current, asset) ? asset.id : createAssetPasteId(asset.id, ids)];
  }));
}

function areAssetMetadataEqual(left: StudioAssetState, right: StudioAssetState): boolean {
  return left.name === right.name && left.width === right.width && left.height === right.height && left.mimeType === right.mimeType;
}

function createAssetPasteId(assetId: string, ids: Set<string>): string {
  if (!ids.has(assetId)) {
    ids.add(assetId);
    return assetId;
  }
  let index = 1;
  let id = `${assetId}-paste`;
  while (ids.has(id)) {
    index += 1;
    id = `${assetId}-paste-${index}`;
  }
  ids.add(id);
  return id;
}

function remapSpriteAssets<ObjectType extends StudioSceneObject>(object: ObjectType, assetMap: ReadonlyMap<string, string>): ObjectType {
  if (object.type === "sprite") return { ...object, assetSlot: assetMap.get(object.assetSlot) ?? object.assetSlot };
  if (object.type === "group") return { ...object, children: object.children.map((child) => remapSpriteAssets(child, assetMap)) };
  return object;
}

function collectSpriteRefs(objects: readonly StudioSceneObject[]): ReadonlyMap<string, readonly string[]> {
  const refs = new Map<string, string[]>();
  for (const object of flattenObjects(objects)) {
    if (isSpriteWithAsset(object)) refs.set(object.assetSlot, [...(refs.get(object.assetSlot) ?? []), object.id]);
  }
  return refs;
}

function flattenObjects(objects: readonly StudioSceneObject[]): readonly StudioSceneObject[] {
  return objects.flatMap((object) => object.type === "group" ? [object, ...flattenObjects(object.children)] : [object]);
}

function isSpriteWithAsset(object: StudioSceneObject): object is StudioSpriteState {
  return object.type === "sprite" && object.assetSlot !== "empty";
}

function moveObject<ObjectType extends StudioSceneObject>(object: ObjectType, x: number, y: number): ObjectType {
  return { ...object, x: object.x + x, y: object.y + y };
}
