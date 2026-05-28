import { validateRaw2DScene } from "./validateRaw2DScene.js";
import type { Raw2DMcpSpriteJson, Raw2DMcpSceneObjectJson } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type {
  CreateRaw2DMcpSceneEditPlanOptions,
  Raw2DMcpSceneEditOperation,
  Raw2DMcpSceneEditPlan,
  Raw2DMcpSceneEditPlanStep
} from "./createRaw2DMcpSceneEditPlan.type.js";

export function createRaw2DMcpSceneEditPlan(options: CreateRaw2DMcpSceneEditPlanOptions): Raw2DMcpSceneEditPlan {
  let document = options.document;
  const steps: Raw2DMcpSceneEditPlanStep[] = [];
  const affectedObjectIds: string[] = [];
  const beforeObjectIds = getObjectIds(document);

  options.operations.forEach((operation, index) => {
    const result = applyOperation(document, operation);
    document = result.document;
    steps.push(createStep(index, operation.type, result.objectId, result.summary));
    pushUnique(affectedObjectIds, result.objectId);
  });

  assertValidScene(document);

  return {
    document,
    steps,
    affectedObjectIds,
    beforeObjectIds,
    afterObjectIds: getObjectIds(document)
  };
}

function applyOperation(
  document: Raw2DMcpSceneDocument,
  operation: Raw2DMcpSceneEditOperation
): { readonly document: Raw2DMcpSceneDocument; readonly objectId: string; readonly summary: string } {
  if (operation.type === "createObject") {
    return createObject(document, operation.object, operation.index);
  }

  if (operation.type === "updateObject") {
    return updateObject(document, operation);
  }

  if (operation.type === "deleteObject") {
    return deleteObject(document, operation.id);
  }

  if (operation.type === "reorderObject") {
    return reorderObject(document, operation.id, operation.index);
  }

  if (operation.type === "setSpriteAsset") {
    return setSpriteAsset(document, operation.id, operation.textureId, operation.frameName);
  }

  return setSpriteAsset(document, operation.id, "empty", undefined);
}

function createObject(
  document: Raw2DMcpSceneDocument,
  object: Raw2DMcpSceneObjectJson,
  index = document.scene.objects.length
): { readonly document: Raw2DMcpSceneDocument; readonly objectId: string; readonly summary: string } {
  assertUniqueId(document, object.id);
  const insertIndex = normalizeIndex(index, document.scene.objects.length, "createObject index");
  const objects = [...document.scene.objects];
  objects.splice(insertIndex, 0, object);

  return {
    document: withObjects(document, objects),
    objectId: object.id,
    summary: `Create ${object.type} ${object.id} at index ${insertIndex}.`
  };
}

function updateObject(
  document: Raw2DMcpSceneDocument,
  operation: Extract<Raw2DMcpSceneEditOperation, { readonly type: "updateObject" }>
): { readonly document: Raw2DMcpSceneDocument; readonly objectId: string; readonly summary: string } {
  const objects = document.scene.objects.map((object) => {
    if (object.id !== operation.id) return object;
    return {
      ...object,
      ...operation.transform,
      ...operation.geometry,
      material: operation.material ? { ...object.material, ...operation.material } : object.material
    } as Raw2DMcpSceneObjectJson;
  });

  assertContainsId(document, operation.id);
  return { document: withObjects(document, objects), objectId: operation.id, summary: `Update object ${operation.id}.` };
}

function deleteObject(
  document: Raw2DMcpSceneDocument,
  id: string
): { readonly document: Raw2DMcpSceneDocument; readonly objectId: string; readonly summary: string } {
  assertContainsId(document, id);
  return {
    document: withObjects(document, document.scene.objects.filter((object) => object.id !== id)),
    objectId: id,
    summary: `Delete object ${id}.`
  };
}

function reorderObject(
  document: Raw2DMcpSceneDocument,
  id: string,
  index: number
): { readonly document: Raw2DMcpSceneDocument; readonly objectId: string; readonly summary: string } {
  const currentIndex = document.scene.objects.findIndex((object) => object.id === id);

  if (currentIndex === -1) {
    throw new Error(`Raw2D MCP scene does not contain object id "${id}".`);
  }

  const objects = [...document.scene.objects];
  const [object] = objects.splice(currentIndex, 1);
  const nextIndex = normalizeIndex(index, objects.length, "reorderObject index");
  objects.splice(nextIndex, 0, object);

  return { document: withObjects(document, objects), objectId: id, summary: `Move object ${id} to index ${nextIndex}.` };
}

function setSpriteAsset(
  document: Raw2DMcpSceneDocument,
  id: string,
  textureId: string,
  frameName: string | undefined
): { readonly document: Raw2DMcpSceneDocument; readonly objectId: string; readonly summary: string } {
  const sprite = findObject(document, id);

  if (sprite.type !== "sprite") {
    throw new Error(`Raw2D MCP object "${id}" is not a sprite.`);
  }

  const nextSprite: Raw2DMcpSpriteJson = frameName
    ? { ...sprite, textureId, frameName }
    : withoutFrameName({ ...sprite, textureId });

  return {
    document: withObjects(document, replaceObject(document, nextSprite)),
    objectId: id,
    summary: `Set sprite ${id} asset reference to ${textureId}.`
  };
}

function replaceObject(document: Raw2DMcpSceneDocument, nextObject: Raw2DMcpSceneObjectJson): readonly Raw2DMcpSceneObjectJson[] {
  return document.scene.objects.map((object) => (object.id === nextObject.id ? nextObject : object));
}

function withoutFrameName(sprite: Raw2DMcpSpriteJson): Raw2DMcpSpriteJson {
  const { frameName: _frameName, ...rest } = sprite;
  void _frameName;
  return rest;
}

function findObject(document: Raw2DMcpSceneDocument, id: string): Raw2DMcpSceneObjectJson {
  const object = document.scene.objects.find((candidate) => candidate.id === id);

  if (!object) {
    throw new Error(`Raw2D MCP scene does not contain object id "${id}".`);
  }

  return object;
}

function assertContainsId(document: Raw2DMcpSceneDocument, id: string): void {
  findObject(document, id);
}

function assertUniqueId(document: Raw2DMcpSceneDocument, id: string): void {
  if (document.scene.objects.some((object) => object.id === id)) {
    throw new Error(`Raw2D MCP scene already contains object id "${id}".`);
  }
}

function assertValidScene(document: Raw2DMcpSceneDocument): void {
  const result = validateRaw2DScene({ document });

  if (!result.valid) {
    throw new Error(`Raw2D MCP edit plan produced invalid scene: ${result.errors[0]?.message ?? "unknown error"}`);
  }
}

function normalizeIndex(index: number, max: number, label: string): number {
  if (!Number.isInteger(index) || index < 0 || index > max) {
    throw new Error(`${label} must be an integer from 0 to ${max}.`);
  }

  return index;
}

function withObjects(document: Raw2DMcpSceneDocument, objects: readonly Raw2DMcpSceneObjectJson[]): Raw2DMcpSceneDocument {
  return { scene: { objects }, camera: document.camera };
}

function getObjectIds(document: Raw2DMcpSceneDocument): readonly string[] {
  return document.scene.objects.map((object) => object.id);
}

function createStep(index: number, type: Raw2DMcpSceneEditOperation["type"], objectId: string, summary: string): Raw2DMcpSceneEditPlanStep {
  return { id: `step-${String(index + 1).padStart(3, "0")}-${type}-${objectId}`, type, objectId, summary };
}

function pushUnique(values: string[], value: string): void {
  if (!values.includes(value)) {
    values.push(value);
  }
}
