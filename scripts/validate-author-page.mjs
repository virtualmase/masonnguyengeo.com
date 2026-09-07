import { existsSync, readFileSync } from "node:fs";

const aboutSource = readFileSync("build-site.py", "utf8");
const aboutOutputPath = existsSync("built-about.html") ? "built-about.html" : "about/index.html";
const aboutOutput = readFileSync(aboutOutputPath, "utf8");
const sitemap = readFileSync("sitemap.xml", "utf8");
const llms = readFileSync("llms.txt", "utf8");

const requiredNames = [
  "Rand Fishkin",
  "Matt Cutts",
  "Tim Ferriss",
  "Chris Voss",
  "John C. Maxwell",
  "Gary Vaynerchuk",
  "Cal Newport",
  "Dale Carnegie",
  "Marcus Aurelius",
  "Grant Cardone",
  "Roger Dawson",
  "Paul Millerd",
  "Dr. Joe Dispenza",
];

const requiredLinks = [
  "https://sparktoro.com/team/rand",
  "https://developers.google.com/search/blog/authors/matt-cutts",
  "https://tim.blog/",
  "https://www.blackswanltd.com/never-split-the-difference",
  "https://www.maxwellleadership.com/",
  "https://garyvaynerchuk.com/",
  "https://calnewport.com/writing/",
  "https://www.dalecarnegie.com/en",
  "https://www.gutenberg.org/ebooks/2680",
  "https://grantcardone.com/",
  "https://rogerdawson.com/",
  "https://pmillerd.com/",
  "https://drjoedispenza.com/collections/books",
];

const assertPresent = (content, value, label) => {
  if (!content.includes(value)) {
    throw new Error(`Missing ${label}: ${value}`);
  }
};

for (const name of requiredNames) {
  assertPresent(aboutSource, name, "inspiration name in generator source");
  assertPresent(aboutOutput, name, "inspiration name in generated author page");
}

for (const url of requiredLinks) {
  assertPresent(aboutSource, url, "direct learning-resource URL");
  if (url.includes("?") || url.includes("affiliate") || url.includes("tag=")) {
    throw new Error(`Unexpected tracking or affiliate parameter: ${url}`);
  }
}

assertPresent(aboutSource, "Every resource on this page is a non-affiliate external link.", "non-affiliate disclosure");
assertPresent(aboutSource, "no health or medical claims are adopted here", "Dr. Joe Dispenza safety boundary");
assertPresent(sitemap, "<loc>https://www.masonnguyengeo.com/about</loc>", "author-page sitemap record");
assertPresent(llms, "Canonical identity: https://www.masonnguyengeo.com/#mason-nguyen", "AI-discovery identity record");

console.log("Author page validation passed.");
