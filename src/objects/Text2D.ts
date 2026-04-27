import { Object2D } from "../core/Object2D";
import { BasicMaterial } from "../materials";
import type { Text2DOptions, Text2DStyle } from "./Text2D.type";

export class Text2D extends Object2D {
  public text: string;
  public font: string;
  public align: CanvasTextAlign;
  public baseline: CanvasTextBaseline;
  public material: BasicMaterial;

  public constructor(options: Text2DOptions) {
    super(options);
    this.text = options.text;
    this.font = options.font ?? "24px sans-serif";
    this.align = options.align ?? "start";
    this.baseline = options.baseline ?? "alphabetic";
    this.material = options.material ?? new BasicMaterial({ fillColor: "#ffffff" });
  }

  public setText(text: string): void {
    this.text = text;
  }

  public setFont(font: string): void {
    this.font = font;
  }

  public getStyle(): Text2DStyle {
    return {
      font: this.font,
      align: this.align,
      baseline: this.baseline
    };
  }
}
