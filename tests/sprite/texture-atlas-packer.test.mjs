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

test("TextureAtlasPacker reports packing diagnostics", () => {
  const packer = new TextureAtlasPacker({
    padding: 2,
    maxWidth: 40,
    createCanvas: createCanvasFactory([])
  });
  const result = packer.packWithStats([
    { name: "idle", source: { width: 16, height: 16 } },
    { name: "run", source: { width: 20, height: 10 } }
  ]);

  assert.deepEqual(result.stats, {
    width: 24,
    height: 32,
    totalArea: 768,
    usedArea: 456,
    wastedArea: 312,
    occupancy: 0.59375,
    frameCount: 2
  });
  assert.deepEqual(result.atlas.getFrame("run"), { x: 2, y: 20, width: 20, height: 10 });
});

test("TextureAtlasPacker can sort by area before packing", () => {
  const packer = new TextureAtlasPacker({
    padding: 1,
    maxWidth: 64,
    sort: "area",
    createCanvas: createCanvasFactory([])
  });
  const atlas = packer.pack([
    { name: "small", source: { width: 8, height: 8 } },
    { name: "large", source: { width: 20, height: 20 } },
    { name: "wide", source: { width: 22, height: 6 } }
  ]);

  assert.deepEqual(atlas.getFrame("large"), { x: 1, y: 1, width: 20, height: 20 });
  assert.deepEqual(atlas.getFrame("wide"), { x: 22, y: 1, width: 22, height: 6 });
  assert.deepEqual(atlas.getFrame("small"), { x: 45, y: 1, width: 8, height: 8 });
});

test("TextureAtlasPacker rejects items wider than maxWidth", () => {
  const packer = new TextureAtlasPacker({
    padding: 1,
    maxWidth: 16,
    createCanvas: createCanvasFactory([])
  });

  assert.throws(() => packer.pack([{ name: "wide", source: { width: 20, height: 8 } }]), /wider than maxWidth/);
});

test("TextureAtlasPacker rejects duplicate frame names", () => {
  const packer = new TextureAtlasPacker({ createCanvas: createCanvasFactory([]) });

  assert.throws(
    () => packer.pack([
      { name: "idle", source: { width: 8, height: 8 } },
      { name: "idle", source: { width: 8, height: 8 } }
    ]),
    /duplicate frame name: idle/
  );
});

test("TextureAtlasPacker rejects invalid item sizes", () => {
  const packer = new TextureAtlasPacker({ createCanvas: createCanvasFactory([]) });

  assert.throws(() => packer.pack([{ name: "empty", source: { width: 0, height: 8 } }]), /invalid size: empty/);
});

test("TextureAtlasPacker rejects items that exceed maxHeight", () => {
  const packer = new TextureAtlasPacker({
    padding: 1,
    maxHeight: 10,
    createCanvas: createCanvasFactory([])
  });

  assert.throws(() => packer.pack([{ name: "tall", source: { width: 8, height: 12 } }]), /taller than maxHeight/);
});

test("TextureAtlasPacker reports atlas full when rows exceed maxHeight", () => {
  const packer = new TextureAtlasPacker({
    padding: 1,
    maxWidth: 12,
    maxHeight: 12,
    createCanvas: createCanvasFactory([])
  });

  assert.throws(
    () => packer.pack([
      { name: "a", source: { width: 8, height: 5 } },
      { name: "b", source: { width: 8, height: 5 } }
    ]),
    /atlas is full before placing item: b/
  );
});

test("TextureAtlasPacker can extrude edge pixels into padding", () => {
  const drawCalls = [];
  const packer = new TextureAtlasPacker({
    padding: 2,
    edgeBleed: 1,
    maxWidth: 32,
    createCanvas: createCanvasFactory(drawCalls)
  });

  packer.pack([{ name: "tile", source: { width: 8, height: 6 } }]);

  assert.deepEqual(drawCalls, [
    "clear:0,0,12,10",
    "draw:8x6->2,2,8,6",
    "draw:1x6->1,2,1,6",
    "draw:1x6->10,2,1,6",
    "draw:8x1->2,1,8,1",
    "draw:8x1->2,8,8,1",
    "draw:1x1->1,1,1,1",
    "draw:1x1->10,1,1,1",
    "draw:1x1->1,8,1,1",
    "draw:1x1->10,8,1,1"
  ]);
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
          drawCalls.push(`draw:${sourceWidth}x${sourceHeight}->${destinationX},${destinationY},${destinationWidth},${destinationHeight}`);
          assert.equal(source.width > 0, true);
          assert.equal(source.height > 0, true);
        }
      };
    }
  });
}
