export * from "./profiles";
export * from "./posts";
export * from "./projects";
export * from "./ai-tools";
export * from "./communities";
export * from "./messages";

export const notifications = [
  {
    id: "n1",
    type: "follow",
    actor: "priyaramesh",
    text: "started following you",
    createdAt: "2026-07-23T17:00:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "like",
    actor: "kenji_oda",
    text: "liked your post about the ledger migration",
    createdAt: "2026-07-23T12:30:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    actor: "graceokafor",
    text: "commented: \"this is exactly the pattern I was missing\"",
    createdAt: "2026-07-22T15:10:00Z",
    read: false,
  },
  {
    id: "n4",
    type: "collab",
    actor: "tomasnovak",
    text: "invited you to collaborate on hollow-hearth",
    createdAt: "2026-07-21T11:45:00Z",
    read: true,
  },
  {
    id: "n5",
    type: "message",
    actor: "priyaramesh",
    text: "sent you a message",
    createdAt: "2026-07-23T16:42:00Z",
    read: true,
  },
];

export const formatRelativeTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date("2026-07-24T22:52:00Z");
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
