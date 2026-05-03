import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-interaction-docs-${version}-`));

try {
  const snippets = await readInteractionSnippets();
  await createProject(workspace, snippets);
  const tarballs = await packPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  console.log(`Interaction docs snippet smoke passed for ${snippets.length} snippets on Raw2D@${version}`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function readInteractionSnippets() {
  const files = [
    "src/pages/DocAdvancedFullExamples.ts",
    "src/pages/DocInteractionPathTopics.ts",
    "src/pages/DocInteractionControllerTopic.ts",
    "src/pages/DocInteractionTopics.ts",
    "src/pages/DocCameraControlsTopic.ts",
    "src/pages/DocKeyboardTopic.ts"
  ];
  const snippets = [];

  for (const file of files) {
    const source = await readFile(path.join(root, file), "utf8");
    const matches = source.matchAll(/(?:code:\s*)?`([\s\S]*?)`/g);

    for (const match of matches) {
      const code = match[1];

      if (isTypeScriptSnippet(code)) {
        snippets.push({ name: `${path.basename(file, ".ts")}-${snippets.length}`, code });
      }
    }
  }

  return snippets;
}

function isTypeScriptSnippet(code) {
  const hasInteractionApi = /InteractionController|SelectionManager|CameraControls|KeyboardController|pickObject|getSelectionBounds|getResizeHandles|pickResizeHandle|ObjectDrag|ObjectResize|selection\.|interaction\.|controls\.|keyboard\./.test(code);
  const isPseudoCode = /->|raw2d-core|^top-left|npm install/m.test(code) || /Circle \/ Ellipse/.test(code);

  return hasInteractionApi && !isPseudoCode;
}

async function createProject(directory, snippets) {
  await mkdir(path.join(directory, "src"), { recursive: true });
  await writeFile(path.join(directory, "tsconfig.json"), getTsConfig());

  for (const snippet of snippets) {
    await writeFile(path.join(directory, "src", `${snippet.name}.ts`), buildSnippetSource(snippet.code));
  }
}

function getTsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`;
}

function buildSnippetSource(code) {
  const cleanCode = stripImports(code);

  if (cleanCode.includes("document.querySelector")) {
    return `${getImports()}

${cleanCode}
`;
  }

  return `${getImports()}

function run(): void {
${getFixture(cleanCode)}

  {
${indent(indent(cleanCode))}
  }
}

void run;
`;
}

function stripImports(code) {
  return code
    .replace(/import\s+\{[\s\S]*?\}\s+from\s+"[^"]+";\n?/g, "")
    .replace(/import\s+type\s+\{[\s\S]*?\}\s+from\s+"[^"]+";\n?/g, "");
}

function getImports() {
  return `import {
  BasicMaterial, Camera2D, CameraControls, Canvas, Circle, InteractionController,
  KeyboardController, Line, Rect, Scene, SelectionManager, endObjectDrag,
  endObjectResize, getResizeHandles, getSelectionBounds, pickObject,
  pickResizeHandle, startObjectDrag, startObjectResize, updateObjectDrag,
  updateObjectResize
} from "raw2d";`;
}

function getFixture(code) {
  void code;

  return indent(`const canvasElement = document.createElement("canvas");
const raw2dCanvas = new Canvas({ canvas: canvasElement });
const renderer = raw2dCanvas;
const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({ width: 120, height: 80, material: new BasicMaterial({ fillColor: "#f45b69" }) });
const circle = new Circle({ radius: 24 });
const line = new Line({ endX: 100, endY: 20 });
const rectA = new Rect({ width: 80, height: 50 });
const rectB = new Rect({ width: 90, height: 60 });
const selection = new SelectionManager();
const interaction = new InteractionController({ canvas: canvasElement, scene, camera });
const controls = new CameraControls({ target: canvasElement, camera });
const keyboard = new KeyboardController({ target: window, selection, scene });
const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
const pointerX = 120;
const pointerY = 80;
const pointer = { x: pointerX, y: pointerY };
const event = { shiftKey: false };
const picked = rect;
let dragState: ReturnType<typeof startObjectDrag> | null = startObjectDrag({ object: rect, pointerX, pointerY });
let resizeState: ReturnType<typeof startObjectResize> | null = startObjectResize({ object: rect, handleName: "bottom-right", pointerX, pointerY });
const bounds = getSelectionBounds({ objects: [rect, circle] });
const handles = bounds ? getResizeHandles({ bounds, size: 8 }) : [];
const handle = handles[0] ?? null;
if (!dragState || !resizeState) return;`);
}

function indent(value) {
  return value.split("\n").map((line) => `  ${line}`).join("\n");
}

async function packPackages(destination) {
  const directories = ["packages/core", "packages/interaction", "packages/text", "packages/sprite", "packages/canvas", "packages/webgl", "packages/effects", "packages/raw2d"];
  const tarballs = [];

  for (const directory of directories) {
    const output = await runForOutput("npm", ["pack", "--silent", "--pack-destination", destination], path.join(root, directory));
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) throw new Error(`npm pack did not return a tarball for ${directory}`);
    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
}

async function run(command, args, cwd) {
  const child = spawn(command, args, { cwd, env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" }, shell: process.platform === "win32", stdio: "inherit" });
  const code = await new Promise((resolve) => child.on("close", resolve));

  if (code !== 0) throw new Error(`Command failed: ${command} ${args.join(" ")}`);
}

async function runForOutput(command, args, cwd) {
  const child = spawn(command, args, { cwd, env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" }, shell: process.platform === "win32", stdio: ["ignore", "pipe", "inherit"] });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk.toString(); });
  const code = await new Promise((resolve) => child.on("close", resolve));

  if (code !== 0) throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  return output;
}
