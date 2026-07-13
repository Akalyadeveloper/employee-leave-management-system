import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = {
  sick: '#ef4444',
  casual: '#3b82f6',
  vacation: '#22c55e',
}

const LABELS = {
  sick: '🏥 Sick Leave',
  casual: '🏠 Casual Leave',
  vacation: '🏖️ Vacation Days',
}

const LeaveBalanceChart = ({ data }) => {
  const chartData = Object.entries(data).map(([type, value]) => ({
    name: LABELS[type] || type,
    type,
    value,
    color: COLORS[type] || '#a855f7',
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const progressPercent = Math.min((data.value / 10) * 100, 100)
      return (
        <div className="chart-tooltip chart-tooltip--enhanced">
          <div className="chart-tooltip__header">
            <p className="chart-tooltip__label">{data.name}</p>
          </div>
          <p className="chart-tooltip__value" style={{ color: data.color, fontSize: '1.2rem', fontWeight: '700' }}>
            {data.value} days
          </p>
          <div className="chart-tooltip__progress">
            <div className="chart-tooltip__bar" style={{ width: `${progressPercent}%`, backgroundColor: data.color }}></div>
          </div>
        </div>
      )
    }
    return null
  }

  const renderBarLabel = (props) => {
    const { x, y, width, height, value } = props
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="var(--text-primary)"
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
      >
        {value}
      </text>
    )
  }

  return (
    <div className="chart-container chart-container--bar chart-balance-container">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
          <defs>
            <filter id="barShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="4 4" horizontal={true} vertical={false} stroke="var(--border-color)" />
          <XAxis 
            dataKey="name"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 'dataMax + 2']}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.3 }} />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
            label={renderBarLabel}
            filter="url(#barShadow)"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LeaveBalanceChart
