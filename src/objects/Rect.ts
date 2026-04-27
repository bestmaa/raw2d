import { Object2D } from "../core/Object2D";
import { BasicMaterial } from "../materials";
import type { RectOptions, RectSize } from "./Rect.type";

export class Rect extends Object2D {
  public width: number;
  public height: number;
  public material: BasicMaterial;

  public constructor(options: RectOptions) {
    super(options);
    this.width = Math.max(0, options.width);
    this.height = Math.max(0, options.height);
    this.material = options.material ?? new BasicMaterial({ fillColor: "#f45b69" });
  }

  public setSize(width: number, height: number): void {
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
  }

  public getSize(): RectSize {
    return {
      width: this.width,
      height: this.height
    };
  }
}
