import type {
  StudioLayoutOptions,
  StudioLayerItem,
  StudioPropertyRow,
  StudioToolItem
} from "./StudioLayout.type";
import { studioRendererOptions } from "./StudioRenderer";

const tools: readonly StudioToolItem[] = [
  { id: "select", label: "Select", shortcut: "V" },
  { id: "rect", label: "Rect", shortcut: "R" },
  { id: "circle", label: "Circle", shortcut: "C" },
  { id: "line", label: "Line", shortcut: "L" },
  { id: "text", label: "Text", shortcut: "T" }
];

const layers: readonly StudioLayerItem[] = [
  { id: "scene", label: "Scene Root", type: "Scene" },
  { id: "guide", label: "Workspace Guide", type: "Guide" }
];

function renderTool(tool: StudioToolItem): string {
  return `
    <button class="studio-tool" type="button" data-tool="${tool.id}">
      <span>${tool.label}</span>
      <kbd>${tool.shortcut}</kbd>
    </button>
  `;
}

function renderLayer(layer: StudioLayerItem): string {
  return `
    <button class="studio-layer" type="button" data-layer="${layer.id}">
      <span>${layer.label}</span>
      <small>${layer.type}</small>
    </button>
  `;
}

function renderRendererSwitch(activeLabel: string): string {
  return studioRendererOptions
    .map((option) => {
      const isActive = option.label === activeLabel;
      return `
        <button class="studio-renderer-option${isActive ? " is-active" : ""}" type="button" data-renderer="${option.mode}">
          <span>${option.label}</span>
          <small>${option.description}</small>
        </button>
      `;
    })
    .join("");
}

function renderProperty(row: StudioPropertyRow): string {
  return `
    <div class="studio-property">
      <span>${row.label}</span>
      <strong>${row.value}</strong>
    </div>
  `;
}

export function renderStudioLayout(options: StudioLayoutOptions): string {
  const properties: readonly StudioPropertyRow[] = [
    { label: "Renderer", value: options.rendererLabel },
    { label: "Objects", value: String(options.objectCount) },
    { label: "Zoom", value: "100%" },
    { label: "Selection", value: "None" }
  ];

  return `
    <section class="studio-shell" aria-label="Raw2D Studio">
      <header class="studio-topbar">
        <div>
          <p class="studio-kicker">Raw2D Studio</p>
          <h1>Editor workspace</h1>
          <span class="studio-scene-name">${options.sceneName}</span>
        </div>
        <nav class="studio-actions" aria-label="Studio actions">
          <button type="button">New</button>
          <button type="button">Save</button>
          <button type="button">Export</button>
        </nav>
      </header>
      <div class="studio-grid">
        <aside class="studio-panel studio-tools" aria-label="Tools">
          <h2>Tools</h2>
          <div class="studio-stack">${tools.map(renderTool).join("")}</div>
        </aside>
        <section class="studio-workspace" aria-label="Canvas workspace">
          <div class="studio-stage-header">
            <span>Canvas workspace</span>
            <span>800 x 600</span>
          </div>
          <div class="studio-canvas-placeholder">
            <div class="studio-artboard">Raw2D canvas mount</div>
          </div>
          <footer class="studio-statusbar">
            Ready | ${options.rendererLabel} renderer | ${options.objectCount} objects | No selection
          </footer>
        </section>
        <aside class="studio-panel studio-inspector" aria-label="Inspector">
          <section>
            <h2>Renderer</h2>
            <div class="studio-renderer-switch">${renderRendererSwitch(options.rendererLabel)}</div>
          </section>
          <section>
            <h2>Layers</h2>
            <div class="studio-stack">${layers.map(renderLayer).join("")}</div>
          </section>
          <section>
            <h2>Properties</h2>
            <div class="studio-stack">${properties.map(renderProperty).join("")}</div>
          </section>
        </aside>
      </div>
    </section>
  `;
}
