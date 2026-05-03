import type { DocTopic } from "./DocPage.type";

export const accessibilityTopics: readonly DocTopic[] = [
  {
    id: "docs-accessibility-checklist",
    label: "Accessibility Checklist",
    title: "Docs Accessibility Smoke Checklist",
    description: "Use this checklist before accepting docs UI or live control changes.",
    sections: [
      {
        title: "Keyboard Navigation",
        body: "Use Tab, Shift+Tab, Enter, and Escape across search, language toggle, topic links, code toggles, and live example controls.",
        code: `Tab through /doc
Shift+Tab back through controls
Enter opens selected controls
Escape closes temporary UI when present`
      },
      {
        title: "Readable Controls",
        body: "Controls must have visible focus, readable labels, enough contrast, and no clipped text at desktop or mobile widths.",
        code: `Search input
English/Hinglish toggle
Left docs navigation
Code details toggles
Right live controls`
      },
      {
        title: "Canvas Examples",
        body: "Canvas and WebGL examples should include nearby text that explains the visible result. The canvas itself does not replace docs text.",
        code: `Rect live controls
WebGL benchmark stats
Interaction selected state
Visual test result text`
      },
      {
        title: "Smoke Routes",
        body: "Check the main docs routes in a browser at desktop and narrow widths before committing.",
        code: `http://localhost:5197/doc
http://localhost:5197/doc#canvas-init
http://localhost:5197/doc#webgl-renderer
http://localhost:5197/doc#interaction-controller`
      }
    ]
  }
];
