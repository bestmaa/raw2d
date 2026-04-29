import { Camera2D, Canvas, Scene, Sprite, TextureAtlasPacker } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const atlasResult = new TextureAtlasPacker({ padding: 2, edgeBleed: 1, sort: "area" }).packWithStats([
  { name: "cyan", source: createTile("#35c2ff", "#dce9ff") },
  { name: "red", source: createTile("#f45b69", "#ffd6dd") },
  { name: "green", source: createTile("#22c55e", "#bbf7d0") }
]);
const atlas = atlasResult.atlas;
const names = ["cyan", "red", "green"] as const;

for (let index = 0; index < 24; index += 1) {
  const name = names[index % names.length];
  scene.add(new Sprite({
    texture: atlas.texture,
    frame: atlas.getFrame(name),
    x: 80 + (index % 8) * 82,
    y: 90 + Math.floor(index / 8) * 92,
    width: 56,
    height: 56,
    origin: "center"
  }));
}

renderer.render(scene, camera);
console.log(atlasResult.stats);

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
