import { Group2D } from "./Group2D.js";
import type { Object2D } from "./Object2D.js";
import type { Rectangle } from "./Rectangle.js";
import { RenderList } from "./RenderList.js";
import type { RenderItem } from "./RenderItem.type.js";
import type { RenderListStats } from "./RenderList.type.js";
import { getCameraWorldBounds } from "./getCameraWorldBounds.js";
import { sortRenderObjects } from "./sortRenderObjects.js";
import type {
  RenderBoundsProvider,
  RenderObjectFilter,
  RenderPipelineBuildOptions,
  RenderPipelineOptions
} from "./RenderPipeline.type.js";

interface MutableStats {
  total: number;
  accepted: number;
  hidden: number;
  filtered: number;
  culled: number;
}

interface BuildContext<TObject extends Object2D> {
  readonly options: RenderPipelineBuildOptions<TObject>;
  readonly boundsProvider?: RenderBoundsProvider<TObject>;
  readonly filter?: RenderObjectFilter<TObject>;
  readonly cullBounds: Rectangle | null;
  readonly stats: MutableStats;
  order: number;
}

export class RenderPipeline<TObject extends Object2D = Object2D> {
  private readonly defaultFilter?: RenderObjectFilter<TObject>;
  private readonly boundsProvider?: RenderBoundsProvider<TObject>;

  public constructor(options: RenderPipelineOptions<TObject> = {}) {
    this.defaultFilter = options.defaultFilter;
    this.boundsProvider = options.boundsProvider;
  }

  public build(options: RenderPipelineBuildOptions<TObject>): RenderList<TObject> {
    const context = this.createContext(options);
    const roots = this.getRootObjects(options);
    const rootItems = this.collectSortedObjects(roots, null, 0, context);
    const flatItems = flattenRenderItems(rootItems);

    return new RenderList({
      rootItems,
      flatItems,
      stats: freezeStats(context.stats)
    });
  }

  private createContext(options: RenderPipelineBuildOptions<TObject>): BuildContext<TObject> {
    return {
      options,
      boundsProvider: options.boundsProvider ?? this.boundsProvider,
      filter: options.filter ?? this.defaultFilter,
      cullBounds: createCullBounds(options),
      stats: { total: 0, accepted: 0, hidden: 0, filtered: 0, culled: 0 },
      order: 0
    };
  }

  private getRootObjects(options: RenderPipelineBuildOptions<TObject>): readonly TObject[] {
    if (options.objects) {
      return options.objects;
    }

    return (options.scene?.getObjects() ?? []) as readonly TObject[];
  }

  private collectSortedObjects(
    objects: readonly TObject[],
    parentId: string | null,
    depth: number,
    context: BuildContext<TObject>
  ): readonly RenderItem<TObject>[] {
    const sortedObjects = sortRenderObjects({ objects });
    const items: RenderItem<TObject>[] = [];

    for (const object of sortedObjects) {
      const item = this.createItem(object, parentId, depth, context);

      if (item) {
        items.push(item);
      }
    }

    return items;
  }

  private createItem(
    object: TObject,
    parentId: string | null,
    depth: number,
    context: BuildContext<TObject>
  ): RenderItem<TObject> | null {
    context.stats.total += 1;

    if (!context.options.includeInvisible && !object.visible) {
      context.stats.hidden += 1;
      return null;
    }

    if (context.filter && !context.filter(object)) {
      context.stats.filtered += 1;
      return null;
    }

    const bounds = context.boundsProvider?.(object) ?? null;

    if (this.isCulled(object, depth, bounds, context)) {
      context.stats.culled += 1;
      return null;
    }

    context.stats.accepted += 1;

    return {
      object,
      id: object.id,
      parentId,
      depth,
      order: context.order++,
      zIndex: object.zIndex,
      visible: object.visible,
      culled: false,
      bounds,
      children: this.collectChildren(object, depth, context)
    };
  }

  private collectChildren(
    object: TObject,
    depth: number,
    context: BuildContext<TObject>
  ): readonly RenderItem<TObject>[] {
    if (!(object instanceof Group2D)) {
      return [];
    }

    return this.collectSortedObjects(object.getChildren() as readonly TObject[], object.id, depth + 1, context);
  }

  private isCulled(
    object: TObject,
    depth: number,
    bounds: RenderItem<TObject>["bounds"],
    context: BuildContext<TObject>
  ): boolean {
    if (!context.options.culling || depth > 0 || object instanceof Group2D || !bounds) {
      return false;
    }

    return context.cullBounds ? !bounds.intersects(context.cullBounds) : false;
  }
}

function createCullBounds<TObject extends Object2D>(
  options: RenderPipelineBuildOptions<TObject>
): Rectangle | null {
  if (!options.culling || !options.camera || !options.viewport) {
    return null;
  }

  return getCameraWorldBounds({
    camera: options.camera,
    width: options.viewport.width,
    height: options.viewport.height
  });
}

function flattenRenderItems<TObject extends Object2D>(
  items: readonly RenderItem<TObject>[]
): readonly RenderItem<TObject>[] {
  const flatItems: RenderItem<TObject>[] = [];

  for (const item of items) {
    flatItems.push(item, ...flattenRenderItems(item.children));
  }

  return flatItems;
}

function freezeStats(stats: MutableStats): RenderListStats {
  return {
    total: stats.total,
    accepted: stats.accepted,
    hidden: stats.hidden,
    filtered: stats.filtered,
    culled: stats.culled
  };
}
