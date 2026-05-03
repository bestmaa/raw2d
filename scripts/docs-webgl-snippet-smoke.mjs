import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-webgl-docs-${version}-`));

try {
  const snippets = await readWebGLSnippets();
  await createProject(workspace, snippets);
  const tarballs = await packPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  console.log(`WebGL docs snippet smoke passed for ${snippets.length} snippets on Raw2D@${version}`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function readWebGLSnippets() {
  const files = [
    "src/pages/DocAdvancedFullExamples.ts",
    "src/pages/DocWebGLPathTopics.ts",
    "src/pages/DocWebGLPipelineTopics.ts",
    "src/pages/DocWebGLBatcherTopics.ts",
    "src/pages/DocWebGLPerformanceTopics.ts",
    "src/pages/DocWebGLRendererTopics.ts"
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
  return /WebGL|webglRenderer|renderer\.getStats|createWebGL|raw2d-webgl/.test(code)
    && !code.trimStart().startsWith("// Browser example:");
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

async function run(): Promise<void> {
${getFixture(cleanCode)}

${indent(cleanCode)}
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
  AssetGroupLoader, BasicMaterial, Camera2D, Canvas, Circle, Line, Rect, Scene,
  Sprite, Text2D, Texture, TextureAtlas, TextureAtlasPacker, WebGLRenderer2D,
  createSpriteFromAtlas, isWebGL2Available
} from "raw2d";
import {
  analyzeWebGLSpriteBatching,
  createWebGLRenderRuns,
  estimateWebGLSpriteTextureBinds,
  getWebGLRenderRunKind,
  sortWebGLSpritesForBatching
} from "raw2d-webgl";`;
}

function getFixture(code) {
  const setup = [
    ["const canvasElement =", "const canvasElement = document.createElement(\"canvas\");"],
    ["const imageElement =", "const imageElement = document.createElement(\"img\");"],
    ["const idleImage =", "const idleImage = document.createElement(\"img\");"],
    ["const runImage =", "const runImage = document.createElement(\"img\");"],
    ["const scene =", "const scene = new Scene();"],
    ["const spriteScene =", "const spriteScene = new Scene();"],
    ["const sceneWithSeparateTextures =", "const sceneWithSeparateTextures = new Scene();"],
    ["const sceneWithPackedAtlas =", "const sceneWithPackedAtlas = new Scene();"],
    ["const camera =", "const camera = new Camera2D();"],
    ["const webglRenderer =", "const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });"],
    ["const canvasRenderer =", "const canvasRenderer = new Canvas({ canvas: canvasElement });"],
    ["const blue =", "const blue = new BasicMaterial({ fillColor: \"#38bdf8\" });"],
    ["const yellowStroke =", "const yellowStroke = new BasicMaterial({ strokeColor: \"#facc15\", lineWidth: 2 });"],
    ["const imageTexture =", "const imageTexture = new Texture({ source: imageElement, width: 64, height: 64 });"],
    ["const idleTexture =", "const idleTexture = imageTexture;"],
    ["const runTexture =", "const runTexture = new Texture({ source: runImage, width: 64, height: 64 });"],
    ["const rect =", "const rect = new Rect({ width: 32, height: 32, material: blue });"],
    ["const sprite =", "const sprite = new Sprite({ texture: imageTexture, width: 32, height: 32 });"],
    ["const background =", "const background = new Rect({ width: 320, height: 180, material: blue });"],
    ["const movingObject =", "const movingObject = new Circle({ radius: 12, material: blue });"],
    ["const player =", "const player = movingObject;"],
    ["const playerSprite =", "const playerSprite = new Sprite({ texture: imageTexture, width: 32, height: 32 });"],
    ["const tileSprite =", "const tileSprite = new Sprite({ texture: imageTexture, width: 32, height: 32 });"],
    ["const sprites =", "const sprites = [tileSprite, playerSprite];"],
    ["const label =", "const label = new Text2D({ text: \"GPU label\", material: blue });"],
    ["const spriteSources =", "const spriteSources = [{ name: \"idle\", source: idleImage }, { name: \"run\", source: runImage }];"],
    ["const renderer =", "const renderer = webglRenderer;", /\brenderer\./.test(code)],
    ["const raw2dCanvas =", "const raw2dCanvas = canvasRenderer;", /\braw2dCanvas\./.test(code)],
    ["const texture =", "const texture = imageTexture;", /\btexture\b/.test(code)],
    ["const atlas =", "const atlas = new TextureAtlas({ texture: imageTexture, frames: { idle: { x: 0, y: 0, width: 32, height: 32 }, run: { x: 32, y: 0, width: 32, height: 32 }, \"grass-alt\": { x: 0, y: 32, width: 32, height: 32 } } });", /\batlas\./.test(code)],
    ["const renderList =", "const renderList = webglRenderer.createRenderList(scene, camera);", /\brenderList\b/.test(code)],
    ["const canUseWebGL =", "const canUseWebGL = true;", /\bcanUseWebGL\b/.test(code)]
  ].map(([needle, line, needed = true]) => needed && !code.includes(needle) ? line : "").filter(Boolean);

  return indent(setup.join("\n"));
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
