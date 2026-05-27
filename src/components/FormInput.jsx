import React from 'react'

export function FormInput({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <input className="form-input" {...props} />
      {error && <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>}
    </div>
  )
}

export function FormSelect({ label, options = [], error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <select
        className="form-input"
        style={{
          appearance: 'none', cursor: 'pointer',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem',
        }}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>}
    </div>
  )
}

export function FormTextarea({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <textarea className="form-input" style={{ resize: 'none' }} rows={3} {...props} />
      {error && <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>}
    </div>
  )
}
