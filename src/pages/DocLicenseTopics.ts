import type { DocTopic } from "./DocPage.type";

export const licenseTopics: readonly DocTopic[] = [
  {
    id: "license",
    label: "License",
    title: "License",
    description: "Raw2D is open source under Apache-2.0 with copyright and attribution notices for Aditya Nandlal.",
    sections: [
      {
        title: "License Type",
        body: "Raw2D uses Apache-2.0. It allows use, modification, and redistribution, including commercial use, while preserving license and copyright notices.",
        code: `license: "Apache-2.0"`
      },
      {
        title: "Copyright",
        body: "The original Raw2D copyright holder is documented in package metadata and NOTICE files.",
        code: `Copyright 2026 Aditya Nandlal`
      },
      {
        title: "Attribution Files",
        body: "Redistributed copies should keep LICENSE and NOTICE. These files are included in every Raw2D npm workspace package.",
        code: `LICENSE
NOTICE`
      },
      {
        title: "Project Name",
        body: "The Apache-2.0 license covers code, not the Raw2D name or project identity. Forks should not present themselves as the official Raw2D project.",
        code: `Original project:
https://github.com/bestmaa/raw2d

Public documentation:
https://raw2d.com/doc`
      }
    ]
  }
];
