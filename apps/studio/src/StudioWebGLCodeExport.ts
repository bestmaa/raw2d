import type { CopyStudioWebGLCodeOptions, StudioWebGLCodeExportOptions } from "./StudioWebGLCodeExport.type";
import type { StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

export function createStudioWebGLCode(options: StudioWebGLCodeExportOptions): string {
  const selector = options.canvasSelector ?? "#raw2d-canvas";
  const width = options.width ?? 800;
  const height = options.height ?? 600;
  const backgroundColor = options.backgroundColor ?? "#0a121c";
  const imports = collectWebGLCodeImports(options.scene.objects);
  const warnings = createStudioWebGLCodeWarnings(options.scene);
  const objectCode = options.scene.objects.map((object, index) => createObjectCode(object, `object${index + 1}`)).join("\n\n");

  return [
    `import { ${imports.join(", ")} } from "raw2d";`,
    "",
    ...warnings.map((warning) => `// WebGL support warning: ${warning}`),
    "",
    `const canvas = document.querySelector<HTMLCanvasElement>(${JSON.stringify(selector)});`,
    "",
    "if (!canvas) {",
    "  throw new Error(\"Canvas element not found.\");",
    "}",
    "",
    "if (!isWebGL2Available({ canvas })) {",
    "  throw new Error(\"Raw2D WebGLRenderer2D requires WebGL2 support. Use the Canvas export as a fallback.\");",
    "}",
    "",
    "const scene = new Scene();",
    `const camera = new Camera2D(${toObjectCode(options.scene.camera)});`,
    "const renderer = new WebGLRenderer2D({",
    "  canvas,",
    `  width: ${width},`,
    `  height: ${height},`,
    `  backgroundColor: ${JSON.stringify(backgroundColor)}`,
    "});",
    "",
    objectCode,
    "",
    "renderer.render(scene, camera);",
    "const diagnostics = renderer.getDiagnostics();",
    "",
    "if (diagnostics.stats.unsupported > 0) {",
    "  console.warn(`Raw2D WebGL skipped ${diagnostics.stats.unsupported} unsupported object(s). Use Canvas export for full fallback coverage.`);",
    "}"
  ].join("\n");
}

export function createStudioWebGLCodeWarnings(scene: StudioSceneState): readonly string[] {
  const warnings = ["WebGL2 is required; generated code throws when the browser cannot create a WebGL2 context."];

  if (scene.objects.some((object) => object.type === "sprite")) {
    warnings.push("Sprite texture sources are placeholders; replace each 1x1 canvas with real image or atlas textures.");
  }

  if (scene.objects.some((object) => object.type === "text2d")) {
    warnings.push("Text2D uses WebGL text textures; load required fonts before the first render for stable metrics.");
  }

  return warnings;
}

export async function copyStudioWebGLCode(options: CopyStudioWebGLCodeOptions): Promise<string> {
  const code = createStudioWebGLCode(options);
  const clipboard = options.clipboard ?? navigator.clipboard;

  await clipboard.writeText(code);
  return code;
}

function collectWebGLCodeImports(objects: readonly StudioSceneObject[]): readonly string[] {
  const names = new Set<string>(["BasicMaterial", "Camera2D", "Scene", "WebGLRenderer2D", "isWebGL2Available"]);

  for (const object of objects) {
    names.add(getClassName(object));
    if (object.type === "sprite") names.add("Texture");
  }

  return [...names].sort();
}

function createObjectCode(object: StudioSceneObject, variableName: string): string {
  return [
    `const ${variableName} = new ${getClassName(object)}(${createObjectOptionsCode(object)});`,
    `scene.add(${variableName});`
  ].join("\n");
}

function createObjectOptionsCode(object: StudioSceneObject): string {
  const entries = createBaseEntries(object);

  if (object.type === "rect") entries.push(["width", object.width], ["height", object.height]);
  else if (object.type === "circle") entries.push(["radius", object.radius]);
  else if (object.type === "line") entries.push(["startX", object.startX], ["startY", object.startY], ["endX", object.endX], ["endY", object.endY]);
  else if (object.type === "text2d") entries.push(["text", object.text], ["font", object.font]);
  else entries.push(["texture", createPlaceholderTextureCode(object.assetSlot)], ["width", object.width], ["height", object.height]);

  return toObjectCode(Object.fromEntries(entries.filter(([, value]) => value !== undefined)));
}

function createBaseEntries(object: StudioSceneObject): Array<[string, unknown]> {
  const material = object.material ? `new BasicMaterial(${toObjectCode(object.material)})` : undefined;
  return [["name", object.name], ["x", object.x], ["y", object.y], ["visible", object.visible], ["material", material]];
}

function getClassName(object: StudioSceneObject): string {
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
