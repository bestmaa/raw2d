import type { DocGroup, DocLanguage, DocTopic } from "./DocPage.type";

export interface DocSearchMatchOptions {
  readonly topic: DocTopic;
  readonly group: DocGroup;
  readonly language: DocLanguage;
  readonly searchTerm: string;
}

export interface DocSearchFindOptions {
  readonly groups: readonly DocGroup[];
  readonly language: DocLanguage;
  readonly searchTerm: string;
}
