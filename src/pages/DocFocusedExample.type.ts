import type { DocLanguage, DocSection } from "./DocPage.type";

export interface DocFocusedExampleOptions {
  readonly section: DocSection;
  readonly sourceSection: DocSection;
  readonly language: DocLanguage;
}
