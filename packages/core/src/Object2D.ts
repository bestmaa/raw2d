import { Matrix3 } from "./Matrix3.js";
import { uid } from "./uid.js";
import type {
  Object2DMatrixState,
  Object2DOptions,
  Object2DOrigin,
  Object2DOriginValue,
  Object2DTransform
} from "./Object2D.type.js";

export class Object2D {
  public readonly id: string;
  public name: string;
  public zIndex: number;
  public visible: boolean;
  private readonly localMatrix = new Matrix3();
  private readonly worldMatrix = new Matrix3();
  private localMatrixDirty = true;
  private worldMatrixDirty = true;
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
    const origin = resolveOrigin(options.origin ?? "top-left");
    this._originX = origin.x;
    this._originY = origin.y;
    this._rotation = options.rotation ?? 0;
    this._scaleX = options.scaleX ?? 1;
    this._scaleY = options.scaleY ?? 1;
    this.zIndex = options.zIndex ?? 0;
    this.visible = options.visible ?? true;
  }

  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    this._x = value;
    this.markMatrixDirty();
  }

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this._y = value;
    this.markMatrixDirty();
  }

  public get originX(): number {
    return this._originX;
  }

  public set originX(value: number) {
    this._originX = value;
    this.markMatrixDirty();
  }

  public get originY(): number {
    return this._originY;
  }

  public set originY(value: number) {
    this._originY = value;
    this.markMatrixDirty();
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(value: number) {
    this._rotation = value;
    this.markMatrixDirty();
  }

  public get scaleX(): number {
    return this._scaleX;
  }

  public set scaleX(value: number) {
    this._scaleX = value;
    this.markMatrixDirty();
  }

  public get scaleY(): number {
    return this._scaleY;
  }

  public set scaleY(value: number) {
    this._scaleY = value;
    this.markMatrixDirty();
  }

  public setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
    this.markMatrixDirty();
  }

  public setScale(scaleX: number, scaleY = scaleX): void {
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this.markMatrixDirty();
  }

  public setOrigin(origin: Object2DOriginValue): void {
    const nextOrigin = resolveOrigin(origin);
    this._originX = nextOrigin.x;
    this._originY = nextOrigin.y;
    this.markMatrixDirty();
  }

  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex;
  }

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

function resolveOrigin(origin: Object2DOriginValue): Object2DOrigin {
  if (typeof origin !== "string") {
    return { x: origin.x, y: origin.y };
  }

  const origins: Record<string, Object2DOrigin> = {
    "top-left": { x: 0, y: 0 },
    top: { x: 0.5, y: 0 },
    "top-right": { x: 1, y: 0 },
    left: { x: 0, y: 0.5 },
    center: { x: 0.5, y: 0.5 },
    right: { x: 1, y: 0.5 },
    "bottom-left": { x: 0, y: 1 },
    bottom: { x: 0.5, y: 1 },
    "bottom-right": { x: 1, y: 1 }
  };

  return origins[origin];
}
