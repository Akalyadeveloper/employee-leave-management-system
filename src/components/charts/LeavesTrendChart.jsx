import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const ICONS = {
  approved: '✅',
  rejected: '❌',
  pending: '⏳',
}

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

  const chartData = Object.values(monthlyData).slice(-6)

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>📈 No trend data available yet</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)
      return (
        <div className="chart-tooltip chart-tooltip--enhanced chart-tooltip--wide">
          <p className="chart-tooltip__label">{label}</p>
          <div className="chart-tooltip__stats">
            {payload.map((entry, index) => (
              <div key={index} className="chart-tooltip__stat">
                <span style={{ color: entry.color, marginRight: '0.5rem' }}>
                  {ICONS[entry.dataKey] || '•'}
                </span>
                <span style={{ color: entry.color, fontWeight: '600' }}>
                  {entry.name}: <span style={{ fontWeight: '700' }}>{entry.value}</span>
                </span>
              </div>
            ))}
            <div className="chart-tooltip__divider"></div>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)', fontWeight: '700' }}>
              Total: {total}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-container chart-container--area chart-trend-container">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <filter id="areaShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => {
              const icon = ICONS[value]
              return <span className="chart-legend-text"><span style={{ marginRight: '0.3rem' }}>{icon}</span>{value}</span>
            }}
          />
          <Area 
            type="monotone" 
            dataKey="approved" 
            name="Approved"
            stroke="#22c55e" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorApproved)"
            animationDuration={800}
            filter="url(#areaShadow)"
          />
          <Area 
            type="monotone" 
            dataKey="rejected" 
            name="Rejected"
            stroke="#ef4444" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorRejected)"
            animationDuration={800}
            filter="url(#areaShadow)"
          />
          <Area 
            type="monotone" 
            dataKey="pending" 
            name="Pending"
            stroke="#f59e0b" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorPending)"
            animationDuration={800}
            filter="url(#areaShadow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LeavesTrendChart