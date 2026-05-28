import type { StudioAssetState } from "./StudioAssets.type";
import type { StudioClipboardPayload } from "./StudioClipboard.type";
import type { StudioGroupState, StudioSceneObject } from "./StudioSceneState.type";

export function parseStudioClipboardPayload(text: string): StudioClipboardPayload | undefined {
  try {
    const value = JSON.parse(text) as unknown;
    const record = asRecord(value);
    if (record?.format !== "raw2d-studio-clipboard" || record.version !== 1) return undefined;
    if (!Array.isArray(record.objects) || !Array.isArray(record.assets)) return undefined;
    const objects = record.objects.map(parseObject);
    const assets = record.assets.map(parseAsset);
    return areObjects(objects) && areAssets(assets)
      ? { format: "raw2d-studio-clipboard", version: 1, objects, assets }
      : undefined;
  } catch {
    return undefined;
  }
}

function parseObject(value: unknown): StudioSceneObject | undefined {
  const object = asRecord(value);
  const base = parseBase(object);
  if (!object || !base) return undefined;

  if (base.type === "rect") return positive(object.width) && positive(object.height) ? { ...base, type: "rect", width: object.width, height: object.height } : undefined;
  if (base.type === "circle") return positive(object.radius) ? { ...base, type: "circle", radius: object.radius } : undefined;
  if (base.type === "line") return number(object.startX) && number(object.startY) && number(object.endX) && number(object.endY)
    ? { ...base, type: "line", startX: object.startX, startY: object.startY, endX: object.endX, endY: object.endY }
    : undefined;
  if (base.type === "text2d") return typeof object.text === "string" ? { ...base, type: "text2d", text: object.text, font: stringOrUndefined(object.font) } : undefined;
  if (base.type === "sprite") return positive(object.width) && positive(object.height) && typeof object.assetSlot === "string"
    ? { ...base, type: "sprite", width: object.width, height: object.height, assetSlot: object.assetSlot }
    : undefined;
  if (base.type === "group" && Array.isArray(object.children)) {
    const children = object.children.map(parseObject);
    return areObjects(children) ? ({ ...base, type: "group", children } satisfies StudioGroupState) : undefined;
  }
  return undefined;
}

function parseBase(object: Record<string, unknown> | undefined): Pick<StudioSceneObject, "id" | "type" | "name" | "x" | "y" | "visible" | "material"> | undefined {
  if (!object || typeof object.id !== "string" || typeof object.name !== "string" || typeof object.type !== "string") return undefined;
  if (!number(object.x) || !number(object.y)) return undefined;
  if (!["rect", "circle", "line", "text2d", "sprite", "group"].includes(object.type)) return undefined;
  return {
    id: object.id,
    type: object.type as StudioSceneObject["type"],
    name: object.name,
    x: object.x,
    y: object.y,
    visible: typeof object.visible === "boolean" ? object.visible : undefined,
    material: asRecord(object.material)
  };
}

function parseAsset(value: unknown): StudioAssetState | undefined {
  const asset = asRecord(value);
  if (!asset || asset.type !== "image" || typeof asset.id !== "string" || typeof asset.name !== "string") return undefined;
  if (!positive(asset.width) || !positive(asset.height) || !Array.isArray(asset.objectIds)) return undefined;
  if (!asset.objectIds.every((id) => typeof id === "string")) return undefined;
  return { id: asset.id, type: "image", name: asset.name, width: asset.width, height: asset.height, mimeType: stringOrUndefined(asset.mimeType), objectIds: asset.objectIds };
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function number(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function positive(value: unknown): value is number {
  return number(value) && value > 0;
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function areObjects(objects: readonly (StudioSceneObject | undefined)[]): objects is readonly StudioSceneObject[] {
  return objects.every(Boolean);
}

function areAssets(assets: readonly (StudioAssetState | undefined)[]): assets is readonly StudioAssetState[] {
  return assets.every(Boolean);
}
