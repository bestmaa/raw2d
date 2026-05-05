import type { ApplyStudioKeyboardOptions, StudioKeyboardResult } from "./StudioKeyboard.type";

const arrowDeltas = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 }
} as const;

export function applyStudioKeyboardCommand(options: ApplyStudioKeyboardOptions): StudioKeyboardResult {
  if (options.command.key === "Escape") {
    return { scene: options.scene, selectedObjectId: undefined, handled: Boolean(options.selectedObjectId) };
  }

  if (!options.selectedObjectId) {
    return { scene: options.scene, selectedObjectId: options.selectedObjectId, handled: false };
  }

  if (options.command.key === "Delete" || options.command.key === "Backspace") {
    return {
      scene: {
        ...options.scene,
        objects: options.scene.objects.filter((object) => object.id !== options.selectedObjectId)
      },
      selectedObjectId: undefined,
      handled: true
    };
  }

  const delta = arrowDeltas[options.command.key as keyof typeof arrowDeltas];

  if (!delta) {
    return { scene: options.scene, selectedObjectId: options.selectedObjectId, handled: false };
  }

  const step = options.command.shiftKey ? 10 : 1;

  return {
    scene: {
      ...options.scene,
      objects: options.scene.objects.map((object) => {
        if (object.id !== options.selectedObjectId) {
          return object;
        }

        return {
          ...object,
          x: object.x + delta.x * step,
          y: object.y + delta.y * step
        };
      })
    },
    selectedObjectId: options.selectedObjectId,
    handled: true
  };
}
