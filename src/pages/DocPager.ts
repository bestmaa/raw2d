import type { DocLanguage, DocTopic } from "./DocPage.type";
import { getDocUiText, translateTopic } from "./DocI18n";
import { topics } from "./DocTopics";

export function createDocPager(topic: DocTopic, language: DocLanguage, onSelect: (topic: DocTopic) => void): HTMLElement {
  const footer = document.createElement("nav");
  const index = topics.findIndex((candidate) => candidate.id === topic.id);
  const previous = index > 0 ? topics[index - 1] : null;
  const next = index >= 0 && index < topics.length - 1 ? topics[index + 1] : null;

  footer.className = "doc-pager";

  if (previous) {
    footer.append(createPagerButton(previous, getDocUiText(language).previous, language, onSelect));
  }

  if (next) {
    footer.append(createPagerButton(next, getDocUiText(language).next, language, onSelect));
  }

  return footer;
}

function createPagerButton(topic: DocTopic, eyebrow: string, language: DocLanguage, onSelect: (topic: DocTopic) => void): HTMLElement {
  const button = document.createElement("button");
  const small = document.createElement("span");
  const label = document.createElement("strong");

  button.type = "button";
  button.className = "doc-pager-button";
  small.textContent = eyebrow;
  label.textContent = translateTopic(topic, language).label;
  button.append(small, label);
  button.addEventListener("click", () => onSelect(topic));
  return button;
}
