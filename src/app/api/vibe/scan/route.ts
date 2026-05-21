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

function makeMermaidFlowchart(
  repoName: string,
  stack: string[],
  folders: { name: string; count: number }[],
  files: string[]
): string {
  const joined = files.join("\n").toLowerCase();
  const lines: string[] = ["graph TD"];

  // ── Detection helpers ──────────────────────────────────────────────
  const has = (pattern: RegExp) => pattern.test(joined);
  const hasFile = (name: string) => files.includes(name);

  // Framework / runtime
  const hasNextJs   = stack.includes("Next.js");
  const hasVite     = stack.includes("Vite");
  const hasReact    = stack.includes("React");
  const hasPython   = stack.includes("Python");
  const hasDocker   = stack.includes("Docker");
  const hasNode     = stack.includes("Node.js");
  const hasTs       = stack.includes("TypeScript");
  const hasTailwind = stack.includes("Tailwind") || has(/tailwind/);

  // Routing / pages
  const hasAppRouter  = has(/src\/app\//);
  const hasPagesDir   = has(/\/pages\//);
  const hasApiRoutes  = has(/\/api\//);
  const hasMiddleware = hasFile("middleware.ts") || hasFile("middleware.js") || has(/\/middleware\//);

  // Auth
  const hasAuth         = has(/\/auth\//);
  const hasNextAuth     = has(/next-?auth/);
  const hasClerk        = has(/clerk/);
  const hasSupabaseAuth = has(/supabase/);
  const hasJwt          = has(/jsonwebtoken|jwt/);
  const hasBcrypt       = has(/bcrypt/);

  // Database / ORM
  const hasPrisma    = has(/prisma/);
  const hasMongoose  = has(/mongoose/);
  const hasSupabase  = has(/supabase/);
  const hasDrizzle   = has(/drizzle/);
  const hasRedis     = has(/redis|upstash/);
  const hasSqlite    = has(/sqlite|better-sqlite/);
  const hasDB = hasPrisma || hasMongoose || hasSupabase || hasDrizzle || hasSqlite;

  // State management
  const hasRedux   = has(/redux|@reduxjs/);
  const hasZustand = has(/zustand/);
  const hasJotai   = has(/jotai/);
  const hasRecoil  = has(/recoil/);
  const hasMobX    = has(/mobx/);
  const hasContext = has(/\/context\//);
  const hasState = hasRedux || hasZustand || hasJotai || hasRecoil || hasMobX || hasContext;

  // UI libraries
  const hasShadcn  = has(/shadcn|@radix-ui/);
  const hasMui     = has(/@mui|material-ui/);
  const hasChakra  = has(/chakra/);
  const hasAntd    = has(/antd|ant-design/);
  const hasFramer  = has(/framer-motion/);

  // Testing
  const hasJest    = has(/jest\.config|\.test\.|__tests__/);
  const hasVitest  = has(/vitest/);
  const hasCypress = has(/cypress/);
  const hasPlaywright = has(/playwright/);
  const hasStorybook = has(/storybook/);
  const hasTesting = hasJest || hasVitest || hasCypress || hasPlaywright;

  // CI / DevOps
  const hasGithubActions = has(/\.github\/workflows/);
  const hasVercel  = hasFile("vercel.json") || has(/vercel/);
  const hasDocker2 = hasDocker || has(/dockerfile/);
  const hasEnvFile = hasFile(".env") || hasFile(".env.example");

  // External services / APIs
  const hasStripe   = has(/stripe/);
  const hasSendgrid = has(/sendgrid|nodemailer|resend/);
  const hasOpenAI   = has(/openai/);
  const hasS3       = has(/s3|aws-sdk|@aws-sdk/);
  const hasAnalytics = has(/analytics|posthog|mixpanel|segment/);

  // Special folders second-level
  const subfolders = (parent: string): string[] => {
    const prefix = parent + "/";
    const seen = new Set<string>();
    for (const f of files) {
      if (!f.toLowerCase().startsWith(prefix.toLowerCase())) continue;
      const rest = f.slice(prefix.length);
      const next = rest.split("/")[0];
      if (next && !next.includes(".") && next.length < 30) seen.add(next);
    }
    return [...seen].slice(0, 6);
  };

  const appNode = hasNextJs ? "NEXT" : hasVite ? "VITE" : hasReact ? "REACT" : hasNode ? "NODE" : "ROOT";
  const dbNode  = hasPrisma ? "PRISMA" : hasMongoose ? "MONGOOSE" : hasSupabase ? "SUPABASE" : hasDrizzle ? "DRIZZLE" : "DB";

  // ── SUBGRAPH: Client / Browser ──────────────────────────────────────
  lines.push("");
  lines.push("  subgraph CLIENT[\"🌐 Client / Browser\"]");
  lines.push("    direction TB");
  if (hasNextJs)                         lines.push(`    NEXT["⚡ Next.js ${hasAppRouter ? "App Router" : hasPagesDir ? "Pages Router" : ""}"]`);
  else if (hasVite)                      lines.push(`    VITE["⚡ Vite + React"]`);
  else if (hasReact)                     lines.push(`    REACT["⚛️ React"]`);
  if (hasTailwind)                       lines.push(`    TAILWIND["🎨 Tailwind CSS"]`);
  if (hasShadcn)                         lines.push(`    SHADCN["🧩 shadcn/ui + Radix"]`);
  else if (hasMui)                       lines.push(`    MUI["🧩 Material UI"]`);
  else if (hasChakra)                    lines.push(`    CHAKRA["🧩 Chakra UI"]`);
  else if (hasAntd)                      lines.push(`    ANTD["🧩 Ant Design"]`);
  if (hasFramer)                         lines.push(`    FRAMER["✨ Framer Motion"]`);
  lines.push("  end");

  // ── SUBGRAPH: Pages / Routing ───────────────────────────────────────
  const pageSubdirs = subfolders(hasAppRouter ? "src/app" : hasPagesDir ? "pages" : "src/pages");
  if (pageSubdirs.length > 0 || hasAppRouter || hasPagesDir) {
    lines.push("");
    lines.push("  subgraph PAGES[\"📄 Pages & Routing\"]");
    lines.push("    direction TB");
    if (hasAppRouter) lines.push(`    APPROUTER["App Router (src/app/)"]`);
    if (hasPagesDir)  lines.push(`    PAGESROUTER["Pages Router (pages/)"]`);
    if (hasMiddleware) lines.push(`    MDW["🔀 Middleware"]`);
    const pagePaths = pageSubdirs.filter(d => !["api", "auth"].includes(d.toLowerCase()));
    for (const dir of pagePaths.slice(0, 5)) {
      const id = "PAGE_" + dir.toUpperCase().replace(/[^A-Z0-9]/g, "_");
      lines.push(`    ${id}["/${dir}"]`);
    }
    lines.push("  end");
  }

  // ── SUBGRAPH: Components ────────────────────────────────────────────
  const compSubdirs = subfolders("src/components").concat(subfolders("components"));
  if (has(/\/components\//) || compSubdirs.length > 0) {
    lines.push("");
    lines.push("  subgraph COMPONENTS[\"🧩 Components\"]");
    lines.push("    direction TB");
    for (const dir of [...new Set(compSubdirs)].slice(0, 6)) {
      const id = "COMP_" + dir.toUpperCase().replace(/[^A-Z0-9]/g, "_");
      lines.push(`    ${id}["${dir}/"]`);
    }
    if (compSubdirs.length === 0) lines.push(`    COMP_GEN["UI Components"]`);
    lines.push("  end");
  }

  // ── SUBGRAPH: State Management ──────────────────────────────────────
  if (hasState) {
    lines.push("");
    lines.push("  subgraph STATE[\"🗃️ State Management\"]");
    lines.push("    direction TB");
    if (hasRedux)   lines.push(`    REDUX["Redux Toolkit"]`);
    if (hasZustand) lines.push(`    ZUSTAND["Zustand"]`);
    if (hasJotai)   lines.push(`    JOTAI["Jotai"]`);
    if (hasRecoil)  lines.push(`    RECOIL["Recoil"]`);
    if (hasMobX)    lines.push(`    MOBX["MobX"]`);
    if (hasContext) lines.push(`    CTX["React Context"]`);
    lines.push("  end");
  }

  // ── SUBGRAPH: API Layer ─────────────────────────────────────────────
  if (hasApiRoutes || hasNode) {
    lines.push("");
    lines.push("  subgraph APILAYER[\"🔌 API Layer\"]");
    lines.push("    direction TB");
    const apiSubdirs = subfolders("src/app/api").concat(subfolders("src/pages/api")).concat(subfolders("pages/api")).concat(subfolders("api"));
    const uniqApiDirs = [...new Set(apiSubdirs)].slice(0, 8);
    if (uniqApiDirs.length > 0) {
      for (const dir of uniqApiDirs) {
        const id = "API_" + dir.toUpperCase().replace(/[^A-Z0-9]/g, "_");
        lines.push(`    ${id}["/api/${dir}"]`);
      }
    } else {
      lines.push(`    API_GEN["REST / Route Handlers"]`);
    }
    if (hasOpenAI) lines.push(`    OPENAI_ROUTE["/api/ai"]`);
    lines.push("  end");
  }

  // ── SUBGRAPH: Auth ──────────────────────────────────────────────────
  if (hasAuth || hasNextAuth || hasClerk || hasSupabaseAuth || hasJwt) {
    lines.push("");
    lines.push("  subgraph AUTHLAYER[\"🔐 Authentication\"]");
    lines.push("    direction TB");
    if (hasNextAuth)     lines.push(`    NEXTAUTH["NextAuth.js"]`);
    if (hasClerk)        lines.push(`    CLERK["Clerk"]`);
    if (hasSupabaseAuth && !hasNextAuth && !hasClerk) lines.push(`    SUPA_AUTH["Supabase Auth"]`);
    if (hasJwt)          lines.push(`    JWT["JWT Tokens"]`);
    if (hasBcrypt)       lines.push(`    BCRYPT["bcrypt Hashing"]`);
    if (hasAuth && !hasNextAuth && !hasClerk) lines.push(`    CUSTOM_AUTH["Custom Auth Logic"]`);
    lines.push("  end");
  }

  // ── SUBGRAPH: Data / ORM ────────────────────────────────────────────
  if (hasDB) {
    lines.push("");
    lines.push("  subgraph DATALAYER[\"🗄️ Data Layer\"]");
    lines.push("    direction TB");
    if (hasPrisma)   lines.push(`    PRISMA["Prisma ORM"]`);
    if (hasMongoose) lines.push(`    MONGOOSE["Mongoose / MongoDB"]`);
    if (hasSupabase) lines.push(`    SUPABASE["Supabase (Postgres)"]`);
    if (hasDrizzle)  lines.push(`    DRIZZLE["Drizzle ORM"]`);
    if (hasSqlite)   lines.push(`    SQLITE["SQLite"]`);
    if (hasRedis)    lines.push(`    REDIS["Redis / Upstash"]`);
    lines.push("  end");
  }

  // ── SUBGRAPH: External Services ─────────────────────────────────────
  const hasExternal = hasStripe || hasSendgrid || hasOpenAI || hasS3 || hasAnalytics;
  if (hasExternal) {
    lines.push("");
    lines.push("  subgraph EXTERNAL[\"☁️ External Services\"]");
    lines.push("    direction TB");
    if (hasStripe)    lines.push(`    STRIPE["💳 Stripe Payments"]`);
    if (hasSendgrid)  lines.push(`    EMAIL["📧 Email (Sendgrid/Resend)"]`);
    if (hasOpenAI)    lines.push(`    OPENAI["🤖 OpenAI API"]`);
    if (hasS3)        lines.push(`    S3["🪣 AWS S3 Storage"]`);
    if (hasAnalytics) lines.push(`    ANALYTICS["📊 Analytics"]`);
    lines.push("  end");
  }

  // ── SUBGRAPH: Config & Tooling ──────────────────────────────────────
  lines.push("");
  lines.push("  subgraph TOOLING[\"⚙️ Config & Tooling\"]");
  lines.push("    direction TB");
  if (hasTs)            lines.push(`    TS["TypeScript"]`);
  if (hasTailwind)      lines.push(`    TW["Tailwind CSS"]`);
  if (hasEnvFile)       lines.push(`    ENV[".env Config"]`);
  if (hasGithubActions) lines.push(`    CI["GitHub Actions CI/CD"]`);
  if (hasVercel)        lines.push(`    VERCEL["Vercel Deployment"]`);
  if (hasDocker2)       lines.push(`    DOCKER["Docker / Compose"]`);
  if (hasStorybook)     lines.push(`    STORYBOOK["Storybook"]`);
  lines.push("  end");

  // ── SUBGRAPH: Testing ───────────────────────────────────────────────
  if (hasTesting) {
    lines.push("");
    lines.push("  subgraph TESTING[\"🧪 Testing\"]");
    lines.push("    direction TB");
    if (hasJest)       lines.push(`    JEST["Jest / RTL"]`);
    if (hasVitest)     lines.push(`    VITEST["Vitest"]`);
    if (hasCypress)    lines.push(`    CYPRESS["Cypress E2E"]`);
    if (hasPlaywright) lines.push(`    PLAYWRIGHT["Playwright E2E"]`);
    lines.push("  end");
  }

  // ── Data flow edges ─────────────────────────────────────────────────
  lines.push("");
  lines.push("  %% ── Data flow ──");

  // User → Client
  lines.push(`  USER(["👤 User"]) -->|HTTP Request| CLIENT`);

  // Client → Pages
  if (hasAppRouter || hasPagesDir || has(/\/pages\//)) {
    lines.push(`  CLIENT -->|renders| PAGES`);
  }

  // Pages → Components
  if (has(/\/components\//)) {
    lines.push(`  PAGES -->|uses| COMPONENTS`);
  }

  // State ↔ Components
  if (hasState) {
    lines.push(`  COMPONENTS -->|reads| STATE`);
    lines.push(`  STATE -->|updates| COMPONENTS`);
  }

  // Pages / Client → API
  if (hasApiRoutes) {
    lines.push(`  PAGES -->|fetch| APILAYER`);
  }

  // Auth gates API
  if (hasAuth || hasNextAuth || hasClerk || hasJwt) {
    lines.push(`  APILAYER -->|verifies| AUTHLAYER`);
    if (hasMiddleware) {
      lines.push(`  PAGES -->|guarded by| AUTHLAYER`);
    }
  }

  // API → Data
  if (hasDB) {
    lines.push(`  APILAYER -->|query| DATALAYER`);
    lines.push(`  DATALAYER -->|result| APILAYER`);
  }

  // API → External
  if (hasExternal) {
    lines.push(`  APILAYER -->|calls| EXTERNAL`);
  }

  // CI/CD → Deployment
  if (hasGithubActions && hasVercel) {
    lines.push(`  TOOLING -->|deploys| CLIENT`);
  }

  return lines.join("\n");
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
            instruction: "Create a short repo brief, architecture notes, 5 implementation tasks, a mermaidFlowchart (a raw string of mermaid js syntax representing the repository architecture, without backticks), and an array of securityVulnerabilities (each object should have 'id', 'severity' and 'description').",
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
        mermaidFlowchart: ai?.mermaidFlowchart || makeMermaidFlowchart(repo.name, stack, folders, files),
        securityVulnerabilities: ai?.securityVulnerabilities || [],
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
