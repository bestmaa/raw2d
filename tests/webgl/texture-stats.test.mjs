import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Scene } from "raw2d-core";
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { WebGLRenderer2D } from "raw2d-webgl";
import {
  createCanvas,
  createFakeCanvas,
  createFakeWebGL2Context,
  createTexture,
  renderSprites
} from "./texture-stats-utils.mjs";

test("WebGLRenderer2D reports texture upload and cache hit stats", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 100, height: 100 });
  const scene = new Scene();
  const texture = createTexture(16, 16);

  scene.add(new Sprite({ texture, x: 10, y: 10, width: 16, height: 16 }));
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getStats().textureBinds, 1);
  assert.equal(renderer.getStats().textureUploads, 1);
  assert.equal(renderer.getStats().textureCacheHits, 0);

  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getStats().textureBinds, 1);
  assert.equal(renderer.getStats().textureUploads, 0);
  assert.equal(renderer.getStats().textureCacheHits, 1);
});

test("packed atlas reduces WebGL texture binds versus separate textures", () => {
  const separateStats = renderSprites([
    new Sprite({ texture: createTexture(16, 16), x: 10, y: 10, width: 16, height: 16 }),
    new Sprite({ texture: createTexture(20, 10), x: 32, y: 10, width: 20, height: 10 })
  ]);
  const atlas = new TextureAtlasPacker({ createCanvas }).pack([
    { name: "idle", source: { width: 16, height: 16 } },
    { name: "run", source: { width: 20, height: 10 } }
  ]);
  const packedStats = renderSprites([
    new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle"), x: 10, y: 10 }),
    new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run"), x: 32, y: 10 })
  ]);

  assert.equal(separateStats.textures, 2);
  assert.equal(separateStats.textureBinds, 2);
  assert.equal(separateStats.textureUploads, 2);
  assert.equal(packedStats.textures, 1);
  assert.equal(packedStats.textureBinds, 1);
  assert.equal(packedStats.textureUploads, 1);
});

test("WebGLRenderer2D reports sprite batch reduction diagnostics", () => {
  const textureA = createTexture(16, 16);
  const textureB = createTexture(16, 16);
  const stats = renderSprites([
    new Sprite({ texture: textureA, x: 10, y: 10, width: 16, height: 16 }),
    new Sprite({ texture: textureB, x: 32, y: 10, width: 16, height: 16 }),
    new Sprite({ texture: textureA, x: 54, y: 10, width: 16, height: 16 })
  ]);

  assert.equal(stats.spriteBatches, 3);
  assert.equal(stats.spriteTextureGroups, 2);
  assert.equal(stats.spriteTextureBinds, 3);
  assert.equal(stats.sortedSpriteTextureBinds, 2);
  assert.equal(stats.spriteTextureBindReduction, 1);
});

test("WebGLRenderer2D can explicitly sort safe Sprite runs by texture", () => {
  const textureA = createTexture(16, 16);
  const textureB = createTexture(16, 16);
  const sprites = [
    new Sprite({ texture: textureA, x: 10, y: 10, width: 16, height: 16 }),
    new Sprite({ texture: textureB, x: 32, y: 10, width: 16, height: 16 }),
    new Sprite({ texture: textureA, x: 54, y: 10, width: 16, height: 16 })
  ];
  const unsortedStats = renderSprites(sprites);
  const sortedStats = renderSprites(sprites, { spriteSorting: "texture" });

  assert.equal(unsortedStats.spriteTextureBinds, 3);
  assert.equal(unsortedStats.drawCalls, 3);
  assert.equal(sortedStats.spriteTextureBinds, 2);
  assert.equal(sortedStats.drawCalls, 2);
  assert.equal(sortedStats.spriteTextureBindReduction, 0);
});

test("WebGLRenderer2D can clear texture caches", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 100,
    height: 100,
    createTextCanvas: createCanvas
  });
  const scene = new Scene();

  scene.add(new Text2D({ x: 10, y: 20, text: "Raw2D" }));
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getTextureCacheSize(), 1);
  assert.equal(renderer.getTextTextureCacheSize(), 1);

  renderer.clearTextureCache();

  assert.equal(renderer.getTextureCacheSize(), 0);
  assert.equal(renderer.getTextTextureCacheSize(), 0);
  assert.equal(gl.calls.includes("deleteTexture"), true);
});

test("WebGLRenderer2D retires stale text textures when text changes", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 100,
    height: 100,
    createTextCanvas: createCanvas
  });
  const scene = new Scene();
  const text = new Text2D({
    x: 10,
    y: 20,
    text: "Old",
    material: new BasicMaterial({ fillColor: "#ffffff" })
  });

  scene.add(text);
  renderer.render(scene, new Camera2D());
  text.setText("New");
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getTextTextureCacheSize(), 1);
  assert.equal(gl.calls.filter((call) => call === "deleteTexture").length, 1);
});

test("WebGLRenderer2D dispose releases WebGL resources", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 100, height: 100 });
  const scene = new Scene();

  scene.add(new Sprite({ texture: createTexture(16, 16), x: 10, y: 10, width: 16, height: 16 }));
  renderer.render(scene, new Camera2D());
  renderer.dispose();

  assert.equal(gl.calls.filter((call) => call === "deleteBuffer").length >= 4, true);
  assert.equal(gl.calls.includes("deleteTexture"), true);
  assert.equal(gl.calls.filter((call) => call === "deleteProgram").length, 2);
});
