import type {
  Raw2DMcpStudioRendererWarning,
  Raw2DMcpStudioValidationIssue,
  Raw2DMcpStudioValidationResult,
  Raw2DMcpStudioValidationWarning,
  ValidateRaw2DStudioSceneOptions
} from "./validateRaw2DStudioScene.type.js";
import { validateRaw2DStudioCommands } from "./validateRaw2DStudioCommand.js";

const objectTypes = new Set(["rect", "circle", "line", "text2d", "sprite", "group"]);

export function validateRaw2DStudioScene(options: ValidateRaw2DStudioSceneOptions): Raw2DMcpStudioValidationResult {
  const errors: Raw2DMcpStudioValidationIssue[] = [];
  const warnings: Raw2DMcpStudioValidationWarning[] = [];
  const document = asRecord(options.document);
  if (!document) {
    return { valid: false, errors: [{ path: "$", message: "Studio scene must be an object." }], warnings };
  }

  const objectIds = validateSceneRoot(document, errors);
  validateAssets(document.assets, errors);
  validateAssetReferences(document, objectIds, warnings);
  validateRendererWarnings(document, warnings);
  validateRaw2DStudioCommands(options.commands, errors);
  return { valid: errors.length === 0, errors, warnings };
}

function validateSceneRoot(document: Record<string, unknown>, errors: Raw2DMcpStudioValidationIssue[]): Set<string> {
  const objectIds = new Set<string>();
  validateExactNumber(document.version, "$.version", 1, errors);
  validateString(document.name, "$.name", errors);
  validateRendererMode(document.rendererMode, "$.rendererMode", errors);
  validateCamera(document.camera, errors);
  validateObjects(document.objects, objectIds, errors);
  return objectIds;
}

function validateCamera(value: unknown, errors: Raw2DMcpStudioValidationIssue[]): void {
  const camera = asRecord(value);

  if (!camera) {
    errors.push({ path: "$.camera", message: "Studio camera must be an object." });
    return;
  }
  validateNumber(camera.x, "$.camera.x", errors);
  validateNumber(camera.y, "$.camera.y", errors);
  if (!isFiniteNumber(camera.zoom) || camera.zoom <= 0) {
    errors.push({ path: "$.camera.zoom", message: "Studio camera zoom must be a positive finite number." });
  }
}

function validateObjects(value: unknown, ids: Set<string>, errors: Raw2DMcpStudioValidationIssue[], path = "$.objects"): void {
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Studio objects must be an array." });
    return;
  }
  value.forEach((item, index) => validateObject(item, `${path}[${index}]`, ids, errors));
}

function validateObject(value: unknown, path: string, ids: Set<string>, errors: Raw2DMcpStudioValidationIssue[]): void {
  const object = asRecord(value);

  if (!object) {
    errors.push({ path, message: "Studio object must be an object." });
    return;
  }
  validateObjectId(object.id, `${path}.id`, ids, errors);
  validateObjectType(object.type, `${path}.type`, errors);
  validateString(object.name, `${path}.name`, errors);
  validateNumber(object.x, `${path}.x`, errors);
  validateNumber(object.y, `${path}.y`, errors);
  if (object.visible !== undefined && typeof object.visible !== "boolean") errors.push({ path: `${path}.visible`, message: "Visible must be boolean." });
  validateMaterial(object.material, `${path}.material`, errors);
  validateObjectShape(object, path, ids, errors);
}

function validateObjectShape(object: Record<string, unknown>, path: string, ids: Set<string>, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (object.type === "rect") validateSizePair(object, path, errors);
  else if (object.type === "circle") validatePositiveNumber(object.radius, `${path}.radius`, errors);
  else if (object.type === "line") validateLine(object, path, errors);
  else if (object.type === "text2d") validateString(object.text, `${path}.text`, errors);
  else if (object.type === "sprite") {
    validateSizePair(object, path, errors);
    validateString(object.assetSlot, `${path}.assetSlot`, errors);
  } else if (object.type === "group") {
    validateObjects(object.children, ids, errors, `${path}.children`);
  }
}

function validateAssets(value: unknown, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (!Array.isArray(value)) {
    errors.push({ path: "$.assets", message: "Studio assets must be an array." });
    return;
  }

  const assetIds = new Set<string>();
  value.forEach((item, index) => validateAsset(item, `$.assets[${index}]`, assetIds, errors));
}

function validateAsset(
  value: unknown,
  path: string,
  assetIds: Set<string>,
  errors: Raw2DMcpStudioValidationIssue[]
): void {
  const asset = asRecord(value);
  if (!asset) {
    errors.push({ path, message: "Studio asset must be an object." });
    return;
  }
  validateObjectId(asset.id, `${path}.id`, assetIds, errors);
  if (asset.type !== "image") errors.push({ path: `${path}.type`, message: "Studio asset type must be image." });
  validateString(asset.name, `${path}.name`, errors);
  validatePositiveNumber(asset.width, `${path}.width`, errors);
  validatePositiveNumber(asset.height, `${path}.height`, errors);
  if (asset.src !== undefined) validateString(asset.src, `${path}.src`, errors);
  if (asset.mimeType !== undefined) validateString(asset.mimeType, `${path}.mimeType`, errors);
  validateObjectIdArray(asset.objectIds, `${path}.objectIds`, errors);
}

function validateAssetReferences(
  document: Record<string, unknown>,
  objectIds: Set<string>,
  warnings: Raw2DMcpStudioValidationWarning[]
): void {
  const assets = Array.isArray(document.assets) ? document.assets.map(asRecord).filter(isRecord) : [];
  const assetIds = new Set(assets.map((asset) => (typeof asset.id === "string" ? asset.id : "")));
  const objects = Array.isArray(document.objects) ? flattenObjects(document.objects) : [];
  objects.forEach((object) => {
    if (object.value.type === "sprite" && object.value.assetSlot !== "empty" && !assetIds.has(String(object.value.assetSlot))) {
      warnings.push({ path: `${object.path}.assetSlot`, message: `Sprite references missing asset "${String(object.value.assetSlot)}".` });
    }
  });
  for (const asset of assets) {
    for (const objectId of Array.isArray(asset.objectIds) ? asset.objectIds : []) {
      if (typeof objectId === "string" && !objectIds.has(objectId)) {
        warnings.push({ path: `$.assets.${String(asset.id)}.objectIds`, message: `Asset references missing object "${objectId}".` });
      }
    }
  }
}

function validateRendererWarnings(document: Record<string, unknown>, warnings: Raw2DMcpStudioRendererWarning[]): void {
  if (document.rendererMode !== "webgl" || !Array.isArray(document.objects)) return;
  warnings.push({ path: "$.rendererMode", message: "WebGL mode requires WebGL2 support in the browser." });
  flattenObjects(document.objects).forEach((object) => {
    if (object.value.type === "sprite") warnings.push({ path: object.path, message: "Sprite assets need runtime image or atlas texture loading for WebGL." });
    if (object.value.type === "text2d") warnings.push({ path: object.path, message: "Text2D WebGL output depends on loaded fonts for stable metrics." });
  });
}

function validateLine(object: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validateNumber(object.startX, `${path}.startX`, errors);
  validateNumber(object.startY, `${path}.startY`, errors);
  validateNumber(object.endX, `${path}.endX`, errors);
  validateNumber(object.endY, `${path}.endY`, errors);
  if (object.startX === object.endX && object.startY === object.endY) errors.push({ path, message: "Studio line start and end points must differ." });
}
function validateMaterial(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (value === undefined) return;
  const material = asRecord(value);
  if (!material) {
    errors.push({ path, message: "Studio material must be an object." });
    return;
  }
  if (material.fillColor !== undefined) validateString(material.fillColor, `${path}.fillColor`, errors);
  if (material.strokeColor !== undefined) validateString(material.strokeColor, `${path}.strokeColor`, errors);
  if (material.lineWidth !== undefined) validatePositiveNumber(material.lineWidth, `${path}.lineWidth`, errors);
}

function validateObjectId(value: unknown, path: string, ids: Set<string>, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (typeof value !== "string" || value.length === 0) {
    errors.push({ path, message: "Id must be a non-empty string." });
  } else if (ids.has(value)) {
    errors.push({ path, message: `Duplicate id "${value}".` });
  } else ids.add(value);
}

function validateObjectIdArray(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Object ids must be an array." });
    return;
  }
  value.forEach((id, index) => {
    if (typeof id !== "string") errors.push({ path: `${path}[${index}]`, message: "Object id reference must be a string." });
  });
}

function validateSizePair(object: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validatePositiveNumber(object.width, `${path}.width`, errors);
  validatePositiveNumber(object.height, `${path}.height`, errors);
}

function validateRendererMode(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (value !== "canvas" && value !== "webgl") errors.push({ path, message: "Renderer mode must be canvas or webgl." });
}

function flattenObjects(value: readonly unknown[], path = "$.objects"): readonly {
  readonly value: Record<string, unknown>;
  readonly path: string;
}[] {
  return value.flatMap((item, index) => {
    const object = asRecord(item);
    if (!object) return [];
    const objectPath = `${path}[${index}]`;
    const children = object.type === "group" && Array.isArray(object.children)
      ? flattenObjects(object.children, `${objectPath}.children`)
      : [];
    return [{ value: object, path: objectPath }, ...children];
  });
}

function validateObjectType(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (typeof value !== "string" || !objectTypes.has(value)) errors.push({ path, message: "Studio object type is not supported." });
}

function validateExactNumber(value: unknown, path: string, expected: number, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (value !== expected) errors.push({ path, message: `Value must be ${expected}.` });
}

function validateString(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (typeof value !== "string" || value.length === 0) errors.push({ path, message: "Value must be a non-empty string." });
}

function validateNumber(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (!isFiniteNumber(value)) errors.push({ path, message: "Value must be a finite number." });
}

function validatePositiveNumber(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (!isFiniteNumber(value) || value <= 0) errors.push({ path, message: "Value must be a positive finite number." });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRecord(value: Record<string, unknown> | null): value is Record<string, unknown> {
  return value !== null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}
