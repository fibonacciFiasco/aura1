
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'

export default function UploadPage() {
  const [category, setCategory] = useState('Application')

  return (
    <div>
      <PageHeader title="Upload Master Proposal Application Details" />

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 16,
        padding: 24,
        maxWidth: 800
      }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Category *
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-card)'
            }}
          >
            <option>Application</option>
            <option>Loss Run</option>
            <option>Loss runs (Prior carrier)</option>
          </select>
        </div>

        <div style={{
          border: '2px dashed var(--border-card)',
          borderRadius: 14,
          padding: 40,
          textAlign: 'center',
          marginBottom: 24
        }}>
          Drag file here OR Just click
        </div>

        <button style={{
          background: '#2563eb',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600
        }}>
          Generate Proposal
        </button>
      </div>
    </div>
  )
}
