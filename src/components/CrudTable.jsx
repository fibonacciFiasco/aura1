import React, { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import Pagination from './Pagination'
import Badge from './Badge'
import { debounce } from '../utils/helpers'

export default function CrudTable({
  title, columns, data = [], onAdd, onEdit, onDelete,
  loading, perPage = 8, addLabel = 'Add New', extraActions,
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSearch = debounce((v) => { setSearch(v); setPage(1) }, 300)

  const filtered = useMemo(() => {
    let rows = [...data]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(row => columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q)))
    }
    if (sortCol) {
      rows.sort((a, b) => {
        const av = a[sortCol] ?? '', bv = b[sortCol] ?? ''
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return rows
  }, [data, search, sortCol, sortDir, columns])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const handleSort = (key) => {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(key); setSortDir('asc') }
  }

  if (loading) {
    return (
      <div className="card-glass">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-card)' }}>
          <div className="skeleton" style={{ height: 20, width: 160, borderRadius: 4 }} />
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, borderRadius: 6 }} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="card-glass" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-card)' }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-heading)', margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 30, paddingTop: 8, paddingBottom: 8, fontSize: 12, width: 200 }}
            />
          </div>
          {extraActions}
          {onAdd && (
            <button onClick={onAdd} className="btn-primary" style={{ fontSize: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={13} />{addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-table-head)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-table)',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable !== false && sortCol === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-table)' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-table)' }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {col.render ? col.render(row[col.key], row) : (
                        col.badge ? <Badge status={row[col.key]} /> :
                        col.mono ? <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mono)' }}>{row[col.key]}</span> :
                        row[col.key] ?? '—'
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        {onEdit && (
                          <button onClick={() => onEdit(row)}
                            style={{ padding: 6, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--stat-cyan-icon)'; e.currentTarget.style.background = 'var(--stat-cyan-bg)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                          >
                            <Edit2 size={13} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)}
                            style={{ padding: 6, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'var(--badge-expired-bg)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} />
    </div>
  )
}
