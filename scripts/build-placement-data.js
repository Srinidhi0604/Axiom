const fs = require("fs");
const path = require("path");

const root = process.cwd();
const companiesDir = path.join(root, "data", "companies");
const outRoot = path.join(root, "public", "data", "placement");
const companyOutDir = path.join(outRoot, "companies");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function topicFromTitle(title) {
  const value = title.toLowerCase();
  if (/tree|bst|trie/.test(value)) return "Trees";
  if (/graph|island|course|path|network|clone/.test(value)) return "Graphs";
  if (/substring|string|anagram|palindrome|word/.test(value)) return "Strings";
  if (/stock|coin|robber|subsequence|dynamic|dp/.test(value)) return "Dynamic Programming";
  if (/search|sorted|median|rotate/.test(value)) return "Binary Search";
  if (/heap|top k|frequency|priority/.test(value)) return "Heaps";
  if (/stack|parentheses|queue/.test(value)) return "Stack/Queue";
  if (/interval|meeting/.test(value)) return "Intervals";
  if (/design|lru|cache|rate/.test(value)) return "Design";
  return "Arrays";
}

fs.mkdirSync(companyOutDir, { recursive: true });

const files = fs.readdirSync(companiesDir).filter((file) => file.endsWith(".csv"));
const companies = [];
let totalQuestions = 0;

for (const file of files) {
  const slug = file.replace(/\.csv$/, "");
  const name = titleCase(slug);
  const csv = fs.readFileSync(path.join(companiesDir, file), "utf8");
  const lines = csv.split(/\r?\n/).filter(Boolean).slice(1);
  const questions = [];
  const difficulty = { easy: 0, medium: 0, hard: 0 };

  for (const line of lines) {
    const [id, url, title, rawDifficulty, acceptance, frequency] = parseCsvLine(line);
    if (!id || !title) continue;
    const normalizedDifficulty = ["Easy", "Medium", "Hard"].includes(rawDifficulty) ? rawDifficulty : "Medium";
    const lower = normalizedDifficulty.toLowerCase();
    difficulty[lower] += 1;
    questions.push({
      id: Number(id),
      slug: slugify(title),
      title,
      url,
      difficulty: normalizedDifficulty,
      topic: topicFromTitle(title),
      acceptance,
      frequency,
      company: name,
      companySlug: slug,
    });
  }

  questions.sort((a, b) => Number.parseFloat(b.frequency || "0") - Number.parseFloat(a.frequency || "0"));
  totalQuestions += questions.length;
  companies.push({ slug, name, count: questions.length, ...difficulty });
  fs.writeFileSync(path.join(companyOutDir, `${slug}.json`), JSON.stringify({ slug, name, questions }));
}

companies.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
fs.writeFileSync(path.join(outRoot, "companies-index.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  totalQuestions,
  companies,
}));

console.log(`Wrote ${companies.length} companies and ${totalQuestions} questions to ${outRoot}`);
