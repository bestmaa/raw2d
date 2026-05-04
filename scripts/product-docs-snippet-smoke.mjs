import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-product-docs-${version}-`));

try {
  const snippets = await readProductSnippets();
  await createProject(workspace, snippets);
  const tarballs = await packPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  console.log(`Product docs snippet smoke passed for ${snippets.length} snippets on Raw2D@${version}`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function readProductSnippets() {
  const files = [
    "docs/GettingStarted.md",
    "docs/Examples.md",
    "docs/V1Install.md",
    "docs/UmbrellaBetaInstallAudit.md",
    "docs/CanvasFocusedInstallAudit.md",
    "docs/WebGLFocusedInstallAudit.md",
    "docs/PostReleaseAuditPlan.md",
    "docs/CDNBetaSmoke.md"
  ];
  const snippets = [];

  for (const file of files) {
    const markdown = await readFile(path.join(root, file), "utf8");
    const matches = markdown.matchAll(/```(?:ts|tsx|js|javascript)\n([\s\S]*?)```/g);

    for (const match of matches) {
      const code = match[1].trim();

      if (isProductSnippet(code)) {
        snippets.push({ name: `${path.basename(file, ".md")}-${snippets.length}`, code });
      }
    }
  }

  if (snippets.length < 8) {
    throw new Error(`Expected at least 8 product snippets, found ${snippets.length}`);
  }

  return snippets;
}

function isProductSnippet(code) {
  return /from "raw2d|from "raw2d-|import\("raw2d/.test(code) && !code.includes("cdn.jsdelivr.net");
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
  const body = stripImports(code);

  return `${getImports()}

async function run(): Promise<void> {
${getFixture(body)}

${indent(body)}
}

void run;
`;
}

function stripImports(code) {
  return code
    .replace(/import\s+type\s+\{[\s\S]*?\}\s+from\s+"[^"]+";\n?/g, "")
    .replace(/import\s+\{[\s\S]*?\}\s+from\s+"[^"]+";\n?/g, "");
}

function getImports() {
  return `import {
  BasicMaterial, Camera2D, Canvas, CanvasRenderer, InteractionController, Rect,
  Scene, Sprite, Text2D, TextureAtlasPacker, WebGLRenderer2D, isWebGL2Available
} from "raw2d";`;
}

function getFixture(code) {
  const lines = [
    maybe(code, "canvasElement", "const canvasElement = document.createElement(\"canvas\");"),
    maybe(code, "canvas", "const canvas = document.createElement(\"canvas\");"),
    maybe(code, "scene", "const scene = new Scene();"),
    maybe(code, "camera", "const camera = new Camera2D();"),
    maybe(code, "renderer", "const renderer = new Canvas({ canvas: canvasElement });"),
    maybe(code, "raw2dCanvas", "const raw2dCanvas = renderer;"),
    maybe(code, "idleCanvas", "const idleCanvas = document.createElement(\"canvas\");"),
    maybe(code, "runCanvas", "const runCanvas = document.createElement(\"canvas\");")
  ].filter(Boolean);

  return indent(lines.join("\n"));
}

function maybe(code, name, line) {
  if (!new RegExp(`\\b${name}\\b`).test(code) || new RegExp(`(?:const|let|var)\\s+${name}\\b`).test(code)) {
    return "";
  }

  return line;
}

function indent(value) {
  return value.split("\n").map((line) => `  ${line}`).join("\n");
}

async function packPackages(destination) {
  const directories = [
    "packages/core",
    "packages/interaction",
    "packages/text",
    "packages/sprite",
    "packages/canvas",
    "packages/webgl",
    "packages/effects",
    "packages/raw2d"
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
