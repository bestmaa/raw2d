import type { DocLanguage } from "./DocPage.type";
import { getDocUiText } from "./DocI18n";
import { getCopyFriendlyCode } from "./DocCopyCode";

export function createCodeBlock(code: string, language: DocLanguage): HTMLElement {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const toolbar = document.createElement("div");
  const pre = document.createElement("pre");
  const codeElement = document.createElement("code");

  details.className = "doc-code-toggle";
  toolbar.className = "doc-code-toolbar";
  summary.textContent = getDocUiText(language).code;
  codeElement.textContent = code;
  toolbar.append(createCopyButton(getCopyFriendlyCode(code), language, codeElement));
  pre.append(codeElement);
  details.append(summary, toolbar, pre);
  return details;
}

function createCopyButton(code: string, language: DocLanguage, codeElement: HTMLElement): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "doc-copy-code";
  button.textContent = language === "hi" ? "Copy" : "Copy";
  button.addEventListener("click", () => {
    void copyCodeToClipboard(code, button, codeElement, language);
  });
  return button;
}

async function copyCodeToClipboard(
  code: string,
  button: HTMLButtonElement,
  codeElement: HTMLElement,
  language: DocLanguage
): Promise<void> {
  if (copyWithTextArea(code)) {
    setButtonState(button, language === "hi" ? "Copied" : "Copied");
    return;
  }

  try {
    await window.navigator.clipboard.writeText(code);
    setButtonState(button, language === "hi" ? "Copied" : "Copied");
  } catch {
    selectCodeElement(codeElement);
    setButtonState(button, language === "hi" ? "Selected" : "Selected");
  }
}

function copyWithTextArea(code: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = code;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

function selectCodeElement(codeElement: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function setButtonState(button: HTMLButtonElement, label: string): void {
  const defaultLabel = "Copy";
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = defaultLabel;
  }, 1200);
}
