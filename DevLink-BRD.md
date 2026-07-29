# DevLink — Business Requirements Document

**Status:** Frontend scaffold complete (UI only, no backend)
**Stack:** Vite + React + JavaScript (JSX) + Tailwind CSS + shadcn-style components + React Router + Framer Motion

---

## 1. Product Vision & Positioning

DevLink is a network built specifically for developers — the missing layer between GitHub (where you write code), Discord (where you talk about it), Dev.to (where you write about it), and Product Hunt (where you discover tools for it). Instead of splitting a developer's professional life across four different products, DevLink unifies:

- **Building in public** — a feed for project updates, technical writing, and polls
- **Finding collaborators** — a structured hub for projects that need specific roles filled
- **Discovering AI tools** — a directory reviewed by working developers, not marketing copy
- **Belonging to a community** — focused spaces organized by discipline, not general chit-chat
- **Direct communication** — messaging that doesn't require yet another Slack workspace

**Positioning statement:** DevLink is where developers show what they're building and find the people who want to build it with them.

### Non-goals (for this phase)
- Not a general-purpose social network — no algorithmic "For You" feed, no ads
- Not a job board — collaboration listings are project-based, not recruiter-driven
- Not a code hosting service — DevLink references GitHub repos, it doesn't replace them

---

## 2. Personas

| Persona | Goal on DevLink |
|---|---|
| **The Builder** (e.g. Sofia, ML Engineer) | Shares project updates, wants visibility for open-source work, looks for contributors with complementary skills |
| **The Connector** (e.g. Priya, Founding Engineer) | Recruits informally through genuine relationships, not cold outreach |
| **The Explorer** (e.g. Liu Wei, Freelancer) | Browses the AI Hub and Collaboration Hub for new tools and paid or collaborative work |
| **The Specialist** (e.g. Grace, Security Engineer) | Posts focused technical content, moderates a community around their discipline |
| **The Newcomer** (you, Jordan) | Sets up a profile, follows people in their stack, looks for a first collaboration |

---

## 3. Information Architecture

```
/                       Landing (public, marketing)
/sign-in                Auth (UI only)
/sign-up                Auth (UI only)
[AppShell: Sidebar + Topbar via <Outlet/>]
  /dashboard            Dashboard
  /feed                 Feed
  /profile/:username    Developer profile (own + others)
  /messages             Messaging
  /ai-hub               AI Hub (tool directory)
  /collaboration-hub    Project/collaborator finder
  /community            Community list
  /community/:id        Community detail
  /settings             Settings (nested tabs via <Outlet/>)
    /settings/profile
    /settings/account
    /settings/notifications
    /settings/appearance
*                       NotFound
```

Global overlays (not full routes): command palette (⌘K / Ctrl+K), notifications popover in the Topbar.

---

## 4. User Journeys

### 4.1 Onboarding
1. Visitor lands on `/`, sees real posts and profiles rather than placeholder content, understands the product in one scroll.
2. Clicks "Create your profile" → `/sign-up`, fills a lightweight form (UI only — no backend call).
3. Redirected into `/dashboard`, sees suggested collaborators and trending tools immediately — no empty state on day one.
4. Visits `/settings/profile` to fill in bio, stack, and role.

### 4.2 Daily active use
1. Opens `/feed`, scrolls recent posts from followed developers.
2. Uses the composer to share a project update.
3. Checks the notifications popover for likes/comments/follows.
4. Opens `/messages` to reply to a DM.

### 4.3 Finding a collaborator
1. Visits `/collaboration-hub`.
2. Filters by role ("Pixel Artist") and stack ("Godot").
3. Opens a project card, message the owner directly from their profile.

### 4.4 Recruiter-style sourcing (informal)
1. A founding engineer (Priya) browses `/community/frontend-craft` for active contributors.
2. Opens a promising profile, sees pinned repo and stack.
3. Sends a DM via `/messages` — no formal "apply" flow, DevLink stays relationship-first.

---

## 5. Design System

### 5.1 Palette
Neutral GitHub-style gray scale for background/border/text, with a single blue accent for primary actions and links. Semantic success (green), warning (amber), and destructive (red) tokens layer on top of the existing shadcn destructive token.

| Token | Light | Dark |
|---|---|---|
| `--background` | `0 0% 100%` | `220 13% 9%` |
| `--foreground` | `220 9% 12%` | `220 9% 92%` |
| `--primary` (accent blue) | `212 92% 45%` | `210 90% 62%` |
| `--success` | `142 71% 32%` | `142 60% 42%` |
| `--warning` | `38 92% 40%` | `38 85% 52%` |
| `--destructive` | `4 80% 52%` | `4 70% 56%` |
| `--border` | `220 13% 90%` | `220 13% 18%` |
| `--sidebar-background` | `220 20% 99%` | `220 15% 8%` |

### 5.2 Typography
- **Inter** — all UI text (headings, body, labels)
- **JetBrains Mono** — tech-stack badges, usernames/handles, code-flavored content

### 5.3 Spacing & Radius
Existing shadcn `--radius` scale (`0.5rem` base) kept as-is. Card padding standardized via `CardContent`/`CardHeader` primitives rather than ad-hoc utility spacing per page.

### 5.4 Motion (Framer Motion)
Used sparingly, per the source BRD's restraint principle:
- Route-level fade transition in `AppShell` (150ms)
- Landing page hero/feature blocks fade+slide in on mount
- No scroll-jacking, no oversized page transitions

### 5.5 Avatars
No stock photography. `src/lib/avatar.js` derives deterministic initials + an HSL color from the username (GitHub-identicon substitute), rendered through the `UserAvatar` component wrapping the shadcn `Avatar` primitive.

---

## 6. Navigation Spec

- **Sidebar** (desktop, ≥1024px): fixed 256px column — logo, primary nav (Dashboard/Feed/Messages/AI Hub/Collaboration Hub/Community), secondary nav (Profile/Settings), current-user card pinned to bottom. Active route highlighted via `NavLink`.
- **Topbar**: search trigger (opens command palette), notifications popover, theme toggle. On mobile, a menu button opens the sidebar as a `Sheet`.
- **Mobile bottom nav** (<1024px): 5 primary destinations (Home/Feed/Messages/Collab/Community), fixed to viewport bottom.
- **Command palette** (`cmdk`): opens via Topbar button or ⌘K/Ctrl+K, searches pages, people, communities, and AI tools; selecting an item navigates and closes the palette.

---

## 7. Component Inventory

| Component | Purpose |
|---|---|
| `PostCard` | Renders text/project-update/poll posts with like/comment/repost affordances and interactive poll voting |
| `PostComposer` | New-post form with type selector (text/project-update/poll) |
| `ProjectCard` | Collaboration hub + profile project listing with stack, roles needed, owner |
| `ToolCard` | AI Hub directory card, opens a detail `Sheet` on click |
| `ConversationList` / `MessageThread` | Messaging list-detail pattern, single-pane on mobile |
| `ProfileHeader` / `ProfileTabs` | Profile identity block + Posts/Projects/Activity tabs |
| `EmptyState` / `ErrorState` / `ListSkeleton` | Shared states used consistently across list-driven pages |
| `CommandPalette` | Global ⌘K search |
| `NotificationsPopover` | Topbar notification list with mark-all-read |

---

## 8. Per-Page Spec (summary)

- **Landing** — hero with real post previews (not gradient hero), feature grid, CTA footer. No auth required.
- **Sign in / Sign up** — centered card form, GitHub OAuth button (UI only), redirects to `/dashboard` on submit.
- **Dashboard** — stat cards, recent activity, suggested collaborators, projects needing help, trending tools. Empty-state ready per widget.
- **Feed** — composer + post list. Loading state shows `ListSkeleton`; empty state prompts following people.
- **Profile** — header (avatar, role, stack) + tabs (Posts/Projects/Activity). Unknown `:username` renders a designed not-found state instead of crashing.
- **Messages** — two-pane on desktop, single-pane (list → thread) on mobile with a back button.
- **AI Hub** — search + category filter chips, grid of `ToolCard`s, detail `Sheet` on selection.
- **Collaboration Hub** — search + role/stack filters over `ProjectCard` grid.
- **Community** — list of cards (members/posts counts) → detail page with about, moderators, and topic-matched posts; join/leave is local component state.
- **Settings** — nested tabs: Profile (editable bio/stack), Account (username/email/password/danger zone), Notifications (email/push toggles), Appearance (theme picker, wired to `next-themes`).

---

## 9. Mobile Responsiveness Rules

- **< 640px (sm):** single-column layouts everywhere; sidebar becomes a `Sheet`; bottom nav visible; messaging is single-pane.
- **640–1024px (sm–lg):** 2-column grids for cards (AI Hub, Collaboration Hub, Community); sidebar still collapsed to sheet + bottom nav.
- **≥ 1024px (lg):** persistent sidebar, 3-column grids where applicable, two-pane messaging, bottom nav hidden.

---

## 10. Data Layer

No backend in this phase. All content is served from typed-shape JS modules in `src/lib/demo-data/`:

- `profiles.js` — 12 developer profiles (11 seeded + `currentUser`)
- `posts.js` — 16 feed posts across text/project-update/poll types
- `projects.js` — 8 collaboration listings
- `ai-tools.js` — 12 AI tool directory entries across 10 categories
- `communities.js` — 6 communities
- `messages.js` — 3 message threads
- `index.js` — barrel export + `notifications` + `formatRelativeTime` helper

Local component state (`useState`) simulates writes — new posts, sent messages, follow/join toggles — without persisting across a reload, since no backend is enabled.

---

## 11. Out of Scope / Follow-up Work

- Backend integration (auth, persistence, real-time messaging)
- i18n (English-only copy for this phase, existing i18n infra untouched)
- Recommendation ranking for the feed (currently reverse-chronological demo data)
- Payment/monetization flows
