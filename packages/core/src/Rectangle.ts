import type { RectangleOptions, RectanglePoint } from "./Rectangle.type.js";

export class Rectangle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public constructor(options: RectangleOptions = {}) {
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.width = Math.max(0, options.width ?? 0);
    this.height = Math.max(0, options.height ?? 0);
  }

  public get left(): number {
    return this.x;
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get top(): number {
    return this.y;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public set(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
  }

  public clone(): Rectangle {
    return new Rectangle({ x: this.x, y: this.y, width: this.width, height: this.height });
  }

  public containsPoint(point: RectanglePoint): boolean {
    return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
  }

  public intersects(rectangle: Rectangle): boolean {
    return this.left <= rectangle.right && this.right >= rectangle.left && this.top <= rectangle.bottom && this.bottom >= rectangle.top;
  }
}
