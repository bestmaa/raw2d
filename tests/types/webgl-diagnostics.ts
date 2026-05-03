import type { WebGLDiagnostics as Raw2DWebGLDiagnostics } from "raw2d";
import type { WebGLDiagnostics, WebGLRenderStats, WebGLRenderer2DLike } from "raw2d-webgl";

declare const renderer: WebGLRenderer2DLike;
declare const diagnostics: WebGLDiagnostics;

const rendererName: "webgl2" = diagnostics.renderer;
const stats: WebGLRenderStats = diagnostics.stats;
const umbrellaDiagnostics: Raw2DWebGLDiagnostics = renderer.getDiagnostics();
const directDiagnostics: WebGLDiagnostics = renderer.getDiagnostics();

void rendererName;
void stats;
void umbrellaDiagnostics;
void directDiagnostics;
