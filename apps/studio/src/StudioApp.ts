import type { StudioAppOptions } from "./StudioApp.type";
import { renderStudioLayout } from "./StudioLayout";
import { getStudioRendererLabel } from "./StudioRenderer";
import type { StudioRendererMode } from "./StudioRenderer.type";

export class StudioApp {
  private readonly root: HTMLElement;
  private rendererMode: StudioRendererMode = "canvas";

  public constructor(options: StudioAppOptions) {
    this.root = options.root;
  }

  public mount(): void {
    this.render();
    this.bindRendererSwitch();
  }

  private render(): void {
    this.root.innerHTML = renderStudioLayout({
      rendererLabel: getStudioRendererLabel(this.rendererMode)
    });
  }

  private bindRendererSwitch(): void {
    const buttons = this.root.querySelectorAll<HTMLButtonElement>("[data-renderer]");

    for (const button of buttons) {
      button.addEventListener("click", () => {
        this.rendererMode = button.dataset.renderer === "webgl" ? "webgl" : "canvas";
        this.mount();
      });
    }
  }
}
