import type { Matrix3Elements, Matrix3Point } from "./Matrix3.type.js";

export class Matrix3 {
  private readonly elements: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  public set(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number): this {
    this.elements[0] = a;
    this.elements[1] = b;
    this.elements[2] = c;
    this.elements[3] = d;
    this.elements[4] = e;
    this.elements[5] = f;
    this.elements[6] = g;
    this.elements[7] = h;
    this.elements[8] = i;
    return this;
  }

  public identity(): this {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  public copy(matrix: Matrix3): this {
    const elements = matrix.getElements();
    return this.set(...elements);
  }

  public clone(): Matrix3 {
    return new Matrix3().copy(this);
  }

  public getElements(): Matrix3Elements {
    return [
      this.elements[0],
      this.elements[1],
      this.elements[2],
      this.elements[3],
      this.elements[4],
      this.elements[5],
      this.elements[6],
      this.elements[7],
      this.elements[8]
    ];
  }

  public compose(x: number, y: number, rotation: number, scaleX: number, scaleY: number): this {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    return this.set(cos * scaleX, -sin * scaleY, x, sin * scaleX, cos * scaleY, y, 0, 0, 1);
  }

  public multiply(matrix: Matrix3): this {
    return this.multiplyMatrices(this, matrix);
  }

  public premultiply(matrix: Matrix3): this {
    return this.multiplyMatrices(matrix, this);
  }

  public multiplyMatrices(left: Matrix3, right: Matrix3): this {
    const a = left.getElements();
    const b = right.getElements();
    return this.set(
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
    );
  }

  public invert(): boolean {
    const m = this.getElements();
    const t00 = m[4] * m[8] - m[5] * m[7];
    const t01 = m[2] * m[7] - m[1] * m[8];
    const t02 = m[1] * m[5] - m[2] * m[4];
    const determinant = m[0] * t00 + m[3] * t01 + m[6] * t02;

    if (Math.abs(determinant) <= Number.EPSILON) {
      return false;
    }

    const inverse = 1 / determinant;
    this.set(
      t00 * inverse,
      t01 * inverse,
      t02 * inverse,
      (m[5] * m[6] - m[3] * m[8]) * inverse,
      (m[0] * m[8] - m[2] * m[6]) * inverse,
      (m[2] * m[3] - m[0] * m[5]) * inverse,
      (m[3] * m[7] - m[4] * m[6]) * inverse,
      (m[1] * m[6] - m[0] * m[7]) * inverse,
      (m[0] * m[4] - m[1] * m[3]) * inverse
    );
    return true;
  }

  public transformPoint(point: Matrix3Point): Matrix3Point {
    return {
      x: this.elements[0] * point.x + this.elements[1] * point.y + this.elements[2],
      y: this.elements[3] * point.x + this.elements[4] * point.y + this.elements[5]
    };
  }
}

