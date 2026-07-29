// Message threads for the Messaging page. "you" is the current user.

export const conversations = [
  {
    id: "conv1",
    participant: "priyaramesh",
    unread: 2,
    lastMessageAt: "2026-07-23T16:42:00Z",
    messages: [
      {
        id: "m1",
        from: "priyaramesh",
        text: "Hey! Saw your comment on the tRPC thread — are you still looking for something on the backend side?",
        sentAt: "2026-07-23T16:10:00Z",
      },
      {
        id: "m2",
        from: "you",
        text: "Yeah, actively looking. Mostly Node/TS but open to Go too. What's the role?",
        sentAt: "2026-07-23T16:22:00Z",
      },
      {
        id: "m3",
        from: "priyaramesh",
        text: "Founding engineer #4 at Cascade. Small team, fintech infra, fully remote. Want to grab 20 min this week?",
        sentAt: "2026-07-23T16:35:00Z",
      },
      {
        id: "m4",
        from: "priyaramesh",
        text: "No pressure either way, just thought of you when the req went up.",
        sentAt: "2026-07-23T16:42:00Z",
      },
    ],
  },
  {
    id: "conv2",
    participant: "tomasnovak",
    unread: 0,
    lastMessageAt: "2026-07-22T20:15:00Z",
    messages: [
      {
        id: "m5",
        from: "you",
        text: "Been following the Hollow Hearth devlogs — the crafting UI mockups look really clean. Did you end up finding a pixel artist?",
        sentAt: "2026-07-22T19:50:00Z",
      },
      {
        id: "m6",
        from: "tomasnovak",
        text: "Not yet! Had a couple people reach out but the styles didn't quite fit. Still looking if you know anyone.",
        sentAt: "2026-07-22T20:02:00Z",
      },
      {
        id: "m7",
        from: "tomasnovak",
        text: "I posted the full brief on the project page if you want to share it around.",
        sentAt: "2026-07-22T20:15:00Z",
      },
    ],
  },
  {
    id: "conv3",
    participant: "graceokafor",
    unread: 0,
    lastMessageAt: "2026-07-20T09:30:00Z",
    messages: [
      {
        id: "m8",
        from: "graceokafor",
        text: "Ran header-audit against your personal site btw — missing a Content-Security-Policy header, everything else looked solid.",
        sentAt: "2026-07-20T09:05:00Z",
      },
      {
        id: "m9",
        from: "you",
        text: "Oh nice catch, thank you! Didn't realize it flagged live sites, that's a great feature.",
        sentAt: "2026-07-20T09:18:00Z",
      },
      {
        id: "m10",
        from: "graceokafor",
        text: "Yep, `header-audit scan yoursite.com` — no auth needed for public sites. Fixing that CSP should be a 10 min job.",
        sentAt: "2026-07-20T09:30:00Z",
      },
    ],
  },
];

export const getConversationByParticipant = (username) =>
  conversations.find((c) => c.participant === username);
