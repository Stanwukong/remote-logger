# PLAN.md — Monita Frontend Development Roadmap

> **Component**: `remote-logger/` — Next.js 15 / React 19 / TailwindCSS 4 Dashboard
> **Parent Plan**: [../PLAN.md](../PLAN.md)
> **Product Spec**: [../PRODUCT.md](../PRODUCT.md)
> **Design System**: [../DESIGN.md](../DESIGN.md) — "Observatory" design language

---

## Design System Integration

The Observatory design system from DESIGN.md governs all frontend work. Key principles:
- **Dark-first**: Deep layered backgrounds (`--bg-void` → `--bg-base` → `--bg-surface` → `--bg-elevated`)
- **Signal Green** (`#00d97e`): Primary accent for CTAs, healthy status, active states
- **Typography**: Syne (display), DM Sans (body), Geist Mono (code/terminal)
- **Motion**: Purposeful animations with `--ease-smooth`, `--ease-snap`, `--ease-spring`
- **Components**: SignalDot, TerminalBlock, Observatory Cards with glow effects

---

## Phase 0: Stabilization

**Goal**: Fix all bugs in the existing frontend before redesigning.

### 0.1 API Service Layer Fixes
- [x] Audit every function in `services/` to verify endpoint paths match backend routes
- [x] Fix any response type mismatches between frontend types and backend responses
- [x] Verify `config.ts` base URL handling for development vs production
- [x] Ensure error responses are caught and displayed via toast notifications
- [x] Add missing `Content-Type` headers where needed
- [x] Verify auth token is sent in `Authorization: Bearer` header on all protected requests

### 0.2 React Query Hook Fixes
- [x] Audit all query hooks: verify keys are unique and don't collide
- [x] Fix mutations that don't invalidate dependent queries (e.g., creating a project should invalidate project list)
- [x] Verify `useAlerts()` works for both project-scoped and user-scoped queries
- [x] Fix any hooks with incorrect enabled conditions (prevent queries from firing when data isn't ready)
- [x] Ensure loading/error states are properly derived and passed to components

### 0.3 Component Fixes
- [x] Fix any components that crash when receiving null/undefined data
- [x] Verify all list renders have unique `key` props
- [x] Fix form submissions that don't validate before API calls
- [x] Ensure modal close handlers reset form state
- [x] Fix sidebar active link highlighting

### 0.4 Auth Flow Fixes
- [x] Verify `middleware.ts` correctly redirects based on token presence
- [x] Handle expired JWT gracefully (redirect to login with message, not white screen)
- [x] Fix cookie handling for auth token (secure, httpOnly flags)
- [x] Verify logout clears all state (cookies, localStorage, React Query cache, Zustand store)

### 0.5 Type Safety
- [x] Audit `types/` directory against actual backend response shapes
- [x] Fix any `any` types that could cause runtime errors
- [x] Add missing type definitions for API responses
- [x] Ensure Zustand store types are correct

---

## Phase 1: Foundation — Observatory Design System + Landing Page

**Goal**: Implement the Observatory design system and rebuild the landing page per DESIGN.md.

### 1.1 Design Token Infrastructure

**Duration**: 2-3 days

**Tasks**:
- [x] Install fonts via `next/font`:
  - Syne (Google Fonts) — display/headlines
  - DM Sans (Google Fonts) — body text
  - Geist Mono (Vercel) — code/terminal
- [x] Create CSS custom properties file with all DESIGN.md tokens
- [x] Configure TailwindCSS 4 to use Observatory color palette
- [x] Set up dark theme as default (no light theme toggle on landing page)
- [x] Create motion utility classes for stagger animations

**Files to create/modify**:
```
app/globals.css                    ← Observatory CSS custom properties
tailwind.config.ts                 ← Observatory color palette, font families
app/layout.tsx                     ← Font imports via next/font
lib/design-tokens.ts               ← TypeScript constants for design tokens
```

**CSS Custom Properties** (from DESIGN.md Part II):
```css
:root {
  /* Backgrounds */
  --bg-void: #060b14;
  --bg-base: #0b1220;
  --bg-surface: #111c2e;
  --bg-elevated: #172236;
  --bg-overlay: #1d2a3f;

  /* Borders */
  --border-faint: #1a2640;
  --border-subtle: #243352;
  --border-accent: #2d4266;

  /* Signal Green */
  --signal: #00d97e;
  --signal-glow: #00d97e26;
  --signal-muted: #00d97e15;
  --signal-bright: #22f598;

  /* ... all tokens from DESIGN.md */
}
```

### 1.2 Foundational Components

**Duration**: 3-4 days

**Components to build**:

| Component | File | Description |
|-----------|------|-------------|
| SignalDot | `components/shared/SignalDot.tsx` | Pulsing status indicator (green/amber/red) with CSS animation |
| TerminalBlock | `components/shared/TerminalBlock.tsx` | Code display with window chrome, traffic lights, syntax highlighting, copy button |
| ObservatoryCard | `components/shared/ObservatoryCard.tsx` | Card with border-glow, hover lift, optional signal-green top accent |
| LogEntry | `components/shared/LogEntry.tsx` | Animated log row with level badge, timestamp, message |
| SectionHeading | `components/shared/SectionHeading.tsx` | Eyebrow + headline + subheadline pattern |
| GlowButton | `components/shared/GlowButton.tsx` | Primary CTA with signal-green glow on hover |
| BadgePill | `components/shared/BadgePill.tsx` | Pill badge with signal dot (e.g., "LIVE" indicator) |
| CountUp | `components/shared/CountUp.tsx` | Animated number count-up on scroll into view |

**Shared utilities**:
- [x] Create `useScrollReveal()` hook — IntersectionObserver for scroll-triggered animations
- [x] Create `useCountUp()` hook — Animated counter with easing
- [x] Create `cn()` utility update to include Observatory-specific class helpers

### 1.3 Landing Page Rebuild

**Duration**: 7-10 days

Build each section as a separate component per DESIGN.md specification.

#### 1.3.1 Navigation (`components/landing/Nav.tsx`)
- [x] Fixed header, 64px height, backdrop blur on scroll
- [x] Logo: Custom SVG "M" logotype in signal green + "monita" wordmark in Syne 600
- [x] Nav links: Features, Integrations, Pricing, Docs, Changelog — DM Sans 14px
- [x] CTA group: "Sign In" ghost + "Start Free" primary button
- [x] Border-bottom appears on scroll (opacity transition)
- [x] Mobile: hamburger menu with slide-down overlay

#### 1.3.2 Hero Section (`components/landing/Hero.tsx` + `HeroCanvas.tsx`)
- [x] `HeroCanvas.tsx` (client component): Constellation node graph
  - Canvas element with `requestAnimationFrame`
  - ~40 Poisson-disc distributed nodes
  - Thin edge lines between nearby nodes
  - Signal-green data pulses traveling along edges
  - Nodes drift ±30px over 15-25s cycles
  - `devicePixelRatio` aware, resize handler
  - Respects `prefers-reduced-motion`
- [x] Badge pill: "LIVE" with signal dot
- [x] Massive headline: Syne 800, `clamp(52px, 8vw, 96px)`, negative letter-spacing
  - "Stop guessing what's breaking in **production.**" (production in signal green)
- [x] Subheadline: DM Sans 400, 18px, `--text-secondary`
- [x] CTA row: Primary button ("Start monitoring free") + Terminal CTA (`npm install monita`)
- [x] Trust bar: 3 items with dots and dividers
- [x] Dashboard preview: Perspective tilt (`rotateX(8deg)`), browser chrome, animated content
  - Line chart that draws in
  - Log entries that appear every 4 seconds
  - Health indicators with signal dots
  - Floating stat badges outside the frame
  - Scroll untilt animation (lerp toward flat)
- [x] Page load choreography: staggered fade-in sequence (0ms → 1100ms)
- [x] Dot grid background pattern with radial fade

#### 1.3.3 Problem Section (`components/landing/ProblemSection.tsx`)
- [x] Eyebrow: "THE PROBLEM" — Syne 600, 11px, uppercase
- [x] Headline: "You're flying blind in production"
- [x] Split layout (50/50):
  - Left: "Without Monita" — scrolling console.log chaos, red tint
  - Right: "With Monita" — structured log explorer UI, signal green status
- [x] Center divider with "VS" circle
- [x] Scroll-reveal animation

#### 1.3.4 Bento Grid Features (`components/landing/BentoGrid.tsx`)
- [x] Eyebrow: "BUILT FOR DEVELOPERS"
- [x] Headline: "Everything you need to **see clearly.**"
- [x] 8 cards in bento grid layout (12-column base):
  - Card A (3col, 200px): Real-time Streaming — animated waveform bars
  - Card B (6col, 320px): Log Explorer HERO — embedded mini-log explorer with animated entries
  - Card C (3col, 200px): Smart Alerts — notification popup decoration
  - Card D (7col, 280px): One-Line SDK — split with terminal code block
  - Card E (5col, 280px): PII Sanitization — before/after animation
  - Card F (4col, 240px): AI Insights — chat bubble decoration
  - Card G (4col, 240px): Health Scoring — SVG progress ring showing "94"
  - Card H (4col, 240px): Team Collaboration — overlapping avatar circles
- [x] Diagonal stagger reveal on scroll
- [x] Mobile: single column, reordered (Card B first)

#### 1.3.5 Stats Number Line (`components/landing/StatsBar.tsx`)
- [x] Full-width `--bg-void` background (darkest, visual pause)
- [x] 4 stats with count-up animation: "5 min" / "10K" / "99.9%" / "133+"
- [x] Syne 800, 72px, signal green numbers
- [x] Labels: DM Sans 400, 14px, `--text-muted`
- [x] Vertical dividers between stats
- [x] Count-up triggers on scroll into view (1200ms, ease-out)

#### 1.3.6 Integrations Section (`components/landing/IntegrationsSection.tsx`)
- [x] Eyebrow: "INTEGRATIONS"
- [x] Headline: "Works with your stack."
- [x] Tab row: Frameworks, Languages, Notifications, Cloud
- [x] Grid of integration tiles (80×80px cards with logo + name)
- [x] "Coming soon" tiles at 50% opacity with badge
- [x] Below tabs: framework-specific quickstart code (auto-updates on tab change)
- [x] Horizontally scrollable tabs on mobile

#### 1.3.7 Pricing Section (`components/landing/Pricing.tsx`)
- [x] Eyebrow: "PRICING"
- [x] Headline: "Start free. Scale when you're ready."
- [x] Monthly/Annual toggle (pill toggle, signal green active)
- [x] 4 cards: Developer ($0), Professional ($29), Team ($99, HIGHLIGHTED), Enterprise (Custom)
- [x] Team card: 2px signal border, glow shadow, "MOST POPULAR" badge
- [x] Each card: plan name, price, key metric, 6-8 features with green checkmarks, CTA
- [x] Collapsible feature comparison table below
- [x] Mobile: horizontal snap scroll (85vw per card)

#### 1.3.8 Final CTA Section (`components/landing/ClosingCTA.tsx`)
- [x] Radial glow background (signal green, very faint portal effect)
- [x] Signal dot + "Production ready in 5 minutes"
- [x] Headline: "Your app is trying to tell you something." — Syne 800, 64px
- [x] Sub: "Most bugs are announced before users notice them. Monita listens."
- [x] Terminal block: `npm install monita`
- [x] Two CTAs: "Start for free →" (primary) + "Read the docs" (ghost)
- [x] Fine print: "No credit card required • 10,000 logs free forever • Cancel anytime"

#### 1.3.9 Footer (`components/landing/Footer.tsx`)
- [x] 4-column grid: Brand, Product, Resources, Company
- [x] Brand column: Logo + wordmark, tagline, social links (GitHub, X)
- [x] Bottom bar: Copyright, compliance badges (GDPR Ready, SOC 2, 99.9% SLA)

#### 1.3.10 Animations & Performance
- [x] Implement scroll-reveal with IntersectionObserver (threshold 0.15)
- [x] Base state: `opacity: 0; transform: translateY(32px)` → Active: `opacity: 1; translateY(0)`
- [x] Stagger children by 80ms (up to 5 children)
- [x] Chart draw-in: SVG stroke-dasharray/dashoffset trick (1500ms)
- [x] Log list feed: new entries from top, height 0→48px, 300ms
- [x] `prefers-reduced-motion` support: disable all animations except 50ms fades
- [x] Canvas: debounced resize, RAF cancelled on unmount
- [x] Images: Next.js `<Image>` with blur placeholder
- [x] Fonts: `font-display: swap`
- [x] Target: Lighthouse > 90 all categories

### 1.4 Shared UI Component Updates

Update existing shadcn/ui components to use Observatory tokens:

- [x] Button: Observatory green primary, ghost variants
- [x] Card: Observatory border-glow, hover lift
- [ ] Badge: Log level colors from `--level-*` tokens
- [ ] Input: Dark surface background, subtle border
- [ ] Dialog: `--bg-overlay` backdrop, `--bg-surface` content
- [ ] Tabs: Signal green active indicator
- [ ] Dropdown: `--bg-elevated` background
- [ ] Toast (Sonner): Observatory styling

---

## Phase 2: Core Experience Redesign

**Goal**: Apply Observatory design to all dashboard pages. Polish core features.

### 2.1 Dashboard Layout Redesign ✅ **COMPLETE**

**Completed**: March 4, 2026 (as part of Phase 2.8)

- [x] Sidebar: Observatory tokens, `border-border-subtle`, signal green active link highlighting, SignalDot project health, collapsible
- [x] Top bar: Breadcrumbs with Observatory colors, command palette trigger (Cmd+K), notification bell with unread badge, theme toggle
- [x] Command palette: Observatory dark styling, SignalDot for project status, keyboard shortcuts with `bg-bg-elevated`
- [ ] Toast styling: Observatory colors and typography (deferred)

**Files modified**:
```
components/app-sidebar.tsx         ← Observatory sidebar
components/top-bar.tsx             ← Observatory top bar
components/command-palette.tsx     ← Observatory command palette
components/theme-toggle.tsx        ← Observatory text colors, tooltip
```

### 2.2 Main Dashboard (`/dashboard`) ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] System status banner: Observatory styling with signal dot
- [x] Key metrics grid: Observatory cards with glow effects on hover
  - Total Logs: large number, Geist Mono, trend arrow
  - Error Rate: red tint card when elevated
  - Success Rate: signal green tint
  - Team Members: neutral
- [x] Health status widget: Observatory colors with status tokens
- [x] Dashboard tabs: Overview, Errors, Performance, Usage
  - Each tab with Observatory signal-green active indicator
- [x] Charts: Recharts with Observatory color palette
  - Line charts: signal green stroke, subtle fill
  - Bar charts: layered blues and greens
  - Area charts: gradient fills with low opacity
- [x] Empty state: Observatory-styled getting started guide

**Files created (3)**:
```
components/dashboard/errors-tab-content.tsx
components/dashboard/performance-tab-content.tsx
components/dashboard/usage-tab-content.tsx
```

**Files modified (7)**:
```
app/(dashboard)/dashboard/page.tsx            ← Wired up tabs, removed console.logs
components/dashboard/dashboard-header.tsx      ← Observatory tokens, time range selector
components/dashboard/dashboard-tabs.tsx        ← 4 tabs, Observatory styling
components/dashboard/overview-tab-content.tsx  ← Recharts with Observatory theme
components/summary-widget.tsx                  ← Glow effects, font-mono, variant accents
components/ui/health-status-widget.tsx         ← Observatory status tokens
components/Empty/dashboard.tsx                 ← Observatory empty state
```

### 2.3 Log Explorer Redesign (`/logs`) ✅ **COMPLETE**

- [x] Split-pane layout: log list (left) + detail panel (right)
- [x] Filter bar redesign: project selector, time range picker, log level multi-select, service/environment filters, full-text search, clear all
- [x] Log list items: level badge with `--level-*` colors, relative timestamps, Geist Mono messages, service/environment tags
- [x] Log detail panel: full message, stack trace via TerminalBlock, expandable JSON tree, error details, timing metrics
- [x] Keyboard navigation: j/k (next/prev), enter (detail), / (search), esc (close detail)
- [x] Live tail mode: WebSocket streaming with auto-scroll, pause button
- [x] Pagination: page numbers, items per page selector

### 2.4 Alert Management Redesign (`/alerts`) ✅ **COMPLETE**

- [x] Alert stats cards: Observatory styling with severity-colored accents
- [x] Filter bar: search, severity, project, date range — Observatory design
- [x] Tab filters: All | Active | Acknowledged | Snoozed | Resolved — with counts
- [x] Alert list items: severity-colored left border, status badge, SignalDot, metadata, tags, action dropdown
- [x] Bulk action bar: selection count, action buttons
- [x] Alert detail modal: Observatory card with timeline, triggering log, rule info
- [x] Split-pane integration with LogExplorerSplitPane

### 2.5 Project Dashboard Redesign (`/projects/[projectId]`) ✅ **COMPLETE**

**Completed**: March 3, 2026

- [x] Decomposed monolithic 930-line page into 10 modular components
- [x] Project header: name, SignalDot status (pulsing green/static danger), copyable ID, back-nav, actions
- [x] Quick stats: ObservatoryMetricCard components with variant coloring (default/success/warning/danger)
- [x] Tabbed content with Observatory styling:
  - Overview: HealthRing SVG, error rate progress, team section, service breakdown, environment stats
  - Errors: Severity-based analysis cards, top errors with "View in Logs" links
  - Performance: 3 metric cards, performance insights, response time LineChart
  - Usage: TerminalBlock API key display, rate limiting, tags, regenerate button
  - Recommendations: Priority badges, categorized action items with SignalDot bullets
- [x] Recharts theme: centralized `lib/charts/observatory-theme.ts` with CSS variable colors
- [x] Null guards on all analytics data access (prevents crashes on partial API responses)
- [x] Projects list page (`/projects`): Observatory tokens, SignalDot, signal button variant, `bg-data-purple/15`
- [x] Bug fixes: inverted isActive, removed console.logs, removed dead code

**Files created (10)**:
```
lib/charts/observatory-theme.ts
components/dashboard/projects/detail/index.ts
components/dashboard/projects/detail/ObservatoryMetricCard.tsx
components/dashboard/projects/detail/HealthRing.tsx
components/dashboard/projects/detail/ProjectDashboardHeader.tsx
components/dashboard/projects/detail/OverviewTab.tsx
components/dashboard/projects/detail/ErrorsTabContent.tsx
components/dashboard/projects/detail/PerformanceTabContent.tsx
components/dashboard/projects/detail/UsageTabContent.tsx
components/dashboard/projects/detail/RecommendationsTabContent.tsx
```

**Files modified (3)**:
```
app/(dashboard)/projects/[projectId]/page.tsx  ← rewritten as ~170-line orchestrator
app/(dashboard)/projects/page.tsx              ← Observatory token migration
components/dashboard/projects/utils.tsx        ← CHART_COLORS updated to CSS vars
```

### 2.6 Project Settings Redesign (`/projects/[projectId]/settings`) ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] Tabbed layout: General, Team, API & Security, SDK Config, Integrations, Advanced (with icons)
- [x] General: Inline editing for name/description, active toggle with useUpdateProject mutation, toast feedback
- [x] Team: Member list with role badges (Owner=signal, Admin=data-info, Viewer=muted), invite button, remove member
- [x] API & Security: Masked API key with show/copy/regenerate (useRegenerateApiKey), rate limit inputs with useUpdateRateLimit
- [x] SDK Config: Remote configuration form matching backend SDKConfig model (existing SDKConfigSettings component)
- [x] Integrations: Observatory-styled channel cards (Slack, Discord, Email, Webhook) with SignalDot status
- [x] Advanced: Archive (useArchiveProject/useRestoreProject), transfer, delete (useDeleteProject with confirm + redirect)

**Files modified (1)**:
```
app/(dashboard)/projects/[projectId]/settings/page.tsx ← Full Observatory redesign, all mutations connected
```

### 2.7 Auth Pages Redesign ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] Login: Observatory dark styling, Syne headline, DM Sans body, signal button variant, security features sidebar
- [x] Signup: Observatory styling, password strength indicator with Observatory CSS variables, benefits section with signal green checkmarks
- [x] Forgot password: Observatory centered form, passwordResetRequest API call enabled
- [x] Reset password: NEW page (`reset-password/[token]/page.tsx`) — password strength, auto-redirect on success
- [x] Session expiry: 401 interceptor in config.ts clears cookies, shows toast, redirects to login
- [x] Backend: Password reset flow (crypto token, SHA-256, NotificationService SMTP email)

**Files created (1)**:
```
app/(auth)/reset-password/[token]/page.tsx
```

**Files modified (7)**:
```
app/(auth)/login/page.tsx              ← Observatory redesign
app/(auth)/signup/page.tsx             ← Observatory redesign
app/(auth)/forgot-password/page.tsx    ← Observatory redesign + API call enabled
middleware.ts                          ← Added /forgot-password and /reset-password to public paths
lib/schemas/auth.ts                    ← Added resetPasswordSchema
services/auth.service.ts               ← Fixed payload field name
services/config.ts                     ← Session expiry 401 interceptor
```

### 2.8 Navigation & Global UI ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] Sidebar: Observatory tokens, pathname-based active link highlighting (signal green), SignalDot for project status, null guards on analytics, environment badge
- [x] Top bar: Search input replaced with command palette trigger button, Observatory tokens, notification dropdown with Observatory colors, cleanup of unused imports/variables
- [x] Command palette: Observatory tokens (text-text-muted, bg-bg-elevated), SignalDot for project active dots, removed unused imports (Star, Filter, Zap) and state (selectedTimeRange)
- [x] Notifications page: Emojis replaced with lucide icons (AlertOctagon, AlertTriangle, CheckCircle2, Info), Observatory status colors, SignalDot for unread indicator, signal button for "Mark All as Read"
- [x] Theme toggle: Observatory text colors, Tooltip wrapper
- [x] Bell icon in top bar with unread badge (bg-status-danger)
- [x] Breadcrumbs with Observatory text-text-muted/text-text-primary colors

**Files modified (5)**:
```
components/app-sidebar.tsx             ← Observatory tokens, active links, SignalDot
components/top-bar.tsx                 ← Observatory tokens, command palette trigger, cleanup
components/command-palette.tsx         ← Observatory tokens, SignalDot, cleanup
components/theme-toggle.tsx            ← Observatory text colors, tooltip
app/(dashboard)/notifications/page.tsx ← Lucide icons, Observatory tokens, SignalDot
```

---

## Phase 3: Complete Frontend Rewrite

**Goal**: Rewrite every dashboard page from scratch. The landing page (`/`) and SDK page (`/sdk`) are preserved. Every other page is redesigned with a clean architecture grounded in the actual data the backend serves. Every backend feature gets a UI.

**Why**: The backend exposes ~24 route files but only ~60% are surfaced in the current UI. Funnels, regressions, custom dashboards, AI suggestions, user preferences, environment analytics, session analytics, and source map management have no UI. The current frontend treats project context as optional, but the backend requires `projectId` for nearly every data endpoint. This rewrite fixes the architecture.

**Scope preserved**: Landing page, /sdk page, Observatory design tokens, shared components (SignalDot, TerminalBlock, SectionHeading), all shadcn/ui primitives.

---

### 3.1 Infrastructure (Foundation for Everything)

**Goal**: Build the data layer, state management, and layout components that every page depends on.

#### 3.1.1 Zustand Store Expansion

Expand `store/loghive-store.ts` with new slices:

```typescript
// New store slices
currentUser: { id, email, name } | null
currentProjectId: string | null
selectedTimeRange: '1h' | '6h' | '24h' | '7d' | '30d' | 'custom'
customTimeRange: { start: Date, end: Date } | null
selectedEnvironment: string | 'all'
autoRefreshEnabled: boolean
autoRefreshInterval: number // ms
sidebarCollapsed: boolean
detailPanelOpen: boolean
theme: 'dark' | 'light' | 'system'
```

#### 3.1.2 Global Hooks

| File | Hooks | Purpose |
|------|-------|---------|
| `hooks/useTimeRange.ts` | `useTimeRange` | Syncs URL param <-> Zustand time range, provides setter |
| `hooks/useProjectContext.ts` | `useProjectContext` | Reads `projectId` from URL, syncs to Zustand, provides project data |
| `hooks/useEnvironmentFilter.ts` | `useEnvironmentFilter` | Global environment filter, URL <-> Zustand sync |

#### 3.1.3 New Service Files

| File | Endpoints Covered |
|------|------------------|
| `services/analytics.service.ts` | 20+ analytics endpoints (errors, performance, activity, sessions, environments) |
| `services/funnel.service.ts` | Funnel analysis, popular paths |
| `services/regression.service.ts` | Regression detection, baseline, comparison |
| `services/customDashboard.service.ts` | Dashboard CRUD, widget CRUD, layout |
| `services/aiSuggestion.service.ts` | Get/accept AI suggestions |
| `services/userPreference.service.ts` | Favorites CRUD |
| `services/user.service.ts` | Profile, password change |

#### 3.1.4 New Hook Files

| File | Hooks |
|------|-------|
| `hooks/analytics.hook.ts` | ~22 hooks: `useErrorTimeline`, `useTopErrors`, `useErrorDistribution`, `useErrorStats`, `useErrorDetails`, `useErrorTrends`, `usePerformanceTimeline`, `useWebVitalsAnalytics`, `useResourcePerformance`, `usePagePerformance`, `usePerformanceScore`, `useSlowestEndpoints`, `useActivityFeed`, `useActivityStats`, `useSessions`, `useSessionDetail`, `useSessionTimeline`, `useSessionStats`, `useUserJourneys`, `useEnvironmentStats` |
| `hooks/funnel.hook.ts` | `useAnalyzeFunnel`, `usePopularPaths` |
| `hooks/regression.hook.ts` | `useDetectRegressions`, `useBaseline`, `useComparePerformance` |
| `hooks/customDashboard.hook.ts` | `useCustomDashboards`, `useCustomDashboard`, `useCreateDashboard`, `useUpdateDashboard`, `useDeleteDashboard`, `useUpdateLayout`, `useAddWidget`, `useUpdateWidget`, `useRemoveWidget`, `useDuplicateDashboard` |
| `hooks/aiSuggestion.hook.ts` | `useAISuggestions`, `useAcceptSuggestion` |
| `hooks/userPreference.hook.ts` | `useFavorites`, `useCheckFavorite`, `useAddFavorite`, `useRemoveFavorite` |
| `hooks/user.hook.ts` | `useProfile`, `useUpdateProfile`, `useChangePassword` |

#### 3.1.5 Project Context Layout

- Create `/projects/[projectId]/layout.tsx` that syncs URL `projectId` -> Zustand store
- All project-scoped pages inherit this layout

#### 3.1.6 Top Bar Enhancements

- [ ] Time range selector -> syncs to Zustand + URL params
- [ ] Environment filter dropdown (global)
- [ ] Auto-refresh toggle with interval indicator
- [ ] Breadcrumbs that resolve project names from React Query cache

#### 3.1.7 Sidebar Redesign

Three sections:
```
Section 1: Primary Nav
  Dashboard, Projects [count], Alerts [active count], Custom Dashboards

Section 2: Active Project (appears when project selected)
  [ProjectSelector dropdown -- name + SignalDot status]
    Overview, Logs, Errors, Performance, Web Vitals, Sessions,
    Activity Feed, Traces, Funnels, Regressions, Environments,
    Alerts, Source Maps, Settings

Section 3: Footer
  SDK Docs, Settings, System status [SignalDot], User [Logout]
```

#### 3.1.8 Layout Components

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Title, description, action buttons -- standardized page header |
| `TabLayout` | Tab bar with lazy-loaded content |
| `MasterDetailLayout` | Resizable split pane (list + detail panel) |
| `EmptyState` | Contextual empty state with icon, message, CTA |
| `SkeletonDashboard` | Loading skeleton for dashboard pages |
| `SkeletonTable` | Loading skeleton for table pages |
| `MetricCard` | KPI card with value, label, trend arrow, sparkline |
| `FilterBar` | Composable filter bar with search + chip dropdowns + action buttons |

---

### 3.2 Log Explorer (Most-Used Page)

**Route**: `/projects/[projectId]/logs`
**Layout**: Pattern B -- Explorer/Table (filter bar -> summary strip -> master-detail split pane)
**Primary Data**: `/:projectId/logs`, `logs/summary`, `logs/trends`, `logs/distinct-values/*`, saved searches

#### Components

| Component | Purpose |
|-----------|---------|
| `FilterBar` | Search, level filter, service filter, environment filter, time range -- composable chips |
| `StructuredQueryInput` | Supports `level:error AND service:auth` syntax |
| `SavedSearchSelector` | Load/save filter configurations |
| `LogTable` | Virtualized table (react-window) with column sorting, 10K+ row support |
| `LogRow` | Level icon, timestamp, message, service tag, expand toggle |
| `LogDetailPanel` | JSON tree, stack trace viewer, context tabs |
| `StackTraceViewer` | Formatted stack trace with source map resolution |
| `JsonTreeViewer` | Collapsible JSON tree for data/context/metadata |

#### Features

- [ ] Master-detail split pane: list (55%) + detail panel (45%), resizable drag handle
- [ ] Keyboard navigation: j/k to move through list, Enter to select, Escape to close panel
- [ ] Live tail mode via WebSocket with auto-scroll + pause button
- [ ] URL-driven filters: all filters live in URL params for deep-linking
- [ ] Structured query: `level:error AND service:auth` syntax parsed to API params
- [ ] Saved searches: persist filter configurations, load from dropdown
- [ ] Export: CSV/JSON download of filtered results
- [ ] Virtualized rendering: react-window for 10K+ row performance

---

### 3.3 Error & Performance Analytics

#### 3.3.1 Error Analytics Dashboard

**Route**: `/projects/[projectId]/errors`
**Layout**: Pattern C -- Analytics Dashboard (KPI cards -> tab bar -> chart + table)
**Primary Data**: `analytics/errors/timeline`, `errors/top`, `errors/distribution`, `errors/stats`, `errors/trends`

- [ ] Error KPI cards: total errors, error rate, unique errors, affected users
- [ ] Error timeline chart: errors over time with level breakdown
- [ ] Top errors table: grouped by message, sorted by frequency/impact
- [ ] Error distribution chart: pie/donut by level, service, environment
- [ ] Error trends: week-over-week comparison

**Route**: `/projects/[projectId]/errors/[errorId]`
- [ ] Error detail: full stack trace, occurrence timeline, affected environments
- [ ] Source map resolution: "De-minify" button for stack traces
- [ ] Occurrence list: paginated list of individual occurrences

#### 3.3.2 Performance Analytics Dashboard

**Route**: `/projects/[projectId]/performance`
**Layout**: Pattern C -- Analytics Dashboard
**Primary Data**: `analytics/performance/timeline`, `performance/web-vitals`, `performance/score`, `performance/pages`, `performance/slowest`, `performance/resources`

- [ ] Performance score card: overall score with trend
- [ ] Performance timeline: response time over time
- [ ] Slowest endpoints table: ranked by p95 latency
- [ ] Page performance table: per-page load times, LCP, CLS, INP
- [ ] Resource performance: breakdown by resource type (scripts, images, styles)

#### 3.3.3 Web Vitals Dashboard (Redesign)

**Route**: `/projects/[projectId]/web-vitals`
**Primary Data**: `web-vitals`, `web-vitals/history`, `web-vitals/pages`

- [ ] `WebVitalGauge` -- Circular gauge with good/needs-improvement/poor zones
- [ ] LCP, INP, CLS gauges with p75 values and Google thresholds
- [ ] Historical trend charts per vital
- [ ] Per-page breakdown table with ratings
- [ ] Rating distribution donut charts

#### Shared Chart Components

| Component | Purpose |
|-----------|---------|
| `TimeSeriesChart` | Recharts wrapper with zoom, brush, Observatory theme |
| `DistributionChart` | Pie/donut for categorical breakdowns |
| `BarChart` | Horizontal/vertical bars |
| `SparklineInline` | Tiny sparkline for table cells |
| `HealthBadge` | Colored badge (critical/poor/good/excellent) |
| `WebVitalGauge` | Circular gauge with performance zones |

---

### 3.4 Global Dashboard + Projects

#### 3.4.1 Global Dashboard

**Route**: `/dashboard`
**Layout**: Pattern A -- Overview Dashboard (metric cards -> primary chart -> 2-col grid -> table)
**Primary Data**: `dashboard/overview`, `dashboard/metrics`, `dashboard/realtime`, `dashboard/projects/health`, `alerts/stats`

- [ ] Cross-project command center: aggregate metrics across all projects
- [ ] Metric cards row: total logs, total errors, active alerts, projects count
- [ ] Primary chart: aggregate log volume over time
- [ ] Project health grid: card per project with health score, error rate, SignalDot status
- [ ] Recent alerts strip: latest alert events across all projects
- [ ] Real-time activity indicator: logs ingested/sec, WebSocket status

#### 3.4.2 Projects List

**Route**: `/projects`
**Primary Data**: `projects`, `projects/summary`, `preferences/favorites`

- [ ] Grid/list toggle view
- [ ] Project cards: name, status SignalDot, key metrics (logs, errors, health), favorite star
- [ ] Favorites section at top (pinned projects)
- [ ] Search and filter (by name, status, environment)
- [ ] Sort by: name, health score, recent activity, log count
- [ ] Quick actions: archive, duplicate, settings

#### 3.4.3 Project Overview

**Route**: `/projects/[projectId]`
**Layout**: Pattern A -- Overview Dashboard
**Primary Data**: `projects/:id`, `insights/:projectId`, `dashboard/overview`

- [ ] Project header: name, status, description, quick actions
- [ ] Key metrics row: log volume, error rate, p95 latency, health score
- [ ] Insights cards: AI-powered recommendations from insights endpoint
- [ ] Recent errors strip: latest error events
- [ ] Environment breakdown: traffic/errors per environment
- [ ] Team section: member avatars with roles

#### 3.4.4 Create Project

**Route**: `/projects/new`
- [ ] Step-by-step wizard: name + description -> environment -> SDK setup guide
- [ ] SDK code snippet with project API key
- [ ] "Waiting for first log" status with real-time detection

---

### 3.5 Alert System

#### 3.5.1 Global Alert Events

**Route**: `/alerts/events`
**Layout**: Pattern B -- Explorer/Table
**Primary Data**: `alerts` (user-scoped), `alerts/stats`

- [ ] Alert stats cards: total, active, acknowledged, resolved
- [ ] Filter bar: severity, status, project, date range, search
- [ ] Tab filters: All | Active | Acknowledged | Snoozed | Resolved (with counts)
- [ ] Alert event list: severity-colored left border, status badge, metadata
- [ ] Bulk actions: acknowledge, resolve, snooze selected
- [ ] Detail panel: timeline, triggering log, rule info, actions

#### 3.5.2 Alert Rules

**Route**: `/alerts/rules`
**Primary Data**: `alert-rules` per project

- [ ] Rule list with project grouping
- [ ] Rule card: name, conditions summary, status (active/paused), last triggered
- [ ] Create/edit rule form: `AlertRuleForm` with composite condition builder
- [ ] `ConditionBuilder`: visual AND/OR condition tree builder
- [ ] Rule testing: test rule against recent logs
- [ ] Snooze: time-based rule snoozing

**Route**: `/projects/[projectId]/alerts/rules`
- [ ] Project-scoped alert rules with same components
- [ ] AI suggestions integration: banner showing AI-suggested rules from `ai-suggestions/:projectId/suggestions`
- [ ] Accept/dismiss AI suggestions

#### 3.5.3 Alert Analytics

**Route**: `/alerts/analytics`
**Primary Data**: `alert-rules/analytics/:projectId`, `alert-rules/timeline/:projectId`

- [ ] MTTR (Mean Time To Resolve) metrics
- [ ] Noisiest rules: rules generating most alerts
- [ ] Alert frequency trends: timeline of alert volume
- [ ] Resolution rate: % of alerts resolved within SLA

#### 3.5.4 Escalation Policies

**Route**: `/alerts/escalation-policies`
- [ ] `EscalationPolicyEditor`: multi-level escalation configuration
- [ ] Visual timeline: Level 1 (5min) -> Level 2 (15min) -> Level 3 (30min)
- [ ] Notification channel selection per level

#### 3.5.5 Maintenance Windows

**Route**: `/alerts/maintenance-windows`
- [ ] `MaintenanceWindowScheduler`: date/time picker with recurrence options
- [ ] Active/upcoming/past windows list
- [ ] Affected rules and projects per window

---

### 3.6 Sessions, Traces, Activity

#### 3.6.1 Session List

**Route**: `/projects/[projectId]/sessions`
**Layout**: Pattern B -- Explorer/Table
**Primary Data**: `analytics/sessions`, `sessions/stats`

- [ ] Session list with user/device info, duration, event count, error indicator
- [ ] Filter by: date range, duration, has errors, user agent
- [ ] Session stats cards: total sessions, avg duration, error session %, bounce rate

#### 3.6.2 Session Detail

**Route**: `/projects/[projectId]/sessions/[sessionId]`
**Layout**: Pattern F -- Session Timeline
**Primary Data**: `analytics/sessions/:sessionId`, `sessions/:sessionId/timeline`

- [ ] `SessionTimeline`: horizontal timeline of session events
- [ ] Event markers: page views, clicks, errors, network requests, console logs
- [ ] Event detail panel: click event to see full context
- [ ] Session metadata: user agent, device, location, duration

#### 3.6.3 Trace List

**Route**: `/projects/[projectId]/traces`
**Layout**: Pattern B -- Explorer/Table
**Primary Data**: `traces`

- [ ] Trace list with service name, duration, span count, error indicator
- [ ] Filter by: service, min duration, status, date range
- [ ] Sort by: duration, timestamp, span count

#### 3.6.4 Trace Waterfall

**Route**: `/projects/[projectId]/traces/[traceId]`
**Layout**: Pattern E -- Trace Waterfall
**Primary Data**: `traces/:traceId`, `traces/:traceId/spans`

- [ ] `TraceWaterfall`: Gantt-chart span visualization with tree nesting
- [ ] `SpanDetailPanel`: tags, logs, duration, parent relationship for selected span
- [ ] Error spans highlighted in red
- [ ] Timeline view: chronological log list grouped by spanId

#### 3.6.5 Activity Feed

**Route**: `/projects/[projectId]/activity`
**Primary Data**: `analytics/activity/feed`, `activity/stats`

- [ ] Real-time event stream: page views, errors, performance events, user interactions
- [ ] Filter by event type
- [ ] Activity stats: events/sec, unique users, active pages
- [ ] Auto-refresh with WebSocket integration

---

### 3.7 Advanced Analytics

#### 3.7.1 Funnel Analysis

**Route**: `/projects/[projectId]/funnels`
**Layout**: Pattern G -- Funnel
**Primary Data**: `funnels/:projectId/popular-paths`, POST `funnels/:projectId/analyze`

- [ ] `FunnelVisualization`: stepped funnel with drop-off indicators and conversion rates
- [ ] Step builder: add/remove/reorder funnel steps (event type + optional filters)
- [ ] Popular paths display: auto-discovered common user journeys
- [ ] Drop-off table: per-step completion rate, time between steps

#### 3.7.2 Regression Detection

**Route**: `/projects/[projectId]/regressions`
**Primary Data**: `regressions/:projectId/detect`, `regressions/:projectId/baseline`

- [ ] `RegressionComparisonChart`: current period vs baseline with z-score overlay
- [ ] Regression list: detected regressions with severity, metric, affected endpoint
- [ ] Baseline display: p50/p95/p99 baseline values with confidence intervals
- [ ] Period comparison: side-by-side metric comparison between two time ranges

#### 3.7.3 Environment Comparison

**Route**: `/projects/[projectId]/environments`
**Primary Data**: `analytics/environments/stats`

- [ ] Environment comparison table: metrics per environment (production, staging, development)
- [ ] Traffic distribution chart
- [ ] Error rate comparison across environments
- [ ] Performance comparison across environments

#### 3.7.4 Custom Dashboards

**Route**: `/custom-dashboards`
**Primary Data**: `custom-dashboards`

- [ ] Dashboard list with name, widget count, last modified, shared indicator
- [ ] Create new dashboard button
- [ ] Duplicate/delete actions

**Route**: `/custom-dashboards/[dashboardId]`
**Primary Data**: `custom-dashboards/:id`, widget data

- [ ] Drag-and-drop widget canvas (react-grid-layout)
- [ ] Widget types: counter, chart, log-stream, alert-list, bar chart, table
- [ ] Widget configuration panel: data source, filters, time range, refresh interval
- [ ] Save/load layouts
- [ ] Share dashboard via link (isShared flag)

---

### 3.8 Settings & Auth

#### 3.8.1 User Settings Hub

**Route**: `/settings` (layout with vertical tab nav)
**Layout**: Pattern D -- Settings

| Sub-route | Purpose | Data |
|-----------|---------|------|
| `/settings/profile` | Name, email, avatar | GET/PUT `users/profile` |
| `/settings/password` | Change password | PUT `users/change-password` |
| `/settings/preferences` | UI preferences, favorites | `preferences/favorites` |

#### 3.8.2 Project Settings (Tabbed Layout)

**Route**: `/projects/[projectId]/settings`
**Layout**: Pattern D -- Settings (vertical tabs)

| Tab/Sub-route | Purpose | Data |
|---------------|---------|------|
| `/settings` (general) | Name, description, status | PUT `projects/:id` |
| `/settings/team` | Team members | `projects/:id/team-members` |
| `/settings/api-key` | API key management | `projects/:id` |
| `/settings/sdk-config` | SDK remote configuration | `projects/:projectId/config` |
| `/settings/rate-limit` | Rate limiting | PUT `projects/:id` |
| `/settings/sampling` | Sampling configuration | PUT `projects/:id` |
| `/settings/retention` | Data retention settings | PUT `projects/:id` |
| `/settings/integrations` | Slack/webhook/email | PUT `projects/:projectId/integration-settings` |

#### 3.8.3 Source Map Management

**Route**: `/projects/[projectId]/source-maps`
- [ ] Upload source map files (drag-and-drop)
- [ ] Source map list: release version, file count, upload date
- [ ] Delete source maps per release

#### 3.8.4 Auth Pages (Redesign)

| Route | Changes |
|-------|---------|
| `/login` | Add GitHub + Google OAuth buttons alongside email/password |
| `/signup` | Add OAuth registration options |

#### 3.8.5 Notifications

**Route**: `/notifications`
- [ ] Notification center with mark-as-read/unread
- [ ] Filter by type (alert, system, team)
- [ ] Notification preferences (which events trigger notifications)

---

### Route Summary (44 Total)

**Auth routes** (4 -- no sidebar):
`/login`, `/signup`, `/forgot-password`, `/reset-password/[token]`

**Global pages** (16 -- sidebar + topbar):
| Route | Purpose |
|-------|---------|
| `/dashboard` | Cross-project command center |
| `/projects` | All projects grid/list |
| `/projects/new` | Create project wizard |
| `/alerts` | Global alert hub (layout) |
| `/alerts/events` | All alert events across projects |
| `/alerts/rules` | All alert rules |
| `/alerts/analytics` | Alert trends, MTTR |
| `/alerts/escalation-policies` | Escalation policies |
| `/alerts/maintenance-windows` | Maintenance windows |
| `/custom-dashboards` | Custom dashboard list |
| `/custom-dashboards/[dashboardId]` | Dashboard view/edit |
| `/notifications` | Notification center |
| `/settings` | User settings hub (layout) |
| `/settings/profile` | User profile |
| `/settings/password` | Change password |
| `/settings/preferences` | UI preferences |

**Project-scoped pages** (24 -- under `/projects/[projectId]/`):
| Route | Purpose |
|-------|---------|
| `/projects/[projectId]` | Project overview |
| `/projects/[projectId]/logs` | Log explorer (master-detail) |
| `/projects/[projectId]/errors` | Error analytics |
| `/projects/[projectId]/errors/[errorId]` | Error detail |
| `/projects/[projectId]/performance` | Performance analytics |
| `/projects/[projectId]/web-vitals` | Core Web Vitals |
| `/projects/[projectId]/sessions` | Session list |
| `/projects/[projectId]/sessions/[sessionId]` | Session timeline |
| `/projects/[projectId]/traces` | Trace list |
| `/projects/[projectId]/traces/[traceId]` | Trace waterfall |
| `/projects/[projectId]/activity` | Real-time activity feed |
| `/projects/[projectId]/funnels` | Funnel analysis |
| `/projects/[projectId]/regressions` | Regression detection |
| `/projects/[projectId]/environments` | Environment comparison |
| `/projects/[projectId]/alerts` | Project-scoped alerts |
| `/projects/[projectId]/alerts/rules` | Project alert rules + AI suggestions |
| `/projects/[projectId]/source-maps` | Source map management |
| `/projects/[projectId]/settings` | Project settings (tabbed) |
| `/projects/[projectId]/settings/team` | Team members |
| `/projects/[projectId]/settings/api-key` | API key management |
| `/projects/[projectId]/settings/sdk-config` | SDK configuration |
| `/projects/[projectId]/settings/rate-limit` | Rate limiting |
| `/projects/[projectId]/settings/sampling` | Sampling config |
| `/projects/[projectId]/settings/retention` | Data retention |

---

### Key Architectural Decisions

1. **Project context in URL AND Zustand**: The `projectId` lives in the URL path for deep-linking, mirrored to Zustand via a sync hook in the project layout. Components use either `useParams()` or the store.

2. **Master-detail for log/alert inspection (not modals)**: Side panel (resizable split) keeps the list visible while inspecting details. Keyboard navigation: j/k to move, Enter to select, Escape to close.

3. **`/logs` redirects to project picker**: The backend requires `projectId` for all log endpoints. No "global" log search -- `/logs` shows a project picker then redirects to `/projects/[pid]/logs`.

4. **Time as a first-class citizen**: Every data page respects the global time range from Zustand/URL. Custom date ranges via calendar picker.

5. **WebSocket-driven cache invalidation**: WebSocket broadcasts (log ingested, alert triggered) automatically invalidate relevant React Query cache keys instead of relying solely on polling.

---

### Implementation Order

```
Phase A: Infrastructure -> services, hooks, layouts, store expansion
Phase B: Log Explorer -> filter bar, virtualized table, master-detail
Phase C: Error & Performance -> metric cards, charts, dashboards
Phase D: Global Dashboard + Projects -> command center, project list/overview
Phase E: Alert System -> events, rules, analytics, escalation, maintenance
Phase F: Sessions, Traces, Activity -> session replay, trace waterfall, feed
Phase G: Advanced Analytics -> funnels, regressions, environments, custom dashboards
Phase H: Settings & Auth -> user/project settings, source maps, OAuth
```

---

## Phase 4: Enterprise UI

**Goal**: Build frontend interfaces for organization management, billing, compliance, and enterprise security features.

> **Depends on**: Backend Phase 4 (Organization, Billing, Security models and endpoints)

### 4.1 Organization Management

**Routes**:
| Route | Purpose |
|-------|---------|
| `/organization` | Organization settings hub (layout with tabs) |
| `/organization/general` | Org name, slug, billing email, plan |
| `/organization/members` | Organization member list with roles (owner/admin/member/billing) |
| `/organization/teams` | Team management (create, members, project access) |
| `/organization/audit-log` | Audit trail viewer with filters (user, action, resource, date range) |

**Components**:
- [ ] `OrgSettingsLayout` -- Tabbed settings (General, Members, Teams, Audit Log)
- [ ] `MemberInviteForm` -- Email + role selector, bulk invite support
- [ ] `MemberTable` -- Sortable table with role badges, remove/change-role actions
- [ ] `TeamCard` -- Team name, member count, project access list, edit/delete
- [ ] `TeamEditor` -- Team name, add/remove members, configure project-level permissions (view/edit/admin)
- [ ] `AuditLogTable` -- Filterable, paginated table showing: timestamp, user, action, resource, IP, user agent
- [ ] `AuditLogDetail` -- Expandable detail panel with full change diff (JSON before/after)

**Services & Hooks**:
- [ ] `services/organization.service.ts` -- org CRUD, member management, team CRUD
- [ ] `hooks/organization.hook.ts` -- `useOrganization`, `useOrgMembers`, `useTeams`, `useAuditLog`

### 4.2 Billing & Subscription

**Routes**:
| Route | Purpose |
|-------|---------|
| `/billing` | Billing overview (current plan, usage meters) |
| `/billing/plans` | Plan comparison + upgrade/downgrade |
| `/billing/payment` | Payment method management |
| `/billing/invoices` | Invoice history + download |

**Components**:
- [ ] `BillingOverview` -- Current plan card, usage meters (logs, API calls, storage) with progress bars and thresholds (80%, 90%, 100%)
- [ ] `UsageMeter` -- Circular/bar visualization showing usage vs limit, with trend sparkline
- [ ] `PlanComparisonTable` -- Side-by-side feature comparison with checkmarks, current plan highlighted
- [ ] `PlanSelector` -- Plan cards with monthly/annual toggle, signal green highlight on recommended tier
- [ ] `UpgradeDialog` -- Confirm plan change with prorated price calculation
- [ ] `PaymentMethodForm` -- Stripe Elements integration (card input, billing address)
- [ ] `PaymentMethodCard` -- Display existing card (last 4 digits, expiry, brand icon)
- [ ] `InvoiceTable` -- Date, amount, status (paid/pending/failed), download PDF link
- [ ] `UsageAlertBanner` -- Persistent banner when approaching limits (80% yellow, 90% red)

**Services & Hooks**:
- [ ] `services/billing.service.ts` -- subscriptions, usage, invoices, payment methods
- [ ] `hooks/billing.hook.ts` -- `useSubscription`, `useUsage`, `useInvoices`, `usePaymentMethods`, `useChangePlan`, `useUpdatePaymentMethod`

### 4.3 Security & Compliance

**Routes**:
| Route | Purpose |
|-------|---------|
| `/settings/security` | MFA setup, session management |
| `/settings/tokens` | API token management (create, revoke, scope) |
| `/settings/privacy` | Data privacy controls, GDPR tools |

**Components**:
- [ ] `MFASetupWizard` -- Step-by-step TOTP setup: QR code display, verification input, backup codes
- [ ] `MFAStatusCard` -- Current MFA status with enable/disable toggle
- [ ] `SessionTable` -- Active sessions: device, browser, IP, last activity, "Revoke" button
- [ ] `LoginHistoryTable` -- Recent logins: timestamp, device, IP, location, success/failure badge
- [ ] `ApiTokenForm` -- Create token: name, scopes (checkboxes), expiration date picker
- [ ] `ApiTokenTable` -- Active tokens: name, scopes, last used, expiry, "Revoke" button
- [ ] `ApiTokenReveal` -- One-time token display after creation (masked, copy button, warning)
- [ ] `DataExportButton` -- Trigger GDPR data export (all user data as JSON/CSV)
- [ ] `DataDeletionForm` -- Right to deletion request with confirmation flow
- [ ] `RetentionPolicyCard` -- Display/edit data retention settings per org
- [ ] `ComplianceReportGenerator` -- Generate SOC 2 / GDPR compliance reports
- [ ] `IPAllowlistEditor` -- Add/remove IP addresses/ranges, test current IP

**Services & Hooks**:
- [ ] `services/security.service.ts` -- MFA, sessions, tokens, GDPR
- [ ] `hooks/security.hook.ts` -- `useMFASetup`, `useSessions`, `useLoginHistory`, `useApiTokens`, `useDataExport`

### 4.4 SSO/SAML

**Components**:
- [ ] `SSOConfigForm` -- SAML configuration: IDP URL, certificate, attribute mapping
- [ ] `SSOTestButton` -- Test SSO connection with result feedback
- [ ] `SSOLoginButton` -- "Sign in with SSO" on login page (appears when org has SSO enabled)

### 4.5 Admin Dashboard (Platform-Wide)

**Routes**:
| Route | Purpose |
|-------|---------|
| `/admin` | Platform admin overview |
| `/admin/users` | All users management |
| `/admin/organizations` | All organizations |
| `/admin/system` | System health, metrics, config |

**Components**:
- [ ] `AdminDashboard` -- Platform KPIs: total users, total orgs, total logs ingested, MRR, system health
- [ ] `AdminUserTable` -- Search/filter users, view details, impersonate, ban/unban
- [ ] `AdminOrgTable` -- All organizations with plan, usage, health
- [ ] `SystemHealthPanel` -- DB status, Redis status, queue depth, error rates, uptime

---

## Phase 5: Ecosystem UI

**Goal**: Build interfaces for the public-facing platform, documentation, integration marketplace, and developer tools.

> **Depends on**: Backend Phase 5 (Integrations, webhooks, public API)

### 5.1 Documentation Site (`/docs`)

**Routes**:
| Route | Purpose |
|-------|---------|
| `/docs` | Documentation home with search |
| `/docs/[...slug]` | Individual doc pages (MDX-based) |
| `/docs/api` | API reference (auto-generated from OpenAPI spec) |
| `/docs/sdk` | SDK reference with framework-specific guides |

**Components**:
- [ ] `DocsLayout` -- Sidebar table of contents + content area + on-page TOC (right rail)
- [ ] `DocSearch` -- Full-text search across all documentation (Algolia or custom)
- [ ] `CodeBlock` -- Enhanced TerminalBlock with language tabs (React/Vue/Next.js/Node), copy button, line highlighting
- [ ] `APIEndpointCard` -- Method badge (GET/POST/PUT/DELETE), path, description, try-it-out button
- [ ] `APIPlayground` -- Interactive API testing: parameter inputs, auth header, response preview
- [ ] `SDKMethodReference` -- Auto-generated from TypeScript types: method signature, params, return type, examples
- [ ] `VersionSelector` -- Documentation version switcher (v1, v2)
- [ ] `FeedbackWidget` -- "Was this helpful?" thumbs up/down + optional comment

**Content Structure** (MDX files):
```
docs/
  getting-started/
    quickstart.mdx
    installation.mdx
    first-project.mdx
  sdk/
    javascript.mdx
    react.mdx
    nextjs.mdx
    vue.mdx
    node.mdx
    configuration.mdx
    auto-instrumentation.mdx
    data-sanitization.mdx
  api/
    authentication.mdx
    logs.mdx
    projects.mdx
    alerts.mdx
    analytics.mdx
    webhooks.mdx
  guides/
    error-tracking.mdx
    performance-monitoring.mdx
    distributed-tracing.mdx
    custom-dashboards.mdx
    team-management.mdx
```

### 5.2 Public Status Page (`/status`)

**Components**:
- [ ] `StatusPage` -- Public (no auth required), Observatory dark theme
- [ ] `SystemStatusBanner` -- Current overall status: Operational / Degraded / Outage with SignalDot
- [ ] `ComponentStatusList` -- Individual component status: API, Dashboard, WebSocket, Database, SDK CDN
- [ ] `UptimeGraph` -- 90-day uptime visualization (green/yellow/red blocks per day)
- [ ] `IncidentTimeline` -- Recent incidents with status updates, timestamps, resolution notes
- [ ] `IncidentDetailPage` -- Full incident report with timeline of updates
- [ ] `StatusSubscribeForm` -- Email/webhook subscription for status updates
- [ ] `ResponseTimeChart` -- API response time over last 24h/7d/30d

### 5.3 Changelog (`/changelog`)

**Components**:
- [ ] `ChangelogPage` -- Reverse-chronological list of releases
- [ ] `ChangelogEntry` -- Date, version tag, category badges (Feature/Fix/Improvement/Breaking), description with screenshots
- [ ] `ChangelogFilter` -- Filter by category, search
- [ ] `ChangelogRSS` -- RSS feed generation
- [ ] `InAppChangelog` -- Small changelog widget in dashboard sidebar (shows unread count)

### 5.4 Integration Marketplace

**Routes**:
| Route | Purpose |
|-------|---------|
| `/integrations` | Integration marketplace (public browsable) |
| `/integrations/[slug]` | Individual integration detail + setup guide |
| `/settings/integrations` | User's connected integrations (authenticated) |

**Components**:
- [ ] `IntegrationGrid` -- Card grid of available integrations with search and category filter
- [ ] `IntegrationCard` -- Logo, name, category badge, short description, "Connect" button
- [ ] `IntegrationDetailPage` -- Full description, screenshots, setup instructions, pricing
- [ ] `IntegrationSetupWizard` -- Step-by-step OAuth flow for each integration
- [ ] `ConnectedIntegrationCard` -- Status (connected/disconnected), last sync, configuration, disconnect button

**Integrations to Support**:
- [ ] GitHub -- Link errors to issues, source code context
- [ ] Jira -- Create tickets from alerts
- [ ] PagerDuty -- Incident creation and escalation
- [ ] Slack -- Channel notifications with action buttons
- [ ] Discord -- Webhook notifications
- [ ] Microsoft Teams -- Connector notifications
- [ ] Webhook -- Custom HTTP webhook configuration

### 5.5 CLI Tool Documentation

- [ ] Installation guide for `monita` CLI
- [ ] Command reference: `monita init`, `monita logs`, `monita deploy`, `monita sourcemaps upload`
- [ ] CI/CD integration examples (GitHub Actions, GitLab CI, CircleCI)

### 5.6 Blog/Content (`/blog`)

- [ ] Blog listing page with category filters
- [ ] Blog post page (MDX-based)
- [ ] Author profiles
- [ ] Related posts sidebar
- [ ] Newsletter subscription (optional)

---

## Testing Strategy

### Component Tests (Phase 0+)
- [ ] Set up Vitest + React Testing Library
- [ ] Test all form components (validation, submission, error display)
- [ ] Test auth flow (login, signup, redirect)
- [ ] Test empty/error state rendering

### E2E Tests (Phase 2+)
- [ ] Set up Playwright
- [ ] Test critical flows: signup → create project → view dashboard
- [ ] Test log explorer: filter → search → view detail
- [ ] Test alert flow: create rule → view alert → acknowledge
- [ ] Test responsive behavior (mobile, tablet, desktop)

### Visual Regression Tests (Phase 1+)
- [ ] Snapshot tests for landing page sections
- [ ] Snapshot tests for Observatory component variants
- [ ] Chromatic or Percy for visual diff

### Accessibility Tests (Phase 1+)
- [ ] axe-core integration in test suite
- [ ] Keyboard navigation tests
- [ ] Screen reader testing (VoiceOver, NVDA)
- [ ] Color contrast verification against DESIGN.md targets

### Performance Tests (Phase 1+)
- [ ] Lighthouse CI in build pipeline
- [ ] Bundle size monitoring
- [ ] Core Web Vitals tracking (using Monita SDK — dogfooding!)

---

## File Structure (Target)

```
remote-logger/
├── app/
│   ├── (auth)/                     ← Auth pages (Observatory design)
│   ├── (dashboard)/                ← Dashboard pages (Observatory design)
│   ├── page.tsx                    ← Landing page (Observatory design)
│   └── globals.css                 ← Observatory CSS tokens
├── components/
│   ├── shared/                     ← Observatory design system components
│   │   ├── SignalDot.tsx
│   │   ├── TerminalBlock.tsx
│   │   ├── ObservatoryCard.tsx
│   │   ├── LogEntry.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── GlowButton.tsx
│   │   ├── BadgePill.tsx
│   │   └── CountUp.tsx
│   ├── landing/                    ← Landing page sections
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── HeroCanvas.tsx
│   │   ├── DashboardPreview.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── BentoGrid.tsx
│   │   ├── StatsBar.tsx
│   │   ├── IntegrationsSection.tsx
│   │   ├── Pricing.tsx
│   │   ├── ClosingCTA.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                  ← Dashboard feature components
│   ├── logs/                       ← Log explorer components
│   ├── alerts/                     ← Alert management components
│   ├── settings/                   ← Settings components
│   └── ui/                         ← shadcn/ui (Observatory-themed)
├── hooks/                          ← Custom hooks
│   ├── useScrollReveal.ts
│   ├── useCountUp.ts
│   └── ... (existing hooks)
├── lib/
│   ├── design-tokens.ts            ← TypeScript token constants
│   └── ... (existing libs)
└── ... (services, store, types)
```

---

*Last updated: March 4, 2026 — Phase 3 replaced with Complete Frontend Rewrite plan (44 routes, 8 implementation phases). Phase 4 Enterprise UI and Phase 5 Ecosystem UI fully detailed.*
