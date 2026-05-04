import type { StudioRendererMode, StudioRendererOption } from "./StudioRenderer.type";

export const studioRendererOptions: readonly StudioRendererOption[] = [
  {
    mode: "canvas",
    label: "Canvas",
    description: "Reference renderer"
  },
  {
    mode: "webgl",
    label: "WebGL",
    description: "Batch renderer"
  }
];

export function getStudioRendererLabel(mode: StudioRendererMode): string {
  return studioRendererOptions.find((option) => option.mode === mode)?.label ?? "Canvas";
}
