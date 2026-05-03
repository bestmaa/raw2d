import { translateTopic } from "./DocI18n";
import type { DocSearchFindOptions, DocSearchMatchOptions } from "./DocSearch.type";

interface SearchEntry {
  readonly value: string;
  readonly weight: number;
}

export function matchesDocSearch(options: DocSearchMatchOptions): boolean {
  return getDocSearchScore(options) > 0;
}

export function findFirstDocSearchMatch(options: DocSearchFindOptions): DocSearchMatchOptions["topic"] | null {
  const searchTerm = options.searchTerm.trim();

  if (!searchTerm) {
    return null;
  }

  let bestTopic: DocSearchMatchOptions["topic"] | null = null;
  let bestScore = 0;

  for (const group of options.groups) {
    for (const topic of group.topics) {
      const score = getDocSearchScore({ topic, group, language: options.language, searchTerm });

      if (score > bestScore) {
        bestTopic = topic;
        bestScore = score;
      }
    }
  }

  return bestTopic;
}

function getDocSearchScore(options: DocSearchMatchOptions): number {
  const tokens = tokenizeSearch(options.searchTerm);

  if (tokens.length === 0) {
    return 1;
  }

  const entries = createSearchEntries(options);
  let score = 0;

  for (const token of tokens) {
    const tokenScore = Math.max(...entries.map((entry) => scoreToken(entry, token)));

    if (tokenScore === 0) {
      return 0;
    }

    score += tokenScore;
  }

  return score;
}

function createSearchEntries(options: DocSearchMatchOptions): readonly SearchEntry[] {
  const translatedTopic = translateTopic(options.topic, options.language);
  return [
    createEntry(options.group.id, 2),
    createEntry(options.group.label, 2),
    createEntry(options.group.hiLabel, 2),
    createEntry(options.topic.id, 5),
    createEntry(translatedTopic.label, 6),
    createEntry(translatedTopic.title, 6),
    createEntry(translatedTopic.description, 3),
    ...translatedTopic.sections.flatMap((section) => [
      createEntry(section.title, 4),
      createEntry(section.body, 2),
      createEntry(section.code ?? "", 1),
      createEntry(section.liveCode ?? "", 1)
    ])
  ];
}

function createEntry(value: string, weight: number): SearchEntry {
  return { value: normalizeSearchText(value), weight };
}

function tokenizeSearch(value: string): readonly string[] {
  const tokens = normalizeSearchText(value).split(" ").filter(Boolean);
  return [...new Set(tokens)];
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9#]+/g, " ")
    .trim();
}

function scoreToken(entry: SearchEntry, token: string): number {
  const words = entry.value.split(" ");

  if (words.includes(token)) {
    return entry.weight * 3;
  }

  if (token.length >= 2 && words.some((word) => word.startsWith(token))) {
    return entry.weight * 2;
  }

  if (token.length >= 2 && getAcronym(words).startsWith(token)) {
    return entry.weight * 2;
  }

  if (token.length >= 3 && entry.value.includes(token)) {
    return entry.weight;
  }

  return token.length >= 4 && words.some((word) => isNearWordMatch(token, word)) ? 1 : 0;
}

function getAcronym(words: readonly string[]): string {
  return words.map((word) => word[0] ?? "").join("");
}

function isNearWordMatch(token: string, word: string): boolean {
  if (word.length < 3) {
    return false;
  }

  const prefix = word.slice(0, token.length);
  return getEditDistance(token, word) <= 1 || getEditDistance(token, prefix) <= 1;
}

function getEditDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_value, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex] ?? 0;
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      previous[rightIndex] = Math.min(
        (previous[rightIndex] ?? 0) + 1,
        (previous[rightIndex - 1] ?? 0) + 1,
        diagonal + cost
      );
      diagonal = above;
    }
  }

  return previous[right.length] ?? 0;
}
