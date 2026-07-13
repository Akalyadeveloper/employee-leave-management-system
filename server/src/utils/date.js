export const calculateTotalDays = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid dates provided')
  }
  if (endDate < startDate) {
    throw new Error('End date must be on or after start date')
  }
  const diffMs = endDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}
