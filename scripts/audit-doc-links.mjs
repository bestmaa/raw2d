import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const docsDir = join(root, "docs");
const srcPagesDir = join(root, "src", "pages");
const failures = [];

const readText = (path) => readFileSync(path, "utf8");

const walk = (dir, predicate) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(path, predicate));
      continue;
    }

    if (predicate(path)) {
      files.push(path);
    }
  }

  return files;
};

const addFailure = (path, message) => {
  failures.push(`${relative(root, path)}: ${message}`);
};

const collectDocTopicIds = () => {
  const ids = new Set();
  const topicFiles = walk(srcPagesDir, (path) => /Doc.*Topics\.ts$/.test(path) || path.endsWith("DocTopics.ts"));

  for (const file of topicFiles) {
    const source = readText(file);
    const matches = source.matchAll(/\bid:\s*"([^"]+)"/g);

    for (const match of matches) {
      ids.add(match[1]);
    }
  }

  return ids;
};

const collectReadmeIds = (fileName) => {
  const file = join(srcPagesDir, fileName);
  const ids = new Set();
  const source = readText(file);
  const matches = source.matchAll(/\bid:\s*"([^"]+)"/g);

  for (const match of matches) {
    ids.add(match[1]);
  }

  return ids;
};

const verifyReadmeImports = (fileName) => {
  const file = join(srcPagesDir, fileName);
  const source = readText(file);
  const imports = source.matchAll(/from\s+"..\/..\/docs\/([^"]+)\.md\?raw"/g);

  for (const match of imports) {
    const markdownPath = join(docsDir, `${match[1]}.md`);

    if (!existsSync(markdownPath)) {
      addFailure(file, `missing imported markdown docs/${match[1]}.md`);
    }
  }
};

const findInternalLinks = (source) => source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);

const stripLinkDecorations = (href) => href.split(/[?#]/)[0].trim();

const verifyRelativeMarkdownLink = (file, href) => {
  const cleanHref = stripLinkDecorations(href);

  if (!cleanHref.endsWith(".md")) {
    return;
  }

  const target = normalize(join(dirname(file), cleanHref));

  if (!target.startsWith(docsDir) || !existsSync(target) || !statSync(target).isFile()) {
    addFailure(file, `dead markdown link ${href}`);
  }
};

const verifyDocRouteLink = (file, href, topicIds) => {
  const match = href.match(/(?:https:\/\/raw2d\.com)?\/doc#([^)\s]+)/);

  if (match && !topicIds.has(match[1])) {
    addFailure(file, `unknown /doc topic ${match[1]}`);
  }
};

const verifyReadmeRouteLink = (file, href, readmeIds) => {
  const match = href.match(/(?:https:\/\/raw2d\.com)?\/readme#([^)\s]+)/);

  if (match && !readmeIds.has(match[1])) {
    addFailure(file, `unknown /readme topic ${match[1]}`);
  }
};

const verifyExampleRouteLink = (file, href) => {
  const match = href.match(/(?:https:\/\/raw2d\.com)?\/examples\/([^)\s#?]+)/);

  if (!match) {
    return;
  }

  const examplePath = join(root, "examples", match[1]);

  if (!existsSync(examplePath)) {
    addFailure(file, `unknown example route ${match[1]}`);
  }
};

const auditMarkdownLinks = () => {
  const topicIds = collectDocTopicIds();
  const readmeIds = new Set([...collectReadmeIds("ReadmeDocs.ts"), ...collectReadmeIds("ReadmeHinglishDocs.ts")]);
  const markdownFiles = walk(docsDir, (path) => path.endsWith(".md"));

  for (const file of markdownFiles) {
    const source = readText(file);

    for (const match of findInternalLinks(source)) {
      const href = match[1].trim();

      verifyRelativeMarkdownLink(file, href);
      verifyDocRouteLink(file, href, topicIds);
      verifyReadmeRouteLink(file, href, readmeIds);
      verifyExampleRouteLink(file, href);
    }
  }

  return { markdownFiles: markdownFiles.length, readmeIds: readmeIds.size, topicIds: topicIds.size };
};

verifyReadmeImports("ReadmeDocs.ts");
verifyReadmeImports("ReadmeHinglishDocs.ts");
const result = auditMarkdownLinks();

if (failures.length > 0) {
  console.error("Docs link audit failed:");
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(
  `Docs link audit passed: ${result.markdownFiles} markdown files, ${result.topicIds} doc topics, ${result.readmeIds} readme topics.`
);
