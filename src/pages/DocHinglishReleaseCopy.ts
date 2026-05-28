import type { DocTopic } from "./DocPage.type";

interface TopicCopy { readonly label: string; readonly title: string; readonly description: string; }

const releaseTopicIds = new Set([
  "v1-release-checklist",
  "npm-publish-checklist",
  "api-freeze-checklist",
  "docs-deploy-checklist",
  "cdn-verification-checklist"
]);

export const releaseTopicCopy: Readonly<Record<string, TopicCopy>> = {
  "v1-release-checklist": { label: "v1 Release Checklist", title: "v1 Release Checklist", description: "Stable v1 mark karne se pehle API, renderer, docs, package aur publish gates." },
  "npm-publish-checklist": { label: "npm Publish Checklist", title: "npm Publish Checklist", description: "GitHub workflow se publish karne se pehle aur baad ke npm/CDN checks." },
  "api-freeze-checklist": { label: "API Freeze Checklist", title: "API Freeze Checklist", description: "v1 ke liye package exports, constructor options, renderer lifecycle aur aliases freeze karna." },
  "docs-deploy-checklist": { label: "Docs Deploy Checklist", title: "Docs Deploy Checklist", description: "Cloudflare docs deploy ke baad routes, redirects aur assets verify karna." },
  "cdn-verification-checklist": { label: "CDN Verification Checklist", title: "CDN Verification Checklist", description: "npm publish ke baad umbrella aur focused package CDN URLs verify karna." }
};

export function createHinglishReleaseBody(topic: DocTopic, sectionTitle: string): string | undefined {
  if (!releaseTopicIds.has(topic.id)) {
    return undefined;
  }

  const topicName = releaseTopicCopy[topic.id]?.label ?? topic.label;
  return `${topicName}: "${sectionTitle}" release gate ko command output, browser check, aur package version parity ke saath verify karein.`;
}
