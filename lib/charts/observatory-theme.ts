// Observatory Recharts theme constants
// Uses CSS variable references for dark-first design

export const CHART_COLORS = {
  signal: "var(--signal)",
  signalBright: "var(--signal-bright)",
  data: "var(--data)",
  dataBright: "var(--data-bright)",
  danger: "var(--status-danger)",
  warn: "var(--status-warn)",
  ok: "var(--status-ok)",
  muted: "var(--text-muted)",
  grid: "var(--border-faint)",
  axis: "var(--text-muted)",
} as const;

export const TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  labelStyle: {
    color: "var(--text-secondary)",
    fontWeight: 600,
    marginBottom: "4px",
  },
  itemStyle: {
    color: "var(--text-primary)",
  },
} as const;

export const GRID_PROPS = {
  stroke: "var(--border-faint)",
  strokeOpacity: 0.06,
} as const;

export const CHART_PALETTE = [
  "var(--signal)",
  "var(--data)",
  "var(--status-warn)",
  "var(--status-danger)",
  "#a78bfa",  // purple
  "#f472b6",  // pink
  "#fb923c",  // orange
  "#34d399",  // teal
] as const;

export const AXIS_TICK_PROPS = {
  fill: "var(--text-muted)",
  fontSize: 11,
  fontFamily: "var(--font-mono)",
} as const;

export const AXIS_PROPS = {
  tickLine: false,
  axisLine: false,
  tick: AXIS_TICK_PROPS,
} as const;
