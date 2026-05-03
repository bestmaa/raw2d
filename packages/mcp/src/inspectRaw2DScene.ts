import type { InspectRaw2DSceneOptions, Raw2DMcpObjectTypeCounts, Raw2DMcpSceneInspection } from "./inspectRaw2DScene.type.js";

export function inspectRaw2DScene(options: InspectRaw2DSceneOptions): Raw2DMcpSceneInspection {
  const counts = createEmptyCounts();

  for (const object of options.document.scene.objects) {
    counts[object.type] += 1;
  }

  const usesTextures = counts.sprite > 0;
  const usesText = counts.text2d > 0;

  return {
    objectCount: options.document.scene.objects.length,
    objectTypes: counts,
    usesTextures,
    usesText,
    rendererHints: createRendererHints(counts)
  };
}

function createEmptyCounts(): Raw2DMcpObjectTypeCounts {
  return {
    rect: 0,
    circle: 0,
    line: 0,
    text2d: 0,
    sprite: 0
  };
}

function createRendererHints(counts: Raw2DMcpObjectTypeCounts): readonly string[] {
  const hints: string[] = [];

  if (counts.sprite > 0) {
    hints.push("Sprites benefit from texture atlas batching in WebGL.");
  }

  if (counts.text2d > 0) {
    hints.push("Text2D uses cached textures in WebGL and direct text drawing in Canvas.");
  }

  if (counts.rect + counts.circle + counts.line > 100) {
    hints.push("Many primitive objects are a good WebGL batching candidate.");
  }

  return hints;
}
