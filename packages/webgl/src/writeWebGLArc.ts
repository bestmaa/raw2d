import type { Arc } from "raw2d-core";
import { toClipPoint, writeWebGLVertex } from "./WebGLVertex.js";
import { getWebGLStrokeVertexCount, writeWebGLStroke } from "./writeWebGLStroke.js";
import type { WebGLLocalPoint, WebGLShapeWriteOptions } from "./WebGLPathGeometry.type.js";

const fullCircle = Math.PI * 2;

export function getWebGLArcVertexCount(arc: Arc, curveSegments: number): number {
  const points = getArcPoints(arc, curveSegments);
  return arc.closed ? Math.max(0, points.length - 1) * 3 : getWebGLStrokeVertexCount(points);
}

export function writeWebGLArc(vertices: Float32Array, offset: number, arc: Arc, options: WebGLShapeWriteOptions): number {
  const points = getArcPoints(arc, options.curveSegments);

  if (arc.closed) {
    return writeClosedArc(vertices, offset, arc, points, options);
  }

  return writeWebGLStroke(vertices, offset, points, {
    ...options,
    color: options.strokeColor,
    lineWidth: arc.material.lineWidth
  });
}

function writeClosedArc(
  vertices: Float32Array,
  offset: number,
  arc: Arc,
  points: readonly WebGLLocalPoint[],
  options: WebGLShapeWriteOptions
): number {
  const center = getArcCenter(arc);

  for (let index = 1; index < points.length; index += 1) {
    offset = writePoint(vertices, offset, center, options);
    offset = writePoint(vertices, offset, points[index - 1], options);
    offset = writePoint(vertices, offset, points[index], options);
  }

  return offset;
}

function getArcPoints(arc: Arc, curveSegments: number): readonly WebGLLocalPoint[] {
  const sweep = getArcSweep(arc);

  if (sweep === 0 || arc.radiusX <= 0 || arc.radiusY <= 0) {
    return [];
  }

  const segmentCount = Math.max(1, Math.ceil((Math.abs(sweep) / fullCircle) * curveSegments));
  const center = getArcCenter(arc);
  const points: WebGLLocalPoint[] = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const angle = arc.startAngle + (sweep * index) / segmentCount;
    points.push({
      x: center.x + Math.cos(angle) * arc.radiusX,
      y: center.y + Math.sin(angle) * arc.radiusY
    });
  }

  return points;
}

function getArcSweep(arc: Arc): number {
  let endAngle = arc.endAngle;

  if (arc.anticlockwise) {
    while (endAngle > arc.startAngle) {
      endAngle -= fullCircle;
    }
  } else {
    while (endAngle < arc.startAngle) {
      endAngle += fullCircle;
    }
  }

  return endAngle - arc.startAngle;
}

function getArcCenter(arc: Arc): WebGLLocalPoint {
  return {
    x: arc.radiusX - arc.radiusX * 2 * arc.originX,
    y: arc.radiusY - arc.radiusY * 2 * arc.originY
  };
}

function writePoint(vertices: Float32Array, offset: number, point: WebGLLocalPoint, options: WebGLShapeWriteOptions): number {
  const clip = toClipPoint(point.x, point.y, options.matrix, options);
  return writeWebGLVertex(vertices, offset, clip.x, clip.y, options.color);
}

