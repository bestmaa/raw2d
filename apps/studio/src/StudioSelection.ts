import { getStudioObjectBounds } from "./StudioObjectBounds";
import { flattenStudioSceneObjects } from "./StudioSceneGraph";
import type {
  StudioSelectionBounds,
  StudioSelectionBoundsOptions,
  StudioSelectionOptions,
  UpdateStudioSelectionOptions
} from "./StudioSelection.type";

export function normalizeStudioSelection(options: StudioSelectionOptions): readonly string[] {
  const entries = flattenStudioSceneObjects(options.scene);
  const entryById = new Map(entries.map((entry) => [entry.object.id, entry]));
  const selection: string[] = [];

  for (const id of options.selectedObjectIds) {
    if (entryById.has(id) && !selection.includes(id)) {
      selection.push(id);
    }
  }

  return selection.filter((id) => !hasSelectedAncestor(id, selection, entryById));
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

  const bounds = flattenStudioSceneObjects(options.scene)
    .filter((entry) => selection.includes(entry.object.id))
    .map((entry) => {
      const local = getStudioObjectBounds(entry.object);
      return {
        x: local.x + entry.worldX - entry.object.x,
        y: local.y + entry.worldY - entry.object.y,
        width: local.width,
        height: local.height
      };
    });

  if (bounds.length === 0) {
    return undefined;
  }

  const minX = Math.min(...bounds.map((bound) => bound.x));
  const minY = Math.min(...bounds.map((bound) => bound.y));
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function hasSelectedAncestor(
  objectId: string,
  selection: readonly string[],
  entryById: ReadonlyMap<string, ReturnType<typeof flattenStudioSceneObjects>[number]>
): boolean {
  let parentId = entryById.get(objectId)?.parentId;

  while (parentId) {
    if (selection.includes(parentId)) {
      return true;
    }

    parentId = entryById.get(parentId)?.parentId;
  }

  return false;
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
