import type { StudioAppOptions } from "./StudioApp.type";
import { renderStudioLayout } from "./StudioLayout";

export class StudioApp {
  private readonly root: HTMLElement;

  public constructor(options: StudioAppOptions) {
    this.root = options.root;
  }

  public mount(): void {
    this.root.innerHTML = renderStudioLayout();
  }
}
