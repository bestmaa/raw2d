import type { RenderCanvasObjectOptions } from "./renderCanvasObject.type.js";

export function renderCanvasObject(options: RenderCanvasObjectOptions): void {
  const handler = options.handlers.find((candidate) => candidate.canRender(options.object));

  if (handler) {
    handler.render(options.context, options.object);
  }
}
