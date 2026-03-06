# Monita Frontend Dashboard

**Monita** is a premium observability and logging platform that helps developers monitor, debug, and optimize their applications in real-time. This repository contains the **frontend dashboard application** — a responsive, modern web interface built with Next.js 15 and React 19 that provides comprehensive log analytics, error tracking, performance monitoring, and alert management.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Folder Structure](#folder-structure)
- [Design System](#design-system)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Learn More](#learn-more)

## Overview

Monita Dashboard is the visual command center for managing your application observability. Monitor logs, errors, performance metrics, and configure sophisticated alert rules—all from one intuitive interface.

**Live Deployments:**
- Production: [https://loghive.vercel.app](https://loghive.vercel.app)
- Local Development: `http://localhost:3000`

**Related Repositories:**
- Backend API: [logger_backend](https://github.com/Stanwukong/logger_backend)
- JavaScript SDK: [loghive-sdk](https://github.com/Stanwukong/loghive-sdk) (npm: `monita`)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.10 | App Router, server components, Turbopack |
| **React** | 19.1.0 | UI library with hooks and suspense |
| **TypeScript** | 5.x | Type-safe development |
| **TailwindCSS** | 4.x | Utility-first styling with custom Observatory design system |
| **Zustand** | 5.0.7 | Global state management (time range, selected project) |
| **TanStack React Query** | 5.84.1 | Data fetching, caching, server state management |
| **Recharts** | 2.15.4 | Interactive charting and data visualization |
| **shadcn/ui** | Latest | UI component library built on Radix primitives |
| **GSAP** | 3.14.2 | Advanced animations (NOT Framer Motion) |
| **Fonts** | Custom | Syne (display), DM Sans (body), Geist Mono (code) |

## Deployment

### Production

The frontend is deployed to Vercel and automatically builds on push to `main`:

```
https://loghive.vercel.app
```

**Environment Variables (Production):**
```
NEXT_PUBLIC_API_BASE_URL=https://loghive-server.vercel.app/api/v1
```

### Local Development

```
http://localhost:3000
```

**Environment Variables (Local):**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

## Quick Start

### Prerequisites

- Node.js 18+ (or npm 10+)
- Backend API running at `http://localhost:5000` (for local development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Stanwukong/monita.git
cd monita/remote-logger
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. Configure the API endpoint in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### Development Server

Start the development server with Turbopack for fast refreshes:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically reload when you make changes.

### Build for Production

```bash
npm run build
npm run start
```

This creates an optimized production build and starts the server.

## Environment Setup

### .env.local Configuration

Create a `.env.local` file in the project root with the following variables:

```bash
# API Base URL (required)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Next.js/Vercel (optional)
NODE_ENV=development
```

**Important Notes:**

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- All other variables are server-side only
- The API base URL is appended with endpoints like `/projects`, `/logs`, etc.
- Ensure the backend API is running and accessible at this URL

## Development

### Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Code Style

- **TypeScript**: Use strict mode. Avoid `any` unless absolutely necessary.
- **Components**: Use React hooks and server components where appropriate.
- **Naming**: `PascalCase` for components, `camelCase` for utilities and hooks.
- **Imports**: Absolute imports preferred (configured in `tsconfig.json`).

### Testing

The codebase includes:
- Component testing with React Testing Library (when needed)
- E2E tests with Playwright (for critical user flows)

Run tests:

```bash
npm test
npm run test:e2e
```

## Folder Structure

```
remote-logger/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Authentication pages (unauthenticated)
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (dashboard)/                  # Main dashboard (protected by middleware)
│   │   ├── layout.tsx                # Shared dashboard layout (sidebar, header)
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── projects/                 # Project management
│   │   │   ├── page.tsx              # Projects list
│   │   │   └── [id]/                 # Per-project pages
│   │   │       ├── logs/
│   │   │       ├── errors/
│   │   │       ├── performance/
│   │   │       ├── web-vitals/
│   │   │       ├── network/
│   │   │       ├── interactions/
│   │   │       ├── console/
│   │   │       ├── pageviews/
│   │   │       ├── sessions/
│   │   │       ├── activity/
│   │   │       ├── traces/
│   │   │       ├── funnels/
│   │   │       ├── regressions/
│   │   │       ├── insights/
│   │   │       ├── settings/
│   │   │       └── source-maps/
│   │   ├── alerts/                   # Alert management
│   │   │   ├── rules/
│   │   │   ├── events/
│   │   │   ├── analytics/
│   │   │   ├── escalation-policies/
│   │   │   └── maintenance-windows/
│   │   ├── custom-dashboards/        # User-configurable dashboards
│   │   └── settings/                 # User settings, profile, preferences
│   ├── (landing)/                    # Public landing page
│   │   └── page.tsx
│   ├── layout.tsx                    # Root layout
│   ├── error.tsx                     # Global error boundary
│   └── not-found.tsx                 # 404 page
│
├── components/                       # Reusable React components (100+)
│   ├── shared/                       # Shared across all pages
│   │   ├── PageHeader.tsx            # Page title + actions header
│   │   ├── MetricCard.tsx            # KPI cards with sparklines
│   │   ├── Sparkline.tsx             # Tiny inline charts
│   │   ├── TimeSeriesChart.tsx       # Main time-series visualization
│   │   ├── ObservatoryBarChart.tsx   # Styled bar chart
│   │   ├── SignalDot.tsx             # Status indicator dots
│   │   ├── TerminalBlock.tsx         # Code/terminal display
│   │   ├── SectionHeading.tsx        # Section title component
│   │   ├── SkeletonDashboard.tsx     # Loading skeleton
│   │   └── ...
│   ├── ui/                           # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── checkbox.tsx
│   │   ├── popover.tsx
│   │   ├── tooltip.tsx
│   │   ├── alert.tsx
│   │   ├── accordion.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   └── ...
│   ├── landing/                      # Landing page components
│   │   ├── Hero.tsx                  # Hero section with CTA
│   │   ├── HeroCanvas.tsx            # Interactive constellation canvas
│   │   ├── ProblemSection.tsx        # Problem/value prop section
│   │   ├── BentoGrid.tsx             # Feature grid layout
│   │   ├── StatsBar.tsx              # Statistics display
│   │   ├── Pricing.tsx               # Pricing table
│   │   ├── ClosingCTA.tsx            # Final call-to-action
│   │   └── ...
│   ├── alerts/                       # Alert-related components
│   │   ├── AlertRuleForm.tsx         # Create/edit alert rules
│   │   ├── AlertRulesList.tsx        # List of alert rules
│   │   ├── AlertEventsList.tsx       # Triggered alert events
│   │   ├── AlertAnalytics.tsx        # Alert trend charts
│   │   └── ...
│   ├── logs/                         # Log explorer components
│   │   ├── LogExplorer.tsx           # Main log filtering UI
│   │   ├── LogTable.tsx              # Log entries table
│   │   ├── LogDetailPanel.tsx        # Side panel with full log details
│   │   ├── LogFilters.tsx            # Filter controls
│   │   ├── LogSearch.tsx             # Full-text search
│   │   └── ...
│   └── dashboard/                    # Dashboard-specific components
│       ├── DashboardGrid.tsx         # Multi-project overview grid
│       ├── ProjectHealthCard.tsx     # Per-project health indicator
│       ├── RecentAlertsWidget.tsx    # Recent alerts list
│       └── ...
│
├── hooks/                            # Custom React hooks + React Query hooks
│   ├── useTimeRange.ts               # Global time range selector
│   ├── useSelectedProject.ts         # Global selected project
│   ├── useDashboardData.ts           # Main dashboard data fetching
│   ├── useAnalyticsData.ts           # Analytics-specific queries
│   ├── useAlerts.ts                  # Alert management hooks
│   ├── useProjects.ts                # Project CRUD hooks
│   ├── useCustomDashboards.ts        # Custom dashboard hooks
│   ├── useGsapAnimations.ts          # GSAP animation helper
│   └── ...
│
├── services/                         # API integration layer (axios-based)
│   ├── config.ts                     # Axios instance with auth interceptor
│   ├── dashboard.service.ts          # Dashboard endpoints
│   ├── logs.service.ts               # Log endpoints
│   ├── alerts.service.ts             # Alert endpoints
│   ├── projects.service.ts           # Project CRUD endpoints
│   ├── users.service.ts              # User auth endpoints
│   ├── custom-dashboards.service.ts  # Custom dashboard endpoints
│   └── ...
│
├── store/                            # Zustand global state
│   └── loghive-store.ts              # Time range, selected project, preferences
│
├── lib/                              # Utilities and helpers
│   ├── format-utils.ts               # formatCompact, formatPercent, formatDuration, etc.
│   ├── chart-theme.ts                # Observatory chart styling for Recharts
│   ├── query-client.ts               # React Query configuration
│   ├── cn.ts                         # TailwindCSS class merging utility
│   ├── date-utils.ts                 # Date/time helpers
│   └── ...
│
├── types/                            # TypeScript type definitions
│   ├── dashboard.ts                  # Dashboard types
│   ├── logs.ts                       # Log-related types
│   ├── alerts.ts                     # Alert types
│   ├── projects.ts                   # Project types
│   └── ...
│
├── app.tsx                           # Root component
├── globals.css                       # Global styles, CSS variables, Observatory tokens
├── globals-animations.css            # CSS animations (signal-pulse, dot-grid)
├── tailwind.config.ts                # TailwindCSS configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## Design System

Monita uses the **Observatory design system** — a dark-first, signal-focused design language optimized for monitoring and data visualization.

### Color Palette

All colors are defined as CSS custom properties in `globals.css` and registered as Tailwind utilities:

**Backgrounds (Dark Theme):**
- `--void`: #060b14 (darkest, base background)
- `--base`: #0b1220 (secondary background)
- `--surface`: #111c2e (card/component background)

**Accent Colors:**
- `--signal`: #00d97e (primary, signal green — used for highlights, call-to-action)
- `--data`: #4d8ef8 (secondary, data blue — charts, info)

**Status Tokens:**
- `text-status-ok`: Green (#10b981)
- `text-status-warn`: Yellow/Orange (#f59e0b)
- `text-status-danger`: Red (#ef4444)

**Log Level Tokens:**
- `text-level-error`, `text-level-warn`, `text-level-info`, `text-level-debug`, `text-level-trace`, `text-level-fatal`

**Data Tokens:**
- `text-data-info`, `text-data-purple`, `bg-data-info/10`

### Typography

- **Display Font**: Syne (bold, headings)
- **Body Font**: DM Sans (readable, UI)
- **Code Font**: Geist Mono (monospace, code blocks)

### Components

All components follow Observatory styling:

- **Button (signal variant)**: Green accent, dark background, hover effects
- **Card**: Subtle borders, glassmorphism effects, signal accent on hover
- **MetricCard**: Sparkline inline charts, percentage change, status-colored text
- **Badge**: Colored by status/level, dark background
- **TimeSeriesChart**: Solid grid lines at 6% opacity, 8-color categorical palette
- **SignalDot**: Replaces inline status dots (e.g., `<SignalDot status="ok" />`)

### Custom CSS

**In `globals.css`:**
- CSS variables for all colors and spacing
- `@theme inline` block defining Tailwind utilities
- Dark mode class `.dark` applied by default
- Custom animation classes (signal-pulse, dot-grid)

**In `globals-animations.css`:**
- `signal-pulse`: Pulsing animation for active indicators
- `dot-grid`: Animated background grid (for landing page)
- Glassmorphism effects

## Key Features

### Dashboard Overview

- **Cross-Project Analytics**: Unified view of all projects with KPI cards (log volume, error rate, performance)
- **Sparklines**: Inline trend charts in MetricCards for at-a-glance insights
- **Project Health Grid**: Quick status of all projects with color-coded health indicators
- **Recent Alerts**: Real-time alert stream with quick actions
- **Period-over-Period Comparison**: Real percentage change vs. previous period

### Log Management

- **Log Explorer**: Advanced filtering, search, and drill-down capabilities
- **Real-Time Streaming**: Live log updates via WebSocket connection
- **Log Detail Panel**: Full context for each log entry with metadata, error stacks, user info
- **Filtering**: By level, service, environment, error type, and custom fields
- **Search**: Full-text search with regex support

### Error Analytics

- **Error Rate Trends**: Visualize error patterns over time
- **Top Errors**: Ranked list of most frequent errors
- **Error Details**: Stack traces, affected pages, user count
- **Error Grouping**: Similar errors grouped together for pattern analysis

### Performance Monitoring

- **Response Time Analytics**: P50, P95, P99 latency tracking
- **Page Load Metrics**: LCP, FCP, TTL analysis
- **Resource Performance**: API endpoint slowness detection
- **Bottleneck Identification**: Highlight slow endpoints and resources

### Web Vitals

- **Core Web Vitals**: LCP, FCP, CLS, INP, TTFB monitoring
- **Trend Analysis**: How metrics change over time
- **Session Impact**: Correlate vitals with user sessions

### Network Monitoring

- **Request Tracking**: All HTTP/HTTPS requests captured
- **Failure Rates**: Failed request analysis by endpoint
- **Top/Slowest Endpoints**: Performance rankings
- **Status Code Distribution**: Error rate breakdown

### User Interactions

- **Click Tracking**: Most-clicked elements
- **Scroll Analysis**: Engagement depth
- **Keyboard Events**: Input activity tracking
- **Element Heatmaps**: Visual representation of interactions

### Console Monitoring

- **Console Messages**: Capture logs, warnings, errors from client
- **Message Levels**: Grouped and counted by severity
- **Stack Context**: Full context for each message

### Page Analytics

- **Page Views**: Trends and popularity
- **Top Pages**: Most visited routes
- **Referrer Tracking**: Where traffic comes from
- **Navigation Flow**: User journey analysis

### Sessions

- **Session Analytics**: User session duration, interaction count
- **Session Replay**: Reconstruct user sessions
- **Session Details**: User agent, location, device info

### Activity Feed

- **Real-Time Events**: Live stream of all activities
- **Event Types**: Filter by event category
- **Timeline View**: Chronological event display

### Distributed Tracing

- **Trace Visualization**: End-to-end request flow
- **Latency Breakdown**: Service-by-service timing
- **Error Context**: Failed service identification

### Funnels

- **Session-Based Funnels**: Multi-step user journey analysis
- **Drop-off Analysis**: Where users abandon flows
- **Conversion Rates**: Success metrics per funnel step

### Regressions

- **Anomaly Detection**: Z-score based statistical detection
- **Baseline Comparison**: Current vs. historical performance
- **Alert Integration**: Automatic alerts for significant changes

### AI Insights

- **Auto-Generated Insights**: Machine learning driven analysis
- **Pattern Recognition**: Identify trends and anomalies
- **Recommendations**: Actionable suggestions for optimization

### Alerts & Rules

- **Alert Rules**: Create sophisticated conditions (error rate > 5%, response time > 2s)
- **Alert Events**: View triggered alerts with full context
- **Escalation Policies**: Route alerts based on severity
- **Maintenance Windows**: Suppress alerts during deployments
- **Integrations**: Email, Slack, webhooks

### Custom Dashboards

- **Widget Builder**: Drag-and-drop dashboard creation
- **26 Metric Presets**: Across 6 categories (volume, errors, performance, interactions, network, vitals)
- **Shareable**: Export and share dashboards with team
- **Real-Time Updates**: Live widget data refreshing

### Project Management

- **Multi-Project Support**: Manage multiple applications
- **Team Collaboration**: Add team members with admin/viewer roles
- **Project Settings**: Configure sampling, retention, integrations
- **API Keys**: Secure SDK authentication
- **Rate Limiting**: Configurable per-project limits

### Authentication

- **JWT Tokens**: Secure, stateless authentication
- **OAuth Integration**: GitHub and Google login
- **Session Persistence**: Cookies with 7-day expiration
- **Password Management**: Change password, reset flow

## Architecture

### Component Structure

Components follow a layered architecture:

1. **Page Components** (`app/**`): Route handlers, data fetching with `Suspense`
2. **Container Components**: Orchestrate data and business logic
3. **Presentational Components**: Pure UI, receive props, no side effects
4. **UI Primitives** (`components/ui`): shadcn/ui building blocks

### Data Flow

```
Page Component
    ↓
React Query Hook (useQuery)
    ↓
Service Layer (axios)
    ↓
Backend API
    ↓
MongoDB / Redis
```

### State Management

**Global State (Zustand):**
- Selected time range (1h, 6h, 24h, 7d, 30d, custom)
- Selected project
- User preferences (theme, sidebar state)

**Server State (React Query):**
- All API data (logs, projects, alerts, metrics)
- Automatic caching and invalidation
- Background refetching

**Component State (React Hooks):**
- Local UI state (forms, modals, filters)

### Authentication Flow

1. User logs in → Backend returns JWT
2. JWT stored in HTTP-only cookie (7-day expiration)
3. Middleware (`middleware.ts`) validates on every request
4. Axios interceptor adds `Authorization: Bearer <token>` header
5. Unauthenticated users redirected to `/login`

### Real-Time Updates

WebSocket connections for live log streaming:

```
Frontend
    ↓ (WebSocket upgrade with JWT)
Backend WebSocket Server
    ↓
Redis (Pub/Sub)
    ↓
All connected clients receive updates
```

WebSocket not available on Vercel (serverless), falls back to polling.

### Performance Optimizations

- **Code Splitting**: Automatic via Next.js App Router
- **React Query Caching**: Deduplication and background updates
- **Virtual Scrolling**: `react-window` for large lists (10k+ rows)
- **Debounced Inputs**: Search and filter operations
- **Turbopack**: Fast development builds
- **Image Optimization**: `next/image` component
- **Bundle Analysis**: Monitor and optimize dependencies

## API Integration

All API calls go through the `services/` layer:

**Example: Fetch logs**

```typescript
// services/logs.service.ts
export const fetchLogs = (projectId: string, filters: LogFilters) => {
  return api.get(`/${projectId}/logs`, { params: filters });
};

// hooks/useLogs.ts (React Query wrapper)
export const useLogs = (projectId: string, filters: LogFilters) => {
  return useQuery({
    queryKey: ['logs', projectId, filters],
    queryFn: () => fetchLogs(projectId, filters),
  });
};

// Usage in component
const { data, isLoading, error } = useLogs(projectId, filters);
```

**API Base URL Configuration:**

The API base URL is set via the `NEXT_PUBLIC_API_BASE_URL` environment variable in the axios config (`services/config.ts`):

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
```

## Contributing

### Submitting Changes

1. Fork and create a feature branch: `git checkout -b feature/description`
2. Make changes following the code style guide
3. Test changes locally: `npm run dev`
4. Build for production: `npm run build`
5. Push and open a pull request
6. Address code review feedback

### Reporting Issues

If you encounter bugs or have feature requests:

1. Check existing issues to avoid duplicates
2. Provide clear reproduction steps
3. Include environment details (Node version, OS)
4. Attach screenshots or logs if applicable

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — Learn about Next.js features and API
- [React Documentation](https://react.dev) — React concepts, hooks, and patterns
- [TailwindCSS Docs](https://tailwindcss.com/docs) — Utility-first styling
- [shadcn/ui Components](https://ui.shadcn.com) — Component library
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [React Query Docs](https://tanstack.com/query/latest) — Server state management
- [Recharts](https://recharts.org) — Charting library
- [GSAP Docs](https://greensock.com/gsap/) — Animation library

### Project Documentation

- [Backend API README](../logger_backend/README.md)
- [SDK Documentation](../loghive-sdk/README.md)
- [Product Specification](../PRODUCT.md)
- [Design System Guide](../DESIGN.md)
- [Architecture Overview](../CLAUDE.md)

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

**Questions?** Open an issue or contact the development team.
