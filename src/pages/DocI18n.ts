import type { DocLanguage, DocTopic } from "./DocPage.type";
import { createHinglishTopic } from "./DocHinglish";

interface DocUiText {
  readonly searchPlaceholder: string;
  readonly searchButton: string;
  readonly noResults: string;
  readonly code: string;
  readonly example: string;
  readonly previous: string;
  readonly next: string;
  readonly language: string;
}

const uiText: Record<DocLanguage, DocUiText> = {
  en: {
    searchPlaceholder: "Search docs",
    searchButton: "Search",
    noResults: "No docs found.",
    code: "Code",
    example: "Example",
    previous: "Previous",
    next: "Next",
    language: "Language"
  },
  hi: {
    searchPlaceholder: "Docs me search karein",
    searchButton: "Search",
    noResults: "Koi matching doc nahi mila.",
    code: "Code dekhein",
    example: "Live example",
    previous: "Pichla",
    next: "Agla",
    language: "Bhasha"
  }
};

export function getDocUiText(language: DocLanguage): DocUiText {
  return uiText[language];
}

export function translateTopic(topic: DocTopic, language: DocLanguage): DocTopic {
  return language === "en" ? topic : createHinglishTopic(topic);
}
