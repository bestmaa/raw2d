import { getStudioObjectBounds } from "./StudioObjectBounds";
import { flattenStudioSceneObjects } from "./StudioSceneGraph";
import { getStudioSelectionBounds } from "./StudioSelection";
import type { StudioMinimapModel, StudioNavigationBounds, StudioNavigationOptions, StudioNavigationViewport } from "./StudioNavigation.type";
import type { StudioCameraState, StudioSceneObject, StudioSceneState } from "./StudioSceneState.type";

const studioViewport: StudioNavigationViewport = { width: 800, height: 600 };
const minimapViewport: StudioNavigationViewport = { width: 160, height: 120 };
const fitPadding = 48;
const minZoom = 0.25;
const maxZoom = 4;

export function zoomStudioCameraToSelection(options: StudioNavigationOptions): StudioSceneState | undefined {
  const bounds = getStudioSelectionBounds({ scene: options.scene, selectedObjectIds: options.selectedObjectIds, minimumCount: 1 });
  return bounds ? withCameraForBounds(options.scene, bounds) : undefined;
}

export function fitStudioCameraToScene(scene: StudioSceneState): StudioSceneState | undefined {
  const bounds = getStudioSceneBounds(scene);
  return bounds ? withCameraForBounds(scene, bounds) : undefined;
}

export function createStudioMinimapModel(options: StudioNavigationOptions): StudioMinimapModel {
  const objectBounds = flattenStudioSceneObjects(options.scene).map((entry) => ({
    id: entry.object.id,
    bounds: getWorldBounds(entry.object, entry.worldX, entry.worldY),
    selected: options.selectedObjectIds.includes(entry.object.id)
  }));
  const viewportBounds = getCameraViewportBounds(options.scene.camera);
  const world = getOuterBounds([...objectBounds.map((entry) => entry.bounds), viewportBounds]) ?? viewportBounds;

  return {
    width: minimapViewport.width,
    height: minimapViewport.height,
    items: objectBounds.map((entry) => ({ id: entry.id, selected: entry.selected, ...toMinimapBounds(entry.bounds, world) })),
    viewport: toMinimapBounds(viewportBounds, world)
  };
}

function withCameraForBounds(scene: StudioSceneState, bounds: StudioNavigationBounds): StudioSceneState {
  return { ...scene, camera: createCameraForBounds(bounds) };
}

function createCameraForBounds(bounds: StudioNavigationBounds): StudioCameraState {
  const zoom = clamp(
    Math.min((studioViewport.width - fitPadding * 2) / Math.max(1, bounds.width), (studioViewport.height - fitPadding * 2) / Math.max(1, bounds.height)),
    minZoom,
    maxZoom
  );
  return {
    x: round(bounds.x + bounds.width / 2 - studioViewport.width / (2 * zoom)),
    y: round(bounds.y + bounds.height / 2 - studioViewport.height / (2 * zoom)),
    zoom: round(zoom)
  };
}

function getStudioSceneBounds(scene: StudioSceneState): StudioNavigationBounds | undefined {
  const bounds = flattenStudioSceneObjects(scene).map((entry) => getWorldBounds(entry.object, entry.worldX, entry.worldY));
  return getOuterBounds(bounds);
}

function getWorldBounds(object: StudioSceneObject, worldX: number, worldY: number): StudioNavigationBounds {
  const local = getStudioObjectBounds(object);
  return { ...local, x: local.x + worldX - object.x, y: local.y + worldY - object.y };
}

function getCameraViewportBounds(camera: StudioCameraState): StudioNavigationBounds {
  return { x: camera.x, y: camera.y, width: studioViewport.width / camera.zoom, height: studioViewport.height / camera.zoom };
}

function getOuterBounds(bounds: readonly StudioNavigationBounds[]): StudioNavigationBounds | undefined {
  if (bounds.length === 0) return undefined;
  const minX = Math.min(...bounds.map((bound) => bound.x));
  const minY = Math.min(...bounds.map((bound) => bound.y));
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height));
  return { x: minX, y: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
}

function toMinimapBounds(bounds: StudioNavigationBounds, world: StudioNavigationBounds): StudioNavigationBounds {
  return {
    x: ((bounds.x - world.x) / world.width) * 100,
    y: ((bounds.y - world.y) / world.height) * 100,
    width: Math.max(1, (bounds.width / world.width) * 100),
    height: Math.max(1, (bounds.height / world.height) * 100)
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
