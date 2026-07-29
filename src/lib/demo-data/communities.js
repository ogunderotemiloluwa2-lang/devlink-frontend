// Communities shown on the Community list/detail pages.

export const communities = [
  {
    id: "c1",
    slug: "distributed-systems",
    name: "Distributed Systems",
    description:
      "Consensus algorithms, sharding strategies, and the occasional war story about a 3am outage. For engineers building systems that don't fit on one machine.",
    members: 18400,
    posts: 2140,
    topics: ["consensus", "sharding", "reliability"],
    moderators: ["amarapatel", "davidkoenig"],
  },
  {
    id: "c2",
    slug: "frontend-craft",
    name: "Frontend Craft",
    description:
      "Component architecture, animation, accessibility, and the never-ending debate about CSS-in-JS. A place for people who care about the details.",
    members: 26300,
    posts: 4870,
    topics: ["react", "css", "accessibility"],
    moderators: ["kenji_oda", "hannahfrost"],
  },
  {
    id: "c3",
    slug: "ml-in-production",
    name: "ML in Production",
    description:
      "Not another tutorial subreddit. Model serving, quantization, drift monitoring, and the parts of ML that happen after the notebook.",
    members: 14750,
    posts: 1620,
    topics: ["mlops", "inference", "monitoring"],
    moderators: ["sofiavargas"],
  },
  {
    id: "c4",
    slug: "indie-hackers-devs",
    name: "Indie Hackers (Dev Edition)",
    description:
      "For developers building and shipping their own products. Revenue numbers welcome, vague hustle-culture platitudes are not.",
    members: 31200,
    posts: 6210,
    topics: ["saas", "bootstrapping", "marketing"],
    moderators: ["liuwei_dev", "priyaramesh"],
  },
  {
    id: "c5",
    slug: "gamedev-collective",
    name: "GameDev Collective",
    description:
      "Solo devs and small studios sharing devlogs, asking for feedback on builds, and occasionally finding a collaborator for their next project.",
    members: 9840,
    posts: 3050,
    topics: ["godot", "unity", "pixelart"],
    moderators: ["tomasnovak"],
  },
  {
    id: "c6",
    slug: "appsec-practitioners",
    name: "AppSec Practitioners",
    description:
      "Threat modeling, secure defaults, and dissecting real CVEs. Please don't ask us to hack your ex's Instagram.",
    members: 12680,
    posts: 1890,
    topics: ["security", "ctf", "threat-modeling"],
    moderators: ["graceokafor"],
  },
];

export const getCommunityBySlug = (slug) => communities.find((c) => c.slug === slug);
