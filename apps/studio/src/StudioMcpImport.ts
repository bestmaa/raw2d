import type { StudioSceneLoadResult } from "./StudioLoad.type";
import type { StudioMaterialState, StudioSceneObject } from "./StudioSceneState.type";
import type { StudioMcpCameraDocument, StudioMcpIdResolution, StudioMcpObjectDocument, StudioMcpSceneDocument } from "./StudioMcpImport.type";
import { validateStudioAssetReferences } from "./StudioSceneDiagnostics";

const supportedTypes = new Set(["rect", "circle", "line", "text2d", "sprite"]);
const validIdPattern = /^[A-Za-z][A-Za-z0-9_-]*$/;
type StudioMcpObjectBase = Pick<StudioSceneObject, "id" | "type" | "name" | "x" | "y" | "visible" | "material">;

export function isRaw2DMcpSceneDocument(value: unknown): value is StudioMcpSceneDocument {
  const document = asRecord(value);
  const scene = asRecord(document?.scene);
  return Array.isArray(scene?.objects) && asRecord(document?.camera) !== null;
}

export function importStudioSceneFromMcpDocument(document: StudioMcpSceneDocument): StudioSceneLoadResult {
  const usedIds = new Set<string>();
  const warnings: string[] = [];
  const scene = {
    version: 1 as const,
    name: "Imported MCP Scene",
    rendererMode: "canvas" as const,
    camera: parseCamera(document.camera),
    assets: [],
    objects: document.scene.objects.map((object, index) => {
      const result = parseObject(object, index, usedIds);
      warnings.push(...result.warnings);
      return result.object;
    })
  };

  return {
    scene,
    warnings: [...warnings, ...validateStudioAssetReferences(scene)]
  };
}

function parseCamera(camera: StudioMcpCameraDocument): StudioMcpCameraDocument {
  return {
    x: expectNumber(camera.x, "Raw2D MCP camera x must be a finite number."),
    y: expectNumber(camera.y, "Raw2D MCP camera y must be a finite number."),
    zoom: expectPositiveNumber(camera.zoom, "Raw2D MCP camera zoom must be greater than 0.")
  };
}

function parseObject(
  object: StudioMcpObjectDocument,
  index: number,
  usedIds: Set<string>
): { readonly object: StudioSceneObject; readonly warnings: readonly string[] } {
  const type = expectType(object.type, index);
  const id = resolveObjectId({ rawId: object.id, type, index, usedIds });
  const base = {
    id: id.id,
    type,
    name: typeof object.name === "string" && object.name.trim() ? object.name : createObjectName(type, id.id),
    x: normalizeNumber(object.x, 0),
    y: normalizeNumber(object.y, 0),
    visible: typeof object.visible === "boolean" ? object.visible : undefined,
    material: parseMaterial(object.material)
  };

  return { object: parseTypedObject(object, base), warnings: id.warnings };
}

function parseTypedObject(object: StudioMcpObjectDocument, base: StudioMcpObjectBase): StudioSceneObject {
  if (base.type === "rect") {
    return { ...base, type: "rect", width: expectPositiveNumber(object.width, `Raw2D MCP rect ${base.id} width must be greater than 0.`), height: expectPositiveNumber(object.height, `Raw2D MCP rect ${base.id} height must be greater than 0.`) };
  }

  if (base.type === "circle") {
    return { ...base, type: "circle", radius: expectPositiveNumber(object.radius, `Raw2D MCP circle ${base.id} radius must be greater than 0.`) };
  }

  if (base.type === "line") {
    const line = {
      ...base,
      type: "line" as const,
      startX: expectNumber(object.startX, `Raw2D MCP line ${base.id} startX must be a finite number.`),
      startY: expectNumber(object.startY, `Raw2D MCP line ${base.id} startY must be a finite number.`),
      endX: expectNumber(object.endX, `Raw2D MCP line ${base.id} endX must be a finite number.`),
      endY: expectNumber(object.endY, `Raw2D MCP line ${base.id} endY must be a finite number.`)
    };

    if (line.startX === line.endX && line.startY === line.endY) {
      throw new Error(`Raw2D MCP line ${base.id} start and end points must be different.`);
    }

    return line;
  }

  if (base.type === "text2d") {
    return { ...base, type: "text2d", text: expectString(object.text, `Raw2D MCP text2d ${base.id} text must be a string.`), font: typeof object.font === "string" ? object.font : undefined };
  }

  return {
    ...base,
    type: "sprite",
    width: normalizePositiveNumber(object.width, 64),
    height: normalizePositiveNumber(object.height, 64),
    assetSlot: expectString(object.textureId, `Raw2D MCP sprite ${base.id} textureId must be a string.`)
  };
}

function resolveObjectId(options: {
  readonly rawId: unknown;
  readonly type: StudioSceneObject["type"];
  readonly index: number;
  readonly usedIds: Set<string>;
}): StudioMcpIdResolution {
  const warnings: string[] = [];
  const fallback = `mcp-${options.type}-${options.index + 1}`;
  const rawId = typeof options.rawId === "string" ? options.rawId.trim() : "";
  const baseId = validIdPattern.test(rawId) ? rawId : fallback;

  if (baseId !== rawId) {
    warnings.push(`Raw2D MCP object at index ${options.index} had invalid id; using ${baseId}.`);
  }

  const id = createUniqueId(baseId, options.usedIds);
  if (id !== baseId) {
    warnings.push(`Raw2D MCP object id ${baseId} was duplicated; using ${id}.`);
  }

  options.usedIds.add(id);
  return { id, warnings };
}

function createUniqueId(baseId: string, usedIds: Set<string>): string {
  if (!usedIds.has(baseId)) return baseId;

  let suffix = 2;
  while (usedIds.has(`${baseId}-${suffix}`)) suffix += 1;
  return `${baseId}-${suffix}`;
}

function expectType(value: unknown, index: number): StudioSceneObject["type"] {
  if (typeof value === "string" && supportedTypes.has(value)) return value as StudioSceneObject["type"];
  throw new Error(`Raw2D MCP object at index ${index} has unsupported type.`);
}

function parseMaterial(value: unknown): StudioMaterialState | undefined {
  const material = asRecord(value);
  if (!material) return undefined;

  return {
    fillColor: typeof material.fillColor === "string" ? material.fillColor : undefined,
    strokeColor: typeof material.strokeColor === "string" ? material.strokeColor : undefined,
    lineWidth: typeof material.lineWidth === "number" && Number.isFinite(material.lineWidth) ? material.lineWidth : undefined
  };
}

function createObjectName(type: StudioSceneObject["type"], id: string): string {
  return `${type.charAt(0).toUpperCase()}${type.slice(1)} ${id}`;
}

function expectString(value: unknown, message: string): string {
  if (typeof value !== "string") throw new Error(message);
  return value;
}

function expectNumber(value: unknown, message: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(message);
  return value;
}

function expectPositiveNumber(value: unknown, message: string): number {
  const number = expectNumber(value, message);
  if (number <= 0) throw new Error(message);
  return number;
}

function normalizeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizePositiveNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}
