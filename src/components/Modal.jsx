import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizeMap = { sm: 448, md: 576, lg: 672, xl: 896 }
  const maxW = sizeMap[size] || 576

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="card-glass animate-fade-in" style={{ position: 'relative', width: '100%', maxWidth: maxW, boxShadow: 'var(--shadow-dropdown)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-card)' }}>
          <h3 style={{ fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            padding: 6, borderRadius: 8, border: 'none', background: 'none',
            cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-table-row-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none' }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}
