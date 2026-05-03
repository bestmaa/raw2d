import type {
  Raw2DMcpValidationError,
  Raw2DMcpValidationResult,
  ValidateRaw2DSceneOptions
} from "./validateRaw2DScene.type.js";

const supportedTypes = new Set(["rect", "circle", "line", "text2d", "sprite"]);

export function validateRaw2DScene(options: ValidateRaw2DSceneOptions): Raw2DMcpValidationResult {
  const errors: Raw2DMcpValidationError[] = [];
  const document = asRecord(options.document);

  if (!document) {
    return invalid([{ path: "$", message: "Scene document must be an object." }]);
  }

  validateCamera(document.camera, errors);
  validateScene(document.scene, errors);

  return { valid: errors.length === 0, errors };
}

function validateCamera(value: unknown, errors: Raw2DMcpValidationError[]): void {
  const camera = asRecord(value);

  if (!camera) {
    errors.push({ path: "$.camera", message: "Camera must be an object." });
    return;
  }

  validateNumber(camera.x, "$.camera.x", errors);
  validateNumber(camera.y, "$.camera.y", errors);

  if (!isFiniteNumber(camera.zoom) || camera.zoom <= 0) {
    errors.push({ path: "$.camera.zoom", message: "Camera zoom must be a positive finite number." });
  }
}

function validateScene(value: unknown, errors: Raw2DMcpValidationError[]): void {
  const scene = asRecord(value);

  if (!scene) {
    errors.push({ path: "$.scene", message: "Scene must be an object." });
    return;
  }

  if (!Array.isArray(scene.objects)) {
    errors.push({ path: "$.scene.objects", message: "Scene objects must be an array." });
    return;
  }

  validateObjects(scene.objects, errors);
}

function validateObjects(objects: readonly unknown[], errors: Raw2DMcpValidationError[]): void {
  const ids = new Set<string>();

  objects.forEach((value, index) => {
    const object = asRecord(value);
    const path = `$.scene.objects[${index}]`;

    if (!object) {
      errors.push({ path, message: "Object must be an object." });
      return;
    }

    validateObjectId(object.id, path, ids, errors);
    validateObjectType(object.type, path, errors);
    validateObjectShape(object, path, errors);
  });
}

function validateObjectId(value: unknown, path: string, ids: Set<string>, errors: Raw2DMcpValidationError[]): void {
  if (typeof value !== "string" || value.length === 0) {
    errors.push({ path: `${path}.id`, message: "Object id must be a non-empty string." });
    return;
  }

  if (ids.has(value)) {
    errors.push({ path: `${path}.id`, message: `Duplicate object id "${value}".` });
    return;
  }

  ids.add(value);
}

function validateObjectType(value: unknown, path: string, errors: Raw2DMcpValidationError[]): void {
  if (typeof value !== "string" || !supportedTypes.has(value)) {
    errors.push({ path: `${path}.type`, message: "Object type is not supported." });
  }
}

function validateObjectShape(object: Record<string, unknown>, path: string, errors: Raw2DMcpValidationError[]): void {
  if (object.type === "rect") {
    validateNonNegativeNumber(object.width, `${path}.width`, errors);
    validateNonNegativeNumber(object.height, `${path}.height`, errors);
  } else if (object.type === "circle") {
    validateNonNegativeNumber(object.radius, `${path}.radius`, errors);
  } else if (object.type === "line") {
    validateNumber(object.startX, `${path}.startX`, errors);
    validateNumber(object.startY, `${path}.startY`, errors);
    validateNumber(object.endX, `${path}.endX`, errors);
    validateNumber(object.endY, `${path}.endY`, errors);
  } else if (object.type === "text2d" && typeof object.text !== "string") {
    errors.push({ path: `${path}.text`, message: "Text2D text must be a string." });
  } else if (object.type === "sprite" && typeof object.textureId !== "string") {
    errors.push({ path: `${path}.textureId`, message: "Sprite textureId must be a string." });
  }
}

function validateNumber(value: unknown, path: string, errors: Raw2DMcpValidationError[]): void {
  if (!isFiniteNumber(value)) {
    errors.push({ path, message: "Value must be a finite number." });
  }
}

function validateNonNegativeNumber(value: unknown, path: string, errors: Raw2DMcpValidationError[]): void {
  if (!isFiniteNumber(value) || value < 0) {
    errors.push({ path, message: "Value must be a non-negative finite number." });
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function invalid(errors: readonly Raw2DMcpValidationError[]): Raw2DMcpValidationResult {
  return { valid: false, errors };
}
