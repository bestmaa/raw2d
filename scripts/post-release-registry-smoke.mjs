import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const version = "1.25.5";
const packages = [
  "raw2d",
  "raw2d-core",
  "raw2d-canvas",
  "raw2d-webgl",
  "raw2d-sprite",
  "raw2d-text",
  "raw2d-effects",
  "raw2d-interaction",
  "raw2d-mcp",
  "raw2d-react",
  "raw2d-react-fiber"
];
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-registry-${version}-`));

try {
  await createProject(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...packages.map((name) => `${name}@${version}`), "react", "react-dom"], workspace);
  await run("node", ["runtime-check.mjs"], workspace);
  console.log(`registry-smoke-ok raw2d packages@${version}`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function createProject(directory) {
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "runtime-check.mjs"), `const raw = await import("raw2d");
const core = await import("raw2d-core");
const canvas = await import("raw2d-canvas");
const webgl = await import("raw2d-webgl");
const sprite = await import("raw2d-sprite");
const text = await import("raw2d-text");
const effects = await import("raw2d-effects");
const interaction = await import("raw2d-interaction");
const mcp = await import("raw2d-mcp");
const react = await import("raw2d-react");
const fiber = await import("raw2d-react-fiber");

const checks = [
  ["raw2d.Scene", raw.Scene],
  ["raw2d-core.Scene", core.Scene],
  ["raw2d-canvas.CanvasRenderer", canvas.CanvasRenderer],
  ["raw2d-webgl.WebGLRenderer2D", webgl.WebGLRenderer2D],
  ["raw2d-sprite.Sprite", sprite.Sprite],
  ["raw2d-text.Text2D", text.Text2D],
  ["raw2d-effects.createOpacityEffect", effects.createOpacityEffect],
  ["raw2d-interaction.InteractionController", interaction.InteractionController],
  ["raw2d-mcp.createRaw2DSceneJson", mcp.createRaw2DSceneJson],
  ["raw2d-react.Raw2DCanvas", react.Raw2DCanvas],
  ["raw2d-react-fiber.createRaw2DFiberHostConfig", fiber.createRaw2DFiberHostConfig]
];

for (const [name, value] of checks) {
  if (typeof value !== "function") {
    throw new Error(\`\${name} is missing from published package\`);
  }
}

console.log("registry-runtime-ok", checks.length);
`);
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
