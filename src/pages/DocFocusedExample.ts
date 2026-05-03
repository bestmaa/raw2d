import { createCodeBlock } from "./DocCodeBlock";
import { getLiveExampleCode } from "./DocLiveExampleCode";
import type { DocFocusedExampleOptions } from "./DocFocusedExample.type";

export function createFocusedExample(options: DocFocusedExampleOptions): HTMLElement {
  const wrapper = document.createElement("div");
  const title = document.createElement("h3");
  const body = document.createElement("p");

  wrapper.className = "doc-focused-example";
  title.textContent = options.section.title;
  body.textContent = options.section.body;
  wrapper.append(title, body);

  if (hasExampleCode(options.sourceSection)) {
    wrapper.append(createExampleCodeToggle(options));
  }

  return wrapper;
}

function createExampleCodeToggle(options: DocFocusedExampleOptions): HTMLElement {
  const smallCode = options.sourceSection.code ?? options.sourceSection.body;
  const fullCode = getLiveExampleCode(options.sourceSection);

  if (smallCode.trim() === fullCode.trim()) {
    return createCodeBlock(fullCode, options.language);
  }

  const wrapper = document.createElement("div");
  const controls = document.createElement("div");
  const codeSlot = document.createElement("div");
  const smallButton = createToggleButton(getLabel(options.language, "small"), true);
  const fullButton = createToggleButton(getLabel(options.language, "full"), false);

  wrapper.className = "doc-example-switch";
  controls.className = "doc-example-switch-controls";
  controls.append(smallButton, fullButton);
  codeSlot.replaceChildren(createCodeBlock(smallCode, options.language));
  wrapper.append(controls, codeSlot);

  smallButton.addEventListener("click", () => {
    updateToggle(smallButton, fullButton, true);
    codeSlot.replaceChildren(createCodeBlock(smallCode, options.language));
  });
  fullButton.addEventListener("click", () => {
    updateToggle(smallButton, fullButton, false);
    codeSlot.replaceChildren(createCodeBlock(fullCode, options.language));
  });

  return wrapper;
}

function hasExampleCode(section: DocFocusedExampleOptions["sourceSection"]): boolean {
  return Boolean(section.liveDemoId || section.liveCode || section.code);
}

function createToggleButton(label: string, active: boolean): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "doc-example-switch-button";
  button.classList.toggle("is-active", active);
  button.textContent = label;
  return button;
}

function updateToggle(smallButton: HTMLButtonElement, fullButton: HTMLButtonElement, smallActive: boolean): void {
  smallButton.classList.toggle("is-active", smallActive);
  fullButton.classList.toggle("is-active", !smallActive);
}

function getLabel(language: DocFocusedExampleOptions["language"], mode: "small" | "full"): string {
  if (language === "hi") {
    return mode === "small" ? "Small code" : "Full example";
  }

  return mode === "small" ? "Small code" : "Full example";
}
