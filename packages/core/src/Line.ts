import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { LineOptions, LinePoints } from "./Line.type.js";

export class Line extends Object2D {
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;
  public material: BasicMaterial;

  public constructor(options: LineOptions) {
    super(options);
    this.startX = options.startX ?? 0;
    this.startY = options.startY ?? 0;
    this.endX = options.endX;
    this.endY = options.endY;
    this.material = options.material ?? new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 });
  }

  public setPoints(startX: number, startY: number, endX: number, endY: number): void {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.markDirty();
  }

  public getPoints(): LinePoints {
    return {
      startX: this.startX,
      startY: this.startY,
      endX: this.endX,
      endY: this.endY
    };
  }
}
