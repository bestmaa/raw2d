import type { BasicMaterialDirtyState, BasicMaterialOptions } from "./BasicMaterial.type.js";

export class BasicMaterial {
  private _fillColor: string;
  private _strokeColor: string;
  private _lineWidth: number;
  private _version = 0;
  private dirty = true;

  public constructor(options: BasicMaterialOptions = {}) {
    this._fillColor = options.fillColor ?? "#ffffff";
    this._strokeColor = options.strokeColor ?? options.fillColor ?? "#ffffff";
    this._lineWidth = Math.max(0, options.lineWidth ?? 1);
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

  public setFillColor(color: string): void {
    this.fillColor = color;
  }

  public setStrokeColor(color: string): void {
    this.strokeColor = color;
  }

  public setLineWidth(lineWidth: number): void {
    this.lineWidth = Math.max(0, lineWidth);
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
