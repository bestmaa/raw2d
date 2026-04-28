import { renderMarkdown } from "./ReadmeMarkdown";
import { readmeDocs } from "./ReadmeDocs";
import type { ReadmeDoc } from "./ReadmePage.type";

export function renderReadmePage(): HTMLElement {
  const page = document.createElement("main");
  const content = document.createElement("section");
  page.className = "readme-page";
  content.className = "readme-content";

  function selectDoc(doc: ReadmeDoc): void {
    window.history.replaceState(null, "", `/readme#${doc.id}`);
    content.replaceChildren(renderDoc(doc));
    updateActiveNav(page, doc.id);
  }

  page.append(createSidebar(selectDoc), content);
  selectDoc(getInitialDoc());
  return page;
}

function createSidebar(onSelect: (doc: ReadmeDoc) => void): HTMLElement {
  const sidebar = document.createElement("aside");
  const nav = document.createElement("nav");
  sidebar.className = "readme-sidebar";
  sidebar.innerHTML = `
    <a href="/" class="doc-back">Canvas Preview</a>
    <a href="/doc" class="doc-back">Interactive Docs</a>
    <h1>Raw2D Readme</h1>
  `;
  nav.className = "readme-nav";

  for (const doc of readmeDocs) {
    const button = document.createElement("button");
    button.className = "readme-nav-button";
    button.type = "button";
    button.dataset.docId = doc.id;
    button.textContent = doc.label;
    button.addEventListener("click", () => onSelect(doc));
    nav.append(button);
  }

  sidebar.append(nav);
  return sidebar;
}

function renderDoc(doc: ReadmeDoc): HTMLElement {
  const wrapper = document.createElement("div");
  const header = document.createElement("header");
  const eyebrow = document.createElement("p");
  wrapper.className = "readme-document";
  header.className = "readme-header";
  eyebrow.className = "readme-eyebrow";
  eyebrow.textContent = `docs/${doc.filename}`;
  header.append(eyebrow);
  wrapper.append(header, renderMarkdown(doc.content));
  return wrapper;
}

function getInitialDoc(): ReadmeDoc {
  const id = window.location.hash.replace("#", "");
  return readmeDocs.find((doc) => doc.id === id) ?? readmeDocs[0];
}

function updateActiveNav(root: HTMLElement, docId: string): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>(".readme-nav-button");

  for (const button of buttons) {
    const isActive = button.dataset.docId === docId;
    button.classList.toggle("is-active", isActive);

    if (isActive) {
      button.scrollIntoView({ block: "nearest" });
    }
  }
}
