import type { WebGLLocalPoint } from "./WebGLPathGeometry.type.js";

const epsilon = 1e-8;

export function triangulateWebGLPolygon(points: readonly WebGLLocalPoint[]): readonly WebGLLocalPoint[] {
  const vertices = normalizePolygonPoints(points);

  if (vertices.length < 3) {
    return [];
  }

  if (vertices.length === 3) {
    return Math.abs(getSignedArea(vertices)) <= epsilon ? [] : vertices;
  }

  return earClip(vertices);
}

function earClip(vertices: readonly WebGLLocalPoint[]): readonly WebGLLocalPoint[] {
  const indices = vertices.map((_, index) => index);
  const triangles: WebGLLocalPoint[] = [];
  const clockwise = getSignedArea(vertices) < 0;
  let guard = vertices.length * vertices.length;

  while (indices.length > 3 && guard > 0) {
    const earIndex = findEarIndex(vertices, indices, clockwise);

    if (earIndex < 0) {
      return createFanTriangles(vertices);
    }

    pushEarTriangle(triangles, vertices, indices, earIndex);
    indices.splice(earIndex, 1);
    guard -= 1;
  }

  if (indices.length === 3) {
    triangles.push(vertices[indices[0]], vertices[indices[1]], vertices[indices[2]]);
  }

  return triangles;
}

function findEarIndex(vertices: readonly WebGLLocalPoint[], indices: readonly number[], clockwise: boolean): number {
  for (let index = 0; index < indices.length; index += 1) {
    if (isEar(vertices, indices, index, clockwise)) {
      return index;
    }
  }

  return -1;
}

function isEar(vertices: readonly WebGLLocalPoint[], indices: readonly number[], index: number, clockwise: boolean): boolean {
  const previous = vertices[indices[(index - 1 + indices.length) % indices.length]];
  const current = vertices[indices[index]];
  const next = vertices[indices[(index + 1) % indices.length]];

  if (!isConvex(previous, current, next, clockwise)) {
    return false;
  }

  return !indices.some((pointIndex, candidateIndex) => {
    if (candidateIndex === index || candidateIndex === (index - 1 + indices.length) % indices.length || candidateIndex === (index + 1) % indices.length) {
      return false;
    }

    return isPointInTriangle(vertices[pointIndex], previous, current, next);
  });
}

function isConvex(previous: WebGLLocalPoint, current: WebGLLocalPoint, next: WebGLLocalPoint, clockwise: boolean): boolean {
  const cross = getCross(previous, current, next);
  return clockwise ? cross < -epsilon : cross > epsilon;
}

function isPointInTriangle(point: WebGLLocalPoint, a: WebGLLocalPoint, b: WebGLLocalPoint, c: WebGLLocalPoint): boolean {
  const areaA = getCross(point, a, b);
  const areaB = getCross(point, b, c);
  const areaC = getCross(point, c, a);
  const hasNegative = areaA < -epsilon || areaB < -epsilon || areaC < -epsilon;
  const hasPositive = areaA > epsilon || areaB > epsilon || areaC > epsilon;
  return !(hasNegative && hasPositive);
}

function pushEarTriangle(triangles: WebGLLocalPoint[], vertices: readonly WebGLLocalPoint[], indices: readonly number[], index: number): void {
  triangles.push(
    vertices[indices[(index - 1 + indices.length) % indices.length]],
    vertices[indices[index]],
    vertices[indices[(index + 1) % indices.length]]
  );
}

function createFanTriangles(vertices: readonly WebGLLocalPoint[]): readonly WebGLLocalPoint[] {
  const triangles: WebGLLocalPoint[] = [];

  for (let index = 1; index < vertices.length - 1; index += 1) {
    triangles.push(vertices[0], vertices[index], vertices[index + 1]);
  }

  return triangles;
}

function normalizePolygonPoints(points: readonly WebGLLocalPoint[]): readonly WebGLLocalPoint[] {
  const vertices = points.map((point) => ({ x: point.x, y: point.y }));
  const first = vertices[0];
  const last = vertices.at(-1);

  if (first && last && first.x === last.x && first.y === last.y) {
    vertices.pop();
  }

  return vertices;
}

function getSignedArea(points: readonly WebGLLocalPoint[]): number {
  let area = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }

  return area / 2;
}

function getCross(a: WebGLLocalPoint, b: WebGLLocalPoint, c: WebGLLocalPoint): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

