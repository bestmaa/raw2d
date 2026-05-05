import type { DocTopic } from "./DocPage.type";

export const darkOverflowTopics: readonly DocTopic[] = [
  {
    id: "dark-ui-overflow",
    label: "Dark UI Overflow",
    title: "Dark UI Overflow Audit",
    description: "Check docs, Studio, examples, benchmark, and showcase pages for dark UI overflow regressions.",
    sections: [
      {
        title: "Automated Check",
        body: "Run the route and CSS audit before beta releases. It checks critical dark UI routes and overflow contracts.",
        code: `npm run test:browser:dark-overflow`
      },
      {
        title: "Routes",
        body: "The audit covers docs, readme, benchmark, Studio, showcase, and a core example route.",
        code: `/doc
/readme
/benchmark
/studio
/examples/showcase/
/examples/canvas-basic/`
      },
      {
        title: "Manual Visual Pass",
        body: "Look for clipped text, hidden controls, wide code blocks, and panels that cannot scroll.",
        code: `Check:
dark background
no clipped text
scrollable code
scrollable side panels
Studio panels wrap and scroll`
      }
    ]
  }
];
