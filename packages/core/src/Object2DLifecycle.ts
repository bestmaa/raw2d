import type { Object2D } from "./Object2D.js";
import type {
  AttachObject2DOptions,
  DetachObject2DOptions,
  Object2DLifecycleState
} from "./Object2DLifecycle.type.js";

const lifecycleStates = new WeakMap<Object2D, Object2DLifecycleState>();

export function attachObject2D(options: AttachObject2DOptions): void {
  lifecycleStates.set(options.object, {
    parent: options.parent,
    disposed: getObject2DLifecycleState(options.object).disposed
  });
  options.object.markDirty();
}

export function detachObject2D(options: DetachObject2DOptions): void {
  const current = getObject2DLifecycleState(options.object);

  if (options.parent && current.parent !== options.parent) {
    return;
  }

  lifecycleStates.set(options.object, {
    parent: null,
    disposed: current.disposed
  });
  options.object.markDirty();
}

export function disposeObject2D(object: Object2D): void {
  lifecycleStates.set(object, {
    parent: null,
    disposed: true
  });
  object.markDirty();
}

export function getObject2DLifecycleState(object: Object2D): Object2DLifecycleState {
  return lifecycleStates.get(object) ?? {
    parent: null,
    disposed: false
  };
}
