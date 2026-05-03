import type { GenerateRaw2DExampleOptions, Raw2DMcpGeneratedExample } from "./generateRaw2DExample.type.js";
import { collectImports, createExampleHeader, createObjectCode, createRenderFooter } from "./generateRaw2DExampleHelpers.js";

export function generateRaw2DWebGLExample(options: GenerateRaw2DExampleOptions): Raw2DMcpGeneratedExample {
  const imports = collectImports(options.document.scene.objects, "WebGLRenderer2D");
  const objects = options.document.scene.objects.map((object, index) => createObjectCode(object, `object${index}`));

  return {
    renderer: "webgl2",
    code: [
      `import { ${imports.join(", ")} } from "raw2d";`,
      "",
      createExampleHeader(options, "WebGLRenderer2D"),
      "",
      ...objects.flatMap((objectCode) => [objectCode, ""]),
      createRenderFooter()
    ].join("\n")
  };
}
