import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, total, perPage = 10, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--border-page)' }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total} records
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          style={{
            padding: 6, borderRadius: 8, border: 'none', background: 'none',
            color: 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.3 : 1, display: 'flex', alignItems: 'center',
          }}
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && onChange(p)}
            style={{
              width: 28, height: 28, borderRadius: 8, fontSize: 12, fontWeight: 500, border: 'none',
              background: p === page ? 'var(--pag-active-bg)' : 'none',
              color: p === page ? 'var(--pag-active-text)' : p === '...' ? 'var(--text-muted)' : 'var(--text-secondary)',
              outline: p === page ? '1px solid var(--pag-active-border)' : 'none',
              cursor: p === '...' ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (p !== page && p !== '...') { e.currentTarget.style.background = 'var(--pag-btn-hover-bg)'; e.currentTarget.style.color = 'var(--pag-btn-hover-text)' } }}
            onMouseLeave={e => { if (p !== page && p !== '...') { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          style={{
            padding: 6, borderRadius: 8, border: 'none', background: 'none',
            color: 'var(--text-secondary)', cursor: page === totalPages ? 'not-allowed' : 'pointer',
            opacity: page === totalPages ? 0.3 : 1, display: 'flex', alignItems: 'center',
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
