import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";

export interface CompactWebGLStaticRunsOptions {
  readonly runs: readonly WebGLRenderRun[];
}

export interface WebGLStaticRunCompactionResult {
  readonly runs: readonly WebGLRenderRun[];
  readonly inputRuns: number;
  readonly outputRuns: number;
  readonly compactedRuns: number;
  readonly mergedStaticObjects: number;
}
