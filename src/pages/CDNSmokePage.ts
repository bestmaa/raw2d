import { BasicMaterial, Camera2D, Canvas, Rect, Scene, Text2D } from "raw2d";

const pinnedVersion = "1.7.6";
const esmUrl = "https://cdn.jsdelivr.net/npm/raw2d@1.7.6/dist/raw2d.js";
const umdUrl = "https://cdn.jsdelivr.net/npm/raw2d@1.7.6/dist/raw2d.umd.cjs";

export function renderCDNSmokePage(root: HTMLElement): void {
  root.innerHTML = `
    <main class="doc-page cdn-smoke-page">
      <section class="doc-content">
        <h1>Raw2D CDN Smoke</h1>
        <p>Use this page after publish to verify pinned jsDelivr URLs and a browser module import.</p>
        <div class="doc-section">
          <h2>Pinned URLs</h2>
          <pre><code>${esmUrl}
${umdUrl}</code></pre>
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
  esm: esmUrl,
  pinnedVersion,
  umd: umdUrl
} as const;
