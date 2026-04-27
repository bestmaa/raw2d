import { Arc } from "./Arc.js";
import { Circle } from "./Circle.js";
import { Ellipse } from "./Ellipse.js";
import { Line } from "./Line.js";
import { Polygon } from "./Polygon.js";
import { Polyline } from "./Polyline.js";
import { Rect } from "./Rect.js";
import { ShapePath } from "./ShapePath.js";
import { containsPoint } from "./containsPoint.js";
import type { HitTestObject } from "./HitTest.type.js";
import type { SceneObject } from "./Scene.type.js";
import type { PickObjectOptions, PickObjectResult } from "./pickObject.type.js";

export function pickObject(options: PickObjectOptions): PickObjectResult {
  const objects = options.scene.getObjects();

  if (options.topmost === false) {
    return pickForward(objects, options);
  }

  return pickBackward(objects, options);
}

function pickForward(objects: readonly SceneObject[], options: PickObjectOptions): PickObjectResult {
  for (const object of objects) {
    const picked = pickSceneObject(object, options);

    if (picked) {
      return picked;
    }
  }

  return null;
}

function pickBackward(objects: readonly SceneObject[], options: PickObjectOptions): PickObjectResult {
  for (let index = objects.length - 1; index >= 0; index -= 1) {
    const object = objects[index];

    if (!object) {
      continue;
    }

    const picked = pickSceneObject(object, options);

    if (picked) {
      return picked;
    }
  }

  return null;
}

function pickSceneObject(object: SceneObject, options: PickObjectOptions): PickObjectResult {
  if (!object.visible || !isHitTestObject(object)) {
    return null;
  }

  if (options.filter && !options.filter(object)) {
    return null;
  }

  return containsPoint({ object, x: options.x, y: options.y, tolerance: options.tolerance }) ? object : null;
}

function isHitTestObject(object: SceneObject): object is HitTestObject {
  return (
    object instanceof Rect ||
    object instanceof Circle ||
    object instanceof Ellipse ||
    object instanceof Line ||
    object instanceof Polyline ||
    object instanceof Polygon ||
    object instanceof Arc ||
    object instanceof ShapePath
  );
}
