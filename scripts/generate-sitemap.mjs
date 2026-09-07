import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const baseUrl = "https://www.masonnguyengeo.com";
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

const urls = walk(root)
  .filter((file) => {
    const html = readFileSync(file, "utf8");
    return !/<meta name="robots" content="[^\"]*noindex/i.test(html);
  })
  .map((file) => {
    const html = readFileSync(file, "utf8");
    const canonical = html.match(/<link rel="canonical" href="([^\"]+)"/i)?.[1];
    const expected = canonicalFor(file);
    if (canonical !== expected) {
      throw new Error(`${relative(root, file)} must be self-canonical (${expected}), received ${canonical ?? "none"}`);
    }
    return canonical;
  })
  .sort((a, b) => a.localeCompare(b));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${urls.length} canonical URLs.`);
