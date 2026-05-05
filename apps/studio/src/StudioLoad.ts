import type {
  StudioCameraState,
  StudioCircleState,
  StudioLineState,
  StudioRectState,
  StudioSceneObject,
  StudioSceneState,
  StudioSpriteState,
  StudioTextState
} from "./StudioSceneState.type";

export function deserializeStudioScene(json: string): StudioSceneState {
  const document = JSON.parse(json) as unknown;
  const source = expectRecord(document);

  return {
    version: expectVersion(source.version),
    name: expectString(source.name),
    rendererMode: expectRendererMode(source.rendererMode),
    camera: parseCamera(source.camera),
    objects: parseObjects(source.objects)
  };
}

export async function readStudioSceneFile(file: File): Promise<StudioSceneState> {
  return deserializeStudioScene(await file.text());
}

function parseCamera(value: unknown): StudioCameraState {
  const camera = expectRecord(value);

  return {
    x: expectNumber(camera.x),
    y: expectNumber(camera.y),
    zoom: expectNumber(camera.zoom)
  };
}

function parseObjects(value: unknown): readonly StudioSceneObject[] {
  if (!Array.isArray(value)) {
    throw new Error("Studio scene objects must be an array.");
  }

  return value.map(parseObject);
}

function parseObject(value: unknown): StudioSceneObject {
  const object = expectRecord(value);
  const type = expectString(object.type);

  if (type === "rect") return parseRect(object);
  if (type === "circle") return parseCircle(object);
  if (type === "line") return parseLine(object);
  if (type === "text2d") return parseText(object);
  if (type === "sprite") return parseSprite(object);
  throw new Error(`Unsupported Studio object type: ${type}`);
}

function parseRect(object: Record<string, unknown>): StudioRectState {
  return { ...parseBase(object, "rect"), width: expectNumber(object.width), height: expectNumber(object.height) };
}

function parseCircle(object: Record<string, unknown>): StudioCircleState {
  return { ...parseBase(object, "circle"), radius: expectNumber(object.radius) };
}

function parseLine(object: Record<string, unknown>): StudioLineState {
  return {
    ...parseBase(object, "line"),
    startX: expectNumber(object.startX),
    startY: expectNumber(object.startY),
    endX: expectNumber(object.endX),
    endY: expectNumber(object.endY)
  };
}

function parseText(object: Record<string, unknown>): StudioTextState {
  return {
    ...parseBase(object, "text2d"),
    text: expectString(object.text),
    font: typeof object.font === "string" ? object.font : undefined
  };
}

function parseSprite(object: Record<string, unknown>): StudioSpriteState {
  return {
    ...parseBase(object, "sprite"),
    width: expectNumber(object.width),
    height: expectNumber(object.height),
    assetSlot: expectString(object.assetSlot)
  };
}

function parseBase<Type extends StudioSceneObject["type"]>(
  object: Record<string, unknown>,
  type: Type
): Pick<Extract<StudioSceneObject, { readonly type: Type }>, "id" | "type" | "name" | "x" | "y" | "visible" | "material"> {
  return {
    id: expectString(object.id),
    type,
    name: expectString(object.name),
    x: expectNumber(object.x),
    y: expectNumber(object.y),
    visible: typeof object.visible === "boolean" ? object.visible : undefined,
    material: typeof object.material === "object" && object.material !== null ? object.material : undefined
  } as Pick<Extract<StudioSceneObject, { readonly type: Type }>, "id" | "type" | "name" | "x" | "y" | "visible" | "material">;
}

function expectRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Studio scene JSON must contain an object.");
  }

  return value as Record<string, unknown>;
}

function expectVersion(value: unknown): 1 {
  if (value !== 1) {
    throw new Error("Studio scene version must be 1.");
  }

  return value;
}

function expectRendererMode(value: unknown): StudioSceneState["rendererMode"] {
  if (value === "canvas" || value === "webgl") {
    return value;
  }

  throw new Error("Studio scene rendererMode must be canvas or webgl.");
}

function expectString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Studio scene field must be a string.");
  }

  return value;
}

function expectNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Studio scene field must be a finite number.");
  }

  return value;
}
