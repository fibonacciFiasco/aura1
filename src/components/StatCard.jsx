import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatNumber } from '../utils/helpers'

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function StatCard({ icon: Icon, label, value, change, color = 'cyan', loading }) {
  const count = useCountUp(loading ? 0 : value)

  // Map to CSS variable names
  const varMap = {
    cyan:    { icon: 'var(--stat-cyan-icon)',    bg: 'var(--stat-cyan-bg)',    border: 'var(--stat-cyan-border)' },
    violet:  { icon: 'var(--stat-violet-icon)',  bg: 'var(--stat-violet-bg)',  border: 'var(--stat-violet-border)' },
    emerald: { icon: 'var(--stat-emerald-icon)', bg: 'var(--stat-emerald-bg)', border: 'var(--stat-emerald-border)' },
    amber:   { icon: 'var(--stat-amber-icon)',   bg: 'var(--stat-amber-bg)',   border: 'var(--stat-amber-border)' },
  }
  const c = varMap[color]
  const isPositive = change && !change.startsWith('-')

  if (loading) {
    return (
      <div className="card-glass p-5">
        <div className="skeleton" style={{ height: 36, width: 36, borderRadius: 10, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 28, width: 96, borderRadius: 4 }} />
      </div>
    )
  }

  return (
    <div className="card-glass card-hover p-5" style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color: c.icon }} />
        </div>
        {change && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700,
            padding: '3px 8px', borderRadius: 8,
            color: isPositive ? 'var(--stat-emerald-icon)' : '#f87171',
            background: isPositive ? 'var(--stat-emerald-bg)' : 'rgba(239,68,68,0.12)',
          }}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change}
          </div>
        )}
      </div>
      <div style={{ color: 'var(--text-label)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 26, color: 'var(--text-heading)', fontFamily: 'inherit' }}>{formatNumber(count)}</div>
    </div>
  )
}
