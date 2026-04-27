import type { Object2D } from "raw2d-core";
import type {
  InteractionAttachOptions,
  InteractionFeatureName,
  InteractionObjectFeatures
} from "./InteractionController.type.js";

export function normalizeAttachOptions(options: InteractionAttachOptions = {}): InteractionObjectFeatures {
  const hasExplicitOption = options.select !== undefined || options.drag !== undefined || options.resize !== undefined;

  if (!hasExplicitOption) {
    return {
      selection: true,
      drag: true,
      resize: true
    };
  }

  return {
    selection: options.select ?? false,
    drag: options.drag ?? false,
    resize: options.resize ?? false
  };
}

export function hasAttachedObjects(attachedObjects: ReadonlyMap<Object2D, InteractionObjectFeatures>): boolean {
  return attachedObjects.size > 0;
}

export function canUseObjectFeature(options: {
  readonly attachedObjects: ReadonlyMap<Object2D, InteractionObjectFeatures>;
  readonly globalFeatures: InteractionObjectFeatures;
  readonly object: Object2D;
  readonly feature: InteractionFeatureName;
}): boolean {
  const attachedFeatures = options.attachedObjects.get(options.object);

  if (attachedFeatures) {
    return attachedFeatures[options.feature];
  }

  if (hasAttachedObjects(options.attachedObjects)) {
    return false;
  }

  return options.globalFeatures[options.feature];
}

export function canUseAnyObjectFeature(options: {
  readonly attachedObjects: ReadonlyMap<Object2D, InteractionObjectFeatures>;
  readonly globalFeatures: InteractionObjectFeatures;
  readonly object: Object2D;
}): boolean {
  return (
    canUseObjectFeature({ ...options, feature: "selection" }) ||
    canUseObjectFeature({ ...options, feature: "drag" }) ||
    canUseObjectFeature({ ...options, feature: "resize" })
  );
}

export function hasSelectionFeature(options: {
  readonly attachedObjects: ReadonlyMap<Object2D, InteractionObjectFeatures>;
  readonly globalFeatures: InteractionObjectFeatures;
}): boolean {
  if (!hasAttachedObjects(options.attachedObjects)) {
    return options.globalFeatures.selection;
  }

  for (const features of options.attachedObjects.values()) {
    if (features.selection) {
      return true;
    }
  }

  return false;
}
