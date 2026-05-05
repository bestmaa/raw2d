import type { StudioInspectorModel, StudioInspectorOptions } from "./StudioInspector.type";
import type { StudioPropertyRow } from "./StudioLayout.type";
import type { StudioPropertyField } from "./StudioProperties.type";
import type { StudioMaterialState, StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function createStudioInspectorModel(
  scene: StudioSceneState,
  rendererLabel: string,
  options: StudioInspectorOptions = {}
): StudioInspectorModel {
  const selectedObject = scene.objects.find((object) => object.id === options.selectedObjectId);

  return {
    layers: scene.objects.map((object) => ({
      id: object.id,
      label: object.name,
      type: object.type,
      visible: object.visible ?? true
    })),
    properties: createProperties(scene, rendererLabel, selectedObject),
    propertyFields: createPropertyFields(selectedObject)
  };
}

function createProperties(
  scene: StudioSceneState,
  rendererLabel: string,
  object: StudioSceneObject | undefined
): readonly StudioPropertyRow[] {
  const baseRows: readonly StudioPropertyRow[] = [
    { label: "Renderer", value: rendererLabel },
    { label: "Objects", value: String(scene.objects.length) },
    { label: "Selection", value: object?.name ?? "None" }
  ];

  if (!object) {
    return baseRows;
  }

  return [...baseRows, ...createObjectProperties(object)];
}

function createObjectProperties(object: StudioSceneObject): readonly StudioPropertyRow[] {
  const transformRows: readonly StudioPropertyRow[] = [
    { label: "X", value: String(object.x) },
    { label: "Y", value: String(object.y) }
  ];

  if (object.type === "rect") {
    return [
      ...transformRows,
      { label: "Width", value: String(object.width) },
      { label: "Height", value: String(object.height) }
    ];
  }

  if (object.type === "circle") {
    return [...transformRows, { label: "Radius", value: String(object.radius) }];
  }

  if (object.type === "line") {
    return [
      ...transformRows,
      { label: "Start", value: `${object.startX}, ${object.startY}` },
      { label: "End", value: `${object.endX}, ${object.endY}` }
    ];
  }

  if (object.type === "text2d") {
    return [
      ...transformRows,
      { label: "Text", value: object.text },
      { label: "Font", value: object.font ?? "default" }
    ];
  }

  if (object.type === "sprite") {
    return [
      ...transformRows,
      { label: "Width", value: String(object.width) },
      { label: "Height", value: String(object.height) },
      { label: "Asset", value: object.assetSlot }
    ];
  }

  return transformRows;
}

function createPropertyFields(object: StudioSceneObject | undefined): readonly StudioPropertyField[] {
  if (!object) {
    return [];
  }

  return [...createTransformFields(object), ...createMaterialFields(object), ...createTextFields(object)];
}

function createTransformFields(object: StudioSceneObject): readonly StudioPropertyField[] {
  const fields: StudioPropertyField[] = [
    { id: "x", label: "X", value: String(object.x), inputType: "number", step: 1 },
    { id: "y", label: "Y", value: String(object.y), inputType: "number", step: 1 }
  ];

  if (object.type === "rect" || object.type === "sprite") {
    fields.push(
      { id: "width", label: "Width", value: String(object.width), inputType: "number", min: 1, step: 1 },
      { id: "height", label: "Height", value: String(object.height), inputType: "number", min: 1, step: 1 }
    );
  }

  if (object.type === "circle") {
    fields.push({ id: "radius", label: "Radius", value: String(object.radius), inputType: "number", min: 1, step: 1 });
  }

  return fields;
}

function createMaterialFields(object: StudioSceneObject): readonly StudioPropertyField[] {
  const material = createFallbackMaterial(object.material);

  return [
    { id: "fillColor", label: "Fill", value: material.fillColor, inputType: "color" },
    { id: "strokeColor", label: "Stroke", value: material.strokeColor, inputType: "color" },
    { id: "lineWidth", label: "Line", value: String(material.lineWidth), inputType: "number", min: 0, step: 1 }
  ];
}

function createFallbackMaterial(material: StudioMaterialState | undefined): Required<StudioMaterialState> {
  return {
    fillColor: material?.fillColor ?? "#ffffff",
    strokeColor: material?.strokeColor ?? "#ffffff",
    lineWidth: material?.lineWidth ?? 0
  };
}

function createTextFields(object: StudioSceneObject): readonly StudioPropertyField[] {
  if (object.type !== "text2d") {
    return [];
  }

  return [
    { id: "text", label: "Text", value: object.text, inputType: "text" },
    { id: "font", label: "Font", value: object.font ?? "", inputType: "text" }
  ];
}
