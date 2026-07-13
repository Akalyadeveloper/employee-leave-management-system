import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const LeavesTrendChart = ({ data }) => {
  // Process data to group by month
  const monthlyData = data.reduce((acc, request) => {
    const date = new Date(request.createdAt)
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, approved: 0, rejected: 0, pending: 0 }
    }
    acc[monthKey][request.status]++
    return acc
  }, {})

  const chartData = Object.values(monthlyData).slice(-6) // Last 6 months

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No trend data available yet</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-container chart-container--area">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-color)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-color)' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => <span className="chart-legend-text">{value}</span>}
          />
          <Area 
            type="monotone" 
            dataKey="approved" 
            name="Approved"
            stroke="#22c55e" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorApproved)" 
          />
          <Area 
            type="monotone" 
            dataKey="rejected" 
            name="Rejected"
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRejected)" 
          />
          <Area 
            type="monotone" 
            dataKey="pending" 
            name="Pending"
            stroke="#f59e0b" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPending)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LeavesTrendChart
