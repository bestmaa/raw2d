import type { StudioAssetState } from "./StudioAssets.type";
import type { StudioSceneLoadResult } from "./StudioLoad.type";
import { importStudioSceneFromMcpDocument, isRaw2DMcpSceneDocument } from "./StudioMcpImport";
import { validateStudioAssetReferences } from "./StudioSceneDiagnostics";
import type {
  StudioCameraState,
  StudioCircleState,
  StudioGroupState,
  StudioLineState,
  StudioRectState,
  StudioSceneObject,
  StudioSceneState,
  StudioSpriteState,
  StudioTextState
} from "./StudioSceneState.type";

export function deserializeStudioScene(json: string): StudioSceneState {
  return deserializeStudioSceneWithDiagnostics(json).scene;
}

export function deserializeStudioSceneWithDiagnostics(json: string): StudioSceneLoadResult {
  const document = JSON.parse(json) as unknown;
  const source = expectRecord(document);

  if (isRaw2DMcpSceneDocument(source)) {
    return importStudioSceneFromMcpDocument(source);
  }

  const assets = parseAssets(source.assets);
  const objects = parseObjects(source.objects);
  const scene = {
    version: expectVersion(source.version),
    name: expectString(source.name),
    rendererMode: expectRendererMode(source.rendererMode),
    camera: parseCamera(source.camera),
    assets,
    objects
  };

  return {
    scene,
    warnings: validateStudioAssetReferences(scene)
  };
}

export async function readStudioSceneFile(file: File): Promise<StudioSceneState> {
  return deserializeStudioScene(await file.text());
}

export async function readStudioSceneFileWithDiagnostics(file: File): Promise<StudioSceneLoadResult> {
  return deserializeStudioSceneWithDiagnostics(await file.text());
}

function parseCamera(value: unknown): StudioCameraState {
  const camera = expectRecord(value);

  return {
    x: expectNumber(camera.x),
    y: expectNumber(camera.y),
    zoom: expectNumber(camera.zoom)
  };
}

function parseObjects(value: unknown): readonly StudioSceneObject[] {
  if (!Array.isArray(value)) {
    throw new Error("Studio scene objects must be an array.");
  }

  return value.map(parseObject);
}

function parseAssets(value: unknown): readonly StudioAssetState[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error("Studio scene assets must be an array.");
  }

  return value.map(parseAsset);
}

function parseAsset(value: unknown): StudioAssetState {
  const asset = expectRecord(value);
  const type = expectString(asset.type);

  if (type !== "image") {
    throw new Error(`Unsupported Studio asset type: ${type}`);
  }

  const mimeType = typeof asset.mimeType === "string" ? asset.mimeType : undefined;

  return {
    id: expectString(asset.id),
    type: "image",
    name: expectString(asset.name),
    width: expectPositiveNumber(asset.width, "asset", expectString(asset.id), "width"),
    height: expectPositiveNumber(asset.height, "asset", expectString(asset.id), "height"),
    ...(mimeType ? { mimeType } : {}),
    objectIds: parseStringArray(asset.objectIds)
  };
}

function parseObject(value: unknown): StudioSceneObject {
  const object = expectRecord(value);
  const type = expectString(object.type);

  if (type === "rect") return parseRect(object);
  if (type === "circle") return parseCircle(object);
  if (type === "line") return parseLine(object);
  if (type === "text2d") return parseText(object);
  if (type === "sprite") return parseSprite(object);
  if (type === "group") return parseGroup(object);
  throw new Error(`Unsupported Studio object type "${type}" for object ${getObjectLabel(object)}.`);
}

function parseRect(object: Record<string, unknown>): StudioRectState {
  const base = parseBase(object, "rect");
  return { ...base, width: expectPositiveNumber(object.width, "rect", base.id, "width"), height: expectPositiveNumber(object.height, "rect", base.id, "height") };
}

function parseCircle(object: Record<string, unknown>): StudioCircleState {
  const base = parseBase(object, "circle");
  return { ...base, radius: expectPositiveNumber(object.radius, "circle", base.id, "radius") };
}

function parseLine(object: Record<string, unknown>): StudioLineState {
  const base = parseBase(object, "line");
  const line = {
    ...base,
    startX: expectNumber(object.startX),
    startY: expectNumber(object.startY),
    endX: expectNumber(object.endX),
    endY: expectNumber(object.endY)
  };

  if (line.startX === line.endX && line.startY === line.endY) {
    throw new Error(`Invalid Studio line geometry ${line.id}: start and end points must be different.`);
  }

  return line;
}

function parseText(object: Record<string, unknown>): StudioTextState {
  return {
    ...parseBase(object, "text2d"),
    text: expectString(object.text),
    font: typeof object.font === "string" ? object.font : undefined
  };
}

function parseSprite(object: Record<string, unknown>): StudioSpriteState {
  const base = parseBase(object, "sprite");
  return { ...base, width: expectPositiveNumber(object.width, "sprite", base.id, "width"), height: expectPositiveNumber(object.height, "sprite", base.id, "height"), assetSlot: expectString(object.assetSlot) };
}

function parseGroup(object: Record<string, unknown>): StudioGroupState {
  const base = parseBase(object, "group");
  return { ...base, children: parseObjects(object.children) };
}

function parseBase<Type extends StudioSceneObject["type"]>(
  object: Record<string, unknown>,
  type: Type
): Pick<Extract<StudioSceneObject, { readonly type: Type }>, "id" | "type" | "name" | "x" | "y" | "visible" | "material"> {
  return {
    id: expectString(object.id),
    type,
    name: expectString(object.name),
    x: expectNumber(object.x),
    y: expectNumber(object.y),
    visible: typeof object.visible === "boolean" ? object.visible : undefined,
    material: typeof object.material === "object" && object.material !== null ? object.material : undefined
  } as Pick<Extract<StudioSceneObject, { readonly type: Type }>, "id" | "type" | "name" | "x" | "y" | "visible" | "material">;
}

function expectRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Studio scene JSON must contain an object.");
  }

  return value as Record<string, unknown>;
}

function expectVersion(value: unknown): 1 {
  if (value !== 1) {
    throw new Error("Studio scene version must be 1.");
  }

  return value;
}

function expectRendererMode(value: unknown): StudioSceneState["rendererMode"] {
  if (value === "canvas" || value === "webgl") {
    return value;
  }

  throw new Error("Studio scene rendererMode must be canvas or webgl.");
}

function expectString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Studio scene field must be a string.");
  }

  return value;
}

function expectNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Studio scene field must be a finite number.");
  }

  return value;
}

function expectPositiveNumber(value: unknown, type: string, id: string, field: string): number {
  const number = expectNumber(value);

  if (number <= 0) {
    throw new Error(`Invalid Studio ${type} geometry ${id}: ${field} must be greater than 0.`);
  }

  return number;
}

function getObjectLabel(object: Record<string, unknown>): string {
  return typeof object.id === "string" ? object.id : "(missing id)";
}

function parseStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    throw new Error("Studio scene field must be a string array.");
  }

  return value.map(expectString);
}
