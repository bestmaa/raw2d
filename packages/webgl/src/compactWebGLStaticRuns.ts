import type { CompactWebGLStaticRunsOptions, WebGLStaticRunCompactionResult } from "./compactWebGLStaticRuns.type.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";

export function compactWebGLStaticRuns(options: CompactWebGLStaticRunsOptions): WebGLStaticRunCompactionResult {
  const runs: WebGLRenderRun[] = [];
  let compactedRuns = 0;
  let mergedStaticObjects = 0;

  for (const run of options.runs) {
    const previous = runs[runs.length - 1];

    if (previous && canCompactStaticRuns(previous, run)) {
      runs[runs.length - 1] = {
        kind: previous.kind,
        mode: previous.mode,
        items: [...previous.items, ...run.items]
      };
      compactedRuns += 1;
      mergedStaticObjects += run.items.length;
    } else {
      runs.push(run);
    }
  }

  return {
    runs,
    inputRuns: options.runs.length,
    outputRuns: runs.length,
    compactedRuns,
    mergedStaticObjects
  };
}

function canCompactStaticRuns(first: WebGLRenderRun, second: WebGLRenderRun): boolean {
  return first.mode === "static" &&
    second.mode === "static" &&
    first.kind === second.kind &&
    isCompactionKind(first.kind);
}

function isCompactionKind(kind: WebGLRenderRun["kind"]): boolean {
  return kind === "shape" || kind === "sprite";
}
