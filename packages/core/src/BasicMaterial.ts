import type { BasicMaterialOptions } from "./BasicMaterial.type.js";

export class BasicMaterial {
  public fillColor: string;
  public strokeColor: string;
  public lineWidth: number;

  public constructor(options: BasicMaterialOptions = {}) {
    this.fillColor = options.fillColor ?? "#ffffff";
    this.strokeColor = options.strokeColor ?? options.fillColor ?? "#ffffff";
    this.lineWidth = Math.max(0, options.lineWidth ?? 1);
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
}
