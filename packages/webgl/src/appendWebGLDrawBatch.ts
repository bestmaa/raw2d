import type { WebGLDrawBatch } from "./WebGLDrawBatch.type.js";

export function appendWebGLDrawBatch(batches: WebGLDrawBatch[], batch: WebGLDrawBatch): void {
  if (batch.vertexCount <= 0) {
    return;
  }

  const lastBatch = batches.at(-1);

  if (lastBatch && lastBatch.key === batch.key && lastBatch.firstVertex + lastBatch.vertexCount === batch.firstVertex) {
    batches[batches.length - 1] = {
      ...lastBatch,
      vertexCount: lastBatch.vertexCount + batch.vertexCount
    };
    return;
  }

  batches.push(batch);
}

