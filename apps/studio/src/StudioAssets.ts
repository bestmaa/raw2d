import type {
  AddStudioImageAssetOptions,
  StudioAssetLookupOptions,
  StudioAssetObjectReferenceOptions,
  StudioAssetState,
  StudioImageAssetState
} from "./StudioAssets.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function addStudioImageAsset(options: AddStudioImageAssetOptions): StudioSceneState {
  const asset = createStudioImageAsset(options);

  if (options.scene.assets.some((candidate) => candidate.id === asset.id)) {
    throw new Error(`Studio asset id already exists: ${asset.id}`);
  }

  return {
    ...options.scene,
    assets: [...options.scene.assets, asset]
  };
}

export function removeStudioAsset(options: StudioAssetLookupOptions): StudioSceneState {
  const assets = options.scene.assets.filter((asset) => asset.id !== options.assetId);

  if (assets.length === options.scene.assets.length) {
    return options.scene;
  }

  return { ...options.scene, assets };
}

export function getStudioAssetById(options: StudioAssetLookupOptions): StudioAssetState | undefined {
  return options.scene.assets.find((asset) => asset.id === options.assetId);
}

export function getStudioAssetObjects(options: StudioAssetLookupOptions): readonly StudioSceneObject[] {
  const asset = getStudioAssetById(options);

  if (!asset) {
    return [];
  }

  return asset.objectIds
    .map((objectId) => findStudioObject(options.scene.objects, objectId))
    .filter((object): object is StudioSceneObject => Boolean(object));
}

export function getStudioAssetsForObject(
  scene: StudioSceneState,
  objectId: StudioSceneObject["id"]
): readonly StudioAssetState[] {
  return scene.assets.filter((asset) => asset.objectIds.includes(objectId));
}

export function addStudioAssetObjectReference(options: StudioAssetObjectReferenceOptions): StudioSceneState {
  assertSceneObjectExists(options.scene, options.objectId);
  let handled = false;
  const assets = options.scene.assets.map((asset) => {
    if (asset.id !== options.assetId || asset.objectIds.includes(options.objectId)) {
      return asset;
    }

    handled = true;
    return { ...asset, objectIds: [...asset.objectIds, options.objectId] };
  });

  return handled ? { ...options.scene, assets } : options.scene;
}

export function removeStudioAssetObjectReference(options: StudioAssetObjectReferenceOptions): StudioSceneState {
  let handled = false;
  const assets = options.scene.assets.map((asset) => {
    if (asset.id !== options.assetId || !asset.objectIds.includes(options.objectId)) {
      return asset;
    }

    handled = true;
    return { ...asset, objectIds: asset.objectIds.filter((objectId) => objectId !== options.objectId) };
  });

  return handled ? { ...options.scene, assets } : options.scene;
}

function createStudioImageAsset(options: AddStudioImageAssetOptions): StudioImageAssetState {
  const id = options.asset.id ?? createNextStudioAssetId(options.scene.assets);
  const objectIds = [...new Set(options.asset.objectIds ?? [])];

  for (const objectId of objectIds) {
    assertSceneObjectExists(options.scene, objectId);
  }

  const src = normalizeOptionalText(options.asset.src);
  const mimeType = normalizeOptionalText(options.asset.mimeType);

  return {
    id,
    type: "image",
    name: normalizeAssetName(options.asset.name),
    width: normalizeDimension(options.asset.width, "width"),
    height: normalizeDimension(options.asset.height, "height"),
    ...(src ? { src } : {}),
    ...(mimeType ? { mimeType } : {}),
    objectIds
  };
}

function createNextStudioAssetId(assets: readonly StudioAssetState[]): string {
  let index = assets.length + 1;

  while (assets.some((asset) => asset.id === `asset-${index}`)) {
    index += 1;
  }

  return `asset-${index}`;
}

function assertSceneObjectExists(scene: StudioSceneState, objectId: string): void {
  if (!findStudioObject(scene.objects, objectId)) {
    throw new Error(`Studio asset object reference was not found: ${objectId}`);
  }
}

function findStudioObject(objects: readonly StudioSceneObject[], objectId: string): StudioSceneObject | undefined {
  for (const object of objects) {
    if (object.id === objectId) return object;
    if (object.type === "group") {
      const child = findStudioObject(object.children, objectId);
      if (child) return child;
    }
  }
  return undefined;
}

function normalizeAssetName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("Studio image asset name must not be empty.");
  }

  return trimmed;
}

function normalizeDimension(value: number, label: "width" | "height"): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Studio image asset ${label} must be a positive number.`);
  }

  return value;
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
