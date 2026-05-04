import type { DocLanguage, DocTopic } from "./DocPage.type";
import { getDocUiText, translateTopic } from "./DocI18n";
import { docGroups, topics } from "./DocTopics";

export function createDocPager(topic: DocTopic, language: DocLanguage, onSelect: (topic: DocTopic) => void): HTMLElement {
  const footer = document.createElement("nav");
  const index = topics.findIndex((candidate) => candidate.id === topic.id);
  const previous = index > 0 ? topics[index - 1] : null;
  const next = index >= 0 && index < topics.length - 1 ? topics[index + 1] : null;

  footer.className = "doc-pager";
  footer.setAttribute("aria-label", "Topic navigation");

  if (index >= 0) {
    footer.append(createProgress(topic, index, topics.length, language));
  }

  if (previous) {
    footer.append(createPagerButton(previous, getDocUiText(language).previous, language, onSelect));
  }

  if (next) {
    footer.append(createPagerButton(next, getDocUiText(language).next, language, onSelect));
  }

  return footer;
}

function createProgress(topic: DocTopic, index: number, total: number, language: DocLanguage): HTMLElement {
  const progress = document.createElement("p");
  const groupProgress = getGroupProgress(topic, language);
  const globalProgress = language === "hi"
    ? `Topic ${index + 1} / ${total}`
    : `Topic ${index + 1} of ${total}`;

  progress.className = "doc-pager-progress";
  progress.textContent = groupProgress ? `${groupProgress} · ${globalProgress}` : globalProgress;
  return progress;
}

function createPagerButton(topic: DocTopic, eyebrow: string, language: DocLanguage, onSelect: (topic: DocTopic) => void): HTMLElement {
  const button = document.createElement("button");
  const small = document.createElement("span");
  const label = document.createElement("strong");

  button.type = "button";
  button.className = "doc-pager-button";
  button.dataset.topicId = topic.id;
  button.setAttribute("aria-label", `${eyebrow}: ${translateTopic(topic, language).label}`);
  small.textContent = eyebrow;
  label.textContent = translateTopic(topic, language).label;
  button.append(small, label);
  button.addEventListener("click", () => onSelect(topic));
  return button;
}

function getGroupProgress(topic: DocTopic, language: DocLanguage): string | null {
  for (const group of docGroups) {
    const index = group.topics.findIndex((candidate) => candidate.id === topic.id);

    if (index >= 0) {
      const label = language === "hi" ? group.hiLabel : group.label;
      return language === "hi"
        ? `${label} step ${index + 1} / ${group.topics.length}`
        : `${label} step ${index + 1} of ${group.topics.length}`;
    }
  }

  return null;
}
