import type { Raw2DMcpSceneObjectJson } from "./Raw2DSceneObjectJson.type.js";
import type { GenerateRaw2DExampleOptions } from "./generateRaw2DExample.type.js";

export function createExampleHeader(options: GenerateRaw2DExampleOptions, rendererClass: "Canvas" | "WebGLRenderer2D"): string {
  const selector = options.canvasSelector ?? "#raw2d-canvas";
  const width = options.width ?? 800;
  const height = options.height ?? 600;
  const backgroundColor = options.backgroundColor ?? "#10141c";

  return [
    `const canvas = document.querySelector<HTMLCanvasElement>(${JSON.stringify(selector)});`,
    "",
    "if (!canvas) {",
    "  throw new Error(\"Canvas element not found.\");",
    "}",
    "",
    "const scene = new Scene();",
    `const camera = new Camera2D(${toObjectCode(options.document.camera)});`,
    `const renderer = new ${rendererClass}({`,
    "  canvas,",
    `  width: ${width},`,
    `  height: ${height},`,
    `  backgroundColor: ${JSON.stringify(backgroundColor)}`,
    "});"
  ].join("\n");
}

export function createObjectCode(object: Raw2DMcpSceneObjectJson, variableName: string): string {
  const options = createObjectOptionsCode(object);

  return [`const ${variableName} = new ${getClassName(object)}(${options});`, `scene.add(${variableName});`].join("\n");
}

export function createRenderFooter(): string {
  return "renderer.render(scene, camera);";
}

export function collectImports(objects: readonly Raw2DMcpSceneObjectJson[], rendererClass: "Canvas" | "WebGLRenderer2D"): readonly string[] {
  const names = new Set<string>(["BasicMaterial", "Camera2D", rendererClass, "Scene"]);

  for (const object of objects) {
    names.add(getClassName(object));

    if (object.type === "sprite") {
      names.add("Texture");
    }
  }

  return [...names].sort();
}

function createObjectOptionsCode(object: Raw2DMcpSceneObjectJson): string {
  const entries = createBaseEntries(object);

  if (object.type === "rect") {
    entries.push(["width", object.width], ["height", object.height]);
  } else if (object.type === "circle") {
    entries.push(["radius", object.radius]);
  } else if (object.type === "line") {
    entries.push(["startX", object.startX], ["startY", object.startY], ["endX", object.endX], ["endY", object.endY]);
  } else if (object.type === "text2d") {
    entries.push(["text", object.text], ["font", object.font]);
  } else {
    entries.push(["texture", createTextureCode(object.textureId)], ["width", object.width], ["height", object.height]);
  }

  return toObjectCode(Object.fromEntries(entries.filter(([, value]) => value !== undefined)));
}

function createBaseEntries(object: Raw2DMcpSceneObjectJson): Array<[string, unknown]> {
  const material = object.material ? `new BasicMaterial(${toObjectCode(object.material)})` : undefined;

  return [
    ["x", object.x],
    ["y", object.y],
    ["rotation", object.rotation],
    ["scaleX", object.scaleX],
    ["scaleY", object.scaleY],
    ["origin", object.origin],
    ["visible", object.visible],
    ["zIndex", object.zIndex],
    ["renderMode", object.renderMode],
    ["material", material]
  ];
}

function getClassName(object: Raw2DMcpSceneObjectJson): string {
  if (object.type === "text2d") {
    return "Text2D";
  }

  return object.type.charAt(0).toUpperCase() + object.type.slice(1);
}

function createTextureCode(id: string): string {
  return `new Texture({ source: document.createElement("canvas"), id: ${JSON.stringify(id)}, width: 1, height: 1 })`;
}

function toObjectCode(value: object): string {
  const entries = Object.entries(value).map(([key, item]) => `  ${key}: ${toValueCode(item)}`);
  return `{\n${entries.join(",\n")}\n}`;
}

function toValueCode(value: unknown): string {
  if (typeof value === "string" && value.startsWith("new ")) {
    return value;
  }

  if (typeof value === "object" && value !== null) {
    return toObjectCode(value);
  }

  return JSON.stringify(value);
}
