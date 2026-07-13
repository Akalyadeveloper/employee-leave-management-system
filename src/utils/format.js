export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatStatus = (status) => {
  if (!status) return 'pending'
  return status.charAt(0).toUpperCase() + status.slice(1)
}
