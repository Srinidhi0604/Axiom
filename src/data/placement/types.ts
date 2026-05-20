export type PlacementDifficulty = "Easy" | "Medium" | "Hard";

export type PlacementProblem = {
  id: number;
  slug: string;
  title: string;
  url: string;
  difficulty: PlacementDifficulty;
  topic: string;
  topicSlug: string;
  company?: string;
  companySlug?: string;
  frequency?: number;
  acceptance?: string;
  solutionUrl?: string;
  isPremium?: boolean;
  isDsaSheet?: boolean;
};

export type CompanySummary = {
  slug: string;
  name: string;
  count: number;
  easy: number;
  medium: number;
  hard: number;
};

export type PlacementData = {
  generatedAt: string;
  questions: PlacementProblem[];
  dsa: PlacementProblem[];
  companies: CompanySummary[];
  topics: string[];
};
