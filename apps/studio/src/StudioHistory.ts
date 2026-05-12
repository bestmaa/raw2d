import { applyStudioCommand, invertStudioCommand } from "./StudioCommand";
import type { StudioCommand } from "./StudioCommand.type";
import type {
  ApplyStudioHistoryCommandOptions,
  CreateStudioHistoryOptions,
  StudioHistoryResult,
  StudioHistoryState,
  UpdateStudioHistoryOptions
} from "./StudioHistory.type";

const defaultHistoryLimit = 100;

export function createStudioHistory(options: CreateStudioHistoryOptions = {}): StudioHistoryState {
  return {
    undoStack: [],
    redoStack: [],
    limit: normalizeLimit(options.limit)
  };
}

export function applyStudioHistoryCommand(options: ApplyStudioHistoryCommandOptions): StudioHistoryResult {
  const result = applyStudioCommand({ scene: options.scene, command: options.command });

  if (!result.handled) {
    return { scene: options.scene, history: options.history, handled: false };
  }

  return {
    scene: result.scene,
    history: {
      ...options.history,
      undoStack: pushCommand(options.history.undoStack, options.command, options.history.limit),
      redoStack: []
    },
    handled: true
  };
}

export function undoStudioHistory(options: UpdateStudioHistoryOptions): StudioHistoryResult {
  const command = options.history.undoStack.at(-1);

  if (!command) {
    return { scene: options.scene, history: options.history, handled: false };
  }

  const result = applyStudioCommand({ scene: options.scene, command: invertStudioCommand(command) });

  if (!result.handled) {
    return { scene: options.scene, history: options.history, handled: false };
  }

  return {
    scene: result.scene,
    history: {
      ...options.history,
      undoStack: options.history.undoStack.slice(0, -1),
      redoStack: pushCommand(options.history.redoStack, command, options.history.limit)
    },
    handled: true
  };
}

export function redoStudioHistory(options: UpdateStudioHistoryOptions): StudioHistoryResult {
  const command = options.history.redoStack.at(-1);

  if (!command) {
    return { scene: options.scene, history: options.history, handled: false };
  }

  const result = applyStudioCommand({ scene: options.scene, command });

  if (!result.handled) {
    return { scene: options.scene, history: options.history, handled: false };
  }

  return {
    scene: result.scene,
    history: {
      ...options.history,
      undoStack: pushCommand(options.history.undoStack, command, options.history.limit),
      redoStack: options.history.redoStack.slice(0, -1)
    },
    handled: true
  };
}

function pushCommand(commands: readonly StudioCommand[], command: StudioCommand, limit: number): readonly StudioCommand[] {
  return [...commands, command].slice(-limit);
}

function normalizeLimit(limit: number | undefined): number {
  return Math.max(1, Math.floor(limit ?? defaultHistoryLimit));
}
