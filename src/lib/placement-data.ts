import type { PlacementData, PlacementProblem } from "@/data/placement/types";

let cachedPlacementData: Promise<PlacementData> | null = null;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function companyNameFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPlacementData() {
  if (!cachedPlacementData) {
    cachedPlacementData = fetch("/data/placement-questions.json", { cache: "force-cache" }).then((response) => {
      if (!response.ok) throw new Error("Unable to load placement questions");
      return response.json() as Promise<PlacementData>;
    });
  }
  return cachedPlacementData;
}

export function filterProblems(
  problems: PlacementProblem[],
  filters: { search?: string; topic?: string; difficulty?: string; company?: string; solved?: "all" | "solved" | "unsolved"; solvedSet?: Set<string> }
) {
  const search = filters.search?.toLowerCase().trim();
  return problems.filter((problem) => {
    if (search && !`${problem.title} ${problem.topic} ${problem.company ?? ""}`.toLowerCase().includes(search)) return false;
    if (filters.topic && filters.topic !== "all" && problem.topicSlug !== filters.topic) return false;
    if (filters.difficulty && filters.difficulty !== "all" && problem.difficulty !== filters.difficulty) return false;
    if (filters.company && filters.company !== "all" && problem.companySlug !== filters.company) return false;
    if (filters.solved && filters.solved !== "all") {
      const isSolved = filters.solvedSet?.has(problem.slug) ?? false;
      if (filters.solved === "solved" && !isSolved) return false;
      if (filters.solved === "unsolved" && isSolved) return false;
    }
    return true;
  });
}
