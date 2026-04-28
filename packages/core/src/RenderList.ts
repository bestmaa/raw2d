import type { Object2D } from "./Object2D.js";
import type { RenderItem } from "./RenderItem.type.js";
import type { RenderListOptions, RenderListStats } from "./RenderList.type.js";

export class RenderList<TObject extends Object2D = Object2D> {
  private readonly rootItems: readonly RenderItem<TObject>[];
  private readonly flatItems: readonly RenderItem<TObject>[];
  private readonly stats: RenderListStats;

  public constructor(options: RenderListOptions<TObject>) {
    this.rootItems = options.rootItems;
    this.flatItems = options.flatItems;
    this.stats = options.stats;
  }

  public getRootItems(): readonly RenderItem<TObject>[] {
    return this.rootItems;
  }

  public getFlatItems(): readonly RenderItem<TObject>[] {
    return this.flatItems;
  }

  public getObjects(): readonly TObject[] {
    return this.flatItems.map((item) => item.object);
  }

  public getStats(): RenderListStats {
    return this.stats;
  }
}

