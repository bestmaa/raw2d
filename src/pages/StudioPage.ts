import type { StudioShellPanel } from "./StudioPage.type";

const panels: readonly StudioShellPanel[] = [
  {
    title: "Layers",
    items: ["Scene order", "Visibility", "Lock state", "Selection"]
  },
  {
    title: "Properties",
    items: ["Transform", "Geometry", "Material", "Render mode"]
  },
  {
    title: "Assets",
    items: ["Textures", "Atlas frames", "Sprite source", "Missing asset warnings"]
  },
  {
    title: "Renderer Stats",
    items: ["Draw calls", "Texture binds", "Cache hits", "Unsupported objects"]
  }
];

export function renderStudioPage(): HTMLElement {
  const page = document.createElement("main");
  const header = document.createElement("header");
  const workspace = document.createElement("section");

  page.className = "studio-page";
  header.className = "studio-header";
  workspace.className = "studio-workspace";

  header.append(createHeading(), createLinks());
  workspace.append(createLeftRail(), createCanvasPlaceholder(), createPanelColumn());
  page.append(header, workspace);
  return page;
}

function createHeading(): HTMLElement {
  const block = document.createElement("div");
  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.textContent = "Raw2D Studio";
  body.textContent = "MVP shell for the future visual editor. This route is UI-only and does not import runtime renderer packages.";
  block.append(title, body);
  return block;
}

function createLinks(): HTMLElement {
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Studio links");
  nav.append(createLink("/doc#studio-scope", "Scope"), createLink("/doc#studio-tools", "Tools"), createLink("/doc#studio-panels", "Panels"));
  return nav;
}

function createLink(href: string, label: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  return link;
}

function createLeftRail(): HTMLElement {
  const rail = document.createElement("aside");
  rail.className = "studio-rail";
  rail.append(createToolButton("Select"), createToolButton("Shape"), createToolButton("Text"), createToolButton("Sprite"));
  return rail;
}

function createToolButton(label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.disabled = true;
  return button;
}

function createCanvasPlaceholder(): HTMLElement {
  const canvas = document.createElement("section");
  const title = document.createElement("h2");
  const body = document.createElement("p");

  canvas.className = "studio-canvas-placeholder";
  title.textContent = "Canvas Workspace";
  body.textContent = "Planned area for add, select, drag, resize, zoom, save, load, and export workflows.";
  canvas.append(title, body);
  return canvas;
}

function createPanelColumn(): HTMLElement {
  const column = document.createElement("aside");
  column.className = "studio-panels";
  column.append(...panels.map(createPanel));
  return column;
}

function createPanel(panel: StudioShellPanel): HTMLElement {
  const section = document.createElement("section");
  const title = document.createElement("h2");
  const list = document.createElement("ul");

  title.textContent = panel.title;
  list.append(...panel.items.map(createPanelItem));
  section.append(title, list);
  return section;
}

function createPanelItem(item: string): HTMLLIElement {
  const element = document.createElement("li");
  element.textContent = item;
  return element;
}
