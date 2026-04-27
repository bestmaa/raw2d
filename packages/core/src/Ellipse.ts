import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { EllipseOptions, EllipseSize } from "./Ellipse.type.js";

export class Ellipse extends Object2D {
  public radiusX: number;
  public radiusY: number;
  public material: BasicMaterial;

  public constructor(options: EllipseOptions) {
    super(options);
    if (options.origin === undefined) {
      this.setOrigin("center");
    }
    this.radiusX = Math.max(0, options.radiusX);
    this.radiusY = Math.max(0, options.radiusY);
    this.material = options.material ?? new BasicMaterial({ fillColor: "#a78bfa" });
  }

  public setRadii(radiusX: number, radiusY: number): void {
    this.radiusX = Math.max(0, radiusX);
    this.radiusY = Math.max(0, radiusY);
  }

  public getSize(): EllipseSize {
    return {
      radiusX: this.radiusX,
      radiusY: this.radiusY,
      width: this.radiusX * 2,
      height: this.radiusY * 2
    };
  }
}
