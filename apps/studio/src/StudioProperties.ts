import type { StudioPropertyEditOptions, StudioPropertyEditResult, StudioPropertyId } from "./StudioProperties.type";
import type { StudioMaterialState, StudioSceneObject } from "./StudioSceneState.type";

export function applyStudioPropertyEdit(options: StudioPropertyEditOptions): StudioPropertyEditResult {
  if (!options.selectedObjectId) {
    return { handled: false, scene: options.scene };
  }

  let handled = false;
  const objects = options.scene.objects.map((object) => {
    if (object.id !== options.selectedObjectId) {
      return object;
    }
    const updated = updateStudioObjectProperty(object, options.propertyId, options.value);
    handled = updated !== object;
    return updated;
  });

  return handled ? { handled, scene: { ...options.scene, objects } } : { handled, scene: options.scene };
}

function updateStudioObjectProperty(object: StudioSceneObject, propertyId: StudioPropertyId, value: string): StudioSceneObject {
  const transformUpdate = updateTransformProperty(object, propertyId, value);
  if (transformUpdate) return transformUpdate;

  const materialUpdate = updateMaterialProperty(object, propertyId, value);
  if (materialUpdate) return materialUpdate;

  if (object.type === "text2d" && propertyId === "text") {
    return { ...object, text: value };
  }

  if (object.type === "text2d" && propertyId === "font") {
    return { ...object, font: value };
  }

  return object;
}

function updateTransformProperty(object: StudioSceneObject, propertyId: StudioPropertyId, value: string): StudioSceneObject | undefined {
  const numericValue = parseNumber(value);

  if (numericValue === undefined) {
    return undefined;
  }

  if (propertyId === "x") return { ...object, x: numericValue };
  if (propertyId === "y") return { ...object, y: numericValue };

  if ((object.type === "rect" || object.type === "sprite") && propertyId === "width") {
    return { ...object, width: Math.max(1, numericValue) };
  }

  if ((object.type === "rect" || object.type === "sprite") && propertyId === "height") {
    return { ...object, height: Math.max(1, numericValue) };
  }

  if (object.type === "circle" && propertyId === "radius") {
    return { ...object, radius: Math.max(1, numericValue) };
  }

  return undefined;
}

function updateMaterialProperty(object: StudioSceneObject, propertyId: StudioPropertyId, value: string): StudioSceneObject | undefined {
  if (propertyId === "fillColor") {
    return { ...object, material: { ...object.material, fillColor: normalizeColor(value) } };
  }

  if (propertyId === "strokeColor") {
    return { ...object, material: { ...object.material, strokeColor: normalizeColor(value) } };
  }

  if (propertyId === "lineWidth") {
    const numericValue = parseNumber(value);
    return numericValue === undefined ? undefined : { ...object, material: { ...object.material, lineWidth: Math.max(0, numericValue) } };
  }

  return undefined;
}

function normalizeColor(value: string): string {
  return value.trim() || "#ffffff";
}

function parseNumber(value: string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function hasStudioPropertyId(value: string | undefined): value is StudioPropertyId {
  return (
    value === "x" ||
    value === "y" ||
    value === "width" ||
    value === "height" ||
    value === "radius" ||
    value === "fillColor" ||
    value === "strokeColor" ||
    value === "lineWidth" ||
    value === "text" ||
    value === "font"
  );
}

export function createFallbackStudioMaterial(material: StudioMaterialState | undefined): Required<StudioMaterialState> {
  return {
    fillColor: material?.fillColor ?? "#ffffff",
    strokeColor: material?.strokeColor ?? "#ffffff",
    lineWidth: material?.lineWidth ?? 0
  };
}
