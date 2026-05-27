import type { Raw2DEffect } from "./Raw2DEffect.type.js";
import type { Raw2DEffectValidationIssue, Raw2DEffectValidationResult } from "./Raw2DEffectValidation.type.js";

const supportedTypes = new Set(["opacity", "blur", "grayscale", "shadow"]);

export function validateRaw2DEffect(effect: unknown, path = "$"): Raw2DEffectValidationResult {
  const issues: Raw2DEffectValidationIssue[] = [];
  validateEffect(effect, path, issues);
  return { valid: issues.length === 0, issues };
}

export function validateRaw2DEffects(effects: readonly unknown[], path = "$"): Raw2DEffectValidationResult {
  const issues: Raw2DEffectValidationIssue[] = [];

  effects.forEach((effect, index) => {
    validateEffect(effect, `${path}[${index}]`, issues);
  });

  return { valid: issues.length === 0, issues };
}

export function isRaw2DEffect(effect: unknown): effect is Raw2DEffect {
  return validateRaw2DEffect(effect).valid;
}

function validateEffect(effect: unknown, path: string, issues: Raw2DEffectValidationIssue[]): void {
  const record = asRecord(effect);

  if (!record) {
    issues.push({ path, message: "Effect must be an object." });
    return;
  }

  validateBase(record, path, issues);

  if (record.type === "opacity") validateUnitValue(record.opacity, `${path}.opacity`, issues);
  else if (record.type === "blur") validateNonNegativeValue(record.radius, `${path}.radius`, issues);
  else if (record.type === "grayscale") validateUnitValue(record.amount, `${path}.amount`, issues);
  else if (record.type === "shadow") validateShadow(record, path, issues);
}

function validateBase(record: Record<string, unknown>, path: string, issues: Raw2DEffectValidationIssue[]): void {
  if (typeof record.type !== "string" || !supportedTypes.has(record.type)) {
    issues.push({ path: `${path}.type`, message: "Effect type is not supported." });
  }

  if (record.id !== undefined && typeof record.id !== "string") {
    issues.push({ path: `${path}.id`, message: "Effect id must be a string when provided." });
  }

  if (record.enabled !== undefined && typeof record.enabled !== "boolean") {
    issues.push({ path: `${path}.enabled`, message: "Effect enabled must be a boolean when provided." });
  }
}

function validateShadow(record: Record<string, unknown>, path: string, issues: Raw2DEffectValidationIssue[]): void {
  if (typeof record.color !== "string" || record.color.length === 0) {
    issues.push({ path: `${path}.color`, message: "Shadow color must be a non-empty string." });
  }

  validateNonNegativeValue(record.blur, `${path}.blur`, issues);
  validateNumber(record.offsetX, `${path}.offsetX`, issues);
  validateNumber(record.offsetY, `${path}.offsetY`, issues);
}

function validateUnitValue(value: unknown, path: string, issues: Raw2DEffectValidationIssue[]): void {
  if (!isFiniteNumber(value) || value < 0 || value > 1) {
    issues.push({ path, message: "Effect value must be a finite number from 0 to 1." });
  }
}

function validateNonNegativeValue(value: unknown, path: string, issues: Raw2DEffectValidationIssue[]): void {
  if (!isFiniteNumber(value) || value < 0) {
    issues.push({ path, message: "Effect value must be a non-negative finite number." });
  }
}

function validateNumber(value: unknown, path: string, issues: Raw2DEffectValidationIssue[]): void {
  if (!isFiniteNumber(value)) {
    issues.push({ path, message: "Effect value must be a finite number." });
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}
