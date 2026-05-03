import type { DocTopic } from "./DocPage.type";

export const docQaChecklistTopics: readonly DocTopic[] = [
  {
    id: "docs-qa-checklist",
    label: "Docs QA Checklist",
    title: "Docs QA Checklist",
    description: "Use this checklist before a docs or release task is marked done.",
    sections: [
      {
        title: "Run Automated Checks",
        body: "Start with the commands that prove TypeScript, tests, docs build, package packing, and consumer imports are healthy.",
        code: `npm run typecheck
npm test
npm run build:docs
npm run pack:check -- --silent
npm run test:consumer`
      },
      {
        title: "Open Docs In Browser",
        body: "Open the docs route after changes. Check the edited topic, sidebar state, search, language switch, code blocks, and live examples.",
        code: `npm run dev -- --host 0.0.0.0 --port 5197

http://localhost:5197/doc`
      },
      {
        title: "Check Feature Examples",
        body: "Every feature topic should have a small code block, and practical topics should include a full example or focused live example.",
        code: `// Good doc flow:
// 1. Short explanation
// 2. Small focused code
// 3. Full setup example when needed
// 4. Browser verification`
      },
      {
        title: "Check File Rules",
        body: "Before commit, keep edited source files below 250 lines and make sure public modules keep isolated type files.",
        code: `find src packages -name "*.ts" -not -path "*/dist/*" \\
  -exec wc -l {} + | sort -nr | head`
      },
      {
        title: "Commit Only After Verify",
        body: "Mark the task completed only after checks pass. Commit the focused change, but push only on a release task or when requested.",
        code: `git diff --check
git status --short
git commit -m "Add docs QA checklist"`
      }
    ]
  }
];
