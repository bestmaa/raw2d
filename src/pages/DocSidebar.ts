import type { DocGroup, DocLanguage, DocTopic } from "./DocPage.type";
import { getDocUiText, translateTopic } from "./DocI18n";
import { findFirstDocSearchMatch, getDocSearchScore } from "./DocSearch";
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
    createSearch(options),
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

function createSearch(options: DocSidebarOptions): HTMLElement {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const button = document.createElement("button");
  const text = getDocUiText(options.language);

  form.className = "doc-search";
  input.type = "search";
  input.value = options.searchTerm;
  input.placeholder = text.searchPlaceholder;
  button.type = "submit";
  button.textContent = text.searchButton;
  form.append(input, button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    selectBestSearchMatch(options, input.value);
  });
  input.addEventListener("input", () => options.onSearch(input.value));
  input.addEventListener("keydown", (event) => handleSearchKeydown(event, options, input));
  return form;
}

function handleSearchKeydown(event: KeyboardEvent, options: DocSidebarOptions, input: HTMLInputElement): void {
  if (event.key === "Escape") {
    input.value = "";
    options.onSearch("");
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    focusFirstSearchResult();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    selectBestSearchMatch(options, input.value);
  }
}

function focusFirstSearchResult(): void {
  document.querySelector<HTMLButtonElement>(".doc-nav-button")?.focus();
}

function selectBestSearchMatch(options: DocSidebarOptions, searchTerm: string): void {
  options.onSearch(searchTerm);
  const topic = findFirstDocSearchMatch({
    groups: docGroups,
    language: options.language,
    searchTerm
  });

  if (topic) {
    options.onSelect(topic);
  }
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
    nav.append(createEmptySearchState(options.language, normalizedSearch));
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
  const description = document.createElement("p");
  let count = 0;

  section.className = "doc-nav-group";
  title.textContent = options.language === "hi" ? group.hiLabel : group.label;
  description.className = "doc-nav-group-description";
  description.textContent = options.language === "hi" ? group.hiDescription : group.description;
  section.append(title, description);

  for (const topic of getRankedTopics(group, options.language, searchTerm)) {

    section.append(createNavButton(topic, options.language, options.onSelect, searchTerm));
    count += 1;
  }

  return { element: section, count };
}

function getRankedTopics(group: DocGroup, language: DocLanguage, searchTerm: string): readonly DocTopic[] {
  if (!searchTerm) {
    return group.topics;
  }

  return group.topics
    .map((topic, index) => ({
      index,
      topic,
      score: getDocSearchScore({ topic, group, language, searchTerm })
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((entry) => entry.topic);
}

function createNavButton(
  topic: DocTopic,
  language: DocLanguage,
  onSelect: (topic: DocTopic) => void,
  searchTerm: string
): HTMLElement {
  const button = document.createElement("button");
  const label = translateTopic(topic, language).label;
  button.className = "doc-nav-button";
  button.type = "button";
  button.dataset.topicId = topic.id;
  appendHighlightedLabel(button, label, searchTerm);
  button.addEventListener("click", () => onSelect(topic));
  return button;
}

function createEmptySearchState(language: DocLanguage, searchTerm: string): HTMLElement {
  const wrapper = document.createElement("div");
  const title = document.createElement("p");
  const hint = document.createElement("p");
  wrapper.className = "doc-nav-empty";
  title.textContent = searchTerm
    ? `${getDocUiText(language).noResults}: "${searchTerm}"`
    : getDocUiText(language).noResults;
  hint.textContent = language === "hi"
    ? "Short words try karein, jaise webgl, sprite, drag, atlas."
    : "Try short words like webgl, sprite, drag, or atlas.";
  wrapper.append(title, hint);
  return wrapper;
}

function appendHighlightedLabel(target: HTMLElement, label: string, searchTerm: string): void {
  const match = findHighlightRange(label, searchTerm);

  if (!match) {
    target.textContent = label;
    return;
  }

  target.append(document.createTextNode(label.slice(0, match.start)));
  const mark = document.createElement("mark");
  mark.textContent = label.slice(match.start, match.end);
  target.append(mark, document.createTextNode(label.slice(match.end)));
}

function findHighlightRange(label: string, searchTerm: string): { readonly start: number; readonly end: number } | null {
  const lowerLabel = label.toLowerCase();
  const tokens = searchTerm.toLowerCase().split(/\s+/).filter((token) => token.length >= 2);

  for (const token of tokens) {
    const index = lowerLabel.indexOf(token);

    if (index >= 0) {
      return { start: index, end: index + token.length };
    }
  }

  return null;
}
