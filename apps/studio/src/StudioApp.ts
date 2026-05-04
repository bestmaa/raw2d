import type { StudioAppOptions } from "./StudioApp.type";
import { renderStudioLayout } from "./StudioLayout";
import { getStudioRendererLabel } from "./StudioRenderer";
import type { StudioRendererMode } from "./StudioRenderer.type";
import { createStudioSceneState } from "./StudioSceneState";
import type { StudioSceneState } from "./StudioSceneState.type";

export class StudioApp {
  private readonly root: HTMLElement;
  private readonly sceneState: StudioSceneState = createStudioSceneState();
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
      rendererLabel: getStudioRendererLabel(this.rendererMode),
      sceneName: this.sceneState.name,
      objectCount: this.sceneState.objects.length
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
