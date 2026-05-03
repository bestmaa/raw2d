import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-mcp-${version}-`));

try {
  await createProject(workspace);
  const tarballs = await packMcpPackages(workspace);
  await run("npm", ["install", ...tarballs, "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  await run("node", ["src/main.mjs"], workspace);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function packMcpPackages(destination) {
  const directories = ["packages/core", "packages/mcp"];
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
  await writeFile(path.join(directory, "package.json"), `{
  "name": "raw2d-mcp-smoke",
  "version": "0.0.0",
  "type": "module",
  "private": true
}
`);
  await writeFile(path.join(directory, "tsconfig.json"), `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`);
  await writeFile(path.join(directory, "src/main.ts"), getTypeScriptSource());
  await writeFile(path.join(directory, "src/main.mjs"), getRuntimeSource());
}

function getTypeScriptSource() {
  return `import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  createRaw2DMcpManifest,
  generateRaw2DDocsSnippet,
  inspectRaw2DScene,
  validateRaw2DScene
} from "raw2d-mcp";
import type { Raw2DMcpSceneDocument } from "raw2d-mcp";

const scene: Raw2DMcpSceneDocument = createRaw2DSceneJson({ camera: { x: 0, y: 0, zoom: 1 } });
const withRect = addRaw2DSceneObject({
  document: scene,
  object: { id: "rect-a", type: "rect", x: 20, y: 30, width: 80, height: 40 }
});
const validation = validateRaw2DScene({ document: withRect });
const inspection = inspectRaw2DScene({ document: withRect });
const snippet = generateRaw2DDocsSnippet({ document: withRect, renderer: "canvas" });
const manifest = createRaw2DMcpManifest();

if (!validation.valid || inspection.objectCount !== 1 || snippet.markdown.length === 0 || manifest.tools.length === 0) {
  throw new Error("MCP smoke failed.");
}
`;
}

function getRuntimeSource() {
  return `import {
  addRaw2DSceneObject,
  createRaw2DSceneJson,
  inspectRaw2DScene,
  validateRaw2DScene
} from "raw2d-mcp";

const scene = createRaw2DSceneJson({ camera: { x: 0, y: 0, zoom: 1 } });
const nextScene = addRaw2DSceneObject({
  document: scene,
  object: { id: "rect-a", type: "rect", x: 8, y: 16, width: 80, height: 32 }
});
const validation = validateRaw2DScene({ document: nextScene });
const inspection = inspectRaw2DScene({ document: nextScene });

if (!validation.valid || inspection.objectCount !== 1) {
  throw new Error("raw2d-mcp runtime smoke failed.");
}

console.log("mcp-runtime-ok", inspection.objectCount);
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

console.log(`MCP install smoke passed for raw2d-mcp@${version}`);
