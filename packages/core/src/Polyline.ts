import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { PolylineOptions, PolylinePoint } from "./Polyline.type.js";

export class Polyline extends Object2D {
  public readonly points: PolylinePoint[];
  public material: BasicMaterial;

  public constructor(options: PolylineOptions) {
    super(options);
    this.points = normalizePoints(options.points);
    this.material = options.material ?? new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 5 });
  }

  public setPoints(points: readonly PolylinePoint[]): void {
    this.points.splice(0, this.points.length, ...normalizePoints(points));
  }

  public addPoint(x: number, y: number): void {
    this.points.push({ x, y });
  }

  public getPoints(): readonly PolylinePoint[] {
    return this.points.map((point) => ({ x: point.x, y: point.y }));
  }
}

function normalizePoints(points: readonly PolylinePoint[]): PolylinePoint[] {
  return points.map((point) => ({ x: point.x, y: point.y }));
}
