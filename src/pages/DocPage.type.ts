export interface DocSection {
  readonly title: string;
  readonly body: string;
  readonly code?: string;
  readonly liveCode?: string;
  readonly liveDemoId?: string;
}

export interface DocTopic {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly sections: readonly DocSection[];
}
