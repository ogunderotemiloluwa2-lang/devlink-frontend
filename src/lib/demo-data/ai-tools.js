// AI Hub tool directory. category drives the filter UI.

export const aiTools = [
  {
    id: "tool1",
    name: "Codeflow",
    tagline: "AI pair programmer that understands your whole repo",
    category: "Code Generation",
    pricing: "Freemium",
    rating: 4.7,
    reviews: 3120,
    description:
      "Indexes your entire codebase for context-aware completions and multi-file refactors. Integrates with VS Code, JetBrains, and the terminal.",
    tags: ["autocomplete", "refactoring", "ide-integration"],
  },
  {
    id: "tool2",
    name: "Reviewly",
    tagline: "Automated, opinionated pull request reviews",
    category: "Code Review",
    pricing: "Paid",
    rating: 4.4,
    reviews: 890,
    description:
      "Leaves inline PR comments on style, potential bugs, and security issues before a human reviewer looks at it. Configurable rule severity per repo.",
    tags: ["pull-requests", "ci", "security"],
  },
  {
    id: "tool3",
    name: "Docwise",
    tagline: "Turns your codebase into living documentation",
    category: "Documentation",
    pricing: "Freemium",
    rating: 4.5,
    reviews: 1240,
    description:
      "Generates and keeps API docs, changelogs, and architecture diagrams in sync with your code automatically on every merge to main.",
    tags: ["docs", "diagrams", "automation"],
  },
  {
    id: "tool4",
    name: "Testforge",
    tagline: "Generates unit and integration tests from your diffs",
    category: "Testing",
    pricing: "Freemium",
    rating: 4.2,
    reviews: 640,
    description:
      "Reads your PR diff and proposes test cases for uncovered branches, including edge cases you're likely to miss under deadline pressure.",
    tags: ["testing", "coverage", "ci"],
  },
  {
    id: "tool5",
    name: "Promptlayer Studio",
    tagline: "Version control and evals for LLM prompts",
    category: "LLM Ops",
    pricing: "Paid",
    rating: 4.6,
    reviews: 510,
    description:
      "Track prompt versions, run regression evals against golden datasets, and diff outputs across model versions before you ship a prompt change.",
    tags: ["evals", "prompts", "observability"],
  },
  {
    id: "tool6",
    name: "Schemify",
    tagline: "Natural language to SQL schema and migrations",
    category: "Database",
    pricing: "Free",
    rating: 4.1,
    reviews: 380,
    description:
      "Describe your data model in plain English and get a normalized schema, indexes, and migration files for Postgres, MySQL, or SQLite.",
    tags: ["sql", "migrations", "schema-design"],
  },
  {
    id: "tool7",
    name: "Debugly",
    tagline: "Explains stack traces and suggests fixes in context",
    category: "Debugging",
    pricing: "Freemium",
    rating: 4.3,
    reviews: 1890,
    description:
      "Pastes your stack trace, reads the surrounding code, and gives a plain-English root cause explanation plus a suggested patch.",
    tags: ["debugging", "error-handling"],
  },
  {
    id: "tool8",
    name: "Figmatic",
    tagline: "Converts Figma frames into production-ready components",
    category: "Design-to-Code",
    pricing: "Paid",
    rating: 4.0,
    reviews: 720,
    description:
      "Generates React + Tailwind components from Figma designs with correct spacing tokens, not just absolute-positioned divs.",
    tags: ["figma", "react", "tailwind"],
  },
  {
    id: "tool9",
    name: "Infraplan",
    tagline: "Reviews Terraform plans for cost and security drift",
    category: "DevOps",
    pricing: "Freemium",
    rating: 4.5,
    reviews: 430,
    description:
      "Annotates `terraform plan` output with estimated cost deltas and flags security-relevant changes like open security groups before apply.",
    tags: ["terraform", "finops", "security"],
  },
  {
    id: "tool10",
    name: "Notewell",
    tagline: "Turns standup and sprint call transcripts into tickets",
    category: "Productivity",
    pricing: "Freemium",
    rating: 4.2,
    reviews: 260,
    description:
      "Joins your engineering standups, summarizes blockers, and drafts Jira/Linear tickets for anything mentioned as a follow-up.",
    tags: ["meetings", "tickets", "automation"],
  },
  {
    id: "tool11",
    name: "Migrator AI",
    tagline: "Automated framework and language version upgrades",
    category: "Refactoring",
    pricing: "Paid",
    rating: 4.3,
    reviews: 310,
    description:
      "Runs large-scale codemods for framework major-version upgrades (React 17→19, Python 2→3-style migrations) with a review-first PR workflow.",
    tags: ["codemods", "upgrades", "legacy"],
  },
  {
    id: "tool12",
    name: "Latency Lens",
    tagline: "AI-assisted performance profiling for web apps",
    category: "Performance",
    pricing: "Free",
    rating: 4.4,
    reviews: 590,
    description:
      "Profiles your app in a real browser, ranks the top contributors to load time, and explains fixes in order of expected impact.",
    tags: ["performance", "web-vitals", "profiling"],
  },
];

export const aiToolCategories = [...new Set(aiTools.map((t) => t.category))];
