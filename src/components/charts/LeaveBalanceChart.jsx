import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = {
  sick: '#ef4444',
  casual: '#3b82f6',
  vacation: '#22c55e',
}

const LABELS = {
  sick: '🏥 Sick',
  casual: '🏠 Casual',
  vacation: '🏖️ Vacation',
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
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__label">{data.name}</p>
          <p className="chart-tooltip__value">{data.value} days remaining</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-container chart-container--bar">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax + 2']}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-color)' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: 'var(--text-primary)', fontSize: 13 }}
            axisLine={false}
            tickLine={false}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)' }} />
          <Bar 
            dataKey="value" 
            radius={[0, 6, 6, 0]}
            animationBegin={0}
            animationDuration={800}
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
