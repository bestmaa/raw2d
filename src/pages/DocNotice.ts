import type { DocNoticeOptions } from "./DocNotice.type";

export function createDocNotice(options: DocNoticeOptions): HTMLElement {
  const notice = document.createElement("aside");
  const title = document.createElement("strong");
  const body = document.createElement("p");

  notice.className = `doc-notice doc-notice-${options.tone}`;
  title.textContent = options.title;
  body.textContent = options.body;
  notice.append(title, body);
  return notice;
}
