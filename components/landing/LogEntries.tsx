interface LogEntryProps {
  level: 'error' | 'warn' | 'info'
  message: string
  time: string
}

function LogEntry({ level, message, time }: LogEntryProps) {
  const levelColors = {
    error: 'bg-red-500',
    warn: 'bg-yellow-500',
    info: 'bg-green-500'
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${levelColors[level]}`} />
      <div className="flex-1 text-sm">{message}</div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  )
}

const logEntries = [
  { level: "error" as const, message: "Database connection timeout", time: "2m ago" },
  { level: "warn" as const, message: "High memory usage detected", time: "5m ago" },
  { level: "info" as const, message: "User authentication successful", time: "8m ago" },
]

export function LogEntries() {
  return (
    <div className="space-y-2">
      {logEntries.map((log, index) => (
        <LogEntry key={index} {...log} />
      ))}
    </div>
  )
}