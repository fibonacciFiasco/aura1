export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric'
  })
}

export const getStatusClass = (status) => {
  const map = {
    Active: 'status-active',
    Pending: 'status-pending',
    Expired: 'status-expired',
    Cancelled: 'status-cancelled',
    Inactive: 'status-cancelled',
    Renewed: 'status-renewed',
    Issued: 'status-active',
    Quote: 'status-pending',
    Submitted: 'status-pending',
    Endorsed: 'status-renewed',
    Lapsed: 'status-expired',
  }
  return map[status] || 'status-pending'
}

export const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
