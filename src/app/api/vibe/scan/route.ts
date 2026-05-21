import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type GitHubRepoRef = {
  owner: string;
  repo: string;
};

type TreeItem = {
  path: string;
  type: "blob" | "tree";
  size?: number;
};

const MAX_TREE_ITEMS = 220;
const IMPORTANT_FILES = [
  "package.json",
  "next.config.ts",
  "next.config.js",
  "vite.config.ts",
  "tsconfig.json",
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/main.tsx",
  "src/App.tsx",
  "server.js",
  "app.js",
  "README.md",
];

function parseGitHubUrl(value: string): GitHubRepoRef | null {
  try {
    const input = value.trim();
    const shorthand = input.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
    if (shorthand) return { owner: shorthand[1], repo: shorthand[2].replace(/\.git$/, "") };

    const url = new URL(input);
    if (!url.hostname.toLowerCase().includes("github.com")) return null;
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

async function githubJson<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Axiom-VibeLab",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function githubText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Axiom-VibeLab" },
    next: { revalidate: 300 },
  });
  if (!response.ok) return "";
  return response.text();
}

function groupTopFolders(tree: TreeItem[]) {
  const counts = new Map<string, number>();
  for (const item of tree) {
    const [top] = item.path.split("/");
    if (!top || top.includes(".")) continue;
    counts.set(top, (counts.get(top) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));
}

function inferStack(files: string[]) {
  const set = new Set(files);
  const joined = files.join("\n").toLowerCase();
  const stack: string[] = [];
  if (set.has("package.json")) stack.push("Node.js");
  if (set.has("next.config.ts") || set.has("next.config.js") || joined.includes("src/app/")) stack.push("Next.js");
  if (set.has("vite.config.ts") || set.has("vite.config.js")) stack.push("Vite");
  if (joined.includes(".tsx") || joined.includes(".jsx")) stack.push("React");
  if (set.has("tsconfig.json") || joined.includes(".ts")) stack.push("TypeScript");
  if (joined.includes("tailwind.config")) stack.push("Tailwind");
  if (joined.includes("requirements.txt") || joined.includes(".py")) stack.push("Python");
  if (joined.includes("dockerfile") || joined.includes("docker-compose")) stack.push("Docker");
  return [...new Set(stack)];
}

function makeTasks(repoName: string, files: string[], folders: { name: string; count: number }[]) {
  const hasTests = files.some((file) => /(^|\/)(__tests__|tests?|spec)\//i.test(file) || /\.(test|spec)\./i.test(file));
  const hasApi = files.some((file) => /(^|\/)(api|routes|server|app\/api)\//i.test(file));
  const firstFolder = folders[0]?.name || "src";

  return [
    {
      title: "Map the entrypoints",
      kind: "Architecture",
      difficulty: "Easy",
      description: `Identify how ${repoName} starts, routes requests, and renders its first screen.`,
    },
    {
      title: `Trace the ${firstFolder} boundary`,
      kind: "Code Reading",
      difficulty: "Easy",
      description: `Explain what belongs in ${firstFolder}/ and what should not cross that boundary.`,
    },
    {
      title: hasApi ? "Add an API contract test" : "Create a public API map",
      kind: "Testing",
      difficulty: "Medium",
      description: hasApi
        ? "Pick one route handler and write a success + failure contract test."
        : "Document the exported functions/components that external code depends on.",
    },
    {
      title: hasTests ? "Find the biggest test gap" : "Create the first test harness",
      kind: "Testing",
      difficulty: "Medium",
      description: hasTests
        ? "Compare the most important source files with existing tests and add the highest-leverage missing case."
        : "Introduce a minimal test setup and cover one pure function or component state transition.",
    },
    {
      title: "Ship a small refactor",
      kind: "Refactor",
      difficulty: "Medium",
      description: "Choose a 2-3 file refactor that improves naming or separation while preserving behavior.",
    },
  ];
}

async function generateAiSummary(input: {
  repo: string;
  description: string;
  stack: string[];
  folders: { name: string; count: number }[];
  files: string[];
  readme: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.API_KEY;
  if (!apiKey) return null;

  const response = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS || 1200),
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You generate concise repo-learning plans. Return valid JSON only.",
        },
        {
          role: "user",
          content: JSON.stringify({
            instruction: "Create a short repo brief, architecture notes, and 5 implementation tasks.",
            ...input,
            readme: input.readme.slice(0, 5000),
            files: input.files.slice(0, 120),
          }),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { repoUrl } = await request.json();
    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    const ref = parseGitHubUrl(repoUrl);
    if (!ref) {
      return NextResponse.json({ error: "Enter a valid GitHub repository URL or owner/repo" }, { status: 400 });
    }

    const repo = await githubJson<any>(`/repos/${ref.owner}/${ref.repo}`);
    const branch = repo.default_branch || "main";
    const treeData = await githubJson<any>(`/repos/${ref.owner}/${ref.repo}/git/trees/${branch}?recursive=1`);
    const tree = (treeData.tree || []) as TreeItem[];
    const files = tree
      .filter((item) => item.type === "blob")
      .map((item) => item.path)
      .slice(0, MAX_TREE_ITEMS);
    const importantFiles = IMPORTANT_FILES.filter((file) => files.includes(file));
    const folders = groupTopFolders(tree);
    const stack = inferStack(files);
    const readme = repo.default_branch
      ? await githubText(`https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${branch}/README.md`)
      : "";
    const fallbackTasks = makeTasks(repo.name, files, folders);
    const ai = await generateAiSummary({
      repo: `${ref.owner}/${ref.repo}`,
      description: repo.description || "",
      stack,
      folders,
      files,
      readme,
    });

    return NextResponse.json({
      success: true,
      scan: {
        repo: `${ref.owner}/${ref.repo}`,
        name: repo.name,
        description: repo.description || "No repository description provided.",
        url: repo.html_url,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        defaultBranch: branch,
        fileCount: tree.filter((item) => item.type === "blob").length,
        folderCount: folders.length,
        stack,
        folders,
        importantFiles,
        tasks: ai?.tasks || fallbackTasks,
        brief: ai?.brief || `A ${stack.join(", ") || "software"} repository with ${files.length} scanned files and ${folders.length} major folders.`,
        architectureNotes: ai?.architectureNotes || folders.map((folder) => `${folder.name}/ contains ${folder.count} scanned items.`),
        aiEnabled: Boolean(ai),
      },
    });
  } catch (error) {
    console.error("Vibe scan error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scan repository" },
      { status: 500 },
    );
  }
}
