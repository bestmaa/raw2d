import { bindStudioAppActions } from "./StudioAppActions";
import { createStudioActionObject } from "./StudioActions";
import type { StudioAppOptions } from "./StudioApp.type";
import type { StudioCommand, StudioCommandApplyOptions } from "./StudioCommand.type";
import { bindStudioCanvasDrag } from "./StudioCanvasBindings";
import { createStudioCreateObjectCommand, createStudioDeleteObjectCommand, createStudioTransformCommand, findStudioObject } from "./StudioCommandFactory";
import { createStudioInspectorModel } from "./StudioInspector";
import { applyStudioKeyboardCommand, getStudioHistoryKeyboardAction } from "./StudioKeyboard";
import { applyStudioHistoryCommand, createStudioHistory, redoStudioHistory, undoStudioHistory } from "./StudioHistory";
import type { StudioHistoryState } from "./StudioHistory.type";
import { bindStudioLayerButtons } from "./StudioLayerBindings";
import { bindStudioPropertyInputs } from "./StudioPropertyBindings";
import { bindStudioRendererSwitch } from "./StudioRendererBindings";
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
  private history: StudioHistoryState = createStudioHistory();
  private rendererStats: StudioStatsPanelModel = createEmptyStudioStats("canvas");
  private statusMessage = "Ready";

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
      statusMessage: this.statusMessage,
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
      setStatusMessage: (message) => { this.statusMessage = message; },
      resetHistory: () => { this.history = createStudioHistory(); },
      onUndo: () => { this.applyHistoryAction("undo"); },
      onRedo: () => { this.applyHistoryAction("redo"); },
      onCreateObject: (action) => { this.handleCreateObject(action); },
      mount: () => { this.mount(); }
    });
  }

  private bindLayers(): void {
    bindStudioLayerButtons({
      root: this.root,
      getScene: () => this.sceneState,
      getSelectedObjectId: () => this.selectedObjectId,
      setScene: (scene) => { this.sceneState = scene; },
      applyCommand: (command, commandOptions) => { this.applyCommand(command, commandOptions); },
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
      applyCommand: (command, commandOptions) => { this.applyCommand(command, commandOptions); },
      renderRuntimeScene: () => { this.renderRuntimeScene(); }
    });
  }

  private bindCanvasDrag(): void {
    bindStudioCanvasDrag({
      root: this.root,
      getScene: () => this.sceneState,
      getSelectedObjectId: () => this.selectedObjectId,
      setScene: (scene) => { this.sceneState = scene; },
      setSelectedObjectId: (selectedObjectId) => { this.selectedObjectId = selectedObjectId; },
      applyCommand: (command, commandOptions) => { this.applyCommand(command, commandOptions); },
      renderRuntimeScene: () => { this.renderRuntimeScene(); },
      mount: () => { this.mount(); }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const historyAction = getStudioHistoryKeyboardAction({
      key: event.key,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey
    });

    if (historyAction) {
      this.applyHistoryAction(historyAction);
      event.preventDefault();
      return;
    }

    const result = applyStudioKeyboardCommand({
      scene: this.sceneState,
      selectedObjectId: this.selectedObjectId,
      command: { key: event.key, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, metaKey: event.metaKey }
    });

    if (!result.handled) {
      return;
    }

    const command = this.createKeyboardCommand(result.scene, event.key);

    if (command) {
      this.applyCommand(command, { selectedObjectId: result.selectedObjectId, statusMessage: "Keyboard edit" });
    } else {
      this.sceneState = result.scene;
      this.selectedObjectId = result.selectedObjectId;
      this.mount();
    }
    event.preventDefault();
  }

  private handleCreateObject(action: Parameters<typeof createStudioActionObject>[1]): void {
    const beforeCount = this.sceneState.objects.length;
    const scene = createStudioActionObject(this.sceneState, action);
    const object = scene.objects.at(-1);

    if (!object || scene === this.sceneState) {
      return;
    }

    this.applyCommand(createStudioCreateObjectCommand(object, beforeCount), {
      selectedObjectId: object.id,
      statusMessage: "Scene updated"
    });
  }

  private applyCommand(command: StudioCommand, options: StudioCommandApplyOptions = {}): void {
    const result = applyStudioHistoryCommand({ scene: this.sceneState, history: this.history, command });

    if (!result.handled) {
      return;
    }

    this.sceneState = result.scene;
    this.history = result.history;
    this.selectedObjectId = options.selectedObjectId ?? this.selectedObjectId;
    this.statusMessage = options.statusMessage ?? "Scene updated";
    if (options.renderRuntimeOnly) {
      this.renderRuntimeScene();
      return;
    }
    this.mount();
  }

  private createKeyboardCommand(scene: StudioSceneState, key: string): StudioCommand | undefined {
    if (key === "Delete" || key === "Backspace") {
      return createStudioDeleteObjectCommand(this.sceneState, this.selectedObjectId);
    }

    const before = findStudioObject(this.sceneState, this.selectedObjectId);
    const after = findStudioObject(scene, this.selectedObjectId);
    return before && after ? createStudioTransformCommand(before, after) : undefined;
  }

  private applyHistoryAction(action: "undo" | "redo"): void {
    const result = action === "undo" ? undoStudioHistory({ scene: this.sceneState, history: this.history }) : redoStudioHistory({ scene: this.sceneState, history: this.history });

    if (!result.handled) {
      this.statusMessage = action === "undo" ? "Nothing to undo" : "Nothing to redo";
      this.mount();
      return;
    }

    this.sceneState = result.scene;
    this.history = result.history;
    if (this.selectedObjectId && !this.sceneState.objects.some((object) => object.id === this.selectedObjectId)) {
      this.selectedObjectId = undefined;
    }
    this.statusMessage = action === "undo" ? "Undid edit" : "Redid edit";
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
    if (statsElement) statsElement.outerHTML = renderStudioStatsPanel(this.rendererStats);
  }
}
