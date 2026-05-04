import { createElement, useState, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { Texture } from "raw2d";
import { Raw2DCanvas, RawCircle, RawLine, RawRect, RawSprite, RawText2D } from "raw2d-react";

const app = document.querySelector<HTMLDivElement>("#app");
const texture = new Texture({ source: createSpriteSource(), width: 32, height: 32 });

if (!app) {
  throw new Error("React app root not found.");
}

createRoot(app).render(createElement(ReactExample));

function ReactExample(): ReactElement {
  const [compact, setCompact] = useState(false);
  const rectWidth = compact ? 92 : 140;
  const circleX = compact ? 250 : 300;
  const spriteX = compact ? 340 : 430;
  const label = compact ? "Compact React scene" : "Raw2D React";

  return createElement("div", { className: "example-runtime" }, [
    createElement("div", { key: "stage" }, [
      createElement(Raw2DCanvas, {
        ariaLabel: "Raw2D React basic canvas",
        backgroundColor: "#10141c",
        height: 360,
        key: "canvas",
        renderer: "canvas",
        width: 640
      }, createSceneChildren({ compact, rectWidth, circleX, spriteX, label })),
      createElement("pre", { id: "raw2d-stats", key: "stats" }, [
        "renderer: canvas | package: raw2d-react\n",
        `objects: 5 | compact: ${compact ? "on" : "off"}`
      ])
    ]),
    createElement("aside", { className: "example-info", key: "info" }, [
      createElement("h2", { key: "heading" }, "React bridge"),
      createElement("pre", { key: "install" }, "npm install raw2d raw2d-react react react-dom"),
      createElement("pre", { key: "import" }, "import { Raw2DCanvas, RawRect } from \"raw2d-react\";"),
      createElement("div", { className: "example-actions", key: "actions" }, [
        createElement("button", {
          id: "toggle-layout",
          key: "toggle",
          onClick: (): void => setCompact((value) => !value),
          type: "button"
        }, "Toggle layout"),
        createElement("button", {
          id: "reset-layout",
          key: "reset",
          onClick: (): void => setCompact(false),
          type: "button"
        }, "Reset")
      ]),
      createElement("pre", { key: "note" }, "Raw2D objects stay in the scene.\nReact props update their data, then the renderer redraws.")
    ])
  ]);
}

function createSceneChildren(options: SceneChildrenOptions): readonly ReactElement[] {
  return [
    createElement(RawRect, {
      fillColor: "#35c2ff",
      height: options.compact ? 70 : 88,
      key: "rect",
      strokeColor: "#dce9ff",
      width: options.rectWidth,
      x: 80,
      y: 80
    }),
    createElement(RawCircle, {
      fillColor: "#f45b69",
      key: "circle",
      radius: options.compact ? 34 : 42,
      x: options.circleX,
      y: 124
    }),
    createElement(RawLine, {
      endX: options.compact ? 160 : 220,
      endY: 0,
      key: "line",
      lineWidth: 5,
      strokeColor: "#f5f7fb",
      x: 80,
      y: 220
    }),
    createElement(RawSprite, { key: "sprite", texture, x: options.spriteX, y: 96 }),
    createElement(RawText2D, {
      fillColor: "#f5f7fb",
      font: "28px sans-serif",
      key: "text",
      text: options.label,
      x: 80,
      y: 300
    })
  ];
}

function createSpriteSource(): HTMLCanvasElement {
  const source = document.createElement("canvas");
  const context = source.getContext("2d");
  source.width = 32;
  source.height = 32;

  if (!context) {
    throw new Error("Sprite source context not found.");
  }

  context.fillStyle = "#facc15";
  context.fillRect(0, 0, 32, 32);
  context.strokeStyle = "#fff7ad";
  context.lineWidth = 4;
  context.strokeRect(2, 2, 28, 28);
  return source;
}

interface SceneChildrenOptions {
  readonly compact: boolean;
  readonly rectWidth: number;
  readonly circleX: number;
  readonly spriteX: number;
  readonly label: string;
}
