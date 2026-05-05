import { bindStudioAppActions } from "./StudioAppActions";
import type { StudioAppOptions } from "./StudioApp.type";
import { getStudioCanvasWorldPoint, moveStudioObject, startStudioDrag } from "./StudioDrag";
import type { StudioDragSession } from "./StudioDrag.type";
import { createStudioInspectorModel } from "./StudioInspector";
import { applyStudioKeyboardCommand } from "./StudioKeyboard";
import { bindStudioLayerButtons } from "./StudioLayerBindings";
import { bindStudioPropertyInputs } from "./StudioPropertyBindings";
import { bindStudioRendererSwitch } from "./StudioRendererBindings";
import { resizeStudioObject, startStudioResize } from "./StudioResize";
import type { StudioResizeSession } from "./StudioResize.type";
import { renderStudioRuntimeScene } from "./StudioRuntimeRender";
import { renderStudioLayout, renderStudioStatsPanel } from "./StudioLayout";
import { getStudioRendererLabel } from "./StudioRenderer";
import type { StudioRendererMode } from "./StudioRenderer.type";
import { createStudioSceneState } from "./StudioSceneState";
import type { StudioSceneState } from "./StudioSceneState.type";
import { createEmptyStudioStats } from "./StudioStats";
import type { StudioStatsPanelModel } from "./StudioStats.type";

export class StudioApp {
  private readonly root: HTMLElement;
  private sceneState: StudioSceneState = createStudioSceneState();
  private rendererMode: StudioRendererMode = "canvas";
  private selectedObjectId: string | undefined;
  private dragSession: StudioDragSession | undefined;
  private resizeSession: StudioResizeSession | undefined;
  private rendererStats: StudioStatsPanelModel = createEmptyStudioStats("canvas");

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
      selectedLayerId: this.selectedObjectId,
      stats: this.rendererStats
    });
  }

  private bindRendererSwitch(): void {
    bindStudioRendererSwitch({
      root: this.root,
      onRendererMode: (mode) => {
        this.rendererMode = mode;
        this.rendererStats = createEmptyStudioStats(mode);
        this.mount();
      }
    });
  }

  private bindActions(): void {
    bindStudioAppActions({
      root: this.root,
      getScene: () => this.sceneState,
      setScene: (scene) => { this.sceneState = scene; },
      setRendererMode: (mode) => { this.rendererMode = mode; },
      setSelectedObjectId: (selectedObjectId) => { this.selectedObjectId = selectedObjectId; },
      mount: () => { this.mount(); }
    });
  }

  private bindLayers(): void {
    bindStudioLayerButtons({
      root: this.root,
      getScene: () => this.sceneState,
      getSelectedObjectId: () => this.selectedObjectId,
      setScene: (scene) => { this.sceneState = scene; },
      setSelectedObjectId: (selectedObjectId) => { this.selectedObjectId = selectedObjectId; },
      mount: () => { this.mount(); }
    });
  }

  private bindProperties(): void {
    bindStudioPropertyInputs({
      root: this.root,
      getScene: () => this.sceneState,
      getSelectedObjectId: () => this.selectedObjectId,
      setScene: (scene) => { this.sceneState = scene; },
      renderRuntimeScene: () => { this.renderRuntimeScene(); }
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
    const result = renderStudioRuntimeScene({
      canvasElement,
      sceneState: this.sceneState,
      selectedObjectId: this.selectedObjectId,
      rendererMode: this.rendererMode
    });

    this.rendererStats = result.stats;
    this.renderStatsPanel();
  }

  private renderStatsPanel(): void {
    const statsElement = this.root.querySelector<HTMLElement>(".studio-stats");

    if (statsElement) {
      statsElement.outerHTML = renderStudioStatsPanel(this.rendererStats);
    }
  }
}
