import type { DocSection, DocTopic } from "./DocPage.type";
import { topics } from "./DocTopics";
import { createBoundsDemo } from "./BoundsDemo";
import { createCircleDemo } from "./CircleDemo";
import { createLineDemo } from "./LineDemo";
import { createOriginDemo } from "./OriginDemo";
import { createRectDemo } from "./RectDemo";
import { createSpriteDemo } from "./SpriteDemo";
import { createText2DDemo } from "./Text2DDemo";

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
  sidebar.className = "doc-sidebar";
  sidebar.innerHTML = `
    <a href="/" class="doc-back">Canvas Preview</a>
    <h1>Raw2D Docs</h1>
  `;

  for (const topic of topics) {
    const button = document.createElement("button");
    button.className = "doc-nav-button";
    button.type = "button";
    button.dataset.topicId = topic.id;
    button.textContent = topic.label;
    button.addEventListener("click", () => onSelect(topic));
    sidebar.append(button);
  }

  return sidebar;
}

function createTopicContent(topic: DocTopic): HTMLElement {
  const demo = createDemoForTopic(topic.id);
  const wrapper = document.createElement("div");
  const content = document.createElement("div");
  const header = document.createElement("header");

  wrapper.className = demo ? "doc-topic-layout" : "";
  content.className = "doc-topic-main";
  header.className = "doc-header";

  const title = document.createElement("h2");
  title.textContent = topic.title;

  const description = document.createElement("p");
  description.textContent = topic.description;

  header.append(title, description);
  content.append(header);

  for (const section of topic.sections) {
    content.append(createSection(section));
  }

  wrapper.append(content);

  if (demo) {
    wrapper.append(demo);
  }

  return wrapper;
}

function createDemoForTopic(topicId: string): HTMLElement | null {
  if (topicId === "rect") {
    return createDemoPanel(createRectDemo());
  }

  if (topicId === "circle") {
    return createDemoPanel(createCircleDemo());
  }

  if (topicId === "line") {
    return createDemoPanel(createLineDemo());
  }

  if (topicId === "text2d") {
    return createDemoPanel(createText2DDemo());
  }

  if (topicId === "sprite") {
    return createDemoPanel(createSpriteDemo());
  }

  if (topicId === "origin") {
    return createDemoPanel(createOriginDemo());
  }

  if (topicId === "bounds") {
    return createDemoPanel(createBoundsDemo());
  }

  return null;
}

function createDemoPanel(demo: HTMLElement): HTMLElement {
  const panel = document.createElement("aside");
  panel.className = "doc-demo-panel";
  panel.append(demo);
  return panel;
}

function createSection(section: DocSection): HTMLElement {
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

function getInitialTopic(): DocTopic {
  const id = window.location.hash.replace("#", "");
  return topics.find((topic) => topic.id === id) ?? topics[0];
}

function updateActiveNav(root: HTMLElement, topicId: string): void {
  const buttons = root.querySelectorAll<HTMLButtonElement>(".doc-nav-button");

  for (const button of buttons) {
    button.classList.toggle("is-active", button.dataset.topicId === topicId);
  }
}
