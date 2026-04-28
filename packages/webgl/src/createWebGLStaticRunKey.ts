import { Sprite } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import type { Object2D } from "raw2d-core";
import type {
  WebGLStaticRunIdentity,
  WebGLStaticRunKeyOptions
} from "./createWebGLStaticRunKey.type.js";

interface Versioned {
  readonly version: number;
}

export function createWebGLStaticRunKey(options: WebGLStaticRunKeyOptions): WebGLStaticRunIdentity {
  const runId = [
    options.run.kind,
    ...options.run.items.map((item) => item.id)
  ].join("|");
  const cameraKey = `${options.camera.x},${options.camera.y},${options.camera.zoom}`;
  const viewportKey = `${options.width},${options.height}`;
  const objectKeys = options.run.items.map((item) => createObjectKey(item.object, options)).join("|");

  return {
    runId,
    key: `${options.run.kind}:${options.run.mode}:${cameraKey}:${viewportKey}:${objectKeys}`
  };
}

function createObjectKey(object: Object2D, options: WebGLStaticRunKeyOptions): string {
  return [
    object.id,
    object.version,
    getMaterialVersion(object),
    getSpriteTextureKey(object, options),
    getSpriteFrameKey(object),
    getTextKey(object)
  ].join(":");
}

function getMaterialVersion(object: Object2D): string {
  if (!("material" in object) || !hasVersion(object.material)) {
    return "material:none";
  }

  return `material:${object.material.version}`;
}

function getSpriteTextureKey(object: Object2D, options: WebGLStaticRunKeyOptions): string {
  if (!(object instanceof Sprite)) {
    return "texture:none";
  }

  return `texture:${options.getTextureKey(object.texture)}`;
}

function getSpriteFrameKey(object: Object2D): string {
  if (!(object instanceof Sprite) || !object.frame) {
    return "frame:none";
  }

  const frame = object.frame;
  return `frame:${frame.x},${frame.y},${frame.width},${frame.height}`;
}

function getTextKey(object: Object2D): string {
  if (!(object instanceof Text2D)) {
    return "text:none";
  }

  return `text:${object.text}:${object.font}:${object.align}:${object.baseline}:${object.material.fillColor}`;
}

function hasVersion(value: unknown): value is Versioned {
  return typeof value === "object" && value !== null && "version" in value && typeof value.version === "number";
}
