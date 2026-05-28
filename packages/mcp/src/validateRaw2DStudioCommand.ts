import type { Raw2DMcpStudioValidationIssue } from "./validateRaw2DStudioScene.type.js";

const commandKinds = new Set([
  "batch",
  "create-object",
  "delete-object",
  "reorder-object",
  "set-visibility",
  "update-material",
  "update-sprite-asset",
  "update-text",
  "update-transform"
]);

export function validateRaw2DStudioCommands(
  commands: readonly unknown[] | undefined,
  errors: Raw2DMcpStudioValidationIssue[]
): void {
  if (commands === undefined) return;
  if (!Array.isArray(commands)) {
    errors.push({ path: "$.commands", message: "Studio commands must be an array." });
    return;
  }

  commands.forEach((command, index) => validateCommand(command, `$.commands[${index}]`, errors));
}

function validateCommand(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  const command = asRecord(value);
  if (!command) {
    errors.push({ path, message: "Studio command must be an object." });
    return;
  }

  if (typeof command.kind !== "string" || !commandKinds.has(command.kind)) {
    errors.push({ path: `${path}.kind`, message: "Studio command kind is not supported." });
    return;
  }

  if (command.kind === "batch") validateNestedCommands(command.commands, `${path}.commands`, errors);
  else if (command.kind === "create-object") validateCommandObject(command.object, `${path}.object`, errors);
  else if (command.kind === "delete-object") validateDeleteCommand(command, path, errors);
  else if (command.kind === "reorder-object") validateReorderCommand(command, path, errors);
  else if (command.kind === "set-visibility") validateVisibilityCommand(command, path, errors);
  else if (command.kind === "update-sprite-asset") validateSpriteAssetCommand(command, path, errors);
  else validatePatchCommand(command, path, errors);
}

function validateDeleteCommand(command: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validateString(command.objectId, `${path}.objectId`, errors);
  validateCommandObject(command.object, `${path}.object`, errors);
  validateIndex(command.index, `${path}.index`, errors);
}

function validateReorderCommand(command: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validateString(command.objectId, `${path}.objectId`, errors);
  validateIndex(command.fromIndex, `${path}.fromIndex`, errors);
  validateIndex(command.toIndex, `${path}.toIndex`, errors);
}

function validateSpriteAssetCommand(command: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validateString(command.objectId, `${path}.objectId`, errors);
  validateString(command.beforeAssetSlot, `${path}.beforeAssetSlot`, errors);
  validateString(command.afterAssetSlot, `${path}.afterAssetSlot`, errors);
}

function validateVisibilityCommand(command: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validateString(command.objectId, `${path}.objectId`, errors);
  if (command.before !== undefined && typeof command.before !== "boolean") errors.push({ path: `${path}.before`, message: "Before visibility must be boolean." });
  if (command.after !== undefined && typeof command.after !== "boolean") errors.push({ path: `${path}.after`, message: "After visibility must be boolean." });
}

function validatePatchCommand(command: Record<string, unknown>, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  validateString(command.objectId, `${path}.objectId`, errors);
  if (!asRecord(command.before)) errors.push({ path: `${path}.before`, message: "Before patch must be an object." });
  if (!asRecord(command.after)) errors.push({ path: `${path}.after`, message: "After patch must be an object." });
}

function validateNestedCommands(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Batch commands must be an array." });
    return;
  }

  value.forEach((command, index) => validateCommand(command, `${path}[${index}]`, errors));
}

function validateCommandObject(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  const object = asRecord(value);

  if (!object) {
    errors.push({ path, message: "Create command object must be an object." });
    return;
  }

  validateString(object.id, `${path}.id`, errors);
  validateString(object.type, `${path}.type`, errors);
}

function validateString(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (typeof value !== "string" || value.length === 0) errors.push({ path, message: "Value must be a non-empty string." });
}

function validateIndex(value: unknown, path: string, errors: Raw2DMcpStudioValidationIssue[]): void {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    errors.push({ path, message: "Index must be a non-negative integer." });
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}
