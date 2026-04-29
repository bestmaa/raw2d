import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Rect } from "raw2d-core";
import { CanvasObjectRenderer } from "raw2d-canvas";
import { Sprite, Texture, TextureAtlas } from "raw2d-sprite";

test("CanvasObjectRenderer dispatches through handlers and skips invisible objects", () => {
  const context = createFakeContext();
  const renderer = new CanvasObjectRenderer({ context });
  const visibleRect = new Rect({
    x: 10,
    y: 20,
    width: 80,
    height: 40,
    material: new BasicMaterial({ fillColor: "#f45b69" })
  });
  const hiddenRect = new Rect({
    width: 20,
    height: 20,
    visible: false,
    material: new BasicMaterial({ fillColor: "#ffffff" })
  });

  renderer.render([visibleRect, hiddenRect]);

  assert.ok(context.calls.includes("fillRect:0,0,80,40:#f45b69"));
  assert.equal(context.calls.some((call) => call.includes("#ffffff")), false);
});

test("CanvasObjectRenderer draws Sprite atlas frames from source rects", () => {
  const context = createFakeContext();
  const renderer = new CanvasObjectRenderer({ context });
  const texture = new Texture({ source: { width: 64, height: 64 }, width: 64, height: 64 });
  const atlas = new TextureAtlas({
    texture,
    frames: {
      icon: { x: 16, y: 8, width: 32, height: 24 }
    }
  });
  const sprite = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("icon"), width: 64, height: 48 });

  renderer.render([sprite]);

  assert.ok(context.calls.includes("drawImage:16,8,32,24,0,0,64,48"));
});

test("CanvasObjectRenderer skips disposed Sprite textures", () => {
  const context = createFakeContext();
  const renderer = new CanvasObjectRenderer({ context });
  const texture = new Texture({ source: { width: 32, height: 32 }, width: 32, height: 32 });
  const sprite = new Sprite({ texture, width: 32, height: 32 });

  texture.dispose();
  renderer.render([sprite]);

  assert.equal(context.calls.some((call) => call.startsWith("drawImage")), false);
});

function createFakeContext() {
  const context = {
    calls: [],
    fillStyle: "",
    globalAlpha: 1,
    save() {
      this.calls.push("save");
    },
    restore() {
      this.calls.push("restore");
    },
    translate(x, y) {
      this.calls.push(`translate:${x},${y}`);
    },
    rotate(rotation) {
      this.calls.push(`rotate:${rotation}`);
    },
    scale(x, y) {
      this.calls.push(`scale:${x},${y}`);
    },
    fillRect(x, y, width, height) {
      this.calls.push(`fillRect:${x},${y},${width},${height}:${this.fillStyle}`);
    },
    drawImage(_source, sx, sy, sw, sh, dx, dy, dw, dh) {
      this.calls.push(`drawImage:${sx},${sy},${sw},${sh},${dx},${dy},${dw},${dh}`);
    }
  };

  return context;
}
