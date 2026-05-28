import type {
  Raw2DMcpSceneObjectJson,
  Raw2DMcpSpriteJson
} from "./Raw2DSceneObjectJson.type.js";
import type {
  Raw2DMcpStudioAssetJson,
  Raw2DMcpStudioObjectJson,
  Raw2DMcpStudioSceneJson
} from "./Raw2DStudioSceneJson.type.js";
import type {
  GenerateRaw2DStudioExampleOptions,
  Raw2DMcpGeneratedStudioExample
} from "./generateRaw2DStudioExample.type.js";
import { validateRaw2DStudioScene } from "./validateRaw2DStudioScene.js";

export function generateRaw2DStudioExample(options: GenerateRaw2DStudioExampleOptions): Raw2DMcpGeneratedStudioExample {
  const scene = createStudioScene(options);

  return {
    renderer: "studio",
    filename: createFilename(scene.name),
    json: `${JSON.stringify(scene, null, 2)}\n`,
    document: scene,
    scene,
    validation: validateRaw2DStudioScene({ document: scene })
  };
}

function createStudioScene(options: GenerateRaw2DStudioExampleOptions): Raw2DMcpStudioSceneJson {
  const objects = options.document.scene.objects.map(createStudioObject);

  return {
    version: 1,
    name: options.name ?? "MCP Studio Example",
    rendererMode: options.rendererMode ?? "canvas",
    camera: options.document.camera,
    assets: createAssets(options.document.scene.objects),
    objects
  };
}

function createStudioObject(object: Raw2DMcpSceneObjectJson): Raw2DMcpStudioObjectJson {
  const base = {
    id: object.id,
    type: object.type,
    name: createObjectName(object),
    x: object.x ?? 0,
    y: object.y ?? 0,
    ...(object.visible !== undefined ? { visible: object.visible } : {}),
    ...(object.material ? { material: object.material } : {})
  };

  if (object.type === "rect") return { ...base, type: "rect", width: object.width, height: object.height };
  if (object.type === "circle") return { ...base, type: "circle", radius: object.radius };
  if (object.type === "line") {
    return {
      ...base,
      type: "line",
      startX: object.startX,
      startY: object.startY,
      endX: object.endX,
      endY: object.endY
    };
  }
  if (object.type === "text2d") {
    return { ...base, type: "text2d", text: object.text, ...(object.font ? { font: object.font } : {}) };
  }
  return {
    ...base,
    type: "sprite",
    width: object.width ?? 64,
    height: object.height ?? 64,
    assetSlot: object.textureId
  };
}

function createAssets(objects: readonly Raw2DMcpSceneObjectJson[]): readonly Raw2DMcpStudioAssetJson[] {
  const sprites = objects.filter((object): object is Raw2DMcpSpriteJson => object.type === "sprite");
  const textureIds = [...new Set(sprites.map((sprite) => sprite.textureId).filter((id) => id !== "empty"))];

  return textureIds.map((textureId) => {
    const matchingSprites = sprites.filter((sprite) => sprite.textureId === textureId);
    const firstSprite = matchingSprites[0];

    return {
      id: textureId,
      type: "image",
      name: createAssetName(textureId),
      width: firstSprite?.width ?? 64,
      height: firstSprite?.height ?? 64,
      mimeType: "image/png",
      objectIds: matchingSprites.map((sprite) => sprite.id)
    };
  });
}

function createObjectName(object: Raw2DMcpSceneObjectJson): string {
  return `${object.type.charAt(0).toUpperCase()}${object.type.slice(1)} ${object.id}`;
}

function createAssetName(textureId: string): string {
  return `Image ${textureId}`;
}

function createFilename(name: string): string {
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeName || "raw2d-studio-example"}.raw2d.json`;
}
