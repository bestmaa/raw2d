import { BasicMaterial, Circle, Line, Rect, Scene } from "raw2d";
import type { BenchmarkSceneOptions } from "./BenchmarkScene.type";

const columns = 20;
const cellWidth = 17;
const cellHeight = 24;

export function createBenchmarkScene(options: BenchmarkSceneOptions): Scene {
  const scene = new Scene();
  const materialA = new BasicMaterial({ fillColor: "#35c2ff" });
  const materialB = new BasicMaterial({ fillColor: "#f45b69" });

  for (let index = 0; index < options.objectCount; index += 1) {
    const material = index % 2 === 0 ? materialA : materialB;
    const x = 12 + (index % columns) * cellWidth;
    const y = 16 + Math.floor(index / columns) * cellHeight;
    const renderMode = index < options.objectCount * 0.72 ? "static" : "dynamic";

    if (options.objectKind === "mixed" && index % 3 === 2) {
      scene.add(new Line({ x, y: y + 8, endX: 12, endY: 0, renderMode, material }));
    } else if (options.objectKind === "circle" || (options.objectKind === "mixed" && index % 3 === 1)) {
      scene.add(new Circle({ x: x + 5, y: y + 7, radius: 6, renderMode, material }));
    } else {
      scene.add(new Rect({ x, y, width: 11, height: 16, renderMode, material }));
    }
  }

  return scene;
}
