export type AxiomVertical = {
  slug: string;
  title: string;
  label: string;
  href: string;
  accent: string;
  description: string;
  stats: string[];
  actions: { label: string; href: string }[];
};

export const axiomVerticals: AxiomVertical[] = [
  {
    slug: "college",
    title: "College Exam Prep",
    label: "College",
    href: "/college",
    accent: "#8dc9ad",
    description: "Semester-wise university preparation with syllabus modules, course maps, concept tasks, and exam practice.",
    stats: ["BMSIT catalog", "Departments", "Semester maps"],
    actions: [
      { label: "Open Courses", href: "/college" },
      { label: "Start Track", href: "/college#courses" },
    ],
  },
  {
    slug: "gate",
    title: "GATE & Competitive",
    label: "GATE",
    href: "/gate",
    accent: "#a59ade",
    description: "GATE CS practice, PYQ-style questions, mocks, formula cards, and readiness tracking.",
    stats: ["8 subjects", "PYQ practice", "Mocks"],
    actions: [
      { label: "Practice", href: "/gate/practice" },
      { label: "Mocks", href: "/gate/mock-tests" },
    ],
  },
  {
    slug: "papers",
    title: "Paper Labs",
    label: "Papers",
    href: "/papers",
    accent: "#06B6D4",
    description: "Research paper implementation tracks with coding workspaces, tests, readers, and paper-first learning.",
    stats: ["ML papers", "Implementation tasks", "Reader"],
    actions: [
      { label: "Browse Papers", href: "/papers" },
      { label: "Fundamentals", href: "/fundamentals" },
    ],
  },
  {
    slug: "placement",
    title: "PlacePrep",
    label: "Placements",
    href: "/placement",
    accent: "#ff7448",
    description: "DSA sheets, company questions, system design, LLD, SQL labs, and interview-ready implementation tracks.",
    stats: ["17,931 questions", "662 companies", "DSA + SD + LLD"],
    actions: [
      { label: "Open PlacePrep", href: "/placement" },
      { label: "Companies", href: "/placement/companies" },
    ],
  },
  {
    slug: "vibe",
    title: "Vibe Lab",
    label: "Vibe Lab",
    href: "/vibe",
    accent: "#10B981",
    description: "GitHub repo analysis, generated learning tasks, security labs, scaling drills, and startup-style implementation work.",
    stats: ["Repo scan", "Attack lab", "Scale plan"],
    actions: [
      { label: "Scan Repo", href: "/vibe" },
      { label: "Tasks", href: "/vibe/tasks/repo-learning" },
    ],
  },
];
