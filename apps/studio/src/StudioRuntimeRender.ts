import { Canvas, WebGLRenderer2D } from "raw2d";
import { createRuntimeSceneFromStudioState } from "./StudioRenderAdapter";
import { drawStudioResizeHandles } from "./StudioResize";
import type { StudioRuntimeRenderOptions, StudioRuntimeRenderResult } from "./StudioRuntimeRender.type";
import { createStudioStatsPanel } from "./StudioStats";

export function renderStudioRuntimeScene(options: StudioRuntimeRenderOptions): StudioRuntimeRenderResult {
  const runtime = createRuntimeSceneFromStudioState(options.sceneState);
  const target = createRenderer(options);
  const renderer = target.renderer;

  renderer.render(runtime.scene, runtime.camera);
  options.canvasElement.style.width = "100%";
  options.canvasElement.style.height = "100%";

  const stats = createStudioStatsPanel(options.rendererMode, renderer.getStats(), target.note ?? getStatsNote(renderer));

  if (renderer instanceof Canvas) {
    drawStudioResizeHandles(renderer.getContext(), options.sceneState, options.selectedObjectId);
  } else {
    renderer.dispose();
  }

  return { stats };
}

function createRenderer(options: StudioRuntimeRenderOptions): { readonly renderer: Canvas | WebGLRenderer2D; readonly note?: string } {
  const rendererOptions = {
    canvas: options.canvasElement,
    width: 800,
    height: 600,
    backgroundColor: "#0a121c"
  };

  if (options.rendererMode === "webgl") {
    try {
      return { renderer: new WebGLRenderer2D(rendererOptions) };
    } catch {
      return {
        renderer: new Canvas(rendererOptions),
        note: "WebGL2 unavailable; Canvas fallback rendered"
      };
    }
  }

  return { renderer: new Canvas(rendererOptions) };
}

function getStatsNote(renderer: Canvas | WebGLRenderer2D): string | undefined {
  if (renderer instanceof WebGLRenderer2D && renderer.getDiagnostics().contextLost) {
    return "WebGL context lost";
  }

  return undefined;
}
