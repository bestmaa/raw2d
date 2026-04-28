import type { Object2D } from "raw2d-core";
import type {
  KeyboardControllerAction,
  KeyboardControllerFeatureFlags,
  KeyboardControllerKeyEvent,
  KeyboardControllerOptions,
  KeyboardControllerSnapshot
} from "./KeyboardController.type.js";

const defaultMoveStep = 1;
const defaultFastMoveStep = 10;

export class KeyboardController {
  private readonly options: KeyboardControllerOptions;
  private readonly features: KeyboardControllerFeatureFlags = { move: false, delete: false, clear: false };
  private lastAction: KeyboardControllerAction = "none";

  public constructor(options: KeyboardControllerOptions) {
    this.options = options;
    options.target.addEventListener("keydown", this.boundKeyDown);
  }

  public enableMove(): void { this.features.move = true; }
  public enableDelete(): void { this.features.delete = true; }
  public enableClear(): void { this.features.clear = true; }
  public disableMove(): void { this.features.move = false; }
  public disableDelete(): void { this.features.delete = false; }
  public disableClear(): void { this.features.clear = false; }

  public handleKeyDown(event: KeyboardControllerKeyEvent): void {
    const moved = this.features.move ? this.tryMove(event) : false;
    const deleted = !moved && this.features.delete ? this.tryDelete(event) : false;
    const cleared = !moved && !deleted && this.features.clear ? this.tryClear(event) : false;

    if (moved || deleted || cleared) {
      if (this.options.preventDefault !== false) {
        event.preventDefault?.();
      }

      this.emitChange();
    }
  }

  public getSnapshot(): KeyboardControllerSnapshot {
    return {
      selectedCount: this.options.selection.getSelected().length,
      lastAction: this.lastAction
    };
  }

  public dispose(): void {
    this.options.target.removeEventListener("keydown", this.boundKeyDown);
  }

  private readonly boundKeyDown = (event: KeyboardControllerKeyEvent): void => this.handleKeyDown(event);

  private tryMove(event: KeyboardControllerKeyEvent): boolean {
    const delta = this.getMoveDelta(event);

    if (!delta) {
      return false;
    }

    for (const object of this.options.selection.getSelected()) {
      moveObject(object, delta.x, delta.y);
    }

    this.lastAction = "move";
    return true;
  }

  private tryDelete(event: KeyboardControllerKeyEvent): boolean {
    if (event.key !== "Delete" && event.key !== "Backspace") {
      return false;
    }

    for (const object of this.options.selection.getSelected()) {
      this.options.scene?.remove(object);
    }

    this.options.selection.clear();
    this.lastAction = "delete";
    return true;
  }

  private tryClear(event: KeyboardControllerKeyEvent): boolean {
    if (event.key !== "Escape") {
      return false;
    }

    this.options.selection.clear();
    this.lastAction = "clear";
    return true;
  }

  private getMoveDelta(event: KeyboardControllerKeyEvent): { readonly x: number; readonly y: number } | null {
    const step = event.shiftKey ? this.options.fastMoveStep ?? defaultFastMoveStep : this.options.moveStep ?? defaultMoveStep;

    if (event.key === "ArrowLeft") {
      return { x: -step, y: 0 };
    }

    if (event.key === "ArrowRight") {
      return { x: step, y: 0 };
    }

    if (event.key === "ArrowUp") {
      return { x: 0, y: -step };
    }

    if (event.key === "ArrowDown") {
      return { x: 0, y: step };
    }

    return null;
  }

  private emitChange(): void {
    this.options.onChange?.(this.getSnapshot());
  }
}

function moveObject(object: Object2D, deltaX: number, deltaY: number): void {
  object.setPosition(object.x + deltaX, object.y + deltaY);
}
