interface StatCardProps {
  label: string
  value: string
  trend: string
}

function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-green-600">{trend}</div>
    </div>
  )
}

const stats = [
  { label: "Total Logs", value: "1.2M", trend: "+12%" },
  { label: "Active Errors", value: "23", trend: "-8%" },
  { label: "Response Time", value: "245ms", trend: "-15ms" },
  { label: "Uptime", value: "99.9%", trend: "+0.1%" },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}