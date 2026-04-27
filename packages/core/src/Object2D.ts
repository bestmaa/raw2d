import { uid } from "./uid.js";
import type { Object2DOptions, Object2DOrigin, Object2DOriginValue, Object2DTransform } from "./Object2D.type.js";

export class Object2D {
  public readonly id: string;
  public name: string;
  public x: number;
  public y: number;
  public originX: number;
  public originY: number;
  public rotation: number;
  public scaleX: number;
  public scaleY: number;
  public visible: boolean;

  public constructor(options: Object2DOptions = {}) {
    this.id = uid("object");
    this.name = options.name ?? "";
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    const origin = resolveOrigin(options.origin ?? "top-left");
    this.originX = origin.x;
    this.originY = origin.y;
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

  public setOrigin(origin: Object2DOriginValue): void {
    const nextOrigin = resolveOrigin(origin);
    this.originX = nextOrigin.x;
    this.originY = nextOrigin.y;
  }

  public getTransform(): Object2DTransform {
    return {
      x: this.x,
      y: this.y,
      originX: this.originX,
      originY: this.originY,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY
    };
  }
}

function resolveOrigin(origin: Object2DOriginValue): Object2DOrigin {
  if (typeof origin !== "string") {
    return { x: origin.x, y: origin.y };
  }

  const origins: Record<string, Object2DOrigin> = {
    "top-left": { x: 0, y: 0 },
    top: { x: 0.5, y: 0 },
    "top-right": { x: 1, y: 0 },
    left: { x: 0, y: 0.5 },
    center: { x: 0.5, y: 0.5 },
    right: { x: 1, y: 0.5 },
    "bottom-left": { x: 0, y: 1 },
    bottom: { x: 0.5, y: 1 },
    "bottom-right": { x: 1, y: 1 }
  };

  return origins[origin];
}
