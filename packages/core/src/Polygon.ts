import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { PolygonOptions, PolygonPoint } from "./Polygon.type.js";

export class Polygon extends Object2D {
  public readonly points: PolygonPoint[];
  public material: BasicMaterial;

  public constructor(options: PolygonOptions) {
    super(options);
    this.points = normalizePoints(options.points);
    this.material = options.material ?? new BasicMaterial({ fillColor: "#22c55e", strokeColor: "#bbf7d0", lineWidth: 2 });
  }

  public setPoints(points: readonly PolygonPoint[]): void {
    this.points.splice(0, this.points.length, ...normalizePoints(points));
    this.markDirty();
  }

  public addPoint(x: number, y: number): void {
    this.points.push({ x, y });
    this.markDirty();
  }

  public getPoints(): readonly PolygonPoint[] {
    return this.points.map((point) => ({ x: point.x, y: point.y }));
  }
}

function normalizePoints(points: readonly PolygonPoint[]): PolygonPoint[] {
  return points.map((point) => ({ x: point.x, y: point.y }));
}
