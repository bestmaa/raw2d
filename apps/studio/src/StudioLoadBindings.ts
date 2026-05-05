import { readStudioSceneFile } from "./StudioLoad";
import type { StudioSceneLoadBindingOptions } from "./StudioLoad.type";

export function bindStudioSceneLoadInput(options: StudioSceneLoadBindingOptions): void {
  const input = options.root.querySelector<HTMLInputElement>("[data-scene-load-input]");

  input?.addEventListener("change", () => {
    const file = input.files?.[0];
    input.value = "";

    if (!file) {
      return;
    }

    void readStudioSceneFile(file)
      .then(options.onSceneLoaded)
      .catch((error: unknown) => {
        options.onLoadError?.(error instanceof Error ? error : new Error("Studio scene load failed."));
      });
  });
}

export function clickStudioSceneLoadInput(root: HTMLElement): void {
  root.querySelector<HTMLInputElement>("[data-scene-load-input]")?.click();
}
