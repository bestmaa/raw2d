import { getStudioObjectBounds } from "./StudioObjectBounds";
import type {
  StudioSelectionBounds,
  StudioSelectionBoundsOptions,
  StudioSelectionOptions,
  UpdateStudioSelectionOptions
} from "./StudioSelection.type";

export function normalizeStudioSelection(options: StudioSelectionOptions): readonly string[] {
  const ids = new Set(options.scene.objects.map((object) => object.id));
  const selection: string[] = [];

  for (const id of options.selectedObjectIds) {
    if (ids.has(id) && !selection.includes(id)) {
      selection.push(id);
    }
  }

  return selection;
}

export function updateStudioSelection(options: UpdateStudioSelectionOptions): readonly string[] {
  if (!options.objectId) {
    return options.additive ? normalizeStudioSelection(options) : [];
  }

  const selection = normalizeStudioSelection(options);

  if (!options.additive) {
    return [options.objectId];
  }

  return selection.includes(options.objectId)
    ? selection.filter((id) => id !== options.objectId)
    : [...selection, options.objectId];
}

export function getPrimaryStudioSelectionId(selectedObjectIds: readonly string[]): string | undefined {
  return selectedObjectIds.at(-1);
}

export function getStudioSelectionBounds(options: StudioSelectionBoundsOptions): StudioSelectionBounds | undefined {
  const selection = normalizeStudioSelection(options);

  if (selection.length < (options.minimumCount ?? 1)) {
    return undefined;
  }

  const bounds = options.scene.objects
    .filter((object) => selection.includes(object.id))
    .map((object) => getStudioObjectBounds(object));

  if (bounds.length === 0) {
    return undefined;
  }

  const minX = Math.min(...bounds.map((bound) => bound.x));
  const minY = Math.min(...bounds.map((bound) => bound.y));
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function drawStudioSelectionBounds(
  context: CanvasRenderingContext2D,
  options: StudioSelectionBoundsOptions
): void {
  const bounds = getStudioSelectionBounds(options);

  if (!bounds) {
    return;
  }

  context.save();
  context.scale(options.scene.camera.zoom, options.scene.camera.zoom);
  context.translate(-options.scene.camera.x, -options.scene.camera.y);
  context.strokeStyle = "#38bdf8";
  context.lineWidth = 2;
  context.setLineDash([8, 5]);
  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.restore();
}
