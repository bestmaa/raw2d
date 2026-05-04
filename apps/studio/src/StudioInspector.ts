import type { StudioInspectorModel } from "./StudioInspector.type";
import type { StudioPropertyRow } from "./StudioLayout.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function createStudioInspectorModel(scene: StudioSceneState, rendererLabel: string): StudioInspectorModel {
  const latestObject = scene.objects.at(-1);

  return {
    layers: scene.objects.map((object) => ({
      id: object.id,
      label: object.name,
      type: object.type
    })),
    properties: createProperties(scene, rendererLabel, latestObject)
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

  return transformRows;
}
