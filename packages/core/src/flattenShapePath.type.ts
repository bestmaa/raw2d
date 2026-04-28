export interface FlattenShapePathOptions {
  readonly curveSegments?: number;
}

export interface FlattenedShapePathPoint {
  readonly x: number;
  readonly y: number;
}

export interface FlattenedShapePathSubpath {
  readonly points: readonly FlattenedShapePathPoint[];
  readonly closed: boolean;
}

export interface FlattenedShapePath {
  readonly subpaths: readonly FlattenedShapePathSubpath[];
}

