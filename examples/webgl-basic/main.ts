import { BasicMaterial, Camera2D, Canvas, Rect, Scene, WebGLRenderer2D, isWebGL2Available } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLParagraphElement>("#raw2d-stats");

if (!canvasElement || !statsElement) {
  throw new Error("Example elements not found.");
}

const statsOutput = statsElement;
const scene = new Scene();
const camera = new Camera2D();
const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" })
  : new Canvas({ canvas: canvasElement, width: 800, height: 480, backgroundColor: "#10141c" });

for (let index = 0; index < 180; index += 1) {
  scene.add(new Rect({
    x: 24 + (index % 30) * 24,
    y: 42 + Math.floor(index / 30) * 42,
    width: 16,
    height: 28,
    material: new BasicMaterial({ fillColor: index % 2 === 0 ? "#35c2ff" : "#f45b69" })
  }));
}

function animate(): void {
  renderer.render(scene, camera);

  if (renderer instanceof WebGLRenderer2D) {
    const stats = renderer.getStats();
    statsOutput.textContent = `WebGL2 drawCalls=${stats.drawCalls} objects=${stats.objects}`;
  } else {
    statsOutput.textContent = "Canvas fallback: WebGL2 is not available.";
  }

  requestAnimationFrame(animate);
}

animate();
