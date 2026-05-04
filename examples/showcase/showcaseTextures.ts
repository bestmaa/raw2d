import { Texture } from "raw2d";

export function createShowcaseTextures(): readonly Texture[] {
  return [
    createTexture("#35c2ff", "#e0f2fe"),
    createTexture("#f45b69", "#ffe4e6"),
    createTexture("#facc15", "#fef9c3"),
    createTexture("#7dd87d", "#dcfce7"),
    createTexture("#c084fc", "#f3e8ff")
  ];
}

function createTexture(fillColor: string, strokeColor: string): Texture {
  const source = document.createElement("canvas");
  source.width = 32;
  source.height = 32;
  const context = source.getContext("2d");

  if (!context) {
    throw new Error("Could not create showcase texture.");
  }

  context.fillStyle = fillColor;
  context.fillRect(5, 5, 22, 22);
  context.strokeStyle = strokeColor;
  context.lineWidth = 3;
  context.strokeRect(6.5, 6.5, 19, 19);

  return new Texture({ source, width: 32, height: 32 });
}
