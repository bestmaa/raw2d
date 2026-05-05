import { Canvas } from "raw2d";
import type { StudioAppOptions } from "./StudioApp.type";
import { getStudioCanvasWorldPoint, moveStudioObject, startStudioDrag } from "./StudioDrag";
import type { StudioDragSession } from "./StudioDrag.type";
import { createStudioInspectorModel } from "./StudioInspector";
import {
  addStudioCircleObject,
  addStudioLineObject,
  addStudioRectObject,
  addStudioSpriteObject,
  addStudioTextObject
} from "./StudioObjectFactory";
import { createRuntimeSceneFromStudioState } from "./StudioRenderAdapter";
import { drawStudioResizeHandles, resizeStudioObject, startStudioResize } from "./StudioResize";
import type { StudioResizeSession } from "./StudioResize.type";
import { renderStudioLayout } from "./StudioLayout";
import { getStudioRendererLabel } from "./StudioRenderer";
import type { StudioRendererMode } from "./StudioRenderer.type";
import { createStudioSampleSceneState, createStudioSceneState } from "./StudioSceneState";
import type { StudioSceneState } from "./StudioSceneState.type";

export class StudioApp {
  private readonly root: HTMLElement;
  private sceneState: StudioSceneState = createStudioSceneState();
  private rendererMode: StudioRendererMode = "canvas";
  private selectedObjectId: string | undefined;
  private dragSession: StudioDragSession | undefined;
  private resizeSession: StudioResizeSession | undefined;

  public constructor(options: StudioAppOptions) {
    this.root = options.root;
  }

  public mount(): void {
    this.render();
    this.bindRendererSwitch();
    this.bindActions();
    this.bindLayers();
    this.bindCanvasDrag();
    this.renderRuntimeScene();
  }

  private render(): void {
    const rendererLabel = getStudioRendererLabel(this.rendererMode);
    const inspector = createStudioInspectorModel(this.sceneState, rendererLabel, {
      selectedObjectId: this.selectedObjectId
    });

    this.root.innerHTML = renderStudioLayout({
      rendererLabel,
      sceneName: this.sceneState.name,
      objectCount: this.sceneState.objects.length,
      layers: inspector.layers,
      properties: inspector.properties,
      selectedLayerId: this.selectedObjectId
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
    const circleTool = this.root.querySelector<HTMLButtonElement>('[data-tool="circle"]');
    const lineTool = this.root.querySelector<HTMLButtonElement>('[data-tool="line"]');
    const textTool = this.root.querySelector<HTMLButtonElement>('[data-tool="text"]');
    const spriteTool = this.root.querySelector<HTMLButtonElement>('[data-tool="sprite"]');

    sampleButton?.addEventListener("click", () => {
      this.sceneState = createStudioSampleSceneState();
      this.rendererMode = this.sceneState.rendererMode;
      this.selectedObjectId = undefined;
      this.mount();
    });

    rectTool?.addEventListener("click", () => {
      this.sceneState = addStudioRectObject({ scene: this.sceneState });
      this.selectedObjectId = this.sceneState.objects.at(-1)?.id;
      this.mount();
    });

    circleTool?.addEventListener("click", () => {
      this.sceneState = addStudioCircleObject({ scene: this.sceneState });
      this.selectedObjectId = this.sceneState.objects.at(-1)?.id;
      this.mount();
    });

    lineTool?.addEventListener("click", () => {
      this.sceneState = addStudioLineObject({ scene: this.sceneState });
      this.selectedObjectId = this.sceneState.objects.at(-1)?.id;
      this.mount();
    });

    textTool?.addEventListener("click", () => {
      this.sceneState = addStudioTextObject({ scene: this.sceneState });
      this.selectedObjectId = this.sceneState.objects.at(-1)?.id;
      this.mount();
    });

    spriteTool?.addEventListener("click", () => {
      this.sceneState = addStudioSpriteObject({ scene: this.sceneState });
      this.selectedObjectId = this.sceneState.objects.at(-1)?.id;
      this.mount();
    });
  }

  private bindLayers(): void {
    const layerButtons = this.root.querySelectorAll<HTMLButtonElement>("[data-layer]");

    for (const button of layerButtons) {
      button.addEventListener("click", () => {
        const objectId = button.dataset.layer;

        if (objectId && this.sceneState.objects.some((object) => object.id === objectId)) {
          this.selectedObjectId = objectId;
          this.mount();
        }
      });
    }
  }

  private bindCanvasDrag(): void {
    const canvasElement = this.root.querySelector<HTMLCanvasElement>(".studio-canvas");

    if (!canvasElement) {
      return;
    }

    canvasElement.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }

      const pointer = getStudioCanvasWorldPoint(canvasElement, event, this.sceneState.camera);
      const resizeStart = startStudioResize(this.sceneState, this.selectedObjectId, pointer);

      if (resizeStart) {
        this.selectedObjectId = resizeStart.selectedObjectId;
        this.resizeSession = resizeStart.session;
        canvasElement.setPointerCapture(event.pointerId);
        event.preventDefault();
        return;
      }

      const dragStart = startStudioDrag(this.sceneState, this.selectedObjectId, pointer);

      if (!dragStart) {
        return;
      }

      this.selectedObjectId = dragStart.selectedObjectId;
      this.dragSession = dragStart.session;
      canvasElement.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    canvasElement.addEventListener("pointermove", (event) => {
      if (this.resizeSession) {
        const pointer = getStudioCanvasWorldPoint(canvasElement, event, this.sceneState.camera);
        this.sceneState = resizeStudioObject({ scene: this.sceneState, session: this.resizeSession, pointer });
        this.renderRuntimeScene();
        event.preventDefault();
        return;
      }

      if (!this.dragSession) {
        return;
      }

      const pointer = getStudioCanvasWorldPoint(canvasElement, event, this.sceneState.camera);
      this.sceneState = moveStudioObject({ scene: this.sceneState, session: this.dragSession, pointer });
      this.renderRuntimeScene();
      event.preventDefault();
    });

    const finishDrag = (event: PointerEvent): void => {
      if (!this.dragSession && !this.resizeSession) {
        return;
      }

      this.dragSession = undefined;
      this.resizeSession = undefined;
      if (canvasElement.hasPointerCapture(event.pointerId)) {
        canvasElement.releasePointerCapture(event.pointerId);
      }
      event.preventDefault();
      this.mount();
    };

    canvasElement.addEventListener("pointerup", finishDrag);
    canvasElement.addEventListener("pointercancel", finishDrag);
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
    drawStudioResizeHandles(renderer.getContext(), this.sceneState, this.selectedObjectId);
  }
}
