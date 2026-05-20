import fs from "fs/promises";
import path from "path";
import { dsaSheet } from "../src/data/placement/dsa-sheet";
import type { CompanySummary, PlacementDifficulty, PlacementProblem } from "../src/data/placement/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function companyNameFromFile(file: string) {
  return file
    .replace(/\.csv$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

async function main() {
  const companiesDir = path.join(process.cwd(), "data", "companies");
  const files = (await fs.readdir(companiesDir)).filter((file) => file.endsWith(".csv"));
  const companyQuestions: PlacementProblem[] = [];
  const companies: CompanySummary[] = [];

  for (const file of files) {
    const companySlug = file.replace(/\.csv$/, "");
    const company = companyNameFromFile(file);
    const content = await fs.readFile(path.join(companiesDir, file), "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean).slice(1);
    const summary: CompanySummary = { slug: companySlug, name: company, count: 0, easy: 0, medium: 0, hard: 0 };

    for (const line of lines) {
      const [id, url, title, difficultyRaw, acceptance, frequencyRaw] = parseCsvLine(line);
      if (!id || !title) continue;
      const difficulty = (["Easy", "Medium", "Hard"].includes(difficultyRaw) ? difficultyRaw : "Medium") as PlacementDifficulty;
      const slug = slugify(title);
      const topic = dsaSheet.find((problem) => problem.slug.startsWith(slug) || problem.title === title)?.topic ?? "Company";
      const topicSlug = slugify(topic);
      const frequency = Number.parseFloat((frequencyRaw || "0").replace("%", ""));

      companyQuestions.push({
        id: Number(id),
        slug,
        title,
        url,
        difficulty,
        topic,
        topicSlug,
        company,
        companySlug,
        acceptance,
        frequency,
        isPremium: false,
      });
      summary.count += 1;
      if (difficulty === "Easy") summary.easy += 1;
      if (difficulty === "Medium") summary.medium += 1;
      if (difficulty === "Hard") summary.hard += 1;
    }
    companies.push(summary);
  }

  const topics = Array.from(new Set(dsaSheet.map((problem) => problem.topic))).sort();
  const out = {
    generatedAt: new Date().toISOString(),
    questions: companyQuestions,
    dsa: dsaSheet,
    companies: companies.sort((a, b) => b.count - a.count),
    topics,
  };

  const outDir = path.join(process.cwd(), "public", "data");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "placement-questions.json"), JSON.stringify(out));
  console.log(`Wrote ${companyQuestions.length} company questions, ${dsaSheet.length} DSA problems, ${companies.length} companies.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
