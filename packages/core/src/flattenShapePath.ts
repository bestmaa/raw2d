import type { PathCommand } from "./PathCommand.type.js";
import type { ShapePath } from "./ShapePath.js";
import type { FlattenedShapePath, FlattenedShapePathPoint, FlattenShapePathOptions } from "./flattenShapePath.type.js";

const defaultCurveSegments = 16;

export function flattenShapePath(path: ShapePath, options: FlattenShapePathOptions = {}): FlattenedShapePath {
  return flattenPathCommands(path.commands, options);
}

export function flattenPathCommands(commands: readonly PathCommand[], options: FlattenShapePathOptions = {}): FlattenedShapePath {
  const context = createFlattenContext(options.curveSegments);

  for (const command of commands) {
    applyPathCommand(context, command);
  }

  return { subpaths: context.subpaths };
}

function applyPathCommand(context: FlattenContext, command: PathCommand): void {
  if (command.type === "moveTo") {
    moveTo(context, { x: command.x, y: command.y });
  } else if (command.type === "lineTo") {
    lineTo(context, { x: command.x, y: command.y });
  } else if (command.type === "quadraticCurveTo") {
    quadraticCurveTo(context, command);
  } else if (command.type === "bezierCurveTo") {
    bezierCurveTo(context, command);
  } else {
    closePath(context);
  }
}

function moveTo(context: FlattenContext, point: FlattenedShapePathPoint): void {
  const subpath: MutableSubpath = { points: [point], closed: false };
  context.subpaths.push(subpath);
  context.currentPoint = point;
  context.startPoint = point;
}

function lineTo(context: FlattenContext, point: FlattenedShapePathPoint): void {
  ensureSubpath(context);
  context.subpaths.at(-1)?.points.push(point);
  context.currentPoint = point;
}

function quadraticCurveTo(context: FlattenContext, command: Extract<PathCommand, { readonly type: "quadraticCurveTo" }>): void {
  const start = context.currentPoint ?? { x: 0, y: 0 };

  if (!context.currentPoint) {
    moveTo(context, start);
  }

  for (let index = 1; index <= context.curveSegments; index += 1) {
    const t = index / context.curveSegments;
    lineTo(context, {
      x: getQuadraticValue(start.x, command.cpx, command.x, t),
      y: getQuadraticValue(start.y, command.cpy, command.y, t)
    });
  }
}

function bezierCurveTo(context: FlattenContext, command: Extract<PathCommand, { readonly type: "bezierCurveTo" }>): void {
  const start = context.currentPoint ?? { x: 0, y: 0 };

  if (!context.currentPoint) {
    moveTo(context, start);
  }

  for (let index = 1; index <= context.curveSegments; index += 1) {
    const t = index / context.curveSegments;
    lineTo(context, {
      x: getCubicValue(start.x, command.cp1x, command.cp2x, command.x, t),
      y: getCubicValue(start.y, command.cp1y, command.cp2y, command.y, t)
    });
  }
}

function closePath(context: FlattenContext): void {
  const subpath = context.subpaths.at(-1);

  if (!subpath || !context.startPoint) {
    return;
  }

  subpath.closed = true;
  context.currentPoint = context.startPoint;
}

function ensureSubpath(context: FlattenContext): void {
  if (!context.currentPoint) {
    moveTo(context, { x: 0, y: 0 });
  }
}

function getQuadraticValue(start: number, control: number, end: number, t: number): number {
  const inverse = 1 - t;
  return inverse * inverse * start + 2 * inverse * t * control + t * t * end;
}

function getCubicValue(start: number, controlA: number, controlB: number, end: number, t: number): number {
  const inverse = 1 - t;
  return inverse ** 3 * start + 3 * inverse ** 2 * t * controlA + 3 * inverse * t ** 2 * controlB + t ** 3 * end;
}

function createFlattenContext(curveSegments = defaultCurveSegments): FlattenContext {
  return {
    subpaths: [],
    currentPoint: null,
    startPoint: null,
    curveSegments: Math.max(1, Math.floor(curveSegments))
  };
}

interface MutableSubpath {
  points: FlattenedShapePathPoint[];
  closed: boolean;
}

interface FlattenContext {
  readonly subpaths: MutableSubpath[];
  currentPoint: FlattenedShapePathPoint | null;
  startPoint: FlattenedShapePathPoint | null;
  readonly curveSegments: number;
}
