import assert from "node:assert/strict";
import test from "node:test";
import { TextureAtlasPacker } from "raw2d-sprite";

test("TextureAtlasPacker packs sources into atlas frames", () => {
  const drawCalls = [];
  const packer = new TextureAtlasPacker({
    padding: 2,
    maxWidth: 40,
    createCanvas: createCanvasFactory(drawCalls)
  });
  const atlas = packer.pack([
    { name: "idle", source: { width: 16, height: 16 } },
    { name: "run", source: { width: 20, height: 10 } }
  ]);

  assert.deepEqual(atlas.texture.getSize(), { width: 24, height: 32 });
  assert.deepEqual(atlas.getFrame("idle"), { x: 2, y: 2, width: 16, height: 16 });
  assert.deepEqual(atlas.getFrame("run"), { x: 2, y: 20, width: 20, height: 10 });
  assert.deepEqual(drawCalls, [
    "clear:0,0,24,32",
    "draw:16x16->2,2,16,16",
    "draw:20x10->2,20,20,10"
  ]);
});

test("TextureAtlasPacker can grow output to power-of-two size", () => {
  const packer = new TextureAtlasPacker({
    padding: 1,
    maxWidth: 64,
    powerOfTwo: true,
    createCanvas: createCanvasFactory([])
  });
  const atlas = packer.pack([
    { name: "a", source: { width: 17, height: 9 } },
    { name: "b", source: { width: 8, height: 8 } }
  ]);

  assert.deepEqual(atlas.texture.getSize(), { width: 32, height: 16 });
  assert.deepEqual(atlas.getFrame("a"), { x: 1, y: 1, width: 17, height: 9 });
  assert.deepEqual(atlas.getFrame("b"), { x: 19, y: 1, width: 8, height: 8 });
});

test("TextureAtlasPacker rejects items wider than maxWidth", () => {
  const packer = new TextureAtlasPacker({
    padding: 1,
    maxWidth: 16,
    createCanvas: createCanvasFactory([])
  });

  assert.throws(() => packer.pack([{ name: "wide", source: { width: 20, height: 8 } }]), /wider than maxWidth/);
});

function createCanvasFactory(drawCalls) {
  return (width, height) => ({
    width,
    height,
    getContext(type) {
      if (type !== "2d") {
        return null;
      }

      return {
        clearRect(x, y, clearWidth, clearHeight) {
          drawCalls.push(`clear:${x},${y},${clearWidth},${clearHeight}`);
        },
        drawImage(source, _sourceX, _sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight) {
          drawCalls.push(`draw:${source.width}x${source.height}->${destinationX},${destinationY},${destinationWidth},${destinationHeight}`);
          assert.equal(sourceWidth, source.width);
          assert.equal(sourceHeight, source.height);
        }
      };
    }
  });
}
