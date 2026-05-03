import { Camera2D, Canvas, Scene, Sprite, Texture, WebGLRenderer2D, isWebGL2Available } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");

if (!canvasElement || !statsElement) {
  throw new Error("Example elements not found.");
}

const statsOutput = statsElement;
const scene = new Scene();
const camera = new Camera2D();
const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" })
  : new Canvas({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" });
const textures = [
  createTexture("#35c2ff", "#e0f2fe"),
  createTexture("#f45b69", "#ffe4e6"),
  createTexture("#facc15", "#fef9c3")
];

for (let index = 0; index < 240; index += 1) {
  const sprite = new Sprite({
    x: 28 + (index % 40) * 18,
    y: 44 + Math.floor(index / 40) * 58,
    width: 14,
    height: 38,
    texture: textures[index % textures.length]
  });
  sprite.setRenderMode("static");
  scene.add(sprite);
}

function animate(): void {
  if (renderer instanceof WebGLRenderer2D) {
    renderer.render(scene, camera, { spriteSorting: "texture" });
    const stats = renderer.getStats();
    statsOutput.textContent = [
      "renderer: WebGL2",
      `objects: ${stats.objects}`,
      `drawCalls: ${stats.drawCalls}`,
      `spriteBatches: ${stats.spriteBatches}`,
      `textureBinds: ${stats.spriteTextureBinds}`,
      `bindReduction: ${stats.spriteTextureBindReduction}`
    ].join(" | ");
  } else {
    renderer.render(scene, camera);
    statsOutput.textContent = "Canvas fallback: WebGL2 is not available.";
  }

  requestAnimationFrame(animate);
}

function createTexture(fillColor: string, strokeColor: string): Texture {
  const source = document.createElement("canvas");
  source.width = 32;
  source.height = 32;
  const context = source.getContext("2d");

  if (!context) {
    throw new Error("Could not create texture source.");
  }

  context.fillStyle = fillColor;
  context.fillRect(4, 4, 24, 24);
  context.strokeStyle = strokeColor;
  context.lineWidth = 3;
  context.strokeRect(5.5, 5.5, 21, 21);

  return new Texture({ source, width: 32, height: 32 });
}

animate();
