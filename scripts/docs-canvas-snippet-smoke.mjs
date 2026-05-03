import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-canvas-docs-${version}-`));

try {
  const examples = await readCanvasExamples();
  await createProject(workspace, examples);
  const tarballs = await packCanvasPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  console.log(`Canvas docs snippet smoke passed for ${examples.length} examples on Raw2D@${version}`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function readCanvasExamples() {
  const source = await readFile(path.join(root, "src/pages/DocFullExamples.ts"), "utf8");
  const names = [
    "fullRectExample",
    "fullCircleExample",
    "fullEllipseExample",
    "fullArcExample",
    "fullLineExample",
    "fullPolylineExample",
    "fullPolygonExample",
    "fullText2DExample",
    "fullSpriteExample"
  ];
  const examples = names.map((name) => {
    const match = source.match(new RegExp(`export const ${name} = \`([\\s\\S]*?)\`;`));

    if (!match?.[1]) {
      throw new Error(`Missing Canvas docs example: ${name}`);
    }

    return { name, code: match[1] };
  });

  return examples;
}

async function createProject(directory, examples) {
  await mkdir(path.join(directory, "src"), { recursive: true });
  await writeFile(path.join(directory, "tsconfig.json"), `{
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
`);

  for (const example of examples) {
    await writeFile(path.join(directory, "src", `${example.name}.ts`), example.code);
  }
}

async function packCanvasPackages(destination) {
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
