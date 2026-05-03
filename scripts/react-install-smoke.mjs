import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-react-${version}-`));

try {
  await createProject(workspace);
  const tarballs = await packReactPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run(
    "npm",
    ["install", ...tarballs, "react@^19.2.5", "react-dom@^19.2.5", "@types/react@^19.2.14", "@types/react-dom@^19.2.3", "vite@^8.0.10", "typescript@~6.0.2"],
    workspace
  );
  await run("npx", ["tsc", "--noEmit"], workspace);
  await run("npx", ["vite", "build"], workspace);
  await run("node", ["runtime-check.mjs"], workspace);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function packReactPackages(destination) {
  const directories = [
    "packages/core",
    "packages/interaction",
    "packages/text",
    "packages/sprite",
    "packages/canvas",
    "packages/webgl",
    "packages/effects",
    "packages/raw2d",
    "packages/react"
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
  await writeFile(path.join(directory, "index.html"), `<div id="root"></div><script type="module" src="/src/main.ts"></script>`);
  await writeFile(path.join(directory, "tsconfig.json"), `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`);
  await writeFile(path.join(directory, "runtime-check.mjs"), `const react = await import("raw2d-react");
if (typeof react.Raw2DCanvas !== "function" || typeof react.RawRect !== "function") {
  throw new Error("raw2d-react runtime exports are missing");
}
console.log("react-runtime-ok", react.RAW2D_REACT_PACKAGE_INFO.packageName);
`);
  await writeFile(path.join(directory, "src/main.ts"), getMainSource());
}

function getMainSource() {
  return `import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Texture } from "raw2d";
import { Raw2DCanvas, RawCircle, RawRect, RawSprite, RawText2D } from "raw2d-react";

const textureCanvas = document.createElement("canvas");
textureCanvas.width = 16;
textureCanvas.height = 16;
const texture = new Texture({ source: textureCanvas, width: 16, height: 16 });
const root = document.querySelector("#root");

if (!root) {
  throw new Error("Root not found.");
}

createRoot(root).render(createElement(Raw2DCanvas, { renderer: "canvas", width: 320, height: 240 }, [
  createElement(RawRect, { fillColor: "#35c2ff", height: 64, key: "rect", width: 96, x: 24, y: 32 }),
  createElement(RawCircle, { fillColor: "#f45b69", key: "circle", radius: 28, x: 180, y: 64 }),
  createElement(RawSprite, { key: "sprite", texture, x: 240, y: 42 }),
  createElement(RawText2D, { fillColor: "#f5f7fb", key: "text", text: "React", x: 24, y: 160 })
]));
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

console.log(`React install smoke passed for raw2d-react@${version}`);
