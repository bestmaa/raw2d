import type { CopyStudioCanvasCodeOptions, StudioCanvasCodeExportOptions } from "./StudioCanvasCodeExport.type";
import type { StudioSceneObject } from "./StudioSceneState.type";

export function createStudioCanvasCode(options: StudioCanvasCodeExportOptions): string {
  const selector = options.canvasSelector ?? "#raw2d-canvas";
  const width = options.width ?? 800;
  const height = options.height ?? 600;
  const backgroundColor = options.backgroundColor ?? "#0a121c";
  const imports = collectCanvasCodeImports(options.scene.objects);
  const objectCode = options.scene.objects.map((object, index) => createObjectCode(object, `object${index + 1}`, "scene")).join("\n\n");

  return [
    `import { ${imports.join(", ")} } from "raw2d";`,
    "",
    `const canvas = document.querySelector<HTMLCanvasElement>(${JSON.stringify(selector)});`,
    "",
    "if (!canvas) {",
    "  throw new Error(\"Canvas element not found.\");",
    "}",
    "",
    "const scene = new Scene();",
    `const camera = new Camera2D(${toObjectCode(options.scene.camera)});`,
    "const renderer = new Canvas({",
    "  canvas,",
    `  width: ${width},`,
    `  height: ${height},`,
    `  backgroundColor: ${JSON.stringify(backgroundColor)}`,
    "});",
    "",
    objectCode,
    "",
    "renderer.render(scene, camera);"
  ].filter((line) => line !== undefined).join("\n");
}

export async function copyStudioCanvasCode(options: CopyStudioCanvasCodeOptions): Promise<string> {
  const code = createStudioCanvasCode(options);
  const clipboard = options.clipboard ?? navigator.clipboard;

  await clipboard.writeText(code);
  return code;
}

function collectCanvasCodeImports(objects: readonly StudioSceneObject[]): readonly string[] {
  const names = new Set<string>(["BasicMaterial", "Camera2D", "Canvas", "Scene"]);

  for (const object of objects) {
    names.add(getClassName(object));
    if (object.type === "sprite") names.add("Texture");
    if (object.type === "group") {
      for (const childImport of collectCanvasCodeImports(object.children)) {
        names.add(childImport);
      }
    }
  }

  return [...names].sort();
}

function createObjectCode(object: StudioSceneObject, variableName: string, parentName: string): string {
  const lines = [
    `const ${variableName} = new ${getClassName(object)}(${createObjectOptionsCode(object)});`,
    `${parentName}.add(${variableName});`
  ];

  if (object.type === "group") {
    lines.push(...object.children.map((child, index) => createObjectCode(child, `${variableName}Child${index + 1}`, variableName)));
  }

  return lines.join("\n");
}

function createObjectOptionsCode(object: StudioSceneObject): string {
  const entries = createBaseEntries(object);

  if (object.type === "rect") entries.push(["width", object.width], ["height", object.height]);
  else if (object.type === "circle") entries.push(["radius", object.radius]);
  else if (object.type === "line") entries.push(["startX", object.startX], ["startY", object.startY], ["endX", object.endX], ["endY", object.endY]);
  else if (object.type === "text2d") entries.push(["text", object.text], ["font", object.font]);
  else if (object.type === "sprite") entries.push(["texture", createPlaceholderTextureCode(object.assetSlot)], ["width", object.width], ["height", object.height]);

  return toObjectCode(Object.fromEntries(entries.filter(([, value]) => value !== undefined)));
}

function createBaseEntries(object: StudioSceneObject): Array<[string, unknown]> {
  const material = object.material ? `new BasicMaterial(${toObjectCode(object.material)})` : undefined;
  return [["name", object.name], ["x", object.x], ["y", object.y], ["visible", object.visible], ["material", material]];
}

function getClassName(object: StudioSceneObject): string {
  if (object.type === "group") return "Group2D";
  if (object.type === "text2d") return "Text2D";
  return object.type.charAt(0).toUpperCase() + object.type.slice(1);
}

function createPlaceholderTextureCode(id: string): string {
  return `new Texture({ source: document.createElement("canvas"), id: ${JSON.stringify(id)}, width: 1, height: 1 })`;
}

function toObjectCode(value: object): string {
  const entries = Object.entries(value).map(([key, item]) => `  ${key}: ${toValueCode(item)}`);
  return `{\n${entries.join(",\n")}\n}`;
}

function toValueCode(value: unknown): string {
  if (typeof value === "string" && value.startsWith("new ")) return value;
  if (typeof value === "object" && value !== null) return toObjectCode(value);
  return JSON.stringify(value);
}
