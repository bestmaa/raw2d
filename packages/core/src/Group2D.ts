import { Object2D } from "./Object2D.js";
import type { Group2DChild, Group2DLike, Group2DOptions } from "./Group2D.type.js";

export class Group2D extends Object2D implements Group2DLike {
  private readonly children: Group2DChild[] = [];

  public constructor(options: Group2DOptions = {}) {
    super(options);

    for (const child of options.children ?? []) {
      this.add(child);
    }
  }

  public add(child: Group2DChild): this {
    if (child === this) {
      throw new Error("Group2D cannot add itself as a child.");
    }

    if (!this.children.includes(child)) {
      this.children.push(child);
    }

    return this;
  }

  public remove(child: Group2DChild): this {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.children.splice(index, 1);
    }

    return this;
  }

  public clear(): void {
    this.children.length = 0;
  }

  public getChildren(): readonly Group2DChild[] {
    return this.children;
  }
}
