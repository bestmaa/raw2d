import { Canvas } from "raw2d";
import { bindStudioActions, createStudioActionObject } from "./StudioActions";
import type { StudioAction } from "./StudioActions.type";
import type { StudioAppOptions } from "./StudioApp.type";
import { getStudioCanvasWorldPoint, moveStudioObject, startStudioDrag } from "./StudioDrag";
import type { StudioDragSession } from "./StudioDrag.type";
import { createStudioInspectorModel } from "./StudioInspector";
import { applyStudioKeyboardCommand } from "./StudioKeyboard";
import { applyStudioLayerAction } from "./StudioLayers";
import type { StudioLayerAction } from "./StudioLayers.type";
import { bindStudioPropertyInputs } from "./StudioPropertyBindings";
import { createRuntimeSceneFromStudioState } from "./StudioRenderAdapter";
import { bindStudioRendererSwitch } from "./StudioRendererBindings";
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
    document.addEventListener("keydown", (event) => {
      this.handleKeyDown(event);
    });
  }

  public mount(): void {
    this.render();
    this.bindRendererSwitch();
    this.bindActions();
    this.bindLayers();
    this.bindProperties();
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
      propertyFields: inspector.propertyFields,
      selectedLayerId: this.selectedObjectId
    });
  }

  private bindRendererSwitch(): void {
    bindStudioRendererSwitch({
      root: this.root,
      onRendererMode: (mode) => {
        this.rendererMode = mode;
        this.mount();
      }
    });
  }

  private bindActions(): void {
    bindStudioActions({
      root: this.root,
      onAction: (action) => {
        this.handleAction(action);
      }
    });
  }

  private handleAction(action: StudioAction): void {
    if (action === "sample-scene") {
      this.sceneState = createStudioSampleSceneState();
      this.rendererMode = this.sceneState.rendererMode;
      this.selectedObjectId = undefined;
      this.mount();
      return;
    }

    this.sceneState = createStudioActionObject(this.sceneState, action);
    this.selectedObjectId = this.sceneState.objects.at(-1)?.id;
    this.mount();
  }

  private bindLayers(): void {
    const layerButtons = this.root.querySelectorAll<HTMLButtonElement>("[data-layer-action]");

    for (const button of layerButtons) {
      button.addEventListener("click", () => {
        const action = button.dataset.layerAction as StudioLayerAction | undefined;
        const objectId = button.dataset.layerId;

        if (!objectId || !action) return;
        const result = applyStudioLayerAction({ scene: this.sceneState, selectedObjectId: this.selectedObjectId, objectId, action });
        if (!result.handled) return;
        this.sceneState = result.scene;
        this.selectedObjectId = result.selectedObjectId;
        this.mount();
      });
    }
  }

  private bindProperties(): void {
    bindStudioPropertyInputs({
      root: this.root,
      getScene: () => this.sceneState,
      getSelectedObjectId: () => this.selectedObjectId,
      setScene: (scene) => {
        this.sceneState = scene;
      },
      renderRuntimeScene: () => {
        this.renderRuntimeScene();
      }
    });
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
      canvasElement.focus();
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

  private handleKeyDown(event: KeyboardEvent): void {
    const result = applyStudioKeyboardCommand({
      scene: this.sceneState,
      selectedObjectId: this.selectedObjectId,
      command: { key: event.key, shiftKey: event.shiftKey }
    });

    if (!result.handled) {
      return;
    }

    this.sceneState = result.scene;
    this.selectedObjectId = result.selectedObjectId;
    event.preventDefault();
    this.mount();
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
    canvasElement.style.width = "100%";
    canvasElement.style.height = "100%";
    drawStudioResizeHandles(renderer.getContext(), this.sceneState, this.selectedObjectId);
  }
}
