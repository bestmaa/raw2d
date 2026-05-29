import { BasicMaterial, Camera2D, Canvas, Rect, Scene, Text2D } from "raw2d";

const pinnedVersion = "1.25.5";
const esmUrl = `https://cdn.jsdelivr.net/npm/raw2d@${pinnedVersion}/dist/raw2d.js`;
const umdUrl = `https://cdn.jsdelivr.net/npm/raw2d@${pinnedVersion}/dist/raw2d.umd.cjs`;
const coreUrl = `https://cdn.jsdelivr.net/npm/raw2d-core@${pinnedVersion}/dist/index.js`;
const canvasUrl = `https://cdn.jsdelivr.net/npm/raw2d-canvas@${pinnedVersion}/dist/index.js`;
const webglUrl = `https://cdn.jsdelivr.net/npm/raw2d-webgl@${pinnedVersion}/dist/index.js`;
const spriteUrl = `https://cdn.jsdelivr.net/npm/raw2d-sprite@${pinnedVersion}/dist/index.js`;
const textUrl = `https://cdn.jsdelivr.net/npm/raw2d-text@${pinnedVersion}/dist/index.js`;
const effectsUrl = `https://cdn.jsdelivr.net/npm/raw2d-effects@${pinnedVersion}/dist/index.js`;
const interactionUrl = `https://cdn.jsdelivr.net/npm/raw2d-interaction@${pinnedVersion}/dist/index.js`;
const mcpUrl = `https://cdn.jsdelivr.net/npm/raw2d-mcp@${pinnedVersion}/dist/index.js`;
const reactUrl = `https://cdn.jsdelivr.net/npm/raw2d-react@${pinnedVersion}/dist/index.js`;
const reactFiberUrl = `https://cdn.jsdelivr.net/npm/raw2d-react-fiber@${pinnedVersion}/dist/index.js`;
const pinnedUrls = [
  esmUrl,
  umdUrl,
  coreUrl,
  canvasUrl,
  webglUrl,
  spriteUrl,
  textUrl,
  effectsUrl,
  interactionUrl,
  mcpUrl,
  reactUrl,
  reactFiberUrl
] as const;

export function renderCDNSmokePage(root: HTMLElement): void {
  root.innerHTML = `
    <main class="doc-page cdn-smoke-page">
      <section class="doc-content">
        <h1>Raw2D CDN Smoke</h1>
        <p>Use this page after publish to verify pinned jsDelivr URLs and a browser module import.</p>
        <div class="doc-section">
          <h2>Pinned URLs</h2>
          <pre><code>${pinnedUrls.join("\n")}</code></pre>
        </div>
        <div class="doc-section">
          <h2>Browser Import</h2>
          <pre><code>import { Scene, Camera2D, CanvasRenderer } from "${esmUrl}";

const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });</code></pre>
        </div>
        <canvas id="raw2d-cdn-canvas" width="320" height="180" aria-label="Raw2D CDN smoke preview"></canvas>
      </section>
    </main>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>("#raw2d-cdn-canvas");

  if (!canvas) {
    throw new Error("CDN smoke canvas not found.");
  }

  const renderer = new Canvas({ canvas, width: 320, height: 180, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const material = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#f5f7fb", lineWidth: 2 });

  scene.add(new Rect({ x: 48, y: 42, width: 112, height: 64, material }));
  scene.add(new Text2D({ x: 48, y: 132, text: "Pinned CDN", material: new BasicMaterial({ fillColor: "#f5f7fb" }) }));
  renderer.render(scene, camera);
}

export const CDN_SMOKE_URLS = {
  canvas: canvasUrl,
  core: coreUrl,
  effects: effectsUrl,
  esm: esmUrl,
  interaction: interactionUrl,
  mcp: mcpUrl,
  pinnedVersion,
  react: reactUrl,
  reactFiber: reactFiberUrl,
  sprite: spriteUrl,
  text: textUrl,
  umd: umdUrl,
  webgl: webglUrl
} as const;
