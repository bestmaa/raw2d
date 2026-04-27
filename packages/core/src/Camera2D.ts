import type { Camera2DOptions, Camera2DTransform } from "./Camera2D.type.js";

export class Camera2D {
  public x: number;
  public y: number;
  public zoom: number;

  public constructor(options: Camera2DOptions = {}) {
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.zoom = Math.max(0.0001, options.zoom ?? 1);
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public setZoom(zoom: number): void {
    this.zoom = Math.max(0.0001, zoom);
  }

  public getTransform(): Camera2DTransform {
    return {
      x: this.x,
      y: this.y,
      zoom: this.zoom
    };
  }
}
