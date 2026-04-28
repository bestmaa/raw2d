import type { DocSection, DocTopic } from "./DocPage.type";
import { createDemoForId, hasDemoId } from "./DocDemos";
import { getLiveExampleCode } from "./DocLiveExampleCode";
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
  const initialDemoSection = getInitialDemoSection(topic);
  const wrapper = document.createElement("div");
  const content = document.createElement("div");
  const header = document.createElement("header");
  let demoPanel: HTMLElement | null = null;

  wrapper.className = initialDemoSection ? "doc-topic-layout" : "";
  content.className = "doc-topic-main";
  header.className = "doc-header";

  const title = document.createElement("h2");
  title.textContent = topic.title;

  const description = document.createElement("p");
  description.textContent = topic.description;

  header.append(title, description);
  content.append(header);

  function showLiveDemo(section: DocSection): void {
    const nextDemo = section.liveDemoId ? createDemoForId(section.liveDemoId, section) : null;

    if (nextDemo && demoPanel) {
      demoPanel.replaceChildren(createFocusedDemo(nextDemo, section));
    }
  }

  for (const section of topic.sections) {
    content.append(createSection(section, showLiveDemo));
  }

  wrapper.append(content);

  if (initialDemoSection?.liveDemoId) {
    const initialDemo = createDemoForId(initialDemoSection.liveDemoId, initialDemoSection);

    if (initialDemo) {
      demoPanel = createDemoPanel(initialDemo, initialDemoSection);
      wrapper.append(demoPanel);
    }
  }

  return wrapper;
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

function createDemoPanel(demo: HTMLElement, section: DocSection): HTMLElement {
  const panel = document.createElement("aside");
  panel.className = "doc-demo-panel";
  panel.append(createFocusedDemo(demo, section));
  return panel;
}

function createFocusedDemo(demo: HTMLElement, section: DocSection): HTMLElement {
  demo.querySelectorAll("pre").forEach((pre) => pre.remove());
  demo.append(createFocusedExample(section));
  return demo;
}

function createFocusedExample(section: DocSection): HTMLElement {
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
    code.textContent = getLiveExampleCode(section);
    pre.append(code);
    wrapper.append(pre);
  }

  return wrapper;
}

function createSection(section: DocSection, onLiveCheck: (section: DocSection) => void): HTMLElement {
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
    article.append(createLiveCheckButton(section, onLiveCheck));
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

function createLiveCheckButton(section: DocSection, onLiveCheck: (section: DocSection) => void): HTMLElement {
  const button = document.createElement("button");
  button.className = "doc-live-check";
  button.type = "button";
  button.textContent = "Example";
  button.addEventListener("click", () => onLiveCheck(section));
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
