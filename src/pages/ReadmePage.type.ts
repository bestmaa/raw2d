export interface ReadmeDoc {
  readonly id: string;
  readonly label: string;
  readonly filename: string;
  readonly content: string;
}

export interface MarkdownRenderState {
  readonly root: HTMLElement;
  readonly paragraphLines: string[];
  readonly listItems: string[];
  codeLines: string[];
  codeLanguage: string;
  inCode: boolean;
}
