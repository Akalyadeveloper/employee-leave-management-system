import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  pending: '#f59e0b',
  approved: '#22c55e', 
  rejected: '#ef4444',
}

const LeaveStatusChart = ({ data }) => {
  const chartData = [
    { name: 'Pending', value: data.pending, color: COLORS.pending },
    { name: 'Approved', value: data.approved, color: COLORS.approved },
    { name: 'Rejected', value: data.rejected, color: COLORS.rejected },
  ].filter(item => item.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No leave requests data yet</p>
      </div>
    )
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__label">{data.name}</p>
          <p className="chart-tooltip__value">{data.value} requests ({percentage}%)</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null // Don't show label for small slices
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
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            innerRadius={50}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="chart-legend-text">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-center-label">
        <span className="chart-center-value">{total}</span>
        <span className="chart-center-text">Total</span>
      </div>
    </div>
  )
}

export default LeaveStatusChart
