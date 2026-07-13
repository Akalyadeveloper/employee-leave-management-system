const StatsGrid = ({ items }) => {
  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.label} className="stat-card">
          <p className="stat-card__label">{item.label}</p>
          <p className="stat-card__value">{item.value}</p>
          {item.helper && <p className="stat-card__helper">{item.helper}</p>}
        </div>
      ))}
    </div>
  )
}

export default StatsGrid
