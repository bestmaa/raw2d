import type { DocGroup, DocLanguage, DocTopic } from "./DocPage.type";
import { getDocUiText, translateTopic } from "./DocI18n";
import { matchesDocSearch } from "./DocSearch";
import { docGroups } from "./DocTopics";

export interface DocSidebarOptions {
  readonly language: DocLanguage;
  readonly searchTerm: string;
  readonly onSelect: (topic: DocTopic) => void;
  readonly onSearch: (term: string) => void;
  readonly onLanguage: (language: DocLanguage) => void;
}

export function createDocSidebarChildren(options: DocSidebarOptions): readonly HTMLElement[] {
  const header = document.createElement("div");
  const nav = createGroupedNav(options);

  header.className = "doc-sidebar-header";
  header.append(
    createSidebarLinks(),
    createLanguageControl(options.language, options.onLanguage),
    createSearch(options.language, options.searchTerm, options.onSearch),
    createSidebarTitle()
  );
  return [header, nav];
}

function createSidebarLinks(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "doc-sidebar-links";
  wrapper.innerHTML = `<a href="/" class="doc-back">Canvas Preview</a><a href="/readme" class="doc-back">Readme Docs</a>`;
  return wrapper;
}

function createSidebarTitle(): HTMLElement {
  const title = document.createElement("h1");
  title.textContent = "Raw2D Docs";
  return title;
}

function createLanguageControl(language: DocLanguage, onLanguage: (language: DocLanguage) => void): HTMLElement {
  const wrapper = document.createElement("div");
  const label = document.createElement("span");
  wrapper.className = "doc-language";
  label.textContent = getDocUiText(language).language;
  wrapper.append(label, createLanguageButton("EN", language === "en", () => onLanguage("en")));
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

function createSearch(language: DocLanguage, searchTerm: string, onSearch: (term: string) => void): HTMLElement {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const button = document.createElement("button");
  const text = getDocUiText(language);

  form.className = "doc-search";
  input.type = "search";
  input.value = searchTerm;
  input.placeholder = text.searchPlaceholder;
  button.type = "submit";
  button.textContent = text.searchButton;
  form.append(input, button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSearch(input.value);
  });
  input.addEventListener("input", () => onSearch(input.value));
  return form;
}

function createGroupedNav(options: DocSidebarOptions): HTMLElement {
  const nav = document.createElement("nav");
  const normalizedSearch = options.searchTerm.trim().toLowerCase();
  let visibleCount = 0;
  nav.className = "doc-nav";

  for (const group of docGroups) {
    const groupElement = createGroup(group, options, normalizedSearch);
    visibleCount += groupElement.count;

    if (groupElement.count > 0) {
      nav.append(groupElement.element);
    }
  }

  if (visibleCount === 0) {
    const empty = document.createElement("p");
    empty.className = "doc-nav-empty";
    empty.textContent = getDocUiText(options.language).noResults;
    nav.append(empty);
  }

  return nav;
}

function createGroup(
  group: DocGroup,
  options: DocSidebarOptions,
  searchTerm: string
): { readonly element: HTMLElement; readonly count: number } {
  const section = document.createElement("section");
  const title = document.createElement("h2");
  let count = 0;

  section.className = "doc-nav-group";
  title.textContent = options.language === "hi" ? group.hiLabel : group.label;
  section.append(title);

  for (const topic of group.topics) {
    if (!matchesDocSearch({ topic, group, language: options.language, searchTerm })) {
      continue;
    }

    section.append(createNavButton(topic, options.language, options.onSelect));
    count += 1;
  }

  return { element: section, count };
}

function createNavButton(topic: DocTopic, language: DocLanguage, onSelect: (topic: DocTopic) => void): HTMLElement {
  const button = document.createElement("button");
  button.className = "doc-nav-button";
  button.type = "button";
  button.dataset.topicId = topic.id;
  button.textContent = translateTopic(topic, language).label;
  button.addEventListener("click", () => onSelect(topic));
  return button;
}
