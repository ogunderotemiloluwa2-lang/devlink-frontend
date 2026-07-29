# DevLink

A developer network frontend scaffold — React (JavaScript, no TypeScript), Vite, Tailwind CSS, shadcn-style components, React Router, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## What's here

- Full route map (landing, auth, dashboard, feed, profiles, messages, AI Hub, collaboration hub, community, nested settings)
- Realistic demo data in `src/lib/demo-data/` (no backend — everything is static JS for now)
- Hand-built shadcn-style UI primitives in `src/components/ui/` (button, card, dialog, sheet, command palette, etc.)
- Light/dark theme via `next-themes`, dark as default, toggle in Settings → Appearance or the topbar
- See `DevLink-BRD.md` for the full product/design spec this scaffold implements

## Build

```bash
npm run build
npm run preview
```
