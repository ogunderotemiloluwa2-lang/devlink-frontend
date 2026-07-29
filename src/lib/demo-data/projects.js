// Projects looking for collaborators, shown on the Collaboration Hub and
// on individual profiles' "Projects" tab.

export const projects = [
  {
    id: "proj1",
    name: "ledger-core",
    owner: "amarapatel",
    tagline: "Open-source double-entry ledger engine for fintech apps",
    description:
      "A battle-tested double-entry accounting core extracted from production payments infrastructure. Looking for contributors comfortable with financial correctness and property-based testing.",
    stack: ["Go", "PostgreSQL", "gRPC"],
    rolesNeeded: ["Backend Engineer", "Technical Writer"],
    stage: "Active development",
    stars: 1240,
    contributors: 14,
  },
  {
    id: "proj2",
    name: "motion-primitives",
    owner: "kenji_oda",
    tagline: "Lightweight animation primitives for React",
    description:
      "Spring-based animation building blocks that stay under 8kb gzipped. Looking for someone to help build a Vue port and improve reduced-motion accessibility support.",
    stack: ["TypeScript", "React", "Rust"],
    rolesNeeded: ["Frontend Engineer", "Accessibility Specialist"],
    stage: "Maintained",
    stars: 6800,
    contributors: 38,
  },
  {
    id: "proj3",
    name: "tinyinfer",
    owner: "sofiavargas",
    tagline: "Run quantized LLMs on constrained edge hardware",
    description:
      "Inference runtime optimized for Raspberry Pi and mobile NPUs. Currently need help with ARM NEON kernel optimization and an Android demo app.",
    stack: ["Python", "C++", "CUDA"],
    rolesNeeded: ["ML Engineer", "Android Developer"],
    stage: "Active development",
    stars: 3420,
    contributors: 22,
  },
  {
    id: "proj4",
    name: "drift-detector",
    owner: "davidkoenig",
    tagline: "Catch infrastructure changes made outside Terraform",
    description:
      "A lightweight service that diffs live cloud state against your Terraform plan and posts alerts to Slack or PagerDuty. Looking for a second maintainer and GCP support.",
    stack: ["Go", "Terraform", "AWS"],
    rolesNeeded: ["DevOps Engineer", "Go Developer"],
    stage: "Early stage",
    stars: 410,
    contributors: 5,
  },
  {
    id: "proj5",
    name: "hollow-hearth",
    owner: "tomasnovak",
    tagline: "A cozy roguelike about rebuilding an abandoned hearth-village",
    description:
      "Solo indie project looking for a pixel artist to collaborate on environment tiles, and a composer for an ambient/folk soundtrack. Revenue share negotiable.",
    stack: ["Godot", "GDScript"],
    rolesNeeded: ["Pixel Artist", "Composer"],
    stage: "Pre-alpha",
    stars: 210,
    contributors: 3,
  },
  {
    id: "proj6",
    name: "header-audit",
    owner: "graceokafor",
    tagline: "CLI that audits and auto-fixes security headers",
    description:
      "Scans deployed sites for missing or misconfigured security headers and opens a fix PR. Looking for contributors to add framework-specific auto-fix templates (Next.js, Django, Rails).",
    stack: ["Go", "GitHub Actions"],
    rolesNeeded: ["Backend Engineer", "DevRel"],
    stage: "Active development",
    stars: 2900,
    contributors: 19,
  },
  {
    id: "proj7",
    name: "starter-saas-kit",
    owner: "liuwei_dev",
    tagline: "Opinionated Next.js + Supabase starter for indie SaaS",
    description:
      "Auth, billing, and multi-tenant scaffolding out of the box. Looking for someone to build a proper e2e test suite with Playwright and improve the onboarding docs.",
    stack: ["Next.js", "Supabase", "Stripe"],
    rolesNeeded: ["QA Engineer", "Technical Writer"],
    stage: "Maintained",
    stars: 1580,
    contributors: 27,
  },
  {
    id: "proj8",
    name: "swiftui-charts-kit",
    owner: "ritaesposito",
    tagline: "Native, accessible charting components for SwiftUI",
    description:
      "VoiceOver-first charting library built for health and finance apps. Need help with a candlestick chart type and Apple Watch complication support.",
    stack: ["Swift", "SwiftUI"],
    rolesNeeded: ["iOS Engineer", "watchOS Developer"],
    stage: "Active development",
    stars: 890,
    contributors: 11,
  },
];

export const getProjectsByOwner = (username) => projects.filter((p) => p.owner === username);
