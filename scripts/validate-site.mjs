import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const baseUrl = "https://www.masonnguyengeo.com";
const errors = [];
const excludedDirectories = new Set([".git", "node_modules", "public"]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return excludedDirectories.has(entry.name) ? [] : walk(join(directory, entry.name));
    }
    return entry.name === "index.html" ? [join(directory, entry.name)] : [];
  });
}

function routeFor(file) {
  const filePath = relative(root, file).replace(/\\/g, "/");
  if (filePath === "index.html") return "/";
  const directory = filePath.replace(/\/index\.html$/, "");
  return directory ? `/${directory}` : "/";
}

function canonicalFor(file) {
  const route = routeFor(file);
  return route === "/" ? baseUrl : `${baseUrl}${route}`;
}

function fail(message) {
  errors.push(message);
}

const indexableUrls = [];
for (const file of walk(root)) {
  const html = readFileSync(file, "utf8");
  const label = relative(root, file);
  const noindex = /<meta name="robots" content="[^\"]*noindex/i.test(html);
  if (noindex) continue;

  const expectedCanonical = canonicalFor(file);
  const canonical = html.match(/<link rel="canonical" href="([^\"]+)"/i)?.[1];
  if (canonical !== expectedCanonical) fail(`${label}: canonical must be ${expectedCanonical}`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${label}: missing page title`);
  if (!/<meta name="description" content="[^\"]+"/i.test(html)) fail(`${label}: missing meta description`);
  if (!/<h1[\s>]/i.test(html)) fail(`${label}: missing H1`);
  if (/\[(?:PAGE-SLUG|PAGE TITLE|META DESCRIPTION|YYYY-MM-DD)\]/i.test(html)) {
    fail(`${label}: contains unresolved template placeholder`);
  }

  for (const asset of html.matchAll(new RegExp(`${baseUrl.replaceAll(".", "\\.")}/assets/([^\"'\\s<]+)`, "g"))) {
    if (!existsSync(join(root, "assets", asset[1]))) fail(`${label}: missing local asset assets/${asset[1]}`);
  }
  indexableUrls.push(expectedCanonical);
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const expectedUrls = [...indexableUrls].sort();
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) {
  fail("sitemap.xml does not exactly match the self-canonical indexable page set; run npm run build:sitemap");
}

const robots = readFileSync(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`)) fail("robots.txt must reference the canonical sitemap URL");
if (robots.includes("https://masonnguyengeo.com")) fail("robots.txt still references the non-canonical host");

const llms = readFileSync(join(root, "llms.txt"), "utf8");
if (!llms.includes(`Canonical identity: ${baseUrl}/#mason-nguyen`)) fail("llms.txt is missing the canonical entity identity");

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site validation passed for ${expectedUrls.length} indexable pages.`);
