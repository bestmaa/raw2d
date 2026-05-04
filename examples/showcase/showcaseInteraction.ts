import { InteractionController } from "raw2d";
import type { ShowcaseInteractionOptions, ShowcaseInteractionResult } from "./ShowcaseInteraction.type";

export function createShowcaseInteraction(options: ShowcaseInteractionOptions): ShowcaseInteractionResult {
  const controller = new InteractionController({
    canvas: options.canvas,
    scene: options.scene,
    camera: options.camera,
    width: options.width,
    height: options.height,
    minResizeWidth: 24,
    minResizeHeight: 16
  });

  controller.enableSelection();
  controller.enableDrag();
  controller.enableResize();

  return { controller };
}
