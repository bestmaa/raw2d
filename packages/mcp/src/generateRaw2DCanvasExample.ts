import type { GenerateRaw2DExampleOptions, Raw2DMcpGeneratedExample } from "./generateRaw2DExample.type.js";
import { collectImports, createExampleHeader, createObjectCode, createRenderFooter } from "./generateRaw2DExampleHelpers.js";

export function generateRaw2DCanvasExample(options: GenerateRaw2DExampleOptions): Raw2DMcpGeneratedExample {
  const imports = collectImports(options.document.scene.objects, "Canvas");
  const objects = options.document.scene.objects.map((object, index) => createObjectCode(object, `object${index}`));

  return {
    renderer: "canvas",
    code: [
      `import { ${imports.join(", ")} } from "raw2d";`,
      "",
      createExampleHeader(options, "Canvas"),
      "",
      ...objects.flatMap((objectCode) => [objectCode, ""]),
      createRenderFooter()
    ].join("\n")
  };
}
