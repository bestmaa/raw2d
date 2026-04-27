import type { DocSection, DocTopic } from "./DocPage.type";
import { createDemoForId, hasDemoId } from "./DocDemos";
import { topics } from "./DocTopics";

export function renderDocPage(): HTMLElement {
  const page = document.createElement("main");
  page.className = "doc-page";
  const content = document.createElement("section");
  content.className = "doc-content";

  function selectTopic(topic: DocTopic): void {
    window.history.replaceState(null, "", `/doc#${topic.id}`);
    content.replaceChildren(createTopicContent(topic));
    updateActiveNav(page, topic.id);
  }

  page.append(createSidebar(selectTopic), content);
  selectTopic(getInitialTopic());
  return page;
}

function createSidebar(onSelect: (topic: DocTopic) => void): HTMLElement {
  const sidebar = document.createElement("aside");
  const nav = document.createElement("nav");
  sidebar.className = "doc-sidebar";
  sidebar.innerHTML = `
    <a href="/" class="doc-back">Canvas Preview</a>
    <h1>Raw2D Docs</h1>
  `;
  nav.className = "doc-nav";

  for (const topic of topics) {
    const button = document.createElement("button");
    button.className = "doc-nav-button";
    button.type = "button";
    button.dataset.topicId = topic.id;
    button.textContent = topic.label;
    button.addEventListener("click", () => onSelect(topic));
    nav.append(button);
  }

  sidebar.append(nav);
  return sidebar;
}

function createTopicContent(topic: DocTopic): HTMLElement {
  const initialDemoId = getInitialDemoId(topic);
  const wrapper = document.createElement("div");
  const content = document.createElement("div");
  const header = document.createElement("header");
  let demoPanel: HTMLElement | null = null;

  wrapper.className = initialDemoId ? "doc-topic-layout" : "";
  content.className = "doc-topic-main";
  header.className = "doc-header";

  const title = document.createElement("h2");
  title.textContent = topic.title;

  const description = document.createElement("p");
  description.textContent = topic.description;

  header.append(title, description);
  content.append(header);

  function showLiveDemo(demoId: string): void {
    const nextDemo = createDemoForId(demoId);

    if (nextDemo && demoPanel) {
      demoPanel.replaceChildren(nextDemo);
    }
  }

  for (const section of topic.sections) {
    content.append(createSection(section, showLiveDemo));
  }

  wrapper.append(content);

  if (initialDemoId) {
    const initialDemo = createDemoForId(initialDemoId);

    if (initialDemo) {
      demoPanel = createDemoPanel(initialDemo);
      wrapper.append(demoPanel);
    }
  }

  return wrapper;
}

function getInitialDemoId(topic: DocTopic): string | null {
  const sectionDemoId = topic.sections.find((section) => section.liveDemoId)?.liveDemoId;
  return sectionDemoId ?? (hasDemoId(topic.id) ? topic.id : null);
}

function createDemoPanel(demo: HTMLElement): HTMLElement {
  const panel = document.createElement("aside");
  panel.className = "doc-demo-panel";
  panel.append(demo);
  return panel;
}

function createSection(section: DocSection, onLiveCheck: (demoId: string) => void): HTMLElement {
  const article = document.createElement("article");
  article.className = "doc-section";

  const title = document.createElement("h2");
  title.textContent = section.title;

  const body = document.createElement("p");
  body.textContent = section.body;

  article.append(title, body);

  if (section.code) {
    article.append(createCodeBlock(section.code));
  }

  if (section.liveDemoId) {
    article.append(createLiveCheckButton(section.liveDemoId, onLiveCheck));
  }

  return article;
}

function createCodeBlock(code: string): HTMLElement {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const pre = document.createElement("pre");
  const codeElement = document.createElement("code");

  details.className = "doc-code-toggle";
  summary.textContent = "Code";
  codeElement.textContent = code;
  pre.append(codeElement);
  details.append(summary, pre);
  return details;
}

function createLiveCheckButton(demoId: string, onLiveCheck: (demoId: string) => void): HTMLElement {
  const button = document.createElement("button");
  button.className = "doc-live-check";
  button.type = "button";
  button.textContent = "Live Check";
  button.addEventListener("click", () => onLiveCheck(demoId));
  return button;
}

function getInitialTopic(): DocTopic {
  const id = window.location.hash.replace("#", "");
  return topics.find((topic) => topic.id === id) ?? topics[0];
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
