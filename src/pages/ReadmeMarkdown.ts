import type { MarkdownRenderState } from "./ReadmePage.type";

export function renderMarkdown(markdown: string): HTMLElement {
  const state: MarkdownRenderState = {
    root: document.createElement("article"),
    paragraphLines: [],
    listItems: [],
    codeLines: [],
    codeLanguage: "",
    inCode: false
  };

  state.root.className = "readme-markdown";

  for (const line of markdown.split("\n")) {
    appendLine(state, line);
  }

  flushCode(state);
  flushParagraph(state);
  flushList(state);
  return state.root;
}

function appendLine(state: MarkdownRenderState, line: string): void {
  if (line.startsWith("```")) {
    toggleCode(state, line);
    return;
  }

  if (state.inCode) {
    state.codeLines.push(line);
    return;
  }

  if (line.trim() === "") {
    flushParagraph(state);
    flushList(state);
    return;
  }

  if (line.startsWith("### ")) {
    appendHeading(state, line.slice(4), 3);
    return;
  }

  if (line.startsWith("## ")) {
    appendHeading(state, line.slice(3), 2);
    return;
  }

  if (line.startsWith("# ")) {
    appendHeading(state, line.slice(2), 1);
    return;
  }

  if (line.startsWith("- ")) {
    flushParagraph(state);
    state.listItems.push(line.slice(2));
    return;
  }

  state.paragraphLines.push(line);
}

function toggleCode(state: MarkdownRenderState, line: string): void {
  if (state.inCode) {
    flushCode(state);
    state.inCode = false;
    state.codeLanguage = "";
    return;
  }

  flushParagraph(state);
  flushList(state);
  state.inCode = true;
  state.codeLanguage = line.slice(3).trim();
  state.codeLines = [];
}

function appendHeading(state: MarkdownRenderState, text: string, level: 1 | 2 | 3): void {
  flushParagraph(state);
  flushList(state);
  const heading = document.createElement(`h${level}`);
  heading.textContent = text;
  state.root.append(heading);
}

function flushParagraph(state: MarkdownRenderState): void {
  if (state.paragraphLines.length === 0) {
    return;
  }

  const paragraph = document.createElement("p");
  appendInlineText(paragraph, state.paragraphLines.join(" "));
  state.root.append(paragraph);
  state.paragraphLines.length = 0;
}

function flushList(state: MarkdownRenderState): void {
  if (state.listItems.length === 0) {
    return;
  }

  const list = document.createElement("ul");

  for (const item of state.listItems) {
    const listItem = document.createElement("li");
    appendInlineText(listItem, item);
    list.append(listItem);
  }

  state.root.append(list);
  state.listItems.length = 0;
}

function flushCode(state: MarkdownRenderState): void {
  if (!state.inCode && state.codeLines.length === 0) {
    return;
  }

  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.textContent = state.codeLines.join("\n");

  if (state.codeLanguage) {
    code.dataset.language = state.codeLanguage;
  }

  pre.append(code);
  state.root.append(pre);
  state.codeLines = [];
}

function appendInlineText(parent: HTMLElement, text: string): void {
  const regex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match = regex.exec(text);

  while (match) {
    parent.append(document.createTextNode(text.slice(lastIndex, match.index)));
    parent.append(createInlineCode(match[1] ?? ""));
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }

  parent.append(document.createTextNode(text.slice(lastIndex)));
}

function createInlineCode(text: string): HTMLElement {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}
