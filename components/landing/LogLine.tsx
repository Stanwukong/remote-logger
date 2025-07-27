interface LogLineProps {
  status: 'success' | 'warning' | 'error'
}

export function LogLine({ status }: LogLineProps) {
  const statusColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }

  const widths = {
    success: 'w-16',
    warning: 'w-20',
    error: 'w-12'
  }

  return (
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 ${statusColors[status]} rounded-full`} />
      <div className="h-3 bg-muted rounded flex-1" />
      <div className={`h-3 bg-muted rounded ${widths[status]}`} />
    </div>
  )
}