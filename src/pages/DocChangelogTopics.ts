import type { DocTopic } from "./DocPage.type";

export const changelogTopics: readonly DocTopic[] = [
  {
    id: "changelog-workflow",
    label: "Changelog Workflow",
    title: "Changelog Workflow Notes",
    description: "Use this workflow to keep Raw2D release history readable and honest.",
    sections: [
      {
        title: "When To Update",
        body: "Update changelog notes during release tasks, API changes, renderer behavior changes, package export changes, and docs-hosting changes.",
        code: `API: constructor options, exports, method names
Renderer: Canvas/WebGL behavior or diagnostics
Packages: npm metadata, package files, focused exports
Docs: public route or deployment behavior`
      },
      {
        title: "Entry Shape",
        body: "Keep entries grouped by Added, Changed, Fixed, Breaking Changes, Known Limits, and Verification. Do not hide breaking changes inside Added.",
        code: `## vVERSION

### Added
### Changed
### Fixed
### Breaking Changes
### Known Limits
### Verification`
      },
      {
        title: "Source Of Truth",
        body: "The release task, git commits, tests, and release notes template should agree. If they disagree, fix the changelog before publishing.",
        code: `task.md
git log --oneline
docs/ReleaseNotesTemplate.md
npm test`
      }
    ]
  }
];
