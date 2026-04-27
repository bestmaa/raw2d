import { Rect, getRectLocalBounds, getWorldBounds, pickObject } from "raw2d-core";
import type { Rectangle } from "raw2d-core";
import { endObjectDrag } from "./endObjectDrag.js";
import { endObjectResize } from "./endObjectResize.js";
import { getInteractionPoint } from "./getInteractionPoint.js";
import { getResizeHandles } from "./getResizeHandles.js";
import { pickResizeHandle } from "./pickResizeHandle.js";
import { capturePointer, releasePointer } from "./pointerCapture.js";
import { SelectionManager } from "./SelectionManager.js";
import { startObjectDrag } from "./startObjectDrag.js";
import { startObjectResize } from "./startObjectResize.js";
import { updateObjectDrag } from "./updateObjectDrag.js";
import { updateObjectResize } from "./updateObjectResize.js";
import type {
  InteractionControllerFeatureFlags,
  InteractionControllerOptions,
  InteractionControllerPointerEvent,
  InteractionControllerSnapshot,
  InteractionControllerState,
  InteractionMode,
  ResizableInteractionObject
} from "./InteractionController.type.js";
import type { ResizeHandle } from "./ResizeHandle.type.js";

const defaultHandleSize = 10;

export class InteractionController {
  private readonly options: InteractionControllerOptions;
  private readonly selection: SelectionManager;
  private readonly features: InteractionControllerFeatureFlags = { selection: false, drag: false, resize: false };
  private readonly state: InteractionControllerState = {
    mode: "idle",
    point: null,
    hoveredHandle: null,
    dragState: null,
    resizeState: null
  };

  public constructor(options: InteractionControllerOptions) {
    this.options = options;
    this.selection = options.selection ?? new SelectionManager();
    options.canvas.addEventListener("pointerdown", this.boundPointerDown);
    options.canvas.addEventListener("pointermove", this.boundPointerMove);
    options.canvas.addEventListener("pointerup", this.boundPointerUp);
    options.canvas.addEventListener("pointercancel", this.boundPointerCancel);
  }

  public enableSelection(): void {
    this.features.selection = true;
  }

  public enableDrag(): void {
    this.features.drag = true;
  }

  public enableResize(): void {
    this.features.resize = true;
  }

  public disableSelection(): void {
    this.features.selection = false;
  }

  public disableDrag(): void {
    this.features.drag = false;
  }

  public disableResize(): void {
    this.features.resize = false;
  }

  public getSelection(): SelectionManager {
    return this.selection;
  }

  public getMode(): InteractionMode {
    return this.state.mode;
  }

  public getHoveredResizeHandle(): ResizeHandle | null {
    return this.state.hoveredHandle;
  }

  public getResizeHandles(): readonly ResizeHandle[] {
    const rect = this.getPrimaryResizableObject();

    if (!rect) {
      return [];
    }

    return getResizeHandles({ bounds: this.getRectBounds(rect), size: this.options.handleSize ?? defaultHandleSize });
  }

  public handlePointerDown(event: InteractionControllerPointerEvent): void {
    const point = this.updatePoint(event);
    const resizeHandle = this.features.resize ? pickResizeHandle({ handles: this.getResizeHandles(), x: point.x, y: point.y }) : null;

    if (resizeHandle) {
      this.startResize(resizeHandle, point.x, point.y);
      capturePointer(this.options.canvas, event);
      this.emitChange();
      return;
    }

    const picked = pickObject({
      scene: this.options.scene,
      x: point.x,
      y: point.y,
      tolerance: this.options.pickTolerance,
      filter: this.options.filter
    });

    if (picked && this.features.selection) {
      this.selection.select(picked, { append: event.shiftKey, toggle: event.shiftKey });
    } else if (!picked && this.features.selection && !event.shiftKey) {
      this.selection.clear();
    }

    if (picked && this.features.drag) {
      this.state.dragState = startObjectDrag({ object: picked, pointerX: point.x, pointerY: point.y });
      this.state.mode = "dragging";
      this.updateCursor();
      capturePointer(this.options.canvas, event);
    }

    this.emitChange();
  }

  public handlePointerMove(event: InteractionControllerPointerEvent): void {
    const point = this.updatePoint(event);

    if (this.state.resizeState) {
      updateObjectResize({ state: this.state.resizeState, pointerX: point.x, pointerY: point.y });
      this.emitChange();
      return;
    }

    if (this.state.dragState) {
      updateObjectDrag({ state: this.state.dragState, pointerX: point.x, pointerY: point.y });
      this.emitChange();
      return;
    }

    this.state.hoveredHandle = this.features.resize ? pickResizeHandle({ handles: this.getResizeHandles(), x: point.x, y: point.y }) : null;
    this.updateCursor();
    this.emitChange();
  }

  public handlePointerUp(event: InteractionControllerPointerEvent): void {
    this.endActiveInteraction();
    releasePointer(this.options.canvas, event);
    this.emitChange();
  }

  public dispose(): void {
    this.options.canvas.removeEventListener("pointerdown", this.boundPointerDown);
    this.options.canvas.removeEventListener("pointermove", this.boundPointerMove);
    this.options.canvas.removeEventListener("pointerup", this.boundPointerUp);
    this.options.canvas.removeEventListener("pointercancel", this.boundPointerCancel);
    this.options.canvas.style.cursor = "";
  }

  public getSnapshot(): InteractionControllerSnapshot {
    return {
      mode: this.state.mode,
      point: this.state.point,
      selected: this.selection.getSelected(),
      primary: this.selection.getPrimary(),
      hoveredHandle: this.state.hoveredHandle
    };
  }

  private readonly boundPointerDown = (event: PointerEvent): void => this.handlePointerDown(event);
  private readonly boundPointerMove = (event: PointerEvent): void => this.handlePointerMove(event);
  private readonly boundPointerUp = (event: PointerEvent): void => this.handlePointerUp(event);
  private readonly boundPointerCancel = (event: PointerEvent): void => this.handlePointerUp(event);

  private updatePoint(event: InteractionControllerPointerEvent): NonNullable<InteractionControllerState["point"]> {
    const point = getInteractionPoint({
      canvas: this.options.canvas,
      event,
      camera: this.options.camera,
      width: this.options.width,
      height: this.options.height
    });
    this.state.point = point;
    return point;
  }

  private startResize(handle: ResizeHandle, pointerX: number, pointerY: number): void {
    const rect = this.getPrimaryResizableObject();

    if (!rect) {
      return;
    }

    this.state.resizeState = startObjectResize({
      object: rect,
      handleName: handle.name,
      pointerX,
      pointerY,
      minWidth: this.options.minResizeWidth,
      minHeight: this.options.minResizeHeight
    });
    this.state.hoveredHandle = handle;
    this.state.mode = "resizing";
    this.updateCursor();
  }

  private endActiveInteraction(): void {
    if (this.state.dragState) {
      endObjectDrag({ state: this.state.dragState });
    }

    if (this.state.resizeState) {
      endObjectResize({ state: this.state.resizeState });
    }

    this.state.dragState = null;
    this.state.resizeState = null;
    this.state.mode = "idle";
    this.updateCursor();
  }

  private getPrimaryResizableObject(): ResizableInteractionObject | null {
    const primary = this.selection.getPrimary();
    return primary instanceof Rect ? primary : null;
  }

  private getRectBounds(rect: Rect): Rectangle {
    return getWorldBounds({ object: rect, localBounds: getRectLocalBounds(rect) });
  }

  private updateCursor(): void {
    if (this.options.updateCursor === false) {
      return;
    }

    this.options.canvas.style.cursor = this.state.hoveredHandle?.cursor ?? (this.state.mode === "dragging" ? "grabbing" : "default");
  }

  private emitChange(): void {
    this.options.onChange?.(this.getSnapshot());
  }
}
