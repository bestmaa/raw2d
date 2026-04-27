import { BasicMaterial } from "./BasicMaterial.js";
import { Object2D } from "./Object2D.js";
import type { PathCommand } from "./PathCommand.type.js";
import type { ShapePathOptions } from "./ShapePath.type.js";

export class ShapePath extends Object2D {
  public readonly commands: PathCommand[];
  public material: BasicMaterial;
  public fill: boolean;
  public stroke: boolean;

  public constructor(options: ShapePathOptions = {}) {
    super(options);
    this.commands = options.commands?.map(cloneCommand) ?? [];
    this.material = options.material ?? new BasicMaterial({ fillColor: "#38bdf8", strokeColor: "#f5f7fb", lineWidth: 2 });
    this.fill = options.fill ?? true;
    this.stroke = options.stroke ?? true;
  }

  public moveTo(x: number, y: number): ShapePath {
    this.commands.push({ type: "moveTo", x, y });
    return this;
  }

  public lineTo(x: number, y: number): ShapePath {
    this.commands.push({ type: "lineTo", x, y });
    return this;
  }

  public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): ShapePath {
    this.commands.push({ type: "quadraticCurveTo", cpx, cpy, x, y });
    return this;
  }

  public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): ShapePath {
    this.commands.push({ type: "bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y });
    return this;
  }

  public closePath(): ShapePath {
    this.commands.push({ type: "closePath" });
    return this;
  }

  public clear(): void {
    this.commands.splice(0, this.commands.length);
  }

  public setCommands(commands: readonly PathCommand[]): void {
    this.commands.splice(0, this.commands.length, ...commands.map(cloneCommand));
  }

  public getCommands(): readonly PathCommand[] {
    return this.commands.map(cloneCommand);
  }
}

function cloneCommand(command: PathCommand): PathCommand {
  return { ...command };
}
