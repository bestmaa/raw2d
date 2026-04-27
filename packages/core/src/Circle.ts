import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { CircleOptions, CircleSize } from "./Circle.type.js";

export class Circle extends Object2D {
  public radius: number;
  public material: BasicMaterial;

  public constructor(options: CircleOptions) {
    super(options);
    this.radius = Math.max(0, options.radius);
    this.material = options.material ?? new BasicMaterial({ fillColor: "#35c2ff" });
  }

  public setRadius(radius: number): void {
    this.radius = Math.max(0, radius);
  }

  public getSize(): CircleSize {
    return {
      radius: this.radius,
      diameter: this.radius * 2
    };
  }
}
