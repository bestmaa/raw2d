import type { DocTopic } from "./DocPage.type";

export const mcpBeginnerTopics: readonly DocTopic[] = [
  {
    id: "mcp-beginner",
    label: "MCP Beginner",
    title: "MCP Beginner",
    description: "Use raw2d-mcp for scene JSON, validation, generated examples, and visual check plans.",
    sections: [
      {
        title: "Install",
        body: "Install raw2d-mcp separately when an AI tool or script needs deterministic scene helpers.",
        code: `npm install raw2d-mcp raw2d`
      },
      {
        title: "Create A Scene",
        body: "Start with a plain scene document. The result is JSON, not a hidden project edit.",
        code: `import { createRaw2DSceneJson } from "raw2d-mcp";

const document = createRaw2DSceneJson({
  camera: { x: 0, y: 0, zoom: 1 }
});`
      },
      {
        title: "Add A Rect",
        body: "Add objects through explicit data. An agent can show this JSON before writing any app files.",
        code: `import { addRaw2DSceneObject } from "raw2d-mcp";

const nextDocument = addRaw2DSceneObject({
  document,
  object: {
    type: "rect",
    id: "card",
    x: 80,
    y: 64,
    width: 160,
    height: 96,
    material: { fillColor: "#35c2ff" }
  }
});`
      },
      {
        title: "Validate And Inspect",
        body: "Validate before generating code. Inspect to see object counts and renderer hints.",
        code: `const validation = validateRaw2DScene({ document: nextDocument });
const inspection = inspectRaw2DScene({ document: nextDocument });

console.log(validation.valid);
console.log(inspection.objectCount);`
      },
      {
        title: "Generate Example",
        body: "Generate Canvas or WebGL code as plain text so the caller can review it.",
        code: `const example = generateRaw2DCanvasExample({ document: nextDocument });

console.log(example.code);`
      },
      {
        title: "Visual Check Plan",
        body: "Visual checks return command plans. The host app decides whether to run them.",
        code: `const plan = createRaw2DVisualCheckPlan({ target: "browser" });

console.log(plan.commands);`
      }
    ]
  }
];
