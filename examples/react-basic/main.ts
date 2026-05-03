import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Raw2DCanvas } from "raw2d-react";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("React app root not found.");
}

createRoot(app).render(createElement(Raw2DCanvas, {
  ariaLabel: "Raw2D React basic canvas",
  backgroundColor: "#10141c",
  height: 360,
  renderer: "canvas",
  width: 640
}));
