import type { BasicMaterialDirtyState, BasicMaterialOptions, BasicMaterialStrokeCap, BasicMaterialStrokeJoin } from "./BasicMaterial.type.js";

export class BasicMaterial {
  private _fillColor: string;
  private _strokeColor: string;
  private _lineWidth: number;
  private _strokeCap: BasicMaterialStrokeCap;
  private _strokeJoin: BasicMaterialStrokeJoin;
  private _miterLimit: number;
  private _version = 0;
  private dirty = true;

  public constructor(options: BasicMaterialOptions = {}) {
    this._fillColor = options.fillColor ?? "#ffffff";
    this._strokeColor = options.strokeColor ?? options.fillColor ?? "#ffffff";
    this._lineWidth = Math.max(0, options.lineWidth ?? 1);
    this._strokeCap = options.strokeCap ?? "butt";
    this._strokeJoin = options.strokeJoin ?? "miter";
    this._miterLimit = Math.max(1, options.miterLimit ?? 10);
  }

  public get version(): number {
    return this._version;
  }

  public get fillColor(): string {
    return this._fillColor;
  }

  public set fillColor(value: string) {
    this._fillColor = value;
    this.markDirty();
  }

  public get strokeColor(): string {
    return this._strokeColor;
  }

  public set strokeColor(value: string) {
    this._strokeColor = value;
    this.markDirty();
  }

  public get lineWidth(): number {
    return this._lineWidth;
  }

  public set lineWidth(value: number) {
    this._lineWidth = Math.max(0, value);
    this.markDirty();
  }

  public get strokeCap(): BasicMaterialStrokeCap {
    return this._strokeCap;
  }

  public set strokeCap(value: BasicMaterialStrokeCap) {
    this._strokeCap = value;
    this.markDirty();
  }

  public get strokeJoin(): BasicMaterialStrokeJoin {
    return this._strokeJoin;
  }

  public set strokeJoin(value: BasicMaterialStrokeJoin) {
    this._strokeJoin = value;
    this.markDirty();
  }

  public get miterLimit(): number {
    return this._miterLimit;
  }

  public set miterLimit(value: number) {
    this._miterLimit = Math.max(1, value);
    this.markDirty();
  }

  public setFillColor(color: string): void {
    this.fillColor = color;
  }

  public setStrokeColor(color: string): void {
    this.strokeColor = color;
  }

  public setLineWidth(lineWidth: number): void {
    this.lineWidth = Math.max(0, lineWidth);
  }

  public setStrokeCap(strokeCap: BasicMaterialStrokeCap): void {
    this.strokeCap = strokeCap;
  }

  public setStrokeJoin(strokeJoin: BasicMaterialStrokeJoin): void {
    this.strokeJoin = strokeJoin;
  }

  public setMiterLimit(miterLimit: number): void {
    this.miterLimit = miterLimit;
  }

  public markDirty(): void {
    this._version += 1;
    this.dirty = true;
  }

  public markClean(): void {
    this.dirty = false;
  }

  public getDirtyState(): BasicMaterialDirtyState {
    return {
      version: this._version,
      dirty: this.dirty
    };
  }
}
