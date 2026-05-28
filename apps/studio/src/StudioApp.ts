import { bindStudioAppActions } from "./StudioAppActions";
import { bindStudioAssetPanel } from "./StudioAssetBindings";
import { createStudioAssetPanelModel } from "./StudioAssetPanel";
import { createStudioActionObject } from "./StudioActions";
import type { StudioAppOptions } from "./StudioApp.type";
import { serializeStudioClipboard } from "./StudioClipboard";
import { createStudioPasteCommand } from "./StudioClipboardCommands";
import type { StudioCommand, StudioCommandApplyOptions } from "./StudioCommand.type";
import { bindStudioCanvasDrag } from "./StudioCanvasBindings";
import { createStudioArrangementCommand } from "./StudioArrangementCommands";
import { createStudioCreateObjectCommand } from "./StudioCommandFactory";
import { createStudioInspectorModel } from "./StudioInspector";
import { createStudioGroupCommand, createStudioUngroupCommand } from "./StudioGroupingCommands";
import { createStudioKeyboardCommand } from "./StudioKeyboardCommandFactory";
import { applyStudioKeyboardCommand, getStudioHistoryKeyboardAction } from "./StudioKeyboard";
import { applyStudioHistoryCommand, createStudioHistory, redoStudioHistory, undoStudioHistory } from "./StudioHistory";
import type { StudioHistoryState } from "./StudioHistory.type";
import { bindStudioLayerButtons } from "./StudioLayerBindings";
import { bindStudioPropertyInputs } from "./StudioPropertyBindings";
import { bindStudioRendererSwitch } from "./StudioRendererBindings";
import { renderStudioRuntimeScene } from "./StudioRuntimeRender";
import { renderStudioLayout, renderStudioStatsPanel } from "./StudioLayout";
import { createStudioMinimapModel, fitStudioCameraToScene, zoomStudioCameraToSelection } from "./StudioNavigation";
import { getStudioRendererLabel } from "./StudioRenderer";
import type { StudioRendererMode } from "./StudioRenderer.type";
import { createStudioSceneState } from "./StudioSceneState";
import type { StudioSceneState } from "./StudioSceneState.type";
import { getPrimaryStudioSelectionId, normalizeStudioSelection } from "./StudioSelection";
import { createEmptyStudioStats } from "./StudioStats";
import type { StudioStatsPanelModel } from "./StudioStats.type";

export class StudioApp {
  private readonly root: HTMLElement;
  private sceneState: StudioSceneState = createStudioSceneState();
  private rendererMode: StudioRendererMode = "canvas";
  private selectedObjectId: string | undefined;
  private selectedObjectIds: readonly string[] = [];
  private selectedAssetId: string | undefined;
  private history: StudioHistoryState = createStudioHistory();
  private rendererStats: StudioStatsPanelModel = createEmptyStudioStats("canvas");
  private statusMessage = "Ready";
  public constructor(options: StudioAppOptions) { this.root = options.root; document.addEventListener("keydown", (event) => { this.handleKeyDown(event); }); }
  public mount(): void {
    this.render(); this.bindRendererSwitch(); this.bindActions(); this.bindAssets(); this.bindLayers(); this.bindProperties(); this.bindCanvasDrag(); this.renderRuntimeScene();
  }
  private render(): void {
    const rendererLabel = getStudioRendererLabel(this.rendererMode);
    this.syncSelection();
    const inspector = createStudioInspectorModel(this.sceneState, rendererLabel, {
      selectedObjectId: this.selectedObjectId,
      selectedObjectIds: this.selectedObjectIds
    });

    this.root.innerHTML = renderStudioLayout({
      rendererLabel, sceneName: this.sceneState.name, statusMessage: this.statusMessage, objectCount: this.sceneState.objects.length,
      layers: inspector.layers, properties: inspector.properties, propertyFields: inspector.propertyFields, selectedLayerId: this.selectedObjectId, selectedLayerIds: this.selectedObjectIds,
      assets: createStudioAssetPanelModel(this.sceneState, this.selectedAssetId, this.selectedObjectId),
      minimap: createStudioMinimapModel({ scene: this.sceneState, selectedObjectIds: this.selectedObjectIds }),
      stats: this.rendererStats
    });
  }
  private bindRendererSwitch(): void {
    bindStudioRendererSwitch({ root: this.root, onRendererMode: (mode) => { this.rendererMode = mode; this.rendererStats = createEmptyStudioStats(mode); this.mount(); } });
  }
  private bindActions(): void {
    bindStudioAppActions({ root: this.root, getScene: () => this.sceneState, setScene: (scene) => { this.sceneState = scene; }, setRendererMode: (mode) => { this.rendererMode = mode; }, setSelectedObjectId: (id) => { this.setSelectedObjectId(id); }, setSelectedAssetId: (id) => { this.selectedAssetId = id; }, setStatusMessage: (message) => { this.statusMessage = message; }, resetHistory: () => { this.history = createStudioHistory(); }, onUndo: () => { this.applyHistoryAction("undo"); }, onRedo: () => { this.applyHistoryAction("redo"); }, onGroup: () => { this.handleGroupObjects(); }, onUngroup: () => { this.handleUngroupObject(); }, onArrange: (action) => { this.handleArrangement(action); }, onNavigate: (action) => { this.handleNavigation(action); }, onCopySelection: () => { void this.copySelection(); }, onPasteSelection: () => { void this.pasteSelection(); }, onCreateObject: (action) => { this.handleCreateObject(action); }, mount: () => { this.mount(); } });
  }

  private bindAssets(): void {
    bindStudioAssetPanel({ root: this.root, getScene: () => this.sceneState, setScene: (scene) => { this.sceneState = scene; }, getSelectedAssetId: () => this.selectedAssetId, getSelectedObjectId: () => this.selectedObjectId, setSelectedAssetId: (id) => { this.selectedAssetId = id; }, applyCommand: (command, options) => { this.applyCommand(command, options); }, setStatusMessage: (message) => { this.statusMessage = message; }, mount: () => { this.mount(); } });
  }

  private bindLayers(): void {
    bindStudioLayerButtons({
      root: this.root, getScene: () => this.sceneState, getSelectedObjectId: () => this.selectedObjectId, getSelectedObjectIds: () => this.selectedObjectIds,
      setScene: (scene) => { this.sceneState = scene; }, applyCommand: (command, commandOptions) => { this.applyCommand(command, commandOptions); },
      setSelectedObjectId: (selectedObjectId) => { this.setSelectedObjectId(selectedObjectId); }, setSelectedObjectIds: (selectedObjectIds) => { this.setSelectedObjectIds(selectedObjectIds); },
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
      root: this.root, getScene: () => this.sceneState, getSelectedObjectId: () => this.selectedObjectId, getSelectedObjectIds: () => this.selectedObjectIds,
      setScene: (scene) => { this.sceneState = scene; }, setSelectedObjectId: (selectedObjectId) => { this.setSelectedObjectId(selectedObjectId); },
      setSelectedObjectIds: (selectedObjectIds) => { this.setSelectedObjectIds(selectedObjectIds); }, applyCommand: (command, commandOptions) => { this.applyCommand(command, commandOptions); },
      renderRuntimeScene: () => { this.renderRuntimeScene(); },
      mount: () => { this.mount(); }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.handleClipboardShortcut(event)) return;
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
      selectedObjectIds: this.selectedObjectIds,
      command: { key: event.key, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey, metaKey: event.metaKey }
    });

    if (!result.handled) {
      return;
    }
    const command = createStudioKeyboardCommand({
      beforeScene: this.sceneState,
      afterScene: result.scene,
      key: event.key,
      selectedObjectId: this.selectedObjectId,
      selectedObjectIds: this.selectedObjectIds
    });

    if (command) {
      this.applyCommand(command, { selectedObjectId: result.selectedObjectId, selectedObjectIds: result.selectedObjectIds, statusMessage: "Keyboard edit" });
    } else {
      this.sceneState = result.scene;
      this.setSelectedObjectIds(result.selectedObjectIds ?? (result.selectedObjectId ? [result.selectedObjectId] : []));
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
      selectedObjectIds: [object.id],
      statusMessage: "Scene updated"
    });
  }
  private handleGroupObjects(): void {
    const result = createStudioGroupCommand(this.sceneState, this.selectedObjectIds);
    if (!result) { this.statusMessage = "Select at least two root objects to group"; this.mount(); return; }
    this.applyCommand(result.command, result.options);
  }
  private handleUngroupObject(): void {
    const result = createStudioUngroupCommand(this.sceneState, this.selectedObjectId);
    if (!result) { this.statusMessage = "Select a group to ungroup"; this.mount(); return; }
    this.applyCommand(result.command, result.options);
  }
  private handleArrangement(action: Parameters<typeof createStudioArrangementCommand>[2]): void {
    const result = createStudioArrangementCommand(this.sceneState, this.selectedObjectIds, action);
    if (result) this.applyCommand(result.command, result.options);
    else { this.statusMessage = "Select more objects to arrange"; this.mount(); }
  }
  private handleNavigation(action: "zoom-selection" | "fit-scene"): void {
    const scene = action === "zoom-selection" ? zoomStudioCameraToSelection({ scene: this.sceneState, selectedObjectIds: this.selectedObjectIds }) : fitStudioCameraToScene(this.sceneState);
    if (!scene) { this.statusMessage = action === "zoom-selection" ? "Select an object to zoom" : "Scene is empty"; this.mount(); return; }
    this.sceneState = scene; this.statusMessage = action === "zoom-selection" ? "Zoomed to selection" : "Fit scene"; this.mount();
  }
  private handleClipboardShortcut(event: KeyboardEvent): boolean {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return false;
    if (!(event.ctrlKey || event.metaKey)) return false;
    const key = event.key.toLowerCase();
    if (key === "c") { void this.copySelection(); event.preventDefault(); return true; }
    if (key === "v") { void this.pasteSelection(); event.preventDefault(); return true; }
    return false;
  }
  private async copySelection(): Promise<void> {
    const text = serializeStudioClipboard(this.sceneState, this.selectedObjectIds);
    if (!text) { this.statusMessage = "Select objects to copy"; this.mount(); return; }
    try { await navigator.clipboard.writeText(text); this.statusMessage = "Copied selection"; } catch { this.statusMessage = "Clipboard unavailable"; } this.mount();
  }
  private async pasteSelection(): Promise<void> {
    const result = await navigator.clipboard.readText().then((text) => createStudioPasteCommand(this.sceneState, text)).catch(() => undefined);
    if (result) this.applyCommand(result.command, result.options);
    else { this.statusMessage = "Clipboard has no Raw2D Studio selection"; this.mount(); }
  }
  private applyCommand(command: StudioCommand, options: StudioCommandApplyOptions = {}): void {
    const result = applyStudioHistoryCommand({ scene: this.sceneState, history: this.history, command });

    if (!result.handled) {
      return;
    }
    this.sceneState = result.scene;
    this.history = result.history;
    this.setSelectedObjectIds(options.selectedObjectIds ?? (options.selectedObjectId ? [options.selectedObjectId] : this.selectedObjectIds));
    this.statusMessage = options.statusMessage ?? "Scene updated";
    if (options.renderRuntimeOnly) {
      this.renderRuntimeScene();
      return;
    }
    this.mount();
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
    this.syncSelection();
    this.statusMessage = action === "undo" ? "Undid edit" : "Redid edit";
    this.mount();
  }
  private renderRuntimeScene(): void {
    const canvasElement = this.root.querySelector<HTMLCanvasElement>(".studio-canvas");

    if (!canvasElement) {
      return;
    }
    const result = renderStudioRuntimeScene({ canvasElement, sceneState: this.sceneState, selectedObjectId: this.selectedObjectId, selectedObjectIds: this.selectedObjectIds, rendererMode: this.rendererMode });
    this.rendererStats = result.stats;
    this.renderStatsPanel();
  }
  private renderStatsPanel(): void {
    const statsElement = this.root.querySelector<HTMLElement>(".studio-stats");
    if (statsElement) statsElement.outerHTML = renderStudioStatsPanel(this.rendererStats);
  }

  private setSelectedObjectId(selectedObjectId: string | undefined): void {
    this.selectedObjectId = selectedObjectId; this.selectedObjectIds = selectedObjectId ? [selectedObjectId] : [];
  }
  private setSelectedObjectIds(selectedObjectIds: readonly string[]): void {
    this.selectedObjectIds = normalizeStudioSelection({ scene: this.sceneState, selectedObjectIds });
    this.selectedObjectId = getPrimaryStudioSelectionId(this.selectedObjectIds);
  }
  private syncSelection(): void { this.setSelectedObjectIds(this.selectedObjectIds); }
}
