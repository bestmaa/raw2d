import {
  Camera2D,
  Canvas,
  Scene,
  Sprite,
  TextureAtlasPacker,
  WebGLRenderer2D,
  isWebGL2Available
} from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");
const nextFrameButton = document.querySelector<HTMLButtonElement>("#raw2d-next-frame");

if (!canvasElement || !statsElement || !nextFrameButton) {
  throw new Error("Example DOM nodes not found.");
}

const statsOutput = statsElement;
const scene = new Scene();
const camera = new Camera2D();
const atlasResult = new TextureAtlasPacker({ padding: 2, edgeBleed: 1, sort: "area" }).packWithStats([
  { name: "cyan", source: createTile("#35c2ff", "#dce9ff") },
  { name: "rose", source: createTile("#f45b69", "#ffd6dd") },
  { name: "green", source: createTile("#22c55e", "#bbf7d0") },
  { name: "gold", source: createTile("#facc15", "#fff7ad") }
]);
const atlas = atlasResult.atlas;
const names = ["cyan", "rose", "green", "gold"] as const;
const sprites: Sprite[] = [];
let selectedFrameIndex = 0;

for (let index = 0; index < 64; index += 1) {
  const name = names[index % names.length];
  const sprite = new Sprite({
    texture: atlas.texture,
    frame: atlas.getFrame(name),
    x: 54 + (index % 16) * 44,
    y: 70 + Math.floor(index / 16) * 72,
    width: 36,
    height: 36,
    origin: "center"
  });
  sprites.push(sprite);
  scene.add(sprite);
}

const renderer = isWebGL2Available()
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 360, backgroundColor: "#10141c" })
  : new Canvas({ canvas: canvasElement, width: 800, height: 360, backgroundColor: "#10141c" });

nextFrameButton.addEventListener("click", (): void => {
  selectedFrameIndex = (selectedFrameIndex + 1) % names.length;
  renderScene();
});

function renderScene(): void {
  const selectedName = names[selectedFrameIndex] ?? names[0];
  updateSelectedFrame(selectedName);

  if (renderer instanceof WebGLRenderer2D) {
    renderer.render(scene, camera, { spriteSorting: "texture" });
    const stats = renderer.getStats();
    statsOutput.textContent = [
      "renderer: WebGL2",
      `selectedFrame: ${selectedName}`,
      `atlas: ${atlasResult.stats.width}x${atlasResult.stats.height}`,
      `frames: ${atlasResult.stats.frameCount}`,
      `sprites: ${stats.objects}`,
      `textureBinds: ${stats.spriteTextureBinds}`,
      `drawCalls: ${stats.drawCalls}`
    ].join(" | ");
  } else {
    renderer.render(scene, camera);
    statsOutput.textContent = [
      "renderer: Canvas fallback",
      `selectedFrame: ${selectedName}`,
      `atlas: ${atlasResult.stats.width}x${atlasResult.stats.height}`,
      `frames: ${atlasResult.stats.frameCount}`,
      "sprites: 64"
    ].join(" | ");
  }
}

function updateSelectedFrame(selectedName: string): void {
  for (let index = 0; index < sprites.length; index += 1) {
    const spriteName = names[index % names.length];
    sprites[index]?.setOpacity(spriteName === selectedName ? 1 : 0.42);
  }
}

function createTile(fillColor: string, strokeColor: string): HTMLCanvasElement {
  const tile = document.createElement("canvas");
  const context = tile.getContext("2d");

  tile.width = 48;
  tile.height = 48;

  if (!context) {
    throw new Error("2D context not available.");
  }

  context.fillStyle = fillColor;
  context.fillRect(4, 4, 40, 40);
  context.strokeStyle = strokeColor;
  context.lineWidth = 4;
  context.strokeRect(4, 4, 40, 40);
  return tile;
}

renderScene();
