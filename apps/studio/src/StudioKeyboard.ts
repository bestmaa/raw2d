import type { ApplyStudioKeyboardOptions, StudioHistoryKeyboardAction, StudioKeyboardCommand, StudioKeyboardResult } from "./StudioKeyboard.type";
import { getPrimaryStudioSelectionId, normalizeStudioSelection } from "./StudioSelection";

const arrowDeltas = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 }
} as const;

export function applyStudioKeyboardCommand(options: ApplyStudioKeyboardOptions): StudioKeyboardResult {
  const selectedObjectIds = normalizeStudioSelection({
    scene: options.scene,
    selectedObjectIds: options.selectedObjectIds ?? (options.selectedObjectId ? [options.selectedObjectId] : [])
  });

  if (options.command.key === "Escape") {
    return {
      scene: options.scene,
      selectedObjectId: undefined,
      selectedObjectIds: [],
      handled: selectedObjectIds.length > 0
    };
  }

  if (selectedObjectIds.length === 0) {
    return { scene: options.scene, selectedObjectId: undefined, selectedObjectIds, handled: false };
  }

  if (options.command.key === "Delete" || options.command.key === "Backspace") {
    return {
      scene: {
        ...options.scene,
        objects: options.scene.objects.filter((object) => !selectedObjectIds.includes(object.id))
      },
      selectedObjectId: undefined,
      selectedObjectIds: [],
      handled: true
    };
  }

  const delta = arrowDeltas[options.command.key as keyof typeof arrowDeltas];

  if (!delta) {
    return {
      scene: options.scene,
      selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds),
      selectedObjectIds,
      handled: false
    };
  }

  const step = options.command.shiftKey ? 10 : 1;

  return {
    scene: {
      ...options.scene,
      objects: options.scene.objects.map((object) => {
        if (!selectedObjectIds.includes(object.id)) {
          return object;
        }

        return {
          ...object,
          x: object.x + delta.x * step,
          y: object.y + delta.y * step
        };
      })
    },
    selectedObjectId: getPrimaryStudioSelectionId(selectedObjectIds),
    selectedObjectIds,
    handled: true
  };
}

export function getStudioHistoryKeyboardAction(command: StudioKeyboardCommand): StudioHistoryKeyboardAction | undefined {
  if (!(command.ctrlKey || command.metaKey)) {
    return undefined;
  }

  const key = command.key.toLowerCase();

  if (key === "z" && command.shiftKey) {
    return "redo";
  }

  if (key === "z") {
    return "undo";
  }

  if (key === "y") {
    return "redo";
  }

  return undefined;
}
