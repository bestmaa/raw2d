import { Canvas } from "raw2d";
import type { StudioAppOptions } from "./StudioApp.type";
import { createStudioInspectorModel } from "./StudioInspector";
import { addStudioRectObject } from "./StudioObjectFactory";
import { createRuntimeSceneFromStudioState } from "./StudioRenderAdapter";
import { renderStudioLayout } from "./StudioLayout";
import { getStudioRendererLabel } from "./StudioRenderer";
import type { StudioRendererMode } from "./StudioRenderer.type";
import { createStudioSampleSceneState, createStudioSceneState } from "./StudioSceneState";
import type { StudioSceneState } from "./StudioSceneState.type";

export class StudioApp {
  private readonly root: HTMLElement;
  private sceneState: StudioSceneState = createStudioSceneState();
  private rendererMode: StudioRendererMode = "canvas";

  public constructor(options: StudioAppOptions) {
    this.root = options.root;
  }

  public mount(): void {
    this.render();
    this.bindRendererSwitch();
    this.bindActions();
    this.renderRuntimeScene();
  }

  private render(): void {
    const rendererLabel = getStudioRendererLabel(this.rendererMode);
    const inspector = createStudioInspectorModel(this.sceneState, rendererLabel);

    this.root.innerHTML = renderStudioLayout({
      rendererLabel,
      sceneName: this.sceneState.name,
      objectCount: this.sceneState.objects.length,
      layers: inspector.layers,
      properties: inspector.properties
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

  private bindActions(): void {
    const sampleButton = this.root.querySelector<HTMLButtonElement>('[data-action="sample-scene"]');
    const rectTool = this.root.querySelector<HTMLButtonElement>('[data-tool="rect"]');

    sampleButton?.addEventListener("click", () => {
      this.sceneState = createStudioSampleSceneState();
      this.rendererMode = this.sceneState.rendererMode;
      this.mount();
    });

    rectTool?.addEventListener("click", () => {
      this.sceneState = addStudioRectObject({ scene: this.sceneState });
      this.mount();
    });
  }

  private renderRuntimeScene(): void {
    const canvasElement = this.root.querySelector<HTMLCanvasElement>(".studio-canvas");

    if (!canvasElement) {
      return;
    }

    const runtime = createRuntimeSceneFromStudioState(this.sceneState);
    const renderer = new Canvas({
      canvas: canvasElement,
      width: 800,
      height: 600,
      backgroundColor: "#0a121c"
    });

    renderer.render(runtime.scene, runtime.camera);
  }
}
