import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  pending: '#f59e0b',
  approved: '#22c55e', 
  rejected: '#ef4444',
}

const ICONS = {
  pending: '⏳',
  approved: '✅',
  rejected: '❌',
}

const LeaveStatusChart = ({ data }) => {
  const chartData = [
    { name: 'Pending', value: data.pending, color: COLORS.pending, icon: ICONS.pending },
    { name: 'Approved', value: data.approved, color: COLORS.approved, icon: ICONS.approved },
    { name: 'Rejected', value: data.rejected, color: COLORS.rejected, icon: ICONS.rejected },
  ].filter(item => item.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>📊 No leave requests data yet</p>
      </div>
    )
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="chart-tooltip chart-tooltip--enhanced">
          <div className="chart-tooltip__header">
            <span className="chart-tooltip__icon">{data.icon}</span>
            <p className="chart-tooltip__label">{data.name}</p>
          </div>
          <p className="chart-tooltip__value">{data.value} requests</p>
          <div className="chart-tooltip__progress">
            <div className="chart-tooltip__bar" style={{ width: `${percentage}%`, backgroundColor: data.color }}></div>
          </div>
          <p className="chart-tooltip__percentage">{percentage}%</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight={700}
        textShadow="0 2px 4px rgba(0,0,0,0.3)"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="chart-container chart-status-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
            innerRadius={60}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            filter="url(#shadow)"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="var(--card-bg)"
                strokeWidth={3}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={40}
            formatter={(value, entry) => (
              <span className="chart-legend-text">
                <span className="chart-legend-icon">{entry.payload.icon}</span>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-center-label">
        <span className="chart-center-value">{total}</span>
        <span className="chart-center-text">Requests</span>
      </div>
    </div>
  )
}

export default LeaveStatusChart
