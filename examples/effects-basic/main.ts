import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Rect,
  Scene,
  Text2D,
  createBlurEffect,
  createGrayscaleEffect,
  createOpacityEffect,
  createShadowEffect
} from "raw2d";
import type { Object2D, Raw2DEffect } from "raw2d";
import { createWebGLEffectPassPlan } from "raw2d-webgl";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");
const statsElement = document.querySelector<HTMLPreElement>("#raw2d-stats");
const planElement = document.querySelector<HTMLPreElement>("#raw2d-webgl-plan");
const toggleButton = document.querySelector<HTMLButtonElement>("#raw2d-toggle-effects");

if (!canvasElement || !statsElement || !planElement || !toggleButton) {
  throw new Error("Effects example elements not found.");
}

const statsOutput = statsElement;
const planOutput = planElement;
const effectToggle = toggleButton;

const renderer = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 480,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();
const effectsByName = new Map<string, readonly Raw2DEffect[]>();

let effectsEnabled = true;
let frame = 0;

const panel = new Rect({
  name: "shadow-panel",
  x: 130,
  y: 110,
  width: 250,
  height: 160,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
const orb = new Circle({
  name: "soft-orb",
  x: 520,
  y: 190,
  radius: 72,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});
const label = new Text2D({
  name: "tone-label",
  x: 126,
  y: 340,
  text: "Canvas effects",
  font: "34px sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
});

scene.add(panel).add(orb).add(label);
effectsByName.set("shadow-panel", [createShadowEffect({ color: "rgba(0,0,0,0.42)", blur: 18, offsetX: 14, offsetY: 14 })]);
effectsByName.set("soft-orb", [createOpacityEffect(0.72), createBlurEffect(1.2)]);
effectsByName.set("tone-label", [createGrayscaleEffect(0.55)]);

effectToggle.addEventListener("click", (): void => {
  effectsEnabled = !effectsEnabled;
  effectToggle.textContent = effectsEnabled ? "Disable effects" : "Enable effects";
});

function animate(): void {
  frame += 1;
  panel.rotation = Math.sin(frame / 90) * 0.08;
  orb.y = 190 + Math.sin(frame / 36) * 28;

  renderer.render(scene, camera, effectsEnabled ? { effects: getEffects } : {});
  writeStats();
  requestAnimationFrame(animate);
}

function getEffects(object: Object2D): readonly Raw2DEffect[] {
  if (!effectsEnabled) {
    return [];
  }

  return effectsByName.get(object.name) ?? [];
}

function writeStats(): void {
  const stats = renderer.getStats();
  const effectList = [...effectsByName.values()].flat();
  const plan = createWebGLEffectPassPlan({ effects: effectList });

  statsOutput.textContent = [
    "renderer: Canvas",
    `effects: ${effectsEnabled ? "enabled" : "disabled"}`,
    `objects: ${stats.objects}`,
    `drawCalls: ${stats.drawCalls}`,
    `frame: ${frame}`
  ].join(" | ");

  planOutput.textContent = [
    "WebGL support plan",
    `inline: ${plan.inlinePasses.map((pass) => pass.effectType).join(", ") || "none"}`,
    `shader-pass: ${plan.shaderPasses.map((pass) => pass.effectType).join(", ") || "none"}`,
    `requiresFramebuffer: ${plan.requiresFramebuffer}`
  ].join("\n");
}

animate();
