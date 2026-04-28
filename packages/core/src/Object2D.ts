import { Matrix3 } from "./Matrix3.js";
import { resolveObject2DOrigin } from "./resolveObject2DOrigin.js";
import { uid } from "./uid.js";
import type {
  Object2DDirtyState,
  Object2DMatrixState,
  Object2DOptions,
  Object2DOriginValue,
  Object2DRenderMode,
  Object2DTransform
} from "./Object2D.type.js";

export class Object2D {
  public readonly id: string;
  public name: string;
  private _zIndex: number;
  private _visible: boolean;
  private _renderMode: Object2DRenderMode;
  private _version = 0;
  private readonly localMatrix = new Matrix3();
  private readonly worldMatrix = new Matrix3();
  private localMatrixDirty = true;
  private worldMatrixDirty = true;
  private dirty = true;
  private _x: number;
  private _y: number;
  private _originX: number;
  private _originY: number;
  private _rotation: number;
  private _scaleX: number;
  private _scaleY: number;

  public constructor(options: Object2DOptions = {}) {
    this.id = uid("object");
    this.name = options.name ?? "";
    this._x = options.x ?? 0;
    this._y = options.y ?? 0;
    const origin = resolveObject2DOrigin(options.origin ?? "top-left");
    this._originX = origin.x;
    this._originY = origin.y;
    this._rotation = options.rotation ?? 0;
    this._scaleX = options.scaleX ?? 1;
    this._scaleY = options.scaleY ?? 1;
    this._zIndex = options.zIndex ?? 0;
    this._visible = options.visible ?? true;
    this._renderMode = options.renderMode ?? "dynamic";
  }

  public get version(): number {
    return this._version;
  }

  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    this._x = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this._y = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get originX(): number {
    return this._originX;
  }

  public set originX(value: number) {
    this._originX = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get originY(): number {
    return this._originY;
  }

  public set originY(value: number) {
    this._originY = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(value: number) {
    this._rotation = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get scaleX(): number {
    return this._scaleX;
  }

  public set scaleX(value: number) {
    this._scaleX = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get scaleY(): number {
    return this._scaleY;
  }

  public set scaleY(value: number) {
    this._scaleY = value;
    this.markMatrixDirty();
    this.markDirty();
  }

  public get zIndex(): number {
    return this._zIndex;
  }

  public set zIndex(value: number) {
    this._zIndex = value;
    this.markDirty();
  }

  public get visible(): boolean {
    return this._visible;
  }

  public set visible(value: boolean) {
    this._visible = value;
    this.markDirty();
  }

  public get renderMode(): Object2DRenderMode {
    return this._renderMode;
  }

  public set renderMode(value: Object2DRenderMode) {
    this._renderMode = value;
    this.markDirty();
  }

  public setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
    this.markMatrixDirty();
    this.markDirty();
  }

  public setScale(scaleX: number, scaleY = scaleX): void {
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this.markMatrixDirty();
    this.markDirty();
  }

  public setOrigin(origin: Object2DOriginValue): void {
    const nextOrigin = resolveObject2DOrigin(origin);
    this._originX = nextOrigin.x;
    this._originY = nextOrigin.y;
    this.markMatrixDirty();
    this.markDirty();
  }

  public setZIndex(zIndex: number): void { this.zIndex = zIndex; }

  public setRenderMode(renderMode: Object2DRenderMode): void { this.renderMode = renderMode; }

  public getTransform(): Object2DTransform {
    return {
      x: this._x,
      y: this._y,
      originX: this._originX,
      originY: this._originY,
      rotation: this._rotation,
      scaleX: this._scaleX,
      scaleY: this._scaleY
    };
  }

  public markMatrixDirty(): void {
    this.localMatrixDirty = true;
    this.worldMatrixDirty = true;
  }

  public markDirty(): void {
    this._version += 1;
    this.dirty = true;
  }

  public markClean(): void {
    this.dirty = false;
  }

  public getDirtyState(): Object2DDirtyState {
    return {
      version: this._version,
      dirty: this.dirty
    };
  }

  public updateMatrix(): void {
    if (!this.localMatrixDirty) {
      return;
    }

    this.localMatrix.compose(this._x, this._y, this._rotation, this._scaleX, this._scaleY);
    this.localMatrixDirty = false;
    this.worldMatrixDirty = true;
  }

  public updateWorldMatrix(parentMatrix?: Matrix3): void {
    this.updateMatrix();

    if (parentMatrix) {
      this.worldMatrix.multiplyMatrices(parentMatrix, this.localMatrix);
    } else {
      this.worldMatrix.copy(this.localMatrix);
    }

    this.worldMatrixDirty = false;
  }

  public getLocalMatrix(): Matrix3 {
    this.updateMatrix();
    return this.localMatrix;
  }

  public getWorldMatrix(): Matrix3 {
    if (this.worldMatrixDirty) {
      this.updateWorldMatrix();
    }

    return this.worldMatrix;
  }

  public getMatrixState(): Object2DMatrixState {
    return {
      localMatrixDirty: this.localMatrixDirty,
      worldMatrixDirty: this.worldMatrixDirty
    };
  }
}
