import type { StudioRendererBindingOptions } from "./StudioRendererBindings.type";

export function bindStudioRendererSwitch(options: StudioRendererBindingOptions): void {
  const buttons = options.root.querySelectorAll<HTMLButtonElement>("[data-renderer]");

  for (const button of buttons) {
    button.addEventListener("click", () => {
      options.onRendererMode(button.dataset.renderer === "webgl" ? "webgl" : "canvas");
    });
  }
}
