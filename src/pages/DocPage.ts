import type { DocLanguage, DocSection, DocTopic } from "./DocPage.type";
import { createCodeBlock } from "./DocCodeBlock";
import { createDemoForId, hasDemoId } from "./DocDemos";
import { getDocUiText, translateTopic } from "./DocI18n";
import { getLiveExampleCode } from "./DocLiveExampleCode";
import { createDocNotice } from "./DocNotice";
import { createDocPager } from "./DocPager";
import { findFirstDocSearchMatch } from "./DocSearch";
import { restoreSidebarSearchFocus, shouldRestoreSearchFocus } from "./DocSearchFocus";
import { createDocSidebarChildren } from "./DocSidebar";
import { docGroups, topics } from "./DocTopics";

export function renderDocPage(): HTMLElement {
  const page = document.createElement("main");
  const sidebar = document.createElement("aside");
  const content = document.createElement("section");
  let currentTopic = getInitialTopic();
  let language = getInitialLanguage();
  let searchTerm = "";

  page.className = "doc-page";
  sidebar.className = "doc-sidebar";
  content.className = "doc-content";

  function render(): void {
    const translatedTopic = translateTopic(currentTopic, language);
    const restoreSearchFocus = shouldRestoreSearchFocus(sidebar);
    window.history.replaceState(null, "", getDocUrl(currentTopic.id, language));
    content.replaceChildren(createTopicContent(translatedTopic, currentTopic, language, selectTopic));
    sidebar.replaceChildren(...createDocSidebarChildren({ language, searchTerm, onSelect: selectTopic, onSearch: setSearchTerm, onLanguage: setLanguage }));
    restoreSidebarSearchFocus(sidebar, restoreSearchFocus, searchTerm);
    updateActiveNav(page, currentTopic.id);
  }

  function selectTopic(topic: DocTopic): void {
    currentTopic = topic;
    render();
  }

  function setSearchTerm(nextSearchTerm: string): void {
    searchTerm = nextSearchTerm;
    currentTopic = findFirstDocSearchMatch({ groups: docGroups, currentTopic, language, searchTerm }) ?? currentTopic;
    render();
  }

  function setLanguage(nextLanguage: DocLanguage): void {
    language = nextLanguage;
    window.localStorage.setItem("raw2d-doc-language", nextLanguage);
    render();
  }

  page.append(sidebar, content);
  render();
  return page;
}

function createTopicContent(
  topic: DocTopic,
  sourceTopic: DocTopic,
  language: DocLanguage,
  onSelect: (topic: DocTopic) => void
): HTMLElement {
  const initialDemoSection = getInitialDemoSection(topic);
  const wrapper = document.createElement("div");
  const content = document.createElement("div");
  const header = document.createElement("header");
  let demoPanel: HTMLElement | null = null;

  wrapper.className = initialDemoSection ? "doc-topic-layout" : "";
  content.className = "doc-topic-main";
  header.className = "doc-header";
  header.append(createHeading(topic.title, topic.description));
  content.append(header);

  function showLiveDemo(section: DocSection, sourceSection: DocSection): void {
    const nextDemo = section.liveDemoId ? createDemoForId(section.liveDemoId, section) : null;

    if (nextDemo && demoPanel) {
      demoPanel.replaceChildren(createFocusedDemo(nextDemo, section, sourceSection));
    }
  }

  for (const [index, section] of topic.sections.entries()) {
    content.append(createSection(section, sourceTopic.sections[index] ?? section, showLiveDemo, language));
  }

  content.append(createDocPager(sourceTopic, language, onSelect));
  wrapper.append(content);

  if (initialDemoSection?.liveDemoId) {
    const initialDemo = createDemoForId(initialDemoSection.liveDemoId, initialDemoSection);

    if (initialDemo) {
      const sourceDemoSection = getInitialDemoSection(sourceTopic) ?? initialDemoSection;
      demoPanel = createDemoPanel(initialDemo, initialDemoSection, sourceDemoSection);
      wrapper.append(demoPanel);
    }
  }

  return wrapper;
}

function createHeading(titleText: string, descriptionText: string): HTMLElement {
  const fragment = document.createElement("div");
  const title = document.createElement("h2");
  const description = document.createElement("p");

  title.textContent = titleText;
  description.textContent = descriptionText;
  fragment.append(title, description);
  return fragment;
}

function getInitialDemoSection(topic: DocTopic): DocSection | null {
  const section = topic.sections.find((candidate) => candidate.liveDemoId);

  if (section) {
    return section;
  }

  if (!hasDemoId(topic.id)) {
    return null;
  }

  return {
    title: topic.title,
    body: topic.description,
    liveDemoId: topic.id
  };
}

function createDemoPanel(demo: HTMLElement, section: DocSection, sourceSection: DocSection): HTMLElement {
  const panel = document.createElement("aside");
  panel.className = "doc-demo-panel";
  panel.append(createFocusedDemo(demo, section, sourceSection));
  return panel;
}

function createFocusedDemo(demo: HTMLElement, section: DocSection, sourceSection: DocSection): HTMLElement {
  demo.querySelectorAll("pre").forEach((pre) => pre.remove());
  demo.append(createFocusedExample(section, sourceSection));
  return demo;
}

function createFocusedExample(section: DocSection, sourceSection: DocSection): HTMLElement {
  const wrapper = document.createElement("div");
  const title = document.createElement("h3");
  const body = document.createElement("p");

  wrapper.className = "doc-focused-example";
  title.textContent = section.title;
  body.textContent = section.body;
  wrapper.append(title, body);

  if (section.liveDemoId || section.liveCode || section.code) {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = getLiveExampleCode(sourceSection);
    pre.append(code);
    wrapper.append(pre);
  }

  return wrapper;
}

function createSection(
  section: DocSection,
  sourceSection: DocSection,
  onLiveCheck: (section: DocSection, sourceSection: DocSection) => void,
  language: DocLanguage
): HTMLElement {
  const article = document.createElement("article");
  const title = document.createElement("h2");
  const body = document.createElement("p");

  article.className = "doc-section";
  title.textContent = section.title;
  body.textContent = section.body;
  article.append(title, body);

  if (section.notice) {
    article.append(createDocNotice(section.notice));
  }

  if (section.code) {
    article.append(createCodeBlock(section.code, language));
  }

  if (section.liveDemoId) {
    article.append(createLiveCheckButton(section, sourceSection, onLiveCheck, language));
  }

  return article;
}

function createLiveCheckButton(
  section: DocSection,
  sourceSection: DocSection,
  onLiveCheck: (section: DocSection, sourceSection: DocSection) => void,
  language: DocLanguage
): HTMLElement {
  const button = document.createElement("button");
  button.className = "doc-live-check";
  button.type = "button";
  button.textContent = getDocUiText(language).example;
  button.addEventListener("click", () => onLiveCheck(section, sourceSection));
  return button;
}

function getInitialTopic(): DocTopic {
  const id = window.location.hash.replace("#", "");
  return topics.find((topic) => topic.id === id) ?? topics[0];
}

function getInitialLanguage(): DocLanguage {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  return queryLanguage === "hi" || window.localStorage.getItem("raw2d-doc-language") === "hi" ? "hi" : "en";
}

function getDocUrl(topicId: string, language: DocLanguage): string {
  const query = language === "hi" ? "?lang=hi" : "";
  return `/doc${query}#${topicId}`;
}

function updateActiveNav(root: HTMLElement, topicId: string): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>(".doc-nav-button");

  for (const button of buttons) {
    const isActive = button.dataset.topicId === topicId;
    button.classList.toggle("is-active", isActive);

    if (isActive) {
      button.scrollIntoView({ block: "nearest" });
    }
  }
}
