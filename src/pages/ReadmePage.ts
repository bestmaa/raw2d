import { renderMarkdown } from "./ReadmeMarkdown";
import { readmeDocs } from "./ReadmeDocs";
import { readmeHinglishDocs } from "./ReadmeHinglishDocs";
import type { DocLanguage } from "./DocPage.type";
import type { ReadmeDoc } from "./ReadmePage.type";

export function renderReadmePage(): HTMLElement {
  const page = document.createElement("main");
  const content = document.createElement("section");
  let language = getInitialLanguage();
  let docs = getDocs(language);
  let currentDoc = getInitialDoc(docs);

  page.className = "readme-page";
  content.className = "readme-content";

  function selectDoc(doc: ReadmeDoc): void {
    currentDoc = doc;
    render();
  }

  function setLanguage(nextLanguage: DocLanguage): void {
    language = nextLanguage;
    docs = getDocs(language);
    currentDoc = docs.find((doc) => doc.id === currentDoc.id) ?? docs[0];
    window.localStorage.setItem("raw2d-readme-language", language);
    render();
  }

  function render(): void {
    window.history.replaceState(null, "", getReadmeUrl(currentDoc.id, language));
    content.replaceChildren(renderDoc(currentDoc));
    sidebar.replaceChildren(...createSidebarChildren(docs, language, selectDoc, setLanguage));
    updateActiveNav(page, currentDoc.id);
  }

  const sidebar = document.createElement("aside");
  sidebar.className = "readme-sidebar";
  page.append(sidebar, content);
  render();
  return page;
}

function createSidebarChildren(
  docs: readonly ReadmeDoc[],
  language: DocLanguage,
  onSelect: (doc: ReadmeDoc) => void,
  onLanguage: (language: DocLanguage) => void
): readonly HTMLElement[] {
  const header = document.createElement("div");
  const nav = document.createElement("nav");

  header.className = "readme-sidebar-header";
  header.innerHTML = `<a href="/" class="doc-back">Canvas Preview</a><a href="/doc" class="doc-back">Interactive Docs</a><h1>Raw2D Readme</h1>`;
  header.append(createLanguageControl(language, onLanguage));
  nav.className = "readme-nav";

  for (const doc of docs) {
    const button = document.createElement("button");
    button.className = "readme-nav-button";
    button.type = "button";
    button.dataset.docId = doc.id;
    button.textContent = doc.label;
    button.addEventListener("click", () => onSelect(doc));
    nav.append(button);
  }

  return [header, nav];
}

function createLanguageControl(language: DocLanguage, onLanguage: (language: DocLanguage) => void): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "doc-language";
  wrapper.append(createLanguageButton("EN", language === "en", () => onLanguage("en")));
  wrapper.append(createLanguageButton("Hinglish", language === "hi", () => onLanguage("hi")));
  return wrapper;
}

function createLanguageButton(label: string, active: boolean, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "doc-language-button";
  button.classList.toggle("is-active", active);
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
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

function getInitialDoc(docs: readonly ReadmeDoc[]): ReadmeDoc {
  const id = window.location.hash.replace("#", "");
  return docs.find((doc) => doc.id === id) ?? docs[0];
}

function getDocs(language: DocLanguage): readonly ReadmeDoc[] {
  return language === "hi" ? readmeHinglishDocs : readmeDocs;
}

function getInitialLanguage(): DocLanguage {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  return queryLanguage === "hi" || window.localStorage.getItem("raw2d-readme-language") === "hi" ? "hi" : "en";
}

function getReadmeUrl(docId: string, language: DocLanguage): string {
  const query = language === "hi" ? "?lang=hi" : "";
  return `/readme${query}#${docId}`;
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
