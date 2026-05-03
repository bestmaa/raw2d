import type { DocTopic } from "./DocPage.type";

export const webGLDebugOverlayTopics: readonly DocTopic[] = [
  {
    id: "webgl-debug-overlay",
    label: "WebGL Debug Overlay",
    title: "WebGL Debug Overlay",
    description: "A debug overlay is a small UI layer that reads WebGL diagnostics after render and shows the pipeline cost while the scene runs.",
    sections: [
      {
        title: "Create Overlay",
        body: "Use getDiagnostics after render. The overlay reads public numbers only; it does not reach into WebGL internals.",
        liveDemoId: "webgl-performance",
        code: `const overlay = document.createElement("code");
overlay.style.position = "absolute";
overlay.style.left = "10px";
overlay.style.top = "10px";

webglRenderer.render(scene, camera);
const diagnostics = webglRenderer.getDiagnostics();

overlay.textContent = [
  \`renderer: \${diagnostics.renderer}\`,
  \`objects: \${diagnostics.stats.objects}\`,
  \`drawCalls: \${diagnostics.stats.drawCalls}\`,
  \`textureBinds: \${diagnostics.stats.textureBinds}\`
].join("\\n");`
      },
      {
        title: "Read Cache Signals",
        body: "Cache size and context state help debug texture churn, text cache pressure, ShapePath fallback pressure, and context lifecycle issues.",
        liveDemoId: "webgl-performance",
        code: `const diagnostics = webglRenderer.getDiagnostics();

console.log(diagnostics.contextLost);
console.log(diagnostics.textureCacheSize);
console.log(diagnostics.textTextureCacheSize);
console.log(diagnostics.shapePathTextureCacheSize);`
      },
      {
        title: "Keep It Optional",
        body: "The overlay belongs in docs and debug tooling. Production rendering should keep diagnostics readable but avoid forcing UI into the renderer.",
        liveDemoId: "webgl-performance",
        code: `if (debug) {
  updateOverlay(webglRenderer.getDiagnostics());
}`
      }
    ]
  }
];
