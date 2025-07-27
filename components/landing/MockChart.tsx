const chartData = [40, 60, 30, 80, 45, 70, 55, 90, 35, 65, 50, 75]

export function MockChart() {
  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Log Volume (24h)</h3>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <div className="w-3 h-3 bg-muted rounded-full" />
        </div>
      </div>
      <div className="flex items-end space-x-1 h-24">
        {chartData.map((height, index) => (
          <div
            key={index}
            className="bg-primary/60 rounded-t flex-1 transition-all duration-500 hover:bg-primary/80"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}