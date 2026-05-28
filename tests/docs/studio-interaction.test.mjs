import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const englishInteraction = readFileSync("docs/Raw2DStudioInteraction.md", "utf8");
const hinglishInteraction = readFileSync("docs/hi/Raw2DStudioInteraction.md", "utf8");
const englishPanels = readFileSync("docs/Raw2DStudioPanels.md", "utf8");
const hinglishPanels = readFileSync("docs/hi/Raw2DStudioPanels.md", "utf8");
const routeTopics = [
  readFileSync("src/pages/DocStudioTopics.ts", "utf8"),
  readFileSync("src/pages/DocStudioInteractionTopics.ts", "utf8")
].join("\n");

test("Studio interaction docs cover current controls", () => {
  for (const content of [englishInteraction, hinglishInteraction, routeTopics]) {
    assert.match(content, /select/i);
    assert.match(content, /drag/i);
    assert.match(content, /resize/i);
    assert.match(content, /Arrow/);
    assert.match(content, /Escape/);
    assert.match(content, /Delete/);
    assert.match(content, /undo/i);
    assert.match(content, /redo/i);
  }
});

test("Studio panel docs cover layers properties and stats", () => {
  for (const content of [englishPanels, hinglishPanels, routeTopics]) {
    assert.match(content, /Layers/);
    assert.match(content, /Properties/);
    assert.match(content, /Renderer Stats|Stats/);
    assert.match(content, /Assets/);
    assert.match(content, /Use|asset/);
    assert.match(content, /fillColor/);
    assert.match(content, /textureBinds/);
  }
});

test("Studio docs route exposes interaction and panel topics", () => {
  assert.match(routeTopics, /studioInteractionTopics/);
  assert.match(routeTopics, /id: "studio-interaction"/);
  assert.match(routeTopics, /applyStudioLayerAction/);
  assert.match(routeTopics, /applyStudioPropertyEdit/);
  assert.match(routeTopics, /createStudioStatsPanel/);
});

test("Studio interaction docs cover command history behavior", () => {
  for (const content of [englishInteraction, hinglishInteraction, routeTopics]) {
    assert.match(content, /applyStudioHistoryCommand/);
    assert.match(content, /undoStudioHistory/);
    assert.match(content, /redoStudioHistory/);
    assert.match(content, /Ctrl\/Cmd\+Z/);
  }
});

test("Studio interaction docs cover advanced editing workflows", () => {
  for (const content of [englishInteraction, hinglishInteraction, routeTopics]) {
    assert.match(content, /Group/);
    assert.match(content, /Ungroup/);
    assert.match(content, /Duplicate/);
    assert.match(content, /Align/);
    assert.match(content, /Distribute/);
    assert.match(content, /Snap/);
    assert.match(content, /Zoom Selection|zoomStudioCameraToSelection/);
    assert.match(content, /Fit Scene|fitStudioCameraToScene/);
    assert.match(content, /minimap|createStudioMinimapModel/);
    assert.match(content, /raw2d-studio-clipboard/);
  }
});

test("Studio interaction docs cover keyboard accessibility", () => {
  for (const content of [englishInteraction, hinglishInteraction, routeTopics]) {
    assert.match(content, /Tab/);
    assert.match(content, /Shift\+Tab/);
    assert.match(content, /Enter/);
    assert.match(content, /focused|Focused/);
    assert.match(content, /Ctrl\/Cmd\+C/);
    assert.match(content, /Ctrl\/Cmd\+V/);
  }
});
