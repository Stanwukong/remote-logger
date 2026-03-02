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

### 2.1 Dashboard Layout Redesign

**Duration**: 3-4 days

- [ ] Rebuild sidebar with Observatory design:
  - `--bg-base` background, `--border-subtle` right border
  - Signal green active indicators
  - Project list with SignalDot health indicators
  - Collapsible with smooth animation
  - User menu at bottom with avatar
- [ ] Rebuild top bar:
  - Breadcrumb navigation
  - Global search trigger (Cmd+K badge)
  - Notification bell with unread count badge
  - Theme toggle (dark/light/system)
- [ ] Command palette rebuild: Observatory styling, Geist Mono for code results
- [ ] Toast styling: Observatory colors and typography

**Files to modify**:
```
components/app-sidebar.tsx         ← Observatory sidebar
components/top-bar.tsx             ← Observatory top bar
components/command-palette.tsx     ← Observatory command palette
```

### 2.2 Main Dashboard (`/dashboard`)

**Duration**: 3-4 days

- [ ] System status banner: Observatory styling with signal dot
- [ ] Key metrics grid: Observatory cards with glow effects on hover
  - Total Logs: large number, Geist Mono, trend arrow
  - Error Rate: red tint card when elevated
  - Success Rate: signal green tint
  - Team Members: neutral
- [ ] Health status widget: SVG ring with Observatory colors
- [ ] Dashboard tabs: Overview, Errors, Performance, Usage
  - Each tab progressively loaded
- [ ] Charts: Recharts with Observatory color palette
  - Line charts: signal green stroke, subtle fill
  - Bar charts: layered blues and greens
  - Area charts: gradient fills with low opacity
- [ ] Empty state: Observatory-styled getting started guide

### 2.3 Log Explorer Redesign (`/logs`)

**Duration**: 5-7 days

- [ ] Split-pane layout: log list (left) + detail panel (right)
- [ ] Filter bar redesign:
  - Project selector (dropdown with search)
  - Time range picker (preset + custom)
  - Log level multi-select (color-coded badges)
  - Service/environment filters (dynamic chips)
  - Full-text search with Geist Mono
  - Clear all / Reset button
- [ ] Log list items:
  - Level badge with `--level-*` colors
  - Timestamp (relative, absolute on hover)
  - Message in Geist Mono (truncated)
  - Service and environment tags
  - Event type icon
- [ ] Log detail panel:
  - Full message (Geist Mono)
  - Stack trace with syntax highlighting (Observatory syntax colors)
  - Context/metadata as expandable JSON tree
  - Error details in structured layout
  - Timing metrics
  - User agent parsed display
- [ ] Keyboard navigation: j/k (next/prev), enter (detail), / (search), esc (close detail)
- [ ] Live tail mode: WebSocket streaming with auto-scroll, pause button
- [ ] Pagination: page numbers, items per page selector
- [ ] Saved searches dropdown (when backend supports it)

### 2.4 Alert Management Redesign (`/alerts`)

**Duration**: 4-5 days

- [ ] Alert stats cards: Observatory styling with severity-colored accents
- [ ] Filter bar: search, severity, project, date range — Observatory design
- [ ] Tab filters: All | Active | Acknowledged | Snoozed | Resolved — with counts
- [ ] Alert list items:
  - Severity-colored left border (not just badge)
  - Status badge with signal dot
  - Title, message, metadata
  - Time (relative), project, environment, count
  - Tags
  - Action dropdown with Observatory styling
- [ ] Bulk action bar: selection count, action buttons
- [ ] Create alert modal: multi-step form with condition builder
- [ ] Alert detail modal: Observatory card with timeline, triggering log, rule info
- [ ] Alert rule management page (sub-page or modal)

### 2.5 Project Dashboard Redesign (`/projects/[projectId]`)

**Duration**: 4-5 days

- [ ] Project header: name, status signal dot, ID (copyable), actions
- [ ] Quick stats: Observatory metric cards
- [ ] Tabbed content with Observatory styling:
  - Overview: Health ring (SVG), service breakdown, environment stats
  - Errors: Error timeline chart, top errors ranking, severity distribution
  - Performance: Response times, p95/p99, slow endpoints, page loads
  - Usage: API key management, rate limits, SDK config
  - Recommendations: AI-generated action items (when available)
- [ ] Interactive charts with hover tooltips and click drill-down
- [ ] Recharts theme: Observatory colors

### 2.6 Project Settings Redesign (`/projects/[projectId]/settings`)

**Duration**: 3-4 days

- [ ] Tabbed layout: General, Team, API & Security, SDK Config, Integrations, Advanced
- [ ] General: Inline editing for name/description, archive toggle, delete with confirmation
- [ ] Team: Member list with role badges, add member form, role change dropdown
- [ ] API & Security: Masked API key with show/copy/regenerate, rate limit inputs
- [ ] SDK Config: Remote configuration form matching backend SDKConfig model
- [ ] Integrations: Channel configuration cards (Slack, Email, Webhook)
- [ ] Advanced: Data retention, export, ownership transfer

### 2.7 Auth Pages Redesign

**Duration**: 2-3 days

- [ ] Login: Observatory dark styling, Syne headline, DM Sans body
  - Form with Observatory inputs
  - Security features sidebar
  - OAuth buttons (GitHub, Google) when backend supports
- [ ] Signup: Two-column layout
  - Password strength indicator with Observatory colors
  - Benefits column with signal green checkmarks
- [ ] Forgot password: Simple centered form
- [ ] All auth pages: consistent layout, subtle constellation background

### 2.8 Notification Center (`/notifications`)

**Duration**: 1-2 days

- [ ] Notification list: Observatory cards, grouped by day
- [ ] Type icons with severity colors
- [ ] Unread indicator (signal dot or bold styling)
- [ ] Mark as read (individual + all)
- [ ] Bell icon in top bar with unread badge
- [ ] Real-time notification delivery via WebSocket

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

- [ ] Dashboard builder page: drag-and-drop grid
- [ ] Widget types: metric card, line chart, bar chart, table, pie chart, log feed
- [ ] Widget configuration: data source, filters, time range
- [ ] Save/load dashboard layouts
- [ ] Share dashboard via link

### 3.3 Advanced Analytics

- [ ] Funnel visualization: step-by-step with conversion rates
- [ ] Performance comparison: side-by-side period comparison
- [ ] Session explorer: timeline of user events within a session
- [ ] Error impact dashboard: errors ranked by impact score

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

*Last updated: March 2026*
