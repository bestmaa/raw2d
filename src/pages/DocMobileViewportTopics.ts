import type { DocTopic } from "./DocPage.type";

export const mobileViewportTopics: readonly DocTopic[] = [
  {
    id: "docs-mobile-viewport",
    label: "Mobile Docs",
    title: "Docs Mobile Viewport",
    description: "Verify docs navigation, search, code blocks, and live panels at phone width.",
    sections: [
      {
        title: "Automated Check",
        body: "Run the mobile docs check before beta releases. It starts Vite, opens `/doc`, `/readme`, and `/studio`, and audits the CSS contracts for docs and Studio mobile layout.",
        code: `npm run test:browser:mobile-docs`
      },
      {
        title: "Manual Width",
        body: "Use browser device mode at 390px width. The sidebar should move above content, search should fit, and code blocks should scroll horizontally.",
        code: `Viewport: 390 x 844
Routes:
/doc
/readme
/studio`
      },
      {
        title: "Pass Criteria",
        body: "The mobile check passes when content stays readable, controls do not overlap, and long examples do not force the whole page wider than the viewport.",
        code: `Check:
navigation visible
search usable
code scrolls
live panel stacks
Studio grid stacks`
      }
    ]
  }
];
