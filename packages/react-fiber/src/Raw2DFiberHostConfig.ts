import { Group2D, Scene } from "raw2d";
import { createRaw2DFiberInstance } from "./createRaw2DFiberInstance.js";
import { updateRaw2DFiberInstance } from "./updateRaw2DFiberInstance.js";
import type {
  Raw2DFiberHostConfig,
  Raw2DFiberHostInstance,
  Raw2DFiberHostParent
} from "./Raw2DFiberHostConfig.type.js";

export const RAW2D_FIBER_HOST_CONFIG: Raw2DFiberHostConfig = {
  createInstance: createRaw2DFiberInstance,
  commitUpdate: updateRaw2DFiberInstance,
  appendChild,
  removeChild
};

export function createRaw2DFiberHostConfig(): Raw2DFiberHostConfig {
  return RAW2D_FIBER_HOST_CONFIG;
}

function appendChild(parent: Raw2DFiberHostParent, child: Raw2DFiberHostInstance): void {
  const target = resolveParent(parent);

  if (target instanceof Scene || target instanceof Group2D) {
    target.add(child.object);
  }
}

function removeChild(parent: Raw2DFiberHostParent, child: Raw2DFiberHostInstance): void {
  const target = resolveParent(parent);

  if (target instanceof Scene || target instanceof Group2D) {
    target.remove(child.object);
  }
}

function resolveParent(parent: Raw2DFiberHostParent): Scene | Group2D {
  if (parent instanceof Scene || parent instanceof Group2D) {
    return parent;
  }

  if (parent.object instanceof Group2D) {
    return parent.object;
  }

  throw new Error("Raw2D Fiber children can only be attached to Scene or Group2D parents.");
}
