## Goal

Rebuild EPMIC (Enterprise Manufacturing Intelligence & Coordination Platform) as a web app in this Lovable project, porting the React frontend from the uploaded zip and replacing the FastAPI/SQLite backend with Lovable Cloud (Postgres + server functions).

## Approach

The zip has ~35 pages across a Manufacturing Hub, Corporate Center, and a Factory workspace (dashboard, KPIs, production, sales, procurement, inventory, warehouse, quality, maintenance, workforce, cost, reports, settings, and 9 master-data CRUD screens). Building all of it in one pass would be huge and unreviewable, so I'll ship it in phases and stop after Phase 1 for you to react.

## Phase 1 — Foundation + Hub + Factory Dashboard (this turn)

**Design system** (`src/styles.css`): map EPMIC tokens (primary `#1E40AF`, slate-900, success/warning/danger/info, `#F8FAFC` background, Inter font) into oklch CSS variables. Load Inter via `<link>` in `__root.tsx`.

**UI kit** (`src/components/ui/`): port the small primitives used everywhere — Button, Card, Badge, StatCard, HealthGauge, Sparkline, Table, EmptyState, PageSkeleton, SearchBar, Modal, SlideOver, ConfirmDialog, Input, Select — all using shadcn/design-system tokens (no hardcoded hex).

**Layout** (`src/components/layout/`): AppShell + Sidebar (Hub → Factory nav tree). Skip Tauri-only TitleBar/StatusBar/SplashScreen.

**Routes** (file-based, replacing the placeholder index):
```text
/                              → Manufacturing Hub (factory picker)
/factory/$factoryId            → Factory Dashboard (KPIs, health, alerts)
```
Both routes get their own `head()` metadata. All other sections stubbed as "Coming soon" nav entries so the shell is navigable.

**Data**: seed a small in-memory factories/KPIs mock in a `.functions.ts` so the shell renders end-to-end without a backend yet. No Lovable Cloud in Phase 1.

## Phase 2 — Lovable Cloud + master data

- Enable Lovable Cloud.
- Migrations for the 9 master-data tables (factories, products, raw_materials, customers, suppliers, machines, production_lines, warehouses, shifts, BOM) with RLS + grants.
- Generic `CrudPage` wired to `requireSupabaseAuth` server functions.
- Routes: `/factory/$factoryId/master-data/{products,customers,...}`.
- Auth: email/password sign-in, `_authenticated/` layout gates the factory workspace.

## Phase 3 — Operational modules

Production planning, sales planning, procurement, inventory, warehouse, quality, maintenance, workforce, cost, KPIs, reports, settings, corporate center. Each as its own route with head() metadata and a server function for reads.

## Technical notes (for reference)

- **Not ported**: Tauri shell, Rust commands, FastAPI, SQLite, Python — replaced by TanStack Start server functions on Cloudflare Workers + Lovable Cloud Postgres.
- **Auth**: single-user in the spec, but web needs auth — using Supabase email/password, one user = one workspace.
- **State**: Zustand kept for pure UI state (sidebar open, filters); server state via TanStack Query.
- **Routing**: React Router → TanStack Router file-based (`factory.$factoryId.dashboard.tsx` etc.).

## Deliverable this turn

A running shell at `/` (Hub) → click a factory → `/factory/$factoryId` dashboard with real-looking mock KPIs, sidebar nav listing every future module, EPMIC visual identity applied. Then I stop for your review before Phase 2.
