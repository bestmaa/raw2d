import { uid } from "./uid.js";
import type { Object2DOptions, Object2DTransform } from "./Object2D.type.js";

export class Object2D {
  public readonly id: string;
  public name: string;
  public x: number;
  public y: number;
  public rotation: number;
  public scaleX: number;
  public scaleY: number;
  public visible: boolean;

  public constructor(options: Object2DOptions = {}) {
    this.id = uid("object");
    this.name = options.name ?? "";
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.rotation = options.rotation ?? 0;
    this.scaleX = options.scaleX ?? 1;
    this.scaleY = options.scaleY ?? 1;
    this.visible = options.visible ?? true;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public setScale(scaleX: number, scaleY = scaleX): void {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  public getTransform(): Object2DTransform {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY
    };
  }
}
