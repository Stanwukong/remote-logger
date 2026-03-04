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

## Phase 3: Intelligence UI

**Goal**: Build interfaces for AI insights and advanced analytics.

### 3.1 Insights Page (`/projects/[projectId]/insights`)

- [ ] AI insight cards with sparkle/AI icon
- [ ] Categorized insights: Errors, Performance, Usage, Recommendations
- [ ] Each insight: title, description, severity indicator, action button
- [ ] Natural language query bar at top
- [ ] Loading state: thinking animation (subtle pulse)
- [ ] Cache indicator (last generated, refresh button)

### 3.2 Custom Dashboards

**Backend Ready**: `/api/v1/custom-dashboards` — Full CRUD + widget management

- [ ] Dashboard builder page: drag-and-drop grid (react-grid-layout)
- [ ] Widget types: metric card (`counter`), line chart (`chart`), bar chart, table, log feed (`log-stream`), alert list (`alert-list`)
- [ ] Widget configuration panel: data source, filters, time range, chart type, refresh interval
- [ ] Save/load dashboard layouts (PUT `/:dashboardId/layout`)
- [ ] Add/update/remove individual widgets (POST/PUT/DELETE `/:dashboardId/widgets/:widgetId`)
- [ ] Share dashboard via link (isShared flag)
- [ ] Duplicate dashboard (POST `/:dashboardId/duplicate`)
- [ ] API service: `services/customDashboard.service.ts`
- [ ] React Query hooks: `hooks/customDashboard.hook.ts`

**Backend Endpoints Available**:
| Method | Path | Description |
|--------|------|-------------|
| GET | `/custom-dashboards` | List user's dashboards |
| POST | `/custom-dashboards` | Create dashboard |
| GET | `/custom-dashboards/:id` | Get single dashboard |
| PUT | `/custom-dashboards/:id` | Update metadata |
| DELETE | `/custom-dashboards/:id` | Delete |
| PUT | `/custom-dashboards/:id/layout` | Update widget layout |
| POST | `/custom-dashboards/:id/widgets` | Add widget |
| PUT | `/custom-dashboards/:id/widgets/:widgetId` | Update widget |
| DELETE | `/custom-dashboards/:id/widgets/:widgetId` | Remove widget |
| POST | `/custom-dashboards/:id/duplicate` | Clone |

### 3.3 Advanced Analytics

**Backend Ready**: Funnels (`/api/v1/funnels`), Regressions (`/api/v1/regressions`), Environment Stats, AI Suggestions

- [ ] Funnel visualization: step-by-step with conversion rates and dropoff (POST `/funnels/:projectId/analyze`)
- [ ] Popular user paths display (GET `/funnels/:projectId/popular-paths`)
- [ ] Performance regression dashboard: current vs baseline with severity badges (GET `/regressions/:projectId/detect`)
- [ ] Performance baseline display with p50/p95/p99 (GET `/regressions/:projectId/baseline`)
- [ ] Period comparison view: side-by-side (POST `/regressions/:projectId/compare`)
- [ ] Environment stats cards: per-environment breakdown (GET `/analytics/:projectId/environments/stats`)
- [ ] Session explorer: timeline of user events within a session (existing: GET `/analytics/:projectId/sessions/*`)
- [ ] Error impact dashboard: errors ranked by impact score
- [ ] AI alert suggestions page: review and accept rule suggestions (GET/POST `/ai-suggestions/:projectId/suggestions`)

### 3.4 User Profile & Settings (NEW)

**Backend Ready**: `/api/v1/users/profile`, `/api/v1/users/change-password`, `/api/v1/users/oauth/login`

- [ ] Profile page (`/settings/profile`): display/edit firstName, lastName, avatarUrl
- [ ] Change password form (`/settings/security`): current + new password with strength indicator
- [ ] OAuth connection buttons: "Connect GitHub" / "Connect Google" (POST `/users/oauth/login`)
- [ ] API service: `services/user.service.ts` — add `getProfile`, `updateProfile`, `changePassword`
- [ ] React Query hooks: `hooks/user.hook.ts`

### 3.5 Project Favorites (NEW)

**Backend Ready**: `/api/v1/preferences/favorites`

- [ ] Star/favorite button on project cards and project detail page
- [ ] Favorites section in sidebar or dashboard overview
- [ ] API service: `services/userPreference.service.ts` — add `getFavorites`, `addFavorite`, `removeFavorite`
- [ ] React Query hooks: `hooks/userPreference.hook.ts`
- [ ] Optimistic updates for instant star toggle feedback

### 3.6 SDK Feature Visualization

**Goal**: Surface the new SDK Phase 2 capabilities (web vitals, distributed tracing, breadcrumbs, environment snapshots, source maps, remote config) in the dashboard UI.

> **Depends on**: Backend Phase 2.5 (SDK Feature Integration) — endpoints must be available before these UIs can function. Build with mock data first, wire to real API when backend is ready.

#### 3.6.1 Web Vitals Dashboard (`/projects/[projectId]/web-vitals`) ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] **VitalCard**: Observatory metric card with Google threshold rating (good/needs-improvement/poor), p75 primary + p50/p95 secondary
- [x] **WebVitalsChart**: Recharts AreaChart with ReferenceLine thresholds, time range selector
- [x] **WebVitalsPageTable**: Sortable per-page table with SignalDot ratings
- [x] **RatingDistribution**: Donut PieChart showing % good/needs-improvement/poor
- [x] **Google Threshold Reference**: Footer with LCP/CLS/INP thresholds
- [x] **Navigation**: "Web Vitals" link added under active projects in sidebar

**Files created (7)**: `services/webVitals.service.ts`, `hooks/webVitals.hook.ts`, `VitalCard.tsx`, `WebVitalsChart.tsx`, `WebVitalsPageTable.tsx`, `RatingDistribution.tsx`, `web-vitals/page.tsx`
**Files modified (1)**: `app-sidebar.tsx`

#### 3.6.2 Distributed Tracing UI (`/projects/[projectId]/traces`) ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] **Trace List Page**: Filterable table with time range, min duration, status, service name filters
- [x] **Trace Detail Page**: Header with copyable trace ID, duration, span count
- [x] **Waterfall View**: Horizontal span bars with tree nesting, error spans in red, click to select
- [x] **Span Detail Panel**: Selected span's attributes, timing, parent relationship
- [x] **Timeline View**: Chronological log list grouped by spanId with level badges
- [x] **Navigation**: "Traces" link added under active projects in sidebar

**Files created (9)**: `services/trace.service.ts`, `hooks/trace.hook.ts`, `TraceList.tsx`, `TraceWaterfall.tsx`, `SpanDetail.tsx`, `TraceTimeline.tsx`, `traces/page.tsx`, `traces/[traceId]/page.tsx`
**Files modified (1)**: `app-sidebar.tsx`

#### 3.6.3 Breadcrumb Trail & Environment Snapshot (Log Detail Enhancement) ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] **Breadcrumb Trail**: Vertical timeline with category badges, relative timestamps, level-based colors, expandable data, collapsible section
- [x] **Environment Snapshot**: Observatory card with URL, viewport, scroll, network (SignalDot), memory (progress bar), collapsible
- [x] **Trace Link**: "View Full Trace" link when log has traceId
- [x] **Release Badge**: Shows `v{release}` in log detail header

**Files created (2)**:
```
components/logs/enhanced/BreadcrumbTrail.tsx
components/logs/enhanced/EnvironmentSnapshot.tsx
```

**Files modified**: `EnhancedLogDetailPanel.tsx`, `EnhancedLogListItem.tsx`, `LogListItem.tsx`, `LogsDetailsDialog.tsx`

#### 3.6.4 Source Map Resolved Stack Traces (Error Detail Enhancement) ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] "De-minify" button shown when error log has `release` field and stack trace
- [x] Calls `POST /:projectId/sourcemaps/resolve` with `{ release, stackTrace }`
- [x] Resolved stack trace displayed with original file paths, line/column numbers
- [x] Toggle between minified and resolved views
- [x] React Query caching keyed by `logId + release`
- [x] Error state when source maps unavailable
- [x] Integrated into EnhancedLogDetailPanel and LogsDetailsDialog

**Files created (3)**: `services/sourceMap.service.ts`, `hooks/sourceMap.hook.ts`, `components/dashboard/logs/ResolvedStackTrace.tsx`
**Files modified (2)**: `EnhancedLogDetailPanel.tsx`, `LogsDetailsDialog.tsx`

#### 3.6.5 SDK Remote Configuration Management (`/projects/[projectId]/settings` → "SDK Config" tab)

**Backend Endpoints** (existing + Phase 2.5.2):
- `GET /projects/:projectId/config` (JWT) — get current SDK config
- `PUT /projects/:projectId/config` (JWT) — update SDK config

**UI Components**:
- [ ] **SDK Config Form** in project settings "SDK Config" tab:
  - **Log Level**: Dropdown selector (trace → fatal)
  - **Batching**: Number inputs for `batchSize` (1-100) and `flushIntervalMs` (1000-60000)
  - **Auto-Capture Toggles**: Switch components for each flag:
    - Errors, Performance, User Interactions, Network Requests, Console Messages, Page Views
  - **Sanitization**: Preset selector (STRICT / BALANCED / LENIENT), enabled toggle
  - **Save** button with optimistic update
  - **Reset to Defaults** button
- [x] **Live Preview**: TerminalBlock showing SDK initialization code reflecting current form state (with masked API key)
- [x] **Status Indicator**: SignalDot with "Remote config active" and last sync timestamp

**Enhancement added** to existing `components/settings/SDKConfigSettings.tsx` (no new files needed)

#### 3.6.6 Release Tracking ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] **Release filter**: Text input in filter bar with `font-mono` styling
- [x] **Release column**: Release version tag shown in log list items (both enhanced and legacy)
- [ ] **Release comparison**: In error analytics, show error counts per release version (deferred — needs dedicated endpoint)
- [x] **Release badge**: `v{release}` badge in log detail panel header and log details dialog

**Files modified**: `ObservatoryFilterBar.tsx`, `EnhancedLogExplorer.tsx`, `EnhancedLogListItem.tsx`, `LogListItem.tsx`, `LogsDetailsDialog.tsx`

#### 3.6.7 Offline Queue Indicator ✅ **COMPLETE**

**Completed**: March 4, 2026

- [x] "Offline" badge shown on log list items when `data.offlineQueued` or `metadata.offlineQueued` is true
- [x] WifiOff icon info banner in log detail panels for offline-queued logs
- [x] Integrated into EnhancedLogListItem, LogListItem, EnhancedLogDetailPanel, LogsDetailsDialog

---

### Implementation Order (Phase 3.6)

```
Step 1: SDK Config Management (3.6.5)        ← uses existing backend endpoints
Step 2: Breadcrumbs + Environment (3.6.3)     ← enhances existing log detail, no new endpoints
Step 3: Release Tracking (3.6.6)              ← uses existing distinct-values endpoint
Step 4: Web Vitals Dashboard (3.6.1)          ← needs backend Phase 2.5.4
Step 5: Distributed Tracing UI (3.6.2)        ← needs backend Phase 2.5.3
Step 6: Source Map Viewer (3.6.4)             ← needs backend Phase 2.5.5
Step 7: Offline Indicator (3.6.7)             ← cosmetic, lowest priority
```

**Note**: Steps 1-3 can begin immediately (existing APIs). Steps 4-6 require backend Phase 2.5 to be implemented first.

### New Files Summary (Phase 3.6)

| File | Purpose |
|------|---------|
| `app/(dashboard)/projects/[projectId]/web-vitals/page.tsx` | Web Vitals dashboard page |
| `app/(dashboard)/projects/[projectId]/traces/page.tsx` | Trace list page |
| `app/(dashboard)/projects/[projectId]/traces/[traceId]/page.tsx` | Trace detail page |
| `components/dashboard/web-vitals/*.tsx` | 5 web vital components |
| `components/dashboard/traces/*.tsx` | 5 trace visualization components |
| `components/dashboard/logs/BreadcrumbTrail.tsx` | Breadcrumb timeline |
| `components/dashboard/logs/EnvironmentSnapshot.tsx` | Environment snapshot card |
| `components/dashboard/logs/ResolvedStackTrace.tsx` | De-minified stack trace |
| `components/dashboard/settings/SourceMapsTab.tsx` | Source map management |
| `components/dashboard/settings/SDKConfigTab.tsx` | SDK remote config form |
| `services/webVitals.service.ts` | Web vitals API client |
| `services/trace.service.ts` | Trace API client |
| `services/sourceMap.service.ts` | Source map API client |
| `services/sdkConfig.service.ts` | SDK config API client |
| `hooks/webVitals.hook.ts` | Web vitals React Query hooks |
| `hooks/trace.hook.ts` | Trace React Query hooks |
| `hooks/sourceMap.hook.ts` | Source map React Query hooks |
| `hooks/sdkConfig.hook.ts` | SDK config React Query hooks |

---

## Phase 4: Enterprise UI

### 4.1 Organization Pages
- [ ] `/organization` — org settings, teams, members
- [ ] `/organization/teams` — team management
- [ ] `/organization/audit-log` — audit trail viewer

### 4.2 Billing Pages
- [ ] `/billing` — current plan, usage meters, upgrade/downgrade
- [ ] `/billing/invoices` — invoice history
- [ ] `/billing/payment` — payment method management

### 4.3 Security Pages
- [ ] `/settings/security` — MFA setup, session management, login history
- [ ] `/settings/tokens` — API token management

### 4.4 Admin Panel
- [ ] `/admin` — platform-wide admin dashboard (users, logs, health, revenue)

---

## Phase 5: Ecosystem UI

### 5.1 Documentation Site
- [ ] `/docs` — comprehensive documentation with search
- [ ] SDK reference with code examples
- [ ] API reference with interactive playground
- [ ] Integration guides

### 5.2 Public Pages
- [ ] `/status` — public status page with incident history
- [ ] `/changelog` — release notes with version history
- [ ] `/blog` — content section (optional, may use external CMS)

### 5.3 Integration Management
- [ ] Integration marketplace page
- [ ] OAuth connection flows
- [ ] Integration status and configuration

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

*Last updated: March 4, 2026 — Phase 3.6 added: SDK Feature Visualization (web vitals, tracing, breadcrumbs, source maps, remote config, release tracking)*
