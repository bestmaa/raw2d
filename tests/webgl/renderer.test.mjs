import assert from "node:assert/strict";
import test from "node:test";
import { BasicMaterial, Camera2D, Circle, Ellipse, Line, Polygon, Polyline, Rect, Scene, ShapePath } from "raw2d-core";
import { Sprite, Texture } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { WebGLRenderer2D } from "raw2d-webgl";

test("WebGLRenderer2D groups Rect draw calls by material key", () => {
  const gl = createFakeWebGL2Context();
  const canvas = createFakeCanvas(gl);
  const renderer = new WebGLRenderer2D({ canvas, width: 200, height: 120, backgroundColor: "#10141c" });
  const scene = new Scene();
  const rectA = createRect(20, "#35c2ff");
  const rectB = createRect(80, "#f45b69");

  scene.add(rectA);
  scene.add(rectB);
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,6"), true);
  assert.equal(gl.calls.includes("drawArrays:4,6,6"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 2,
    renderList: { total: 2, accepted: 2, hidden: 0, filtered: 0, culled: 0 },
    rects: 2,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 2,
    staticBatches: 0,
    dynamicBatches: 2,
    staticObjects: 0,
    dynamicObjects: 2,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 12,
    drawCalls: 2,
    uploadBufferDataCalls: 1,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 288,
    unsupported: 0
  });
});

test("WebGLRenderer2D keeps same-material filled shapes in one draw range", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect(20, "#35c2ff"));
  scene.add(new Circle({ x: 80, y: 40, radius: 20 }));
  scene.add(new Ellipse({ x: 130, y: 50, radiusX: 22, radiusY: 12 }));
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,102"), true);
  assert.equal(gl.calls.includes("drawArrays:4,102,96"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 3,
    renderList: { total: 3, accepted: 3, hidden: 0, filtered: 0, culled: 0 },
    rects: 1,
    arcs: 0,
    circles: 1,
    ellipses: 1,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 2,
    staticBatches: 0,
    dynamicBatches: 2,
    staticObjects: 0,
    dynamicObjects: 3,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 198,
    drawCalls: 2,
    uploadBufferDataCalls: 1,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 4752,
    unsupported: 0
  });
});

test("WebGLRenderer2D groups Line, Polyline, and Polygon material ranges", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(new Line({ x: 20, y: 20, startX: 0, startY: 0, endX: 50, endY: 0 }));
  scene.add(
    new Polyline({
      x: 20,
      y: 50,
      points: [
        { x: 0, y: 0 },
        { x: 30, y: 12 },
        { x: 60, y: 0 }
      ]
    })
  );
  scene.add(
    new Polygon({
      x: 100,
      y: 30,
      points: [
        { x: 0, y: 0 },
        { x: 40, y: 0 },
        { x: 40, y: 30 },
        { x: 0, y: 30 }
      ]
    })
  );
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,6"), true);
  assert.equal(gl.calls.includes("drawArrays:4,6,12"), true);
  assert.equal(gl.calls.includes("drawArrays:4,18,6"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 3,
    renderList: { total: 3, accepted: 3, hidden: 0, filtered: 0, culled: 0 },
    rects: 0,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 1,
    polylines: 1,
    polygons: 1,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 3,
    staticBatches: 0,
    dynamicBatches: 3,
    staticObjects: 0,
    dynamicObjects: 3,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 24,
    drawCalls: 3,
    uploadBufferDataCalls: 1,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 576,
    unsupported: 0
  });
});

test("WebGLRenderer2D renders ShapePath stroke through the shape batch", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect(20, "#35c2ff"));
  scene.add(new ShapePath({ fill: false }).moveTo(0, 0).lineTo(50, 0));
  renderer.render(scene, new Camera2D());

  assert.deepEqual(renderer.getStats(), {
    objects: 2,
    renderList: { total: 2, accepted: 2, hidden: 0, filtered: 0, culled: 0 },
    rects: 1,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 1,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 2,
    staticBatches: 0,
    dynamicBatches: 2,
    staticObjects: 0,
    dynamicObjects: 2,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 12,
    drawCalls: 2,
    uploadBufferDataCalls: 1,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 288,
    unsupported: 0
  });
});

test("WebGLRenderer2D reports unsupported ShapePath fills without counting the object unsupported", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(
    new ShapePath({ fill: true, stroke: false })
      .moveTo(0, 0)
      .lineTo(30, 30)
      .lineTo(0, 30)
      .lineTo(30, 0)
      .closePath()
  );
  renderer.render(scene, new Camera2D());

  assert.equal(renderer.getStats().shapePaths, 1);
  assert.equal(renderer.getStats().shapePathUnsupportedFills, 1);
  assert.equal(renderer.getStats().unsupported, 0);
  assert.equal(renderer.getStats().drawCalls, 0);
});

test("WebGLRenderer2D can warn through a callback for skipped ShapePath fills", () => {
  const gl = createFakeWebGL2Context();
  const fallbacks = [];
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 200,
    height: 120,
    shapePathFillFallback: "warn",
    onShapePathFillFallback: (fallback) => fallbacks.push(fallback)
  });
  const scene = new Scene();
  const shapePath = new ShapePath({ name: "broken-fill", fill: true, stroke: false })
    .moveTo(0, 0)
    .lineTo(30, 30)
    .lineTo(0, 30)
    .lineTo(30, 0)
    .closePath();

  scene.add(shapePath);
  renderer.render(scene, new Camera2D());

  assert.deepEqual(fallbacks, [
    { objectId: shapePath.id, objectName: "broken-fill", reason: "self-intersection" }
  ]);
});

test("WebGLRenderer2D culls offscreen objects before batching", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect(20, "#35c2ff"));
  scene.add(createRect(500, "#f45b69"));
  renderer.render(scene, new Camera2D(), { culling: true });

  assert.equal(gl.calls.includes("drawArrays:4,0,6"), true);
  assert.equal(gl.calls.some((call) => call === "drawArrays:4,6,6"), false);
  assert.equal(renderer.getStats().objects, 1);
  assert.deepEqual(renderer.getStats().renderList, {
    total: 2,
    accepted: 1,
    hidden: 0,
    filtered: 0,
    culled: 1
  });
  assert.equal(renderer.getStats().drawCalls, 1);
});

test("WebGLRenderer2D can render a prebuilt culled render list", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const camera = new Camera2D();

  scene.add(createRect(20, "#35c2ff"));
  scene.add(createRect(500, "#f45b69"));
  const renderList = renderer.createRenderList(scene, camera, { culling: true });
  renderer.render(scene, camera, { renderList });

  assert.deepEqual(renderList.getStats(), {
    total: 2,
    accepted: 1,
    hidden: 0,
    filtered: 0,
    culled: 1
  });
  assert.equal(renderer.getStats().objects, 1);
  assert.equal(renderer.getStats().rects, 1);
  assert.equal(renderer.getStats().drawCalls, 1);
});

test("WebGLRenderer2D batches consecutive Sprites by texture", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const texture = createTexture();

  scene.add(new Sprite({ texture, x: 20, y: 20, width: 16, height: 16 }));
  scene.add(new Sprite({ texture, x: 44, y: 20, width: 16, height: 16 }));
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("drawArrays:4,0,12"), true);
  assert.equal(gl.calls.includes("texImage2D:3553"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 2,
    renderList: { total: 2, accepted: 2, hidden: 0, filtered: 0, culled: 0 },
    rects: 0,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 2,
    staticSprites: 0,
    dynamicSprites: 2,
    spriteBatches: 1,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 1,
    spriteTextureGroups: 1,
    spriteTextureBinds: 1,
    sortedSpriteTextureBinds: 1,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 1,
    textureBinds: 1,
    textureUploads: 1,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 0,
    dynamicBatches: 1,
    staticObjects: 0,
    dynamicObjects: 2,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 12,
    drawCalls: 1,
    uploadBufferDataCalls: 1,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 240,
    unsupported: 0
  });
});

test("WebGLRenderer2D renders Text2D through the texture batch path", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({
    canvas: createFakeCanvas(gl),
    width: 200,
    height: 120,
    createTextCanvas: createFakeTextCanvas
  });
  const scene = new Scene();

  scene.add(new Text2D({
    x: 20,
    y: 40,
    text: "Raw2D",
    font: "20px sans-serif",
    material: new BasicMaterial({ fillColor: "#f5f7fb" })
  }));
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("texImage2D:3553"), true);
  assert.equal(gl.calls.includes("drawArrays:4,0,6"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 1,
    renderList: { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 },
    rects: 0,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 1,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 1,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 1,
    textureBinds: 1,
    textureUploads: 1,
    textureCacheHits: 0,
    textTextures: 1,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 1,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 0,
    dynamicBatches: 1,
    staticObjects: 0,
    dynamicObjects: 1,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 6,
    drawCalls: 1,
    uploadBufferDataCalls: 1,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 120,
    unsupported: 0
  });
});

test("WebGLRenderer2D reuses GPU buffer capacity on later renders", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();

  scene.add(createRect(20, "#35c2ff"));
  renderer.render(scene, new Camera2D());
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("bufferSubData:34962,0,36"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 1,
    renderList: { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 },
    rects: 1,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 0,
    dynamicBatches: 1,
    staticObjects: 0,
    dynamicObjects: 1,
    staticCacheHits: 0,
    staticCacheMisses: 0,
    vertices: 6,
    drawCalls: 1,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 1,
    uploadedBytes: 144,
    unsupported: 0
  });
});

test("WebGLRenderer2D separates static and dynamic runs", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const staticRect = createRect(20, "#35c2ff");
  const dynamicRect = createRect(80, "#35c2ff");

  staticRect.setRenderMode("static");
  scene.add(staticRect);
  scene.add(dynamicRect);
  renderer.render(scene, new Camera2D());

  assert.equal(gl.calls.includes("bufferData:34962,36,35044"), true);
  assert.equal(gl.calls.includes("bufferData:34962,36,35048"), true);
  assert.deepEqual(renderer.getStats(), {
    objects: 2,
    renderList: { total: 2, accepted: 2, hidden: 0, filtered: 0, culled: 0 },
    rects: 2,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 2,
    staticBatches: 1,
    dynamicBatches: 1,
    staticObjects: 1,
    dynamicObjects: 1,
    staticCacheHits: 0,
    staticCacheMisses: 1,
    vertices: 12,
    drawCalls: 2,
    uploadBufferDataCalls: 2,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 288,
    unsupported: 0
  });
});

test("WebGLRenderer2D reuses clean static run buffers", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const staticRect = createRect(20, "#35c2ff");

  staticRect.setRenderMode("static");
  scene.add(staticRect);
  renderer.render(scene, new Camera2D());
  renderer.render(scene, new Camera2D());

  assert.deepEqual(renderer.getStats(), {
    objects: 1,
    renderList: { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 },
    rects: 1,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 1,
    dynamicBatches: 0,
    staticObjects: 1,
    dynamicObjects: 0,
    staticCacheHits: 1,
    staticCacheMisses: 0,
    vertices: 6,
    drawCalls: 1,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 0,
    unsupported: 0
  });

  staticRect.setSize(60, 30);
  renderer.render(scene, new Camera2D());

  assert.deepEqual(renderer.getStats(), {
    objects: 1,
    renderList: { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 },
    rects: 1,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 0,
    staticSprites: 0,
    dynamicSprites: 0,
    spriteBatches: 0,
    staticSpriteBatches: 0,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 0,
    spriteTextureBinds: 0,
    sortedSpriteTextureBinds: 0,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 0,
    textureBinds: 0,
    textureUploads: 0,
    textureCacheHits: 0,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 1,
    dynamicBatches: 0,
    staticObjects: 1,
    dynamicObjects: 0,
    staticCacheHits: 0,
    staticCacheMisses: 1,
    vertices: 6,
    drawCalls: 1,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 1,
    uploadedBytes: 144,
    unsupported: 0
  });
});

test("WebGLRenderer2D reuses clean static Sprite buffers", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const texture = createTexture();
  const sprite = new Sprite({ texture, x: 20, y: 20, width: 16, height: 16 });

  sprite.setRenderMode("static");
  scene.add(sprite);
  renderer.render(scene, new Camera2D());
  renderer.render(scene, new Camera2D());

  assert.deepEqual(renderer.getStats(), {
    objects: 1,
    renderList: { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 },
    rects: 0,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 1,
    staticSprites: 1,
    dynamicSprites: 0,
    spriteBatches: 1,
    staticSpriteBatches: 1,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 1,
    spriteTextureBinds: 1,
    sortedSpriteTextureBinds: 1,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 1,
    textureBinds: 1,
    textureUploads: 0,
    textureCacheHits: 1,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 1,
    dynamicBatches: 0,
    staticObjects: 1,
    dynamicObjects: 0,
    staticCacheHits: 1,
    staticCacheMisses: 0,
    vertices: 6,
    drawCalls: 1,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 0,
    uploadedBytes: 0,
    unsupported: 0
  });
});

test("WebGLRenderer2D invalidates static Sprite cache when frame changes", () => {
  const gl = createFakeWebGL2Context();
  const renderer = new WebGLRenderer2D({ canvas: createFakeCanvas(gl), width: 200, height: 120 });
  const scene = new Scene();
  const texture = new Texture({ source: { width: 32, height: 16 }, width: 32, height: 16 });
  const sprite = new Sprite({
    texture,
    frame: { x: 0, y: 0, width: 16, height: 16 },
    x: 20,
    y: 20
  });

  sprite.setRenderMode("static");
  scene.add(sprite);
  renderer.render(scene, new Camera2D());
  renderer.render(scene, new Camera2D());
  sprite.setFrame({ x: 16, y: 0, width: 16, height: 16 });
  renderer.render(scene, new Camera2D());

  assert.deepEqual(renderer.getStats(), {
    objects: 1,
    renderList: { total: 1, accepted: 1, hidden: 0, filtered: 0, culled: 0 },
    rects: 0,
    arcs: 0,
    circles: 0,
    ellipses: 0,
    lines: 0,
    polylines: 0,
    polygons: 0,
    shapePaths: 0,
    shapePathUnsupportedFills: 0,
    sprites: 1,
    staticSprites: 1,
    dynamicSprites: 0,
    spriteBatches: 1,
    staticSpriteBatches: 1,
    dynamicSpriteBatches: 0,
    spriteTextureGroups: 1,
    spriteTextureBinds: 1,
    sortedSpriteTextureBinds: 1,
    spriteTextureBindReduction: 0,
    skippedSpriteTextures: 0,
    textures: 1,
    textureBinds: 1,
    textureUploads: 0,
    textureCacheHits: 1,
    textTextures: 0,
    textTextureCacheHits: 0,
    textTextureCacheMisses: 0,
    textTextureEvictions: 0,
    retiredTextTextures: 0,
    batches: 1,
    staticBatches: 1,
    dynamicBatches: 0,
    staticObjects: 1,
    dynamicObjects: 0,
    staticCacheHits: 0,
    staticCacheMisses: 1,
    vertices: 6,
    drawCalls: 1,
    uploadBufferDataCalls: 0,
    uploadBufferSubDataCalls: 1,
    uploadedBytes: 120,
    unsupported: 0
  });
});

function createRect(x, fillColor) {
  return new Rect({
    x,
    y: 20,
    width: 40,
    height: 30,
    material: new BasicMaterial({ fillColor })
  });
}

function createTexture() {
  return new Texture({
    source: {
      width: 16,
      height: 16
    },
    width: 16,
    height: 16
  });
}

function createFakeCanvas(gl) {
  return {
    clientWidth: 200,
    clientHeight: 120,
    width: 0,
    height: 0,
    getContext(type) {
      return type === "webgl2" ? gl : null;
    }
  };
}

function createFakeTextCanvas(width, height) {
  return {
    width,
    height,
    getContext(type) {
      if (type !== "2d") {
        return null;
      }

      return {
        font: "",
        textAlign: "start",
        textBaseline: "alphabetic",
        fillStyle: "#ffffff",
        clearRect() {},
        fillText() {},
        measureText(text) {
          const width = text.length * 10;
          return {
            width,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: width,
            actualBoundingBoxAscent: 16,
            actualBoundingBoxDescent: 4
          };
        }
      };
    }
  };
}

function createFakeWebGL2Context() {
  return {
    ARRAY_BUFFER: 34962,
    COLOR_BUFFER_BIT: 16384,
    COMPILE_STATUS: 35713,
    DYNAMIC_DRAW: 35048,
    STATIC_DRAW: 35044,
    FLOAT: 5126,
    FRAGMENT_SHADER: 35632,
    BLEND: 3042,
    CLAMP_TO_EDGE: 33071,
    LINK_STATUS: 35714,
    LINEAR: 9729,
    ONE_MINUS_SRC_ALPHA: 771,
    RGBA: 6408,
    SRC_ALPHA: 770,
    TEXTURE0: 33984,
    TEXTURE_2D: 3553,
    TEXTURE_MAG_FILTER: 10240,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TRIANGLES: 4,
    UNSIGNED_BYTE: 5121,
    VERTEX_SHADER: 35633,
    calls: [],
    activeTexture(texture) {
      this.calls.push(`activeTexture:${texture}`);
    },
    attachShader() {},
    bindBuffer(target) {
      this.calls.push(`bindBuffer:${target}`);
    },
    bindTexture(target) {
      this.calls.push(`bindTexture:${target}`);
    },
    blendFunc(source, destination) {
      this.calls.push(`blendFunc:${source},${destination}`);
    },
    bufferData(target, data, usage) {
      this.calls.push(`bufferData:${target},${data.length},${usage}`);
    },
    bufferSubData(target, offset, data) {
      this.calls.push(`bufferSubData:${target},${offset},${data.length}`);
    },
    clear(mask) {
      this.calls.push(`clear:${mask}`);
    },
    clearColor(r, g, b, a) {
      this.calls.push(`clearColor:${r},${g},${b},${a}`);
    },
    compileShader() {},
    createBuffer() {
      return {};
    },
    createProgram() {
      return {};
    },
    createShader() {
      return {};
    },
    createTexture() {
      return {};
    },
    deleteProgram() {},
    deleteShader() {},
    drawArrays(mode, first, count) {
      this.calls.push(`drawArrays:${mode},${first},${count}`);
    },
    enable(capability) {
      this.calls.push(`enable:${capability}`);
    },
    enableVertexAttribArray(location) {
      this.calls.push(`enableVertexAttribArray:${location}`);
    },
    getAttribLocation(_program, name) {
      if (name === "a_position") {
        return 0;
      }

      if (name === "a_color") {
        return 1;
      }

      if (name === "a_uv") {
        return 2;
      }

      if (name === "a_alpha") {
        return 3;
      }

      return -1;
    },
    getProgramInfoLog() {
      return "";
    },
    getProgramParameter() {
      return true;
    },
    getShaderInfoLog() {
      return "";
    },
    getShaderParameter() {
      return true;
    },
    getUniformLocation() {
      return {};
    },
    linkProgram() {},
    shaderSource() {},
    texImage2D(target) {
      this.calls.push(`texImage2D:${target}`);
    },
    texParameteri(target, name, value) {
      this.calls.push(`texParameteri:${target},${name},${value}`);
    },
    uniform1i(_location, value) {
      this.calls.push(`uniform1i:${value}`);
    },
    useProgram() {},
    vertexAttribPointer(location, size, type, normalized, stride, offset) {
      this.calls.push(`vertexAttribPointer:${location},${size},${type},${normalized},${stride},${offset}`);
    },
    viewport(x, y, width, height) {
      this.calls.push(`viewport:${x},${y},${width},${height}`);
    }
  };
}
