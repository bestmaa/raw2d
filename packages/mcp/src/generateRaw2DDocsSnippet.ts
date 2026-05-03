import { generateRaw2DCanvasExample } from "./generateRaw2DCanvasExample.js";
import { generateRaw2DWebGLExample } from "./generateRaw2DWebGLExample.js";
import { inspectRaw2DScene } from "./inspectRaw2DScene.js";
import type { GenerateRaw2DDocsSnippetOptions, Raw2DMcpDocsSnippet } from "./generateRaw2DDocsSnippet.type.js";

export function generateRaw2DDocsSnippet(options: GenerateRaw2DDocsSnippetOptions): Raw2DMcpDocsSnippet {
  const title = options.title ?? "Raw2D Scene Example";
  const renderer = options.renderer ?? "canvas";
  const inspection = inspectRaw2DScene({ document: options.document });
  const example =
    renderer === "webgl2"
      ? generateRaw2DWebGLExample({ document: options.document })
      : generateRaw2DCanvasExample({ document: options.document });

  return {
    title,
    markdown: [
      `## ${title}`,
      "",
      `Renderer: \`${renderer}\``,
      "",
      `Objects: \`${inspection.objectCount}\``,
      "",
      createObjectSummary(inspection.objectTypes),
      "",
      "```ts",
      example.code,
      "```"
    ].join("\n")
  };
}

function createObjectSummary(counts: Record<string, number>): string {
  const active = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `\`${type}\`: ${count}`);

  if (active.length === 0) {
    return "Scene has no objects yet.";
  }

  return `Object types: ${active.join(", ")}.`;
}
