export type VibeDifficulty = "Easy" | "Medium" | "Hard";

export type VibeTask = {
  slug: string;
  title: string;
  description: string;
  kind: string;
  difficulty: VibeDifficulty;
  starter: string;
  tests: string[];
};

export type VibeTrack = {
  slug: string;
  title: string;
  description: string;
  badge: string;
  tasks: VibeTask[];
};

const makeTask = (
  slug: string,
  title: string,
  description: string,
  kind: string,
  difficulty: VibeDifficulty,
  starter: string,
  tests: string[],
): VibeTask => ({ slug, title, description, kind, difficulty, starter, tests });

export const vibeTracks: VibeTrack[] = [
  {
    slug: "repo-learning",
    title: "Generated Learning Tasks",
    badge: "Repo Scan",
    description: "Turn any GitHub repository into guided implementation tasks that force code reading, testing, and refactoring.",
    tasks: [
      makeTask("map-entrypoints", "Map App Entrypoints", "Find the main app entry, routing layer, and data flow boundaries before changing code.", "Reading", "Easy", "export function mapEntrypoints(files) {\n  // return routes, appRoot, apiRoots\n}\n", ["Detects a frontend root file", "Lists API or server routes", "Explains where state enters the app"]),
      makeTask("component-contracts", "Extract Component Contracts", "Read props and render paths, then document what each major component owns.", "Architecture", "Medium", "type Contract = { name: string; props: string[]; responsibilities: string[] };\n\nexport function extractContracts(source: string): Contract[] {\n  return [];\n}\n", ["Finds component names", "Separates props from responsibilities", "Flags components with too many jobs"]),
      makeTask("ticket-board", "Build Ticket Board", "Create a status-column board from scanned tasks and support optimistic status updates.", "Feature", "Medium", "export default function TicketBoard({ tickets }) {\n  // group tickets by status\n  return null;\n}\n", ["Renders four status columns", "Moves a ticket without full reload", "Keeps empty states readable"]),
      makeTask("dependency-map", "Generate Dependency Map", "Parse package files and produce a dependency risk map for runtime, dev, and unused packages.", "Analysis", "Medium", "export function dependencyMap(pkg) {\n  return { runtime: [], dev: [], risky: [] };\n}\n", ["Separates dependencies and devDependencies", "Marks outdated or risky package categories", "Produces a short recommendation"]),
      makeTask("test-gap-report", "Find Test Gaps", "Compare source modules with test files and create a prioritized test backlog.", "Testing", "Easy", "export function findTestGaps(sourceFiles, testFiles) {\n  return [];\n}\n", ["Matches common test naming patterns", "Scores critical untested files higher", "Returns actionable test names"]),
      makeTask("readme-synthesis", "Synthesize README", "Generate a concise repo brief: purpose, setup, architecture, workflows, and next tasks.", "Docs", "Easy", "export function synthesizeReadme(scan) {\n  return '';\n}\n", ["Includes setup commands", "Mentions key folders", "Lists known risks"]),
      makeTask("api-surface", "Audit API Surface", "Find route handlers, methods, auth requirements, and missing validation points.", "Backend", "Medium", "export function auditRoutes(routes) {\n  return [];\n}\n", ["Lists methods per route", "Flags missing validation", "Identifies auth boundaries"]),
      makeTask("state-flow", "Trace State Flow", "Track where server data becomes UI state and where mutations return to the backend.", "Frontend", "Hard", "export function traceStateFlow(files) {\n  return { reads: [], writes: [] };\n}\n", ["Finds fetch calls", "Finds mutation handlers", "Explains stale-data risks"]),
      makeTask("refactor-slice", "Plan Refactor Slice", "Choose one small refactor that improves maintainability without changing behavior.", "Refactor", "Medium", "export function planRefactor(scan) {\n  return { files: [], reason: '', safetyChecks: [] };\n}\n", ["Names a focused file set", "States behavior-preserving intent", "Includes verification checks"]),
      makeTask("onboarding-path", "Create Onboarding Path", "Turn the repo into a 7-day learning plan with daily reading and implementation tasks.", "Learning", "Easy", "export function onboardingPath(scan) {\n  return [];\n}\n", ["Creates seven days", "Mixes reading and coding", "Ends with a portfolio task"]),
    ],
  },
  {
    slug: "security-lab",
    title: "Security Attack Lab",
    badge: "Attack",
    description: "Practice finding and fixing repo vulnerabilities with Axiom-style implementation tasks.",
    tasks: [
      makeTask("nosql-injection", "Fix NoSQL Injection", "Validate login payloads so Mongo operators cannot bypass authentication.", "Security", "Hard", "export function validateLogin(body) {\n  if (typeof body.username !== 'string') throw new Error('invalid username');\n  if (typeof body.password !== 'string') throw new Error('invalid password');\n  return body;\n}\n", ["Rejects object username", "Rejects object password", "Returns generic auth errors"]),
      makeTask("xss-comments", "Prevent Stored XSS", "Render user comments safely and remove dangerous HTML paths.", "Security", "Medium", "export function SafeComment({ text }) {\n  return <div>{text}</div>;\n}\n", ["Escapes script tags", "Avoids dangerous inner HTML", "Keeps plain text readable"]),
      makeTask("idor-check", "Patch IDOR Route", "Scope resource lookup by the current user so changing IDs cannot leak data.", "Security", "Hard", "export async function getOwnedResource(model, id, userId) {\n  return model.findOne({ _id: id, owner: userId });\n}\n", ["Queries by id and owner", "Returns 404 for foreign resources", "Does not leak existence"]),
      makeTask("rate-limit", "Add Route Rate Limit", "Throttle high-risk endpoints with standard retry headers.", "Security", "Medium", "export const limiterConfig = {\n  windowMs: 60_000,\n  max: 100,\n  standardHeaders: true,\n};\n", ["Has a one-minute window", "Caps request count", "Returns useful retry metadata"]),
      makeTask("secret-scan", "Secret Scan Guard", "Detect committed API keys, tokens, and private credential patterns.", "Security", "Medium", "export function scanSecrets(text) {\n  return [];\n}\n", ["Finds common token prefixes", "Ignores examples safely", "Returns file and line metadata"]),
      makeTask("csrf-mutation", "CSRF Mutation Guard", "Protect cookie-authenticated mutation routes from cross-site form posts.", "Security", "Medium", "export function requireCsrf(req) {\n  // compare header token with signed cookie token\n}\n", ["Requires token on mutations", "Skips safe methods", "Fails closed"]),
      makeTask("file-upload", "Harden File Upload", "Validate size, extension, MIME, and storage location before accepting files.", "Security", "Hard", "export function validateUpload(file) {\n  return file.size < 5_000_000;\n}\n", ["Rejects large files", "Rejects dangerous extensions", "Uses server-generated names"]),
      makeTask("error-leaks", "Remove Error Leaks", "Return safe client errors while preserving structured server logs.", "Security", "Easy", "export function publicError(error) {\n  return { message: 'Something went wrong' };\n}\n", ["No stack trace in response", "Keeps request id", "Logs server detail separately"]),
      makeTask("rbac-policy", "Implement RBAC Policy", "Centralize role checks for admin, owner, and viewer actions.", "Security", "Medium", "export function can(user, action, resource) {\n  return false;\n}\n", ["Owner can edit own resource", "Viewer cannot mutate", "Admin can manage"]),
      makeTask("audit-log", "Write Audit Log", "Record sensitive actions with actor, target, action, and timestamp.", "Security", "Easy", "export function audit(actor, action, target) {\n  return { actor, action, target, at: new Date().toISOString() };\n}\n", ["Includes actor", "Includes target", "Uses append-only records"]),
    ],
  },
  {
    slug: "scale-plan",
    title: "Mass-User Survival Plan",
    badge: "Scale",
    description: "Practice the same scaling moves from the Vibe Lab repo: indexes, cache, queues, backpressure, and observability.",
    tasks: [
      makeTask("hot-index", "Add Hot Path Index", "Move a frequently hit query from collection scan to indexed lookup.", "Scale", "Medium", "LinkSchema.index({ shortCode: 1 }, { unique: true });\n", ["Names the hot query", "Adds the right index", "Explains IXSCAN verification"]),
      makeTask("read-through-cache", "Implement Read-Through Cache", "Cache repeated reads with a short TTL and a DB fallback.", "Scale", "Hard", "export async function getCached(key, load) {\n  const cached = await cache.get(key);\n  if (cached) return JSON.parse(cached);\n  const value = await load();\n  await cache.set(key, JSON.stringify(value), { ttl: 60 });\n  return value;\n}\n", ["Checks cache first", "Writes on miss", "Uses bounded TTL"]),
      makeTask("async-clicks", "Buffer Click Events", "Move write-heavy analytics away from the request path.", "Scale", "Hard", "const buffer = new Map();\nexport function recordClick(code) {\n  buffer.set(code, (buffer.get(code) || 0) + 1);\n}\n", ["Does not block response", "Flushes in batches", "Handles duplicate keys"]),
      makeTask("queue-worker", "Create Background Worker", "Process slow jobs outside the HTTP request using a queue contract.", "Scale", "Medium", "export async function enqueue(job) {\n  return queue.add('job', job);\n}\n", ["Defines job payload", "Retries failures", "Keeps idempotency"]),
      makeTask("p99-dashboard", "Build P99 Dashboard", "Expose latency, error rate, queue depth, and cache hit rate.", "Observability", "Medium", "export const metrics = ['p50', 'p95', 'p99', 'errorRate', 'queueDepth'];\n", ["Tracks p99", "Tracks errors", "Tracks queue depth"]),
      makeTask("backpressure", "Add Backpressure", "Reject or degrade gracefully when downstream systems are overloaded.", "Scale", "Hard", "export function shouldShedLoad(metrics) {\n  return metrics.queueDepth > 10000 || metrics.p99 > 2000;\n}\n", ["Detects overload", "Returns clear failure", "Protects core path"]),
      makeTask("pagination", "Fix Unbounded Lists", "Replace unbounded fetches with cursor pagination.", "Scale", "Medium", "export function pageQuery(cursor, limit = 25) {\n  return { cursor, limit: Math.min(limit, 100) };\n}\n", ["Caps limit", "Supports cursor", "Returns next cursor"]),
      makeTask("cdn-assets", "Move Static Assets", "Send heavy static assets through immutable CDN caching.", "Scale", "Easy", "export const cacheHeader = 'public, max-age=31536000, immutable';\n", ["Uses immutable cache", "Versioned asset URL", "Keeps HTML uncached"]),
      makeTask("db-pool", "Tune DB Pool", "Bound database connections and avoid connection storms during deploys.", "Scale", "Medium", "export const mongoOptions = { maxPoolSize: 20, minPoolSize: 2 };\n", ["Caps pool size", "Reuses connections", "Explains deploy behavior"]),
      makeTask("failure-drill", "Run Failure Drill", "Document what happens when Redis, DB, or queue goes down.", "Scale", "Easy", "export const failureModes = ['redis-down', 'db-slow', 'queue-backed-up'];\n", ["Lists fallback behavior", "Names user impact", "Defines recovery metric"]),
    ],
  },
];

export function getVibeTrack(slug: string) {
  return vibeTracks.find((track) => track.slug === slug);
}

export function getVibeTask(trackSlug: string, taskSlug: string) {
  const track = getVibeTrack(trackSlug);
  const task = track?.tasks.find((item) => item.slug === taskSlug);
  return track && task ? { track, task } : null;
}
