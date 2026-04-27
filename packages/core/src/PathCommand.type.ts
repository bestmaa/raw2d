export interface MoveToCommand {
  readonly type: "moveTo";
  readonly x: number;
  readonly y: number;
}

export interface LineToCommand {
  readonly type: "lineTo";
  readonly x: number;
  readonly y: number;
}

export interface QuadraticCurveToCommand {
  readonly type: "quadraticCurveTo";
  readonly cpx: number;
  readonly cpy: number;
  readonly x: number;
  readonly y: number;
}

export interface BezierCurveToCommand {
  readonly type: "bezierCurveTo";
  readonly cp1x: number;
  readonly cp1y: number;
  readonly cp2x: number;
  readonly cp2y: number;
  readonly x: number;
  readonly y: number;
}

export interface ClosePathCommand {
  readonly type: "closePath";
}

export type PathCommand =
  | MoveToCommand
  | LineToCommand
  | QuadraticCurveToCommand
  | BezierCurveToCommand
  | ClosePathCommand;
