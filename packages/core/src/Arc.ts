import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { ArcAngles, ArcOptions } from "./Arc.type.js";

export class Arc extends Object2D {
  public radiusX: number;
  public radiusY: number;
  public startAngle: number;
  public endAngle: number;
  public anticlockwise: boolean;
  public closed: boolean;
  public material: BasicMaterial;

  public constructor(options: ArcOptions) {
    super(options);
    if (options.origin === undefined) {
      this.setOrigin("center");
    }
    this.radiusX = Math.max(0, options.radiusX);
    this.radiusY = Math.max(0, options.radiusY);
    this.startAngle = options.startAngle;
    this.endAngle = options.endAngle;
    this.anticlockwise = options.anticlockwise ?? false;
    this.closed = options.closed ?? false;
    this.material = options.material ?? new BasicMaterial({ strokeColor: "#f97316", lineWidth: 6 });
  }

  public setRadii(radiusX: number, radiusY: number): void {
    this.radiusX = Math.max(0, radiusX);
    this.radiusY = Math.max(0, radiusY);
  }

  public setAngles(startAngle: number, endAngle: number, anticlockwise = this.anticlockwise): void {
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.anticlockwise = anticlockwise;
  }

  public getAngles(): ArcAngles {
    return {
      startAngle: this.startAngle,
      endAngle: this.endAngle,
      anticlockwise: this.anticlockwise
    };
  }
}
