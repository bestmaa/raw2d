import { getInteractionPoint } from "./getInteractionPoint.js";
import { capturePointer, releasePointer } from "./pointerCapture.js";
import type {
  CameraControlsFeatureFlags,
  CameraControlsOptions,
  CameraControlsPointerEvent,
  CameraControlsSnapshot,
  CameraControlsState,
  CameraControlsWheelEvent
} from "./CameraControls.type.js";

const defaultMinZoom = 0.1;
const defaultMaxZoom = 8;
const defaultZoomSpeed = 0.001;
const defaultPanButton = 1;

export class CameraControls {
  private readonly options: CameraControlsOptions;
  private readonly features: CameraControlsFeatureFlags = { pan: false, zoom: false };
  private readonly state: CameraControlsState = { mode: "idle", lastPoint: null };
  private panButton: number;

  public constructor(options: CameraControlsOptions) {
    this.options = options;
    this.panButton = options.panButton ?? defaultPanButton;
    options.target.addEventListener("wheel", this.boundWheel, { passive: false });
    options.target.addEventListener("pointerdown", this.boundPointerDown);
    options.target.addEventListener("pointermove", this.boundPointerMove);
    options.target.addEventListener("pointerup", this.boundPointerUp);
    options.target.addEventListener("pointercancel", this.boundPointerCancel);
  }

  public enablePan(button = this.panButton): void {
    this.features.pan = true;
    this.panButton = button;
  }

  public enableZoom(): void { this.features.zoom = true; }

  public disablePan(): void { this.features.pan = false; }

  public disableZoom(): void { this.features.zoom = false; }

  public handleWheel(event: CameraControlsWheelEvent): void {
    if (!this.features.zoom) {
      return;
    }

    this.preventDefault(event);
    const point = this.getPoint(event);
    const currentZoom = this.options.camera.zoom;
    const nextZoom = this.clampZoom(currentZoom * Math.exp(-event.deltaY * (this.options.zoomSpeed ?? defaultZoomSpeed)));

    if (nextZoom === currentZoom) {
      return;
    }

    this.options.camera.setPosition(point.x - point.canvasX / nextZoom, point.y - point.canvasY / nextZoom);
    this.options.camera.setZoom(nextZoom);
    this.emitChange();
  }

  public handlePointerDown(event: CameraControlsPointerEvent): void {
    if (!this.features.pan || (event.button ?? 0) !== this.panButton) {
      return;
    }

    this.preventDefault(event);
    this.state.mode = "panning";
    this.state.lastPoint = this.getPoint(event);
    capturePointer(this.options.target, event);
    this.emitChange();
  }

  public handlePointerMove(event: CameraControlsPointerEvent): void {
    if (this.state.mode !== "panning" || !this.state.lastPoint) {
      return;
    }

    this.preventDefault(event);
    const point = this.getPoint(event);
    const deltaX = (point.canvasX - this.state.lastPoint.canvasX) / this.options.camera.zoom;
    const deltaY = (point.canvasY - this.state.lastPoint.canvasY) / this.options.camera.zoom;
    this.options.camera.setPosition(this.options.camera.x - deltaX, this.options.camera.y - deltaY);
    this.state.lastPoint = point;
    this.emitChange();
  }

  public handlePointerUp(event: CameraControlsPointerEvent): void {
    if (this.state.mode !== "panning") {
      return;
    }

    this.state.mode = "idle";
    this.state.lastPoint = null;
    releasePointer(this.options.target, event);
    this.emitChange();
  }

  public getSnapshot(): CameraControlsSnapshot {
    return {
      mode: this.state.mode,
      camera: this.options.camera.getTransform()
    };
  }

  public dispose(): void {
    this.options.target.removeEventListener("wheel", this.boundWheel);
    this.options.target.removeEventListener("pointerdown", this.boundPointerDown);
    this.options.target.removeEventListener("pointermove", this.boundPointerMove);
    this.options.target.removeEventListener("pointerup", this.boundPointerUp);
    this.options.target.removeEventListener("pointercancel", this.boundPointerCancel);
  }

  private readonly boundWheel = (event: WheelEvent): void => this.handleWheel(event);
  private readonly boundPointerDown = (event: PointerEvent): void => this.handlePointerDown(event);
  private readonly boundPointerMove = (event: PointerEvent): void => this.handlePointerMove(event);
  private readonly boundPointerUp = (event: PointerEvent): void => this.handlePointerUp(event);
  private readonly boundPointerCancel = (event: PointerEvent): void => this.handlePointerUp(event);

  private getPoint(event: CameraControlsPointerEvent | CameraControlsWheelEvent): ReturnType<typeof getInteractionPoint> {
    return getInteractionPoint({
      canvas: this.options.target,
      event,
      camera: this.options.camera,
      width: this.options.width,
      height: this.options.height
    });
  }

  private clampZoom(zoom: number): number {
    const minZoom = this.options.minZoom ?? defaultMinZoom;
    const maxZoom = this.options.maxZoom ?? defaultMaxZoom;
    return Math.min(Math.max(zoom, minZoom), maxZoom);
  }

  private preventDefault(event: CameraControlsPointerEvent | CameraControlsWheelEvent): void {
    if (this.options.preventDefault !== false) {
      event.preventDefault?.();
    }
  }

  private emitChange(): void {
    this.options.onChange?.(this.getSnapshot());
  }
}
