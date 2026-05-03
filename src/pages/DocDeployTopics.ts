import type { DocTopic } from "./DocPage.type";

export const deployTopics: readonly DocTopic[] = [
  {
    id: "docs-deploy-checklist",
    label: "Docs Deploy Checklist",
    title: "Cloudflare Docs Deploy Checklist",
    description: "Use this checklist after pushing docs changes to Cloudflare Workers static assets.",
    sections: [
      {
        title: "Build Settings",
        body: "Cloudflare should build docs with the docs build command from the repository root and deploy the generated dist assets.",
        code: `Build command: npm run build:docs
Deploy command: npx wrangler deploy
Output/assets directory: dist`
      },
      {
        title: "Route Verification",
        body: "Check both the workers.dev preview and the production custom domain. The /doc route must load the Raw2D docs app, not a placeholder page.",
        code: `https://raw2d.bestemplin.workers.dev/doc
https://raw2d.com/doc
https://raw2d.com/readme
https://raw2d.com/benchmark
https://raw2d.com/visual-test`
      },
      {
        title: "Redirects And Assets",
        body: "Confirm redirects do not loop, asset URLs return 200, and deep hash routes work after a hard refresh.",
        code: `curl -I https://raw2d.com/doc
curl -I https://raw2d.com/assets/
curl -I https://raw2d.com/examples/canvas-basic/`
      },
      {
        title: "Failure Checks",
        body: "If deploy fails, check wrangler output for workspace-root detection, invalid _redirects rules, stale commit deploys, or wrong route binding.",
        code: `wrangler deploy
Cloudflare Pages/Workers deployment log
Workers & Pages -> Domains & Routes`
      }
    ]
  }
];
