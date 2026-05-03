import type { DocTopic } from "./DocPage.type";

export const reactReadinessTopics: readonly DocTopic[] = [
  {
    id: "react-readiness-checklist",
    label: "React Readiness",
    title: "Final React Package Readiness Checklist",
    description: "Use this checklist before presenting raw2d-react as ready for early users.",
    sections: [
      {
        title: "Package Boundary",
        body: "raw2d-react should stay as an adapter package. It must not move React into core, canvas, webgl, sprite, or text packages.",
        code: `raw2d-react depends on React
raw2d-core stays React-free
raw2d-canvas stays React-free
raw2d-webgl stays React-free`
      },
      {
        title: "Consumer Build",
        body: "The React consumer smoke test must build. JSX primitives should map to Raw2D objects without hiding the renderer pipeline.",
        code: `npm run build --workspace raw2d-react
node --test tests/react/*.test.mjs`
      },
      {
        title: "Docs",
        body: "React docs should explain that the package is optional, early, and separate from the browser-first Raw2D runtime.",
        code: `http://localhost:5197/doc#react-package-design
http://localhost:5197/examples/react-basic/`
      }
    ]
  }
];
