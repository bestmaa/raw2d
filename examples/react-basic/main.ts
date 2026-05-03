import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Texture } from "raw2d";
import { Raw2DCanvas, RawCircle, RawLine, RawRect, RawSprite, RawText2D } from "raw2d-react";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("React app root not found.");
}

const spriteSource = document.createElement("canvas");
spriteSource.width = 32;
spriteSource.height = 32;
const context = spriteSource.getContext("2d");

if (!context) {
  throw new Error("Sprite source context not found.");
}

context.fillStyle = "#facc15";
context.fillRect(0, 0, 32, 32);

const texture = new Texture({ source: spriteSource, width: 32, height: 32 });

createRoot(app).render(createElement(Raw2DCanvas, {
  ariaLabel: "Raw2D React basic canvas",
  backgroundColor: "#10141c",
  height: 360,
  renderer: "canvas",
  width: 640
}, [
  createElement(RawRect, { fillColor: "#35c2ff", height: 88, key: "rect", width: 140, x: 80, y: 80 }),
  createElement(RawCircle, { fillColor: "#f45b69", key: "circle", radius: 42, x: 300, y: 124 }),
  createElement(RawLine, { endX: 220, endY: 0, key: "line", lineWidth: 5, strokeColor: "#f5f7fb", x: 80, y: 220 }),
  createElement(RawSprite, { key: "sprite", texture, x: 380, y: 96 }),
  createElement(RawText2D, { fillColor: "#f5f7fb", font: "28px sans-serif", key: "text", text: "Raw2D React", x: 80, y: 300 })
]));
