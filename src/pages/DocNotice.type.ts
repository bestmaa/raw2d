export type DocNoticeTone = "info" | "warning";

export interface DocNoticeOptions {
  readonly tone: DocNoticeTone;
  readonly title: string;
  readonly body: string;
}
