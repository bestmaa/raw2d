import { Object2D } from "../core/Object2D";
import { BasicMaterial } from "../materials";
import type { CircleOptions, CircleSize } from "./Circle.type";

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
