# Raw2D MCP Aur Plugin Consumer Guide

Raw2D me automation ke do surface hain:

- `raw2d-mcp` ek installable package hai jo scene JSON, validation, inspection, aur examples generate karta hai.
- `plugins/raw2d` repo-local Codex plugin hai jo Raw2D contributors ke liye bana hai.

## MCP Kab Use Karein

Jab external agent ya script ko deterministic Raw2D data chahiye ho, tab `raw2d-mcp` use karein:

```bash
npm install raw2d-mcp raw2d
```

```ts
import { createRaw2DSceneJson, validateRaw2DScene } from "raw2d-mcp";

const document = createRaw2DSceneJson();
const result = validateRaw2DScene({ document });
```

MCP helpers JSON, generated code, ya command plans return karte hain. Ye draw nahi karte, Git push nahi karte, npm publish nahi karte, aur browser control nahi karte.

## Plugin Kab Use Karein

Jab aap Raw2D repo ke andar contribute kar rahe ho, tab repo plugin use karein:

```bash
node plugins/raw2d/scripts/run-docs-qa.mjs --json
node plugins/raw2d/scripts/create-raw2d-showcase.mjs --out /tmp/raw2d-showcase --renderer webgl
node plugins/raw2d/scripts/run-fresh-install-audit.mjs --dry-run --json
```

Plugin examples scaffold kar sakta hai, stats explain kar sakta hai, docs QA chala sakta hai, aur audit plans bana sakta hai. Version bump, tags, push, release notes, aur npm workflow checks release task ke under hi hone chahiye.

## Recommended Flow

1. MCP se scene JSON create ya inspect karein.
2. Us JSON se Canvas/WebGL snippets generate karein.
3. Plugin scripts se examples ya audit checks repo ke andar run karein.
4. Ready bolne se pehle browser aur visual checks run karein.
5. Push ya publish sirf tab karein jab task explicitly release bole.
