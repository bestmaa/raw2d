import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-readme-snippets-${version}-`));

try {
  await createProject(workspace);
  const tarballs = await packSnippetPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function packSnippetPackages(destination) {
  const directories = [
    "packages/core",
    "packages/interaction",
    "packages/text",
    "packages/sprite",
    "packages/canvas",
    "packages/webgl",
    "packages/effects",
    "packages/raw2d",
    "packages/mcp"
  ];
  const tarballs = [];

  for (const directory of directories) {
    const output = await runForOutput("npm", ["pack", "--silent", "--pack-destination", destination], path.join(root, directory));
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) {
      throw new Error(`npm pack did not return a tarball for ${directory}`);
    }

    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
}

async function createProject(directory) {
  await mkdir(path.join(directory, "src"), { recursive: true });
  await writeFile(path.join(directory, "tsconfig.json"), `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`);
  await writeFile(path.join(directory, "src", "main.ts"), getMainSource());
  await writeFile(path.join(directory, "src", "mcp.ts"), getMcpSource());
}

function getMainSource() {
  return `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  CanvasRenderer,
  InteractionController,
  Rect,
  Scene,
  SelectionManager,
  Sprite,
  TextureLoader,
  WebGLRenderer2D
} from "raw2d";
import type { Renderer2DLike } from "raw2d";

const canvasElement = document.createElement("canvas");
const scene = new Scene();
const camera = new Camera2D();

const canvasRenderer = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});
const rect = new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
canvasRenderer.render(scene, camera);

const explicitCanvas = new Canvas({ canvas: canvasElement });
explicitCanvas.render(scene, camera);

const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });
webglRenderer.render(scene, camera);
const stats = webglRenderer.getStats();
console.log(stats.drawCalls, stats.textureBinds, stats.spriteTextureBindReduction);

function drawFrame(renderer: Renderer2DLike): void {
  renderer.render(scene, camera);
}

drawFrame(new CanvasRenderer({ canvas: canvasElement }));

async function loadSprite(): Promise<void> {
  const renderer = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
  const texture = await new TextureLoader().load("/sprite.png");
  scene.add(new Sprite({ texture, x: 120, y: 80, width: 128, height: 128, origin: "center" }));
  renderer.render(scene, camera);
}

const selection = new SelectionManager();
const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  selection,
  onChange: () => canvasRenderer.render(scene, camera)
});

interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
void loadSprite;
`;
}

function getMcpSource() {
  return `import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  generateRaw2DCanvasExample,
  validateRaw2DScene
} from "raw2d-mcp";

const document = addRaw2DSceneObject({
  document: createRaw2DSceneJson(),
  object: { type: "rect", id: "card", width: 120, height: 80 }
});
const result = validateRaw2DScene({ document });
const example = generateRaw2DCanvasExample({ document });

console.log(result.valid, example.code);
`;
}

async function run(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: "inherit"
  });
  const code = await new Promise((resolve) => child.on("close", resolve));

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

async function runForOutput(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "inherit"]
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  const code = await new Promise((resolve) => child.on("close", resolve));

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return output;
}

console.log(`README snippet smoke passed for Raw2D@${version}`);
