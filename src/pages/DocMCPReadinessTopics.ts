import type { DocTopic } from "./DocPage.type";

export const mcpReadinessTopics: readonly DocTopic[] = [
  {
    id: "mcp-plugin-readiness",
    label: "MCP Plugin Readiness",
    title: "Final MCP And Plugin Readiness Checklist",
    description: "Use this checklist before presenting Raw2D AI tooling as release-ready.",
    sections: [
      {
        title: "MCP Package",
        body: "Confirm raw2d-mcp builds, exposes stable tools, validates scene JSON, and never mutates input scene documents.",
        code: `npm run build --workspace raw2d-mcp
node --test tests/mcp/*.test.mjs`
      },
      {
        title: "Codex Plugin",
        body: "Confirm the plugin scaffold, manifest, commands, and skills remain outside runtime packages and are documented.",
        code: `plugins/raw2d-codex/.codex-plugin/plugin.json
plugins/raw2d-codex/skills/raw2d-doc-writer/SKILL.md
plugins/raw2d-codex/skills/raw2d-feature-builder/SKILL.md`
      },
      {
        title: "Skill Checks",
        body: "Each skill should state its job, verification rules, browser/manual check expectations, and file-size discipline.",
        code: `raw2d-doc-writer
raw2d-feature-builder
raw2d-visual-check
raw2d-package-audit`
      }
    ]
  }
];
