import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Plus, Pencil, Trash2, Upload } from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────────

const FieldLabel = ({ children, required }) => (
  <label style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em', color: 'var(--accent)', display: 'block', marginBottom: 4 }}>
    {children}{required && <span style={{ color: 'var(--accent)' }}> *</span>}
  </label>
)

const ReadInput = ({ label, value, required }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <input readOnly value={value || ''} className="form-input w-full"
      style={{ fontSize: '0.85rem', background: 'var(--bg-input)', color: 'var(--text-primary)', cursor: 'default' }} />
  </div>
)

const ReadSelect = ({ label, value, required }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <input readOnly value={value || ''} className="form-input w-full"
      style={{ fontSize: '0.85rem', background: 'var(--bg-input)', color: 'var(--text-primary)', cursor: 'default' }} />
  </div>
)

const EditInput = ({ label, value, onChange, required, type = 'text' }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="form-input w-full"
      style={{ fontSize: '0.85rem' }} />
  </div>
)

const EditSelect = ({ label, value, onChange, options, required }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <select value={value || ''} onChange={e => onChange(e.target.value)} className="form-input w-full"
      style={{ fontSize: '0.85rem' }}>
      <option value="">--- Select ---</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

// ── Shared table styles ───────────────────────────────────────────────────────
const TH = ({ children, style = {} }) => (
  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-heading)', background: 'var(--bg-table-head)', whiteSpace: 'nowrap', ...style }}>{children}</th>
)
const TD = ({ children, style = {} }) => (
  <td style={{ padding: '10px 12px', fontSize: '0.82rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-divider)', verticalAlign: 'middle', ...style }}>{children}</td>
)

// Section heading bar
const SectionBar = ({ children }) => (
  <div style={{ background: 'var(--bg-table-head)', borderRadius: 6, padding: '8px 14px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-heading)', marginBottom: 0 }}>
    {children}
  </div>
)

// Pink row header (like "Log # : 7707  (12124)  MONOLINE  Log Detail for 7707")
const PinkRowHeader = ({ children }) => (
  <div style={{ background: '#e57f8a', padding: '8px 14px', fontWeight: 700, fontSize: '0.82rem', color: '#fff', borderRadius: 4, marginBottom: 0 }}>
    {children}
  </div>
)

// ── LOB config ────────────────────────────────────────────────────────────────
const LOB_TABS = {
  'Boiler & Machinery': ['Policy Details', 'Additional Locations', 'Risk Profile', 'Proposal', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims'],
  'Commercial Property': ['Policy Details', 'Additional Locations', 'Property', 'Proposal', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims'],
  'Cyber/Network Liability': ['Policy Details', 'Additional Locations', 'Risk Profile', 'Proposal', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims'],
  'Commercial - Windstorm Deductible Buy Back': ['Policy Details', 'Additional Locations', 'Risk Profile', 'Property', 'Proposal', 'Forms', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims'],
  'Home Owners': ['Policy Details', 'Additional Locations', 'Risk Profile', 'Property', 'Add On', 'Proposal', 'Forms', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims'],
  'Business Auto': ['Policy Details', 'Additional Locations', 'Risk Profile', 'Proposal', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims'],
}
const DEFAULT_TABS = ['Policy Details', 'Additional Locations', 'Risk Profile', 'Proposal', 'Subjectivity', 'Log', 'Documents', 'Issuance', 'Claims']

// ── LOB action sets ───────────────────────────────────────────────────────────
const COMM_PROP_LOBs = ['Commercial Property']
const COMM_WINDSTORM_LOBs = ['Commercial - Windstorm Deductible Buy Back', 'Cyber/Network Liability', 'Boiler & Machinery', 'Home Owners', 'Crime']

// Quote-stage actions (Commercial Property LOB)
const QUOTE_ACTIONS_COMM_PROP = [
  { label: 'Close Quote',        icon: '✕', iconStyle: { background: '#6b7280' }, danger: false },
  { label: 'Decline Quote',      icon: 'Ø', iconStyle: { background: '#ef4444' }, danger: true  },
  { label: 'Discard',            icon: 'Ø', iconStyle: { background: '#ef4444' }, danger: true  },
  { label: 'Aura Proposal',      icon: '↑', iconStyle: { background: '#3b82f6' }, danger: false, auraProposal: true },
  { label: 'Generate Proposal',  icon: '↑', iconStyle: { background: '#10b981' }, danger: false },
  { label: 'Invalidate Quote',   icon: '!', iconStyle: { background: '#f97316' }, danger: true  },
  { label: 'Issue Policy',       icon: null, danger: false },
  { label: 'Transfer Quote/Policy', icon: null, danger: false },
]

// Policy-stage actions for Commercial - Windstorm, Cyber, Boiler, Home Owners, Crime, etc.
const POLICY_ACTIONS_COMM_WIND = [
  { label: 'Cancel Policy',      icon: null, danger: false },
  { label: 'Create Endorsement', icon: null, danger: false },
  { label: 'Do Not Renew (DNR)', icon: '!', iconStyle: { background: '#f87171' }, danger: true, dnr: true },
  { label: 'Generate Invoice',   icon: null, danger: false },
  { label: 'Get Policy Documents', icon: null, danger: false },
  { label: 'Not Renew Policy (Renewal Not Taken)', icon: '!', iconStyle: { background: '#f87171' }, danger: true, dnr: true },
  { label: 'Transfer Quote/Policy', icon: null, danger: false },
]

// Quote-stage actions for Commercial Property (quote status)
const QUOTE_ACTIONS_COMM_PROP_POLICY = [
  { label: 'Close Quote',        icon: '✕', iconStyle: { background: '#6b7280' }, danger: false },
  { label: 'Decline Quote',      icon: 'Ø', iconStyle: { background: '#ef4444' }, danger: true  },
  { label: 'Discard',            icon: 'Ø', iconStyle: { background: '#ef4444' }, danger: true  },
  { label: 'Aura Proposal',      icon: '↑', iconStyle: { background: '#3b82f6' }, danger: false, auraProposal: true },
  { label: 'Generate Proposal',  icon: '↑', iconStyle: { background: '#10b981' }, danger: false },
  { label: 'Invalidate Quote',   icon: '!', iconStyle: { background: '#f97316' }, danger: true  },
  { label: 'Issue Policy',       icon: null, danger: false },
  { label: 'Transfer Quote/Policy', icon: null, danger: false },
]

// Default policy actions (for all other active policies)
const DEFAULT_POLICY_ACTIONS = [
  { label: 'Cancel Policy',      icon: null, danger: false },
  { label: 'Create Endorsement', icon: null, danger: false },
  { label: 'Do Not Renew (DNR)', icon: '!', iconStyle: { background: '#f87171' }, danger: true, dnr: true },
  { label: 'Generate Invoice',   icon: null, danger: false },
  { label: 'Get Policy Documents', icon: null, danger: false },
  { label: 'Not Renew Policy (Renewal Not Taken)', icon: '!', iconStyle: { background: '#f87171' }, danger: true, dnr: true },
  { label: 'Transfer Quote/Policy', icon: null, danger: false },
]

const DNR_REASONS = [
  '--- Select Reason ---',
  'Applicant accepted other carrier',
  'Applicant did not respond',
  'Applicant reject for coverage limitations',
  'Received broker of record request',
  'Other',
  'Underwriter Decision',
  'Applicant reject for price',
]

// ── Reusable modal shell ──────────────────────────────────────────────────────
function ModalShell({ title, titleColor, onClose, children, maxWidth = 480 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: 16 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', width: '100%', maxWidth, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: titleColor || 'var(--text-heading)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Reusable toast notification
function Toast({ message, type, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t) }, [])
  const bg = type === 'success' ? '#10b981' : type === 'warn' ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999, background: bg, color: '#fff', borderRadius: 10, padding: '14px 20px', fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 260 }}>
      <span>{type === 'success' ? '✓' : '!'}</span>
      {message}
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 16 }}>×</button>
    </div>
  )
}

// ── Aura Proposal Modal ───────────────────────────────────────────────────────
function AuraProposalModal({ onClose, onSuccess }) {
  const [category, setCategory] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const CATEGORIES = ['Application', 'Loss Run', 'Loss runs (Prior carrier)']

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]; if (f) setFile(f)
  }
  const handleSubmit = () => {
    if (!category) { setError('Please select a category.'); return }
    if (!file) { setError('Please attach a file.'); return }
    setError(''); setUploading(true)
    setTimeout(() => { setUploading(false); onSuccess(`Proposal uploaded: ${file.name}`); onClose() }, 1200)
  }

  return (
    <ModalShell title="Upload Master Proposal" onClose={onClose} maxWidth={520}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: 14, textTransform: 'uppercase' }}>Application Details</div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Category <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={category} onChange={e => { setCategory(e.target.value); setError('') }} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          <option value="">--- Select Category ---</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('aura-file-inp').click()}
        style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : file ? '#10b981' : 'var(--border-divider)'}`, borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--accent-muted)' : 'var(--bg-input)', transition: 'all 0.18s', marginBottom: 6 }}
      >
        <input id="aura-file-inp" type="file" style={{ display: 'none' }} onChange={e => { setFile(e.target.files[0]); setError('') }} />
        <div style={{ fontSize: 26, marginBottom: 6, opacity: 0.5 }}>{file ? '✅' : '📄'}</div>
        {file
          ? <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>{file.name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({(file.size / 1024).toFixed(1)} KB)</span></div>
          : <><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>Drag file here</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>OR <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Just click</span> to browse</div></>}
      </div>
      {file && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14, textAlign: 'right' }}>
        <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}>✕ Remove file</button>
      </div>}
      {error && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleSubmit} className="btn-primary" disabled={uploading} style={{ fontSize: 13, opacity: uploading ? 0.7 : 1, minWidth: 90 }}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── DNR Modal ─────────────────────────────────────────────────────────────────
function DNRModal({ label, onClose, onSuccess }) {
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const handleConfirm = () => {
    if (!reason || reason === '--- Select Reason ---') return
    setSaving(true)
    setTimeout(() => { setSaving(false); onSuccess(`DNR recorded: ${reason}`); onClose() }, 800)
  }
  return (
    <ModalShell title={label} titleColor="#f87171" onClose={onClose}>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 6 }}>Select Do Not Renew (DNR) Reason :</label>
        <select value={reason} onChange={e => setReason(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          {DNR_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {(!reason || reason === '--- Select Reason ---') && reason !== '' && (
        <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>Please select a reason to continue.</div>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleConfirm} disabled={!reason || reason === '--- Select Reason ---' || saving}
          className="btn-primary" style={{ fontSize: 13, background: '#ef4444', borderColor: '#ef4444', opacity: (!reason || reason === '--- Select Reason ---') ? 0.5 : 1, minWidth: 90 }}>
          {saving ? 'Saving…' : 'Confirm'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Cancel Policy Modal ───────────────────────────────────────────────────────
function CancelPolicyModal({ policy, onClose, onSuccess }) {
  const [reason, setReason] = useState('')
  const [cancelDate, setCancelDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const REASONS = ['Non-Payment', 'Insured Request', 'Underwriter Decision', 'Fraud / Misrepresentation', 'Other']
  const handleSubmit = () => {
    if (!reason) return
    setSaving(true)
    setTimeout(() => { setSaving(false); onSuccess('Policy cancelled successfully.'); onClose() }, 900)
  }
  return (
    <ModalShell title="Cancel Policy" titleColor="#ef4444" onClose={onClose}>
      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#f87171' }}>
        ⚠️ This will cancel policy <strong>{policy?.policyNumber}</strong>. This action cannot be undone.
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Cancellation Date <span style={{ color: '#ef4444' }}>*</span></label>
        <input type="date" value={cancelDate} onChange={e => setCancelDate(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Reason <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={reason} onChange={e => setReason(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          <option value="">--- Select Reason ---</option>
          {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleSubmit} disabled={!reason || saving} className="btn-primary"
          style={{ fontSize: 13, background: '#ef4444', borderColor: '#ef4444', opacity: !reason ? 0.5 : 1, minWidth: 110 }}>
          {saving ? 'Processing…' : 'Cancel Policy'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Create Endorsement Modal ──────────────────────────────────────────────────
function CreateEndorsementModal({ policy, onClose, onSuccess }) {
  const [type, setType] = useState('')
  const [effDate, setEffDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const TYPES = ['Additional Insured', 'Address Change', 'Coverage Change', 'Limit Change', 'Named Insured Change', 'Exclusion Add/Remove', 'Other']
  const handleSubmit = () => {
    if (!type) return
    setSaving(true)
    setTimeout(() => { setSaving(false); onSuccess(`Endorsement created: ${type}`); onClose() }, 900)
  }
  return (
    <ModalShell title="Create Endorsement" onClose={onClose} maxWidth={500}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Endorsement Type <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={type} onChange={e => setType(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          <option value="">--- Select Type ---</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Effective Date <span style={{ color: '#ef4444' }}>*</span></label>
        <input type="date" value={effDate} onChange={e => setEffDate(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="form-input w-full" rows={3} style={{ fontSize: '0.85rem', resize: 'vertical' }} placeholder="Describe the endorsement changes..." />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleSubmit} disabled={!type || saving} className="btn-primary"
          style={{ fontSize: 13, opacity: !type ? 0.5 : 1, minWidth: 120 }}>
          {saving ? 'Creating…' : 'Create Endorsement'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Generate Invoice Modal ────────────────────────────────────────────────────
function GenerateInvoiceModal({ policy, onClose, onSuccess }) {
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [billTo, setBillTo] = useState('Insured')
  const [generating, setGenerating] = useState(false)
  const handleSubmit = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); onSuccess('Invoice generated successfully.'); onClose() }, 1000)
  }
  return (
    <ModalShell title="Generate Invoice" onClose={onClose} maxWidth={460}>
      <div style={{ background: 'var(--bg-table-head)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-label)' }}>Policy:</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{policy?.policyNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-label)' }}>Total Premium:</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{policy?.billedPremiumStr || '$0.00'}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Invoice Date</label>
          <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Due Date</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }} />
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Bill To</label>
        <select value={billTo} onChange={e => setBillTo(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          {['Insured', 'Agent', 'Broker', 'Direct Bill'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleSubmit} disabled={generating} className="btn-primary" style={{ fontSize: 13, minWidth: 120 }}>
          {generating ? 'Generating…' : 'Generate Invoice'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Get Policy Documents Modal ────────────────────────────────────────────────
function GetPolicyDocsModal({ policy, onClose, onSuccess }) {
  const [selected, setSelected] = useState([])
  const [downloading, setDownloading] = useState(false)
  const DOCS = [
    { id: 'dec', label: 'Declarations Page', size: '124 KB' },
    { id: 'policy', label: 'Full Policy Document', size: '1.2 MB' },
    { id: 'invoice', label: 'Invoice', size: '88 KB' },
    { id: 'endorsements', label: 'Endorsements', size: '340 KB' },
    { id: 'cert', label: 'Certificate of Insurance', size: '95 KB' },
    { id: 'proposal', label: 'Proposal', size: '210 KB' },
  ]
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const handleDownload = () => {
    if (!selected.length) return
    setDownloading(true)
    setTimeout(() => { setDownloading(false); onSuccess(`${selected.length} document(s) downloaded.`); onClose() }, 1100)
  }
  return (
    <ModalShell title="Get Policy Documents" onClose={onClose} maxWidth={460}>
      <div style={{ marginBottom: 14, fontSize: 12, color: 'var(--text-secondary)' }}>Select documents to download for policy <strong style={{ color: 'var(--text-primary)' }}>{policy?.policyNumber}</strong></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {DOCS.map(d => (
          <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: selected.includes(d.id) ? 'var(--accent-muted)' : 'var(--bg-input)', borderRadius: 8, cursor: 'pointer', border: `1px solid ${selected.includes(d.id) ? 'var(--accent)' : 'var(--border-divider)'}`, transition: 'all 0.15s' }}>
            <input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggle(d.id)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
            <span style={{ fontSize: 13, flex: 1, color: 'var(--text-primary)', fontWeight: selected.includes(d.id) ? 600 : 400 }}>📄 {d.label}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{d.size}</span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 'auto' }}>{selected.length} selected</span>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleDownload} disabled={!selected.length || downloading} className="btn-primary" style={{ fontSize: 13, opacity: !selected.length ? 0.5 : 1, minWidth: 110 }}>
          {downloading ? 'Downloading…' : '⬇ Download'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Close / Decline / Discard Quote Modal ─────────────────────────────────────
function SimpleConfirmModal({ title, titleColor, message, confirmLabel, confirmColor, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  return (
    <ModalShell title={title} titleColor={titleColor} onClose={onClose}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>{message}</div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="form-input w-full" rows={2} style={{ fontSize: '0.85rem', resize: 'vertical' }} placeholder="Add a reason or notes..." />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Go Back</button>
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onConfirm(notes) }, 700) }} disabled={loading}
          className="btn-primary" style={{ fontSize: 13, background: confirmColor || 'var(--accent)', borderColor: confirmColor || 'var(--accent)', minWidth: 100 }}>
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Invalidate Quote Modal ────────────────────────────────────────────────────
function InvalidateQuoteModal({ policy, onClose, onSuccess }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const REASONS = ['Rate Change', 'Coverage Change', 'Data Error', 'Duplicate Quote', 'Underwriting Revision', 'Other']
  return (
    <ModalShell title="Invalidate Quote" titleColor="#f97316" onClose={onClose}>
      <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#fb923c' }}>
        ⚠️ Invalidating quote <strong>{policy?.policyNumber}</strong> will mark it as void and no further actions will be available.
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Reason <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={reason} onChange={e => setReason(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          <option value="">--- Select Reason ---</option>
          {REASONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={() => { if (!reason) return; setLoading(true); setTimeout(() => { setLoading(false); onSuccess('Quote invalidated.'); onClose() }, 800) }}
          disabled={!reason || loading} className="btn-primary"
          style={{ fontSize: 13, background: '#f97316', borderColor: '#f97316', opacity: !reason ? 0.5 : 1, minWidth: 120 }}>
          {loading ? 'Processing…' : 'Invalidate Quote'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Issue Policy Modal ────────────────────────────────────────────────────────
function IssuePolicyModal({ policy, onClose, onSuccess }) {
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleIssue = () => {
    if (!paymentMethod || !confirm) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess('Policy issued successfully! Status updated to Active.'); onClose() }, 1100)
  }
  return (
    <ModalShell title="Issue Policy" onClose={onClose} maxWidth={480}>
      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#10b981' }}>
        ✓ Issuing policy for <strong>{policy?.name}</strong> — Quote <strong>{policy?.policyNumber}</strong>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Issue Date</label>
        <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Payment Method <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          <option value="">--- Select Payment Method ---</option>
          {['Check', 'ACH / Bank Transfer', 'Credit Card', 'Wire Transfer', 'Financing'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, cursor: 'pointer' }}>
        <input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>I confirm all information is correct and authorize policy issuance.</span>
      </label>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={handleIssue} disabled={!paymentMethod || !confirm || loading} className="btn-primary"
          style={{ fontSize: 13, opacity: (!paymentMethod || !confirm) ? 0.5 : 1, minWidth: 110 }}>
          {loading ? 'Issuing…' : 'Issue Policy'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Transfer Quote/Policy Modal ───────────────────────────────────────────────
function TransferModal({ policy, onClose, onSuccess, onTransferComplete }) {
  const [toAgent, setToAgent] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const AGENTS = ['James Martinez', 'Sarah Thompson', 'Andrew Williams', 'Rita Chen', 'Kevin Patel']
  return (
    <ModalShell title="Transfer Quote / Policy" onClose={onClose}>
      <div style={{ background: 'var(--bg-table-head)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-label)' }}>Policy:</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{policy?.policyNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-label)' }}>Currently Assigned To:</span>
          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{policy?.assignedTo || '—'}</span>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Transfer To <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={toAgent} onChange={e => setToAgent(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          <option value="">--- Select Agent / User ---</option>
          {AGENTS.filter(a => a !== policy?.assignedTo).map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Reason / Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="form-input w-full" rows={2} style={{ fontSize: '0.85rem', resize: 'vertical' }} placeholder="Why is this being transferred?" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={() => {
          if (!toAgent) return
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
            if (onTransferComplete) onTransferComplete(toAgent)
            onSuccess(`Transferred to ${toAgent}.`)
            onClose()
          }, 800)
        }}
          disabled={!toAgent || loading} className="btn-primary"
          style={{ fontSize: 13, opacity: !toAgent ? 0.5 : 1, minWidth: 100 }}>
          {loading ? 'Transferring…' : 'Transfer'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Generate Proposal Modal ───────────────────────────────────────────────────
function GenerateProposalModal({ policy, onClose, onSuccess }) {
  const [format, setFormat] = useState('PDF')
  const [includeTerms, setIncludeTerms] = useState(true)
  const [includeCoverage, setIncludeCoverage] = useState(true)
  const [loading, setLoading] = useState(false)
  return (
    <ModalShell title="Generate Proposal" onClose={onClose} maxWidth={440}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-label)', display: 'block', marginBottom: 5 }}>Output Format</label>
        <select value={format} onChange={e => setFormat(e.target.value)} className="form-input w-full" style={{ fontSize: '0.85rem' }}>
          {['PDF', 'Word (DOCX)', 'Excel (XLSX)'].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
          <input type="checkbox" checked={includeCoverage} onChange={e => setIncludeCoverage(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Include Coverage Summary
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
          <input type="checkbox" checked={includeTerms} onChange={e => setIncludeTerms(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Include Terms & Conditions
        </label>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancel</button>
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onSuccess(`Proposal generated as ${format}.`); onClose() }, 1000) }}
          disabled={loading} className="btn-primary" style={{ fontSize: 13, minWidth: 130 }}>
          {loading ? 'Generating…' : 'Generate Proposal'}
        </button>
      </div>
    </ModalShell>
  )
}

// ── Dynamic Actions Dropdown ──────────────────────────────────────────────────
function ActionsDropdown({ policy, onAssignedToChange }) {
  const [open, setOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [toast, setToast] = useState(null)

  const lob = policy?.lob || ''
  const isQuote = policy?.status === 'Quote' || policy?.transactionStatus === 'Quote'
  const isCommProp = lob === 'Commercial Property'
  const isCommWind = COMM_WINDSTORM_LOBs.includes(lob)

  let actions
  if (isCommProp && isQuote)       actions = QUOTE_ACTIONS_COMM_PROP
  else if (isCommProp && !isQuote) actions = QUOTE_ACTIONS_COMM_PROP_POLICY
  else if (isCommWind)             actions = POLICY_ACTIONS_COMM_WIND
  else                             actions = DEFAULT_POLICY_ACTIONS

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const handleAction = (item) => {
    setOpen(false)
    setActiveModal(item.label)
  }

  const closeModal = () => setActiveModal(null)

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Actions <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: 270, overflow: 'hidden' }}>
              {actions.map((item, i) => (
                <button key={i} onClick={() => handleAction(item)}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: item.danger ? '#f87171' : 'var(--text-primary)', borderBottom: i < actions.length - 1 ? '1px solid var(--border-divider)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  {item.icon && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', color: '#fff', fontSize: 11, fontWeight: 800, flexShrink: 0, ...(item.iconStyle || { background: '#f87171' }) }}>
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modal rendering ── */}
      {activeModal === 'Aura Proposal' && <AuraProposalModal onClose={closeModal} onSuccess={m => showToast(m)} />}
      {(activeModal === 'Do Not Renew (DNR)' || activeModal === 'Not Renew Policy (Renewal Not Taken)') &&
        <DNRModal label={activeModal} onClose={closeModal} onSuccess={m => showToast(m, 'warn')} />}
      {activeModal === 'Cancel Policy' && <CancelPolicyModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m, 'warn')} />}
      {activeModal === 'Create Endorsement' && <CreateEndorsementModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m)} />}
      {activeModal === 'Generate Invoice' && <GenerateInvoiceModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m)} />}
      {activeModal === 'Get Policy Documents' && <GetPolicyDocsModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m)} />}
      {activeModal === 'Close Quote' && <SimpleConfirmModal title="Close Quote" titleColor="#6b7280"
        message={`Are you sure you want to close quote ${policy?.policyNumber}? The quote will be moved to closed status.`}
        confirmLabel="Close Quote" confirmColor="#6b7280" onClose={closeModal}
        onConfirm={() => { showToast('Quote closed.', 'warn'); closeModal() }} />}
      {activeModal === 'Decline Quote' && <SimpleConfirmModal title="Decline Quote" titleColor="#ef4444"
        message={`Declining quote ${policy?.policyNumber} will mark it as declined. The insured will need to reapply.`}
        confirmLabel="Decline Quote" confirmColor="#ef4444" onClose={closeModal}
        onConfirm={() => { showToast('Quote declined.', 'warn'); closeModal() }} />}
      {activeModal === 'Discard' && <SimpleConfirmModal title="Discard Quote" titleColor="#ef4444"
        message={`This will permanently discard quote ${policy?.policyNumber}. This cannot be undone.`}
        confirmLabel="Discard" confirmColor="#ef4444" onClose={closeModal}
        onConfirm={() => { showToast('Quote discarded.', 'error'); closeModal() }} />}
      {activeModal === 'Generate Proposal' && <GenerateProposalModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m)} />}
      {activeModal === 'Invalidate Quote' && <InvalidateQuoteModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m, 'warn')} />}
      {activeModal === 'Issue Policy' && <IssuePolicyModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m)} />}
      {activeModal === 'Transfer Quote/Policy' && <TransferModal policy={policy} onClose={closeModal} onSuccess={m => showToast(m)} onTransferComplete={onAssignedToChange} />}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

// ── Policy Header ─────────────────────────────────────────────────────────────
function PolicyHeader({ policy }) {
  const statusColor = policy.status === 'Active' ? '#10b981' : policy.status === 'Expired' ? '#f59e0b' : policy.status === 'Cancelled' ? '#ef4444' : '#94a3b8'
  return (
    <div style={{ background: 'var(--bg-table-head)', borderRadius: '10px 10px 0 0', padding: '14px 24px', borderBottom: '1px solid var(--border-divider)' }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2" style={{ fontSize: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Quote Number : <span style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'monospace' }}>{policy.policyNumber}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Quote State : <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{policy.policyState}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Quote Type : <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{policy.policyType}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Line of Business : <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{policy.lob}</span></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Quote Holder : <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{policy.name}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Issuing Carrier : <span style={{ color: 'var(--text-primary)' }}>{policy.issuingCarrier}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Billing Carrier : <span style={{ color: 'var(--text-primary)' }}>{policy.billingCarrier}</span></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Quote Period : <span style={{ color: 'var(--text-primary)' }}>{policy.effectiveDate} - {policy.expirationDate}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Status : <span style={{ color: statusColor, fontWeight: 700 }}>{policy.status}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Transaction Status : <span style={{ color: 'var(--text-primary)' }}>{policy.transactionStatus}</span></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Billed Premium : <span style={{ color: '#10b981', fontWeight: 700 }}>{policy.billedPremiumStr}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Written Premium : <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{policy.writtenPremiumStr}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Annual Premium : <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{policy.annualPremiumStr}</span></span>
          <span style={{ color: 'var(--text-label)', whiteSpace: 'nowrap' }}>Assigned To : <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{policy.assignedTo}</span></span>
        </div>
      </div>
    </div>
  )
}

// ── Policy Details Tab ────────────────────────────────────────────────────────
function PolicyDetailPanel({ policy, onNext, onPrev, isFirst, isLast }) {
  const lob = policy.lob
  const isHomeOwners = lob === 'Home Owners'
  const isCommProp = lob === 'Commercial Property'

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ReadSelect label="Division" value={policy.division} required />
        <ReadSelect label="Branch" value={policy.branch} required />
        <ReadInput label="Requested Effective Date" value={policy.effectiveDate} required />
        <ReadInput label="Expiry Date" value={policy.expirationDate} required />
        <ReadSelect label="Policy State" value={policy.policyState} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ReadSelect label="Policy Type" value={policy.policyType} required />
        <ReadSelect label="Line of Business" value={lob} required />
        <ReadSelect label="Retail Agent" value={policy.retailAgent} required />
        <ReadInput label="Retail Agent Contact Name" value={policy.retailAgentContactName} required />
        <ReadInput label="Retail Agent Contact Email" value={policy.retailAgentContactEmail} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ReadSelect label="Billing Type" value={policy.billingType} />
        <ReadInput label="AURA Broker Name" value={policy.auraBrokerName} required />
        <ReadInput label="AURA Broker Email" value={policy.auraBrokerEmail} required />
        <ReadInput label="Issuing Carrier" value={policy.issuingCarrier} />
        <ReadInput label="Billing Carrier" value={policy.billingCarrier} />
      </div>
      {isHomeOwners ? (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <ReadSelect label="Client Type" value="Person/Individual" required />
          <ReadInput label="First Name" value={policy.firstName || 'd'} required />
          <ReadInput label="Middle Name" value={policy.middleName || ''} />
          <ReadInput label="Last Name" value={policy.lastName || 'test'} required />
          <ReadInput label="Professional License No" value={policy.licenseNo || ''} />
          <ReadSelect label="Designation" value={policy.designation || '-- Designation --'} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <ReadSelect label="Client Type" value={policy.clientType || 'Company/Organization'} required />
          <div style={{ gridColumn: 'span 2' }}>
            <ReadInput label="Company Name" value={policy.name} required />
          </div>
          <ReadSelect label="Type of Business" value={policy.typeOfBusiness} />
          <ReadInput label="Establishment Date" value={policy.establishmentDate || ''} />
          <ReadInput label="Year(s) In Business" value={policy.yearsInBusiness || ''} />
        </div>
      )}
      {!isHomeOwners && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReadInput label="Nature of Business" value={policy.natureOfBusiness || ''} />
          <ReadInput label="NAICS Code" value={policy.naicsCode || ''} />
          <ReadInput label="SIC Code" value={policy.sicCode || ''} />
        </div>
      )}
      <div style={{ background: 'var(--accent-muted)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Physical Address</span>
        <span style={{ color: '#f87171', fontWeight: 600, fontSize: 13 }}>Select the applicable LOB(s) to this location.</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }}>
          <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{lob}</span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div style={{ gridColumn: 'span 2' }}><ReadInput label="Address Line 1" value={policy.address1 || ''} required /></div>
        <div style={{ gridColumn: 'span 2' }}><ReadInput label="Address Line 2" value={policy.address2 || ''} /></div>
        <ReadInput label="Telephone Number" value={policy.phone || '123-456-7890'} />
        <ReadInput label="Fax" value={policy.fax || '123-456-7890'} />
        <ReadInput label="Zip" value={policy.zip || ''} required />
        <ReadSelect label="State" value={policy.policyState} required />
        <ReadSelect label="County" value={policy.county || ''} required />
        <ReadSelect label="City" value={policy.city || ''} required />
        {isCommProp && <div style={{ gridColumn: 'span 2' }}><ReadSelect label="Wind/Hail Zone" value="--- Select ---" /></div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <input type="checkbox" style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>If Mailing Address different than Physical Address</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border-divider)' }}>
        <button className="btn-secondary">Reset</button>
        <button className="btn-secondary">Save</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Additional Locations Tab ──────────────────────────────────────────────────
function AdditionalLocationsTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const [locations] = useState([
    { id: 4496, address: 'add 1 add 2', federalId: '', zip: '62454', state: 'Illinois', county: 'Crawford', city: 'Robinson', telephone: '', fax: '', effectiveDate: '06/13/2025', expirationDate: '', addressUsedIn: ['Mailing', 'Physical Office'] },
    { id: 4497, address: 'add 1 add 2', federalId: '', zip: '81034', state: 'Colorado', county: 'Crowley', city: 'Ark Valley Corr Facl', telephone: '545-456-4564', fax: '', effectiveDate: '06/13/2025', expirationDate: '', addressUsedIn: [] },
  ])

  return (
    <div className="space-y-4">
      <SectionBar>Other Location Information</SectionBar>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)' }}>
          <thead>
            <tr>
              <TH>Id</TH>
              <TH>Address</TH>
              <TH>Federal Id</TH>
              <TH>Zip Code</TH>
              <TH>State</TH>
              <TH>County</TH>
              <TH>City</TH>
              <TH>Telephone</TH>
              <TH>Fax</TH>
              <TH>Effective Date</TH>
              <TH>Expiration Date</TH>
              <TH>Address Used In</TH>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc, i) => (
              <tr key={loc.id} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-table-row-alt, var(--bg-body))' }}>
                <TD style={{ color: 'var(--accent)', fontWeight: 600 }}>{loc.id}</TD>
                <TD>{loc.address}</TD>
                <TD>{loc.federalId}</TD>
                <TD>{loc.zip}</TD>
                <TD>{loc.state}</TD>
                <TD>{loc.county}</TD>
                <TD>{loc.city}</TD>
                <TD>{loc.telephone}</TD>
                <TD>{loc.fax}</TD>
                <TD>{loc.effectiveDate}</TD>
                <TD>{loc.expirationDate}</TD>
                <TD>
                  {loc.addressUsedIn.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'disc', paddingLeft: 16 }}>
                      {loc.addressUsedIn.map(a => (
                        <li key={a} style={{ color: '#e57f8a', fontWeight: 600, fontSize: '0.8rem' }}>{a}</li>
                      ))}
                    </ul>
                  ) : null}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Property Tab ──────────────────────────────────────────────────────────────
function PropertyTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const [data, setData] = useState({
    squareFeet: '23', stories: '6', sprinkler: 'Yes', deductible: '$10,000', coinsurance: 'N/A',
    buildingLimit: '20.00', constructionType: 'Steel', smokeDetector: 'Yes', windstormDeductible: '2%',
    contentsLimit: '', yearBuilt: '2020', fireAlarm: 'No', distanceToCoast: '2.51 Miles - 10 Miles',
    roofConstruction: 'Ceramic Tile', protectionClass: '3', burglarAlarm: 'Yes', incurredLosses: '2000',
  })
  const set = k => v => setData(p => ({ ...p, [k]: v }))

  const yesNo = ['Yes', 'No']
  const deductibles = ['$1,000', '$2,500', '$5,000', '$10,000', '$25,000', '$50,000']
  const constructionTypes = ['Frame', 'Masonry', 'Steel', 'Joisted Masonry', 'Non-Combustible', 'Fire Resistive']
  const windDeductibles = ['None', '1%', '2%', '3%', '5%', '10%']
  const distanceOptions = ['Less than 1 Mile', '1 Mile - 2.5 Miles', '2.51 Miles - 10 Miles', 'More than 10 Miles']
  const roofOptions = ['Asphalt Shingle', 'Metal', 'Tile', 'Ceramic Tile', 'Slate', 'Flat/BUR', 'TPO/EPDM']
  const coinsuranceOptions = ['N/A', '80%', '90%', '100%']

  return (
    <div className="space-y-4">
      <div style={{ background: 'var(--accent-muted)', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-heading)' }}>
        {policy.address1} {policy.address2} {policy.city}, {policy.policyState} {policy.zip}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <EditInput label="Square Feet" value={data.squareFeet} onChange={set('squareFeet')} />
        <EditInput label="Building Limit" value={data.buildingLimit} onChange={set('buildingLimit')} />
        <EditInput label="Contents Limit" value={data.contentsLimit} onChange={set('contentsLimit')} />
        <EditSelect label="Roof Construction" value={data.roofConstruction} onChange={set('roofConstruction')} options={roofOptions} />

        <EditInput label="# of Stories" value={data.stories} onChange={set('stories')} />
        <EditSelect label="Construction Type" value={data.constructionType} onChange={set('constructionType')} options={constructionTypes} />
        <EditInput label="Year Built" value={data.yearBuilt} onChange={set('yearBuilt')} />
        <EditInput label="Protection Class" value={data.protectionClass} onChange={set('protectionClass')} />

        <EditSelect label="Sprinkler" value={data.sprinkler} onChange={set('sprinkler')} options={yesNo} />
        <EditSelect label="Smoke Detector" value={data.smokeDetector} onChange={set('smokeDetector')} options={yesNo} />
        <EditSelect label="Fire Alarm" value={data.fireAlarm} onChange={set('fireAlarm')} options={yesNo} />
        <EditSelect label="Burglar Alarm" value={data.burglarAlarm} onChange={set('burglarAlarm')} options={yesNo} />

        <EditSelect label="Deductible" value={data.deductible} onChange={set('deductible')} options={deductibles} />
        <EditSelect label="Windstorm or Hail Deductible" value={data.windstormDeductible} onChange={set('windstormDeductible')} options={windDeductibles} />
        <EditSelect label="Distance to Coast(Miles)" value={data.distanceToCoast} onChange={set('distanceToCoast')} options={distanceOptions} />
        <EditInput label="# Incurred Loss(es)" value={data.incurredLosses} onChange={set('incurredLosses')} />

        <EditSelect label="CoInsurance" value={data.coinsurance} onChange={set('coinsurance')} options={coinsuranceOptions} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border-divider)' }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Proposal Tab ──────────────────────────────────────────────────────────────
function ProposalTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const [data, setData] = useState({
    policyNumber: policy.policyNumber || '12124',
    issuingCarrier: policy.issuingCarrier || 'Certain underwriters at Lloyd\'s and other insurers',
    billingCarrier: policy.billingCarrier || 'CFC Underwriting Limited',
    pureAnnualPremium: '0.00',
    annualBilledPremium: '0.00',
    companyCommissionRate: '2.00',
    agentCommissionRate: '1.20',
    carrierFee: '2,000.00',
    processingFee: '',
    auraBrokerFee: '2,000.00',
    admitted: 'Yes',
  })
  const set = k => v => setData(p => ({ ...p, [k]: v }))

  const ratingRows = [
    { docId: '7707', coverage: 'Commercial Property', location: `add 1 add 2 Robinson,...`, tivUnits: '20.00', effectiveDate: '06/13/2025', pureAnnual: '$0.00', billed: '$0.00', accumulated: '$0.00', carrierFee: '$2,000.00', auraBrokerFee: '$2,000.00', stampingFee: '', processingFee: '', otherFees: '$0.00', surcharge: '', tax: '', total: '$4,000.00' },
  ]

  return (
    <div className="space-y-5">
      {/* Proposal form */}
      <div style={{ background: 'var(--accent-muted)', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-heading)' }}>
        Commercial Property (CPRP) {policy.address1} {policy.address2} {policy.city}, {policy.policyState} {policy.zip}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EditInput label="Policy Number *" value={data.policyNumber} onChange={set('policyNumber')} />
        <div>
          <FieldLabel required>Issuing Carrier</FieldLabel>
          <input readOnly value={data.issuingCarrier} className="form-input w-full" style={{ fontSize: '0.82rem', background: 'var(--bg-input)', cursor: 'default' }} />
        </div>
        <div>
          <FieldLabel>Billing Carrier</FieldLabel>
          <input readOnly value={data.billingCarrier} className="form-input w-full" style={{ fontSize: '0.82rem', background: 'var(--bg-input)', cursor: 'default' }} />
        </div>

        <EditInput label="Pure/Annual Premium" value={data.pureAnnualPremium} onChange={set('pureAnnualPremium')} />
        <EditInput label="Annual/Billed Premium *" value={data.annualBilledPremium} onChange={set('annualBilledPremium')} />
        <EditInput label="Company Commission Rate(%) *" value={data.companyCommissionRate} onChange={set('companyCommissionRate')} />

        <EditInput label="Agent Commission Rate(%) *" value={data.agentCommissionRate} onChange={set('agentCommissionRate')} />
        <EditInput label="Carrier Fee (Taxable)" value={data.carrierFee} onChange={set('carrierFee')} />
        <EditInput label="Processing Fee (Non-Taxable)" value={data.processingFee} onChange={set('processingFee')} />

        <EditInput label="AURA Broker Fee (Taxable)" value={data.auraBrokerFee} onChange={set('auraBrokerFee')} />
        <EditSelect label="Admitted *" value={data.admitted} onChange={set('admitted')} options={['Yes', 'No']} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>

      {/* Rating Information */}
      <SectionBar>Rating Information</SectionBar>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              {['Doc. Id.', 'Coverage', 'Location', 'TIV/Units', 'Effective Date', 'Pure/Annual Premium', 'Billed Premium', 'Accumulated Premium', 'Carrier Fee', 'AURA Broker Fee', 'Stamping Fee', 'Processing Fee', 'Other Fees', 'Surcharge', 'Tax', 'Total'].map(h => (
                <TH key={h}>{h}</TH>
              ))}
            </tr>
          </thead>
          <tbody>
            {ratingRows.map((r, i) => (
              <tr key={i}>
                <TD style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.docId}</TD>
                <TD>{r.coverage}</TD>
                <TD>{r.location}</TD>
                <TD>{r.tivUnits}</TD>
                <TD>{r.effectiveDate}</TD>
                <TD>{r.pureAnnual}</TD>
                <TD>{r.billed}</TD>
                <TD>{r.accumulated}</TD>
                <TD>{r.carrierFee}</TD>
                <TD>{r.auraBrokerFee}</TD>
                <TD>{r.stampingFee}</TD>
                <TD>{r.processingFee}</TD>
                <TD>{r.otherFees}</TD>
                <TD>{r.surcharge}</TD>
                <TD>{r.tax}</TD>
                <TD style={{ fontWeight: 700, color: '#10b981' }}>{r.total}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Subjectivity Tab ──────────────────────────────────────────────────────────
function SubjectivityTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const availableItems = [
    '5 Year Current Valued Loss Run',
    'Completed ASIC app (attached)',
    'KNLL if Bind request is received past the effective date',
    'NO LOCATIONS WITH PRMA WILL BE CONSIDERED',
    'Renewal Guidance is within 9% of the current rate over or below proposed premium herein',
    'Separate Cost for Equipment Breakdown is $2500 Per Partner 100MM Limit',
    'Signed Accord Forms',
    'Signed Statement of Values & Proposal',
    'Surplus Lines Producer Information.',
    'Warranty Statement',
    'Written request to bind prior to proposal expiration date.',
  ]
  const [attached, setAttached] = useState([])

  const attach = (item) => {
    if (!attached.includes(item)) setAttached(p => [...p, item])
  }
  const detach = (item) => setAttached(p => p.filter(x => x !== item))

  return (
    <div className="space-y-4">
      <SectionBar>Subjectivity Information</SectionBar>

      <div style={{ border: '1px solid var(--border-divider)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-table-head)', padding: '8px 14px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-heading)' }}>
          Attached Subjectivity Information
        </div>
        {attached.length === 0 ? (
          <div style={{ padding: '14px 16px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>No data found.</div>
        ) : (
          attached.map((item, i) => (
            <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border-divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.83rem', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-body)' }}>
              <span style={{ color: 'var(--text-primary)' }}>{item}</span>
              <button onClick={() => detach(item)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>Remove</button>
            </div>
          ))
        )}
      </div>

      <div style={{ border: '1px solid var(--border-divider)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-table-head)', padding: '8px 14px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-heading)' }}>
          Available Subjectivity Information
        </div>
        {availableItems.filter(i => !attached.includes(i)).map((item, i, arr) => (
          <div key={item} style={{ padding: '9px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-divider)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.83rem', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-body)' }}>
            <span style={{ color: 'var(--text-primary)' }}>{item}</span>
            <button onClick={() => attach(item)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11, borderRadius: 4, padding: '3px 10px', fontWeight: 600 }}>Attach</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Log Tab ───────────────────────────────────────────────────────────────────
function LogTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const [logs, setLogs] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLog, setNewLog] = useState({ logType: '', followUpDate: '', followUpUser: '', comment: '' })

  const logTypes = ['Follow Up', 'General', 'Underwriting', 'Claims', 'Payment', 'Binding']

  const addLog = () => {
    if (!newLog.comment) return
    setLogs(prev => [...prev, {
      seq: prev.length + 1,
      ...newLog,
      enteredUser: 'Nishit Kawane',
      enteredDate: new Date().toLocaleString(),
    }])
    setNewLog({ logType: '', followUpDate: '', followUpUser: '', comment: '' })
    setShowAddForm(false)
  }

  const docId = policy.policyNumber ? policy.policyNumber.split('(')[1]?.replace(')', '') || '7707' : '7707'
  const policyNum = policy.policyNumber ? policy.policyNumber.split(' ')[0] : '12124'

  return (
    <div className="space-y-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SectionBar>Log Details</SectionBar>
      </div>

      {/* Add Log collapsible */}
      <div style={{ border: '1px solid var(--border-divider)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-table-head)', padding: '8px 14px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Add Log</span>
          <button onClick={() => setShowAddForm(p => !p)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {showAddForm ? '−' : '+'}
          </button>
        </div>
        {showAddForm && (
          <div style={{ padding: 16 }} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EditSelect label="Log Type" value={newLog.logType} onChange={v => setNewLog(p => ({ ...p, logType: v }))} options={logTypes} />
              <EditInput label="Follow Up Date" value={newLog.followUpDate} onChange={v => setNewLog(p => ({ ...p, followUpDate: v }))} type="date" />
              <EditInput label="Follow Up Notify User" value={newLog.followUpUser} onChange={v => setNewLog(p => ({ ...p, followUpUser: v }))} />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={addLog} className="btn-primary" style={{ width: '100%' }}>Save Log</button>
              </div>
            </div>
            <div>
              <FieldLabel>Comment</FieldLabel>
              <textarea value={newLog.comment} onChange={e => setNewLog(p => ({ ...p, comment: e.target.value }))}
                className="form-input w-full" rows={3} style={{ fontSize: '0.85rem', resize: 'vertical' }} placeholder="Enter log comment..." />
            </div>
          </div>
        )}
      </div>

      {/* Log Information */}
      <div style={{ border: '1px solid var(--border-divider)', borderRadius: 6, overflow: 'hidden' }}>
        <PinkRowHeader>Log # : {docId} &nbsp;&nbsp; ({policyNum}) &nbsp;&nbsp; {policy.policyType?.toUpperCase() || 'MONOLINE'} &nbsp;&nbsp; Log Detail for {docId}</PinkRowHeader>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)' }}>
            <thead>
              <tr>
                <TH>Sequence #</TH>
                <TH>Log Type</TH>
                <TH>Follow Up date</TH>
                <TH>Follow up notify user</TH>
                <TH>Entered User</TH>
                <TH>Entered Date and Time</TH>
                <TH>Comment</TH>
                <TH style={{ color: 'var(--accent)' }}>Action</TH>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.83rem' }}>No log entries found.</td></tr>
              ) : logs.map((log, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-body)' }}>
                  <TD style={{ color: 'var(--accent)', fontWeight: 700 }}>{log.seq}</TD>
                  <TD>{log.logType}</TD>
                  <TD>{log.followUpDate}</TD>
                  <TD>{log.followUpUser}</TD>
                  <TD>{log.enteredUser}</TD>
                  <TD>{log.enteredDate}</TD>
                  <TD>{log.comment}</TD>
                  <TD>
                    <button onClick={() => setLogs(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Documents Tab ─────────────────────────────────────────────────────────────
function DocumentsTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const [documents, setDocuments] = useState([])
  const [term, setTerm] = useState('2025 - 2026')
  const [displayPolicy, setDisplayPolicy] = useState('Yes')
  const [category, setCategory] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ category: '', comments: '' })

  const docCategories = ['-- All Categories --', 'Application', 'Policy', 'Endorsement', 'Invoice', 'Loss Run', 'Correspondence', 'Other']

  const docId = policy.policyNumber ? policy.policyNumber.split('(')[1]?.replace(')', '') || '7707' : '7707'
  const policyNum = policy.policyNumber ? policy.policyNumber.split(' ')[0] : '12124'

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setDocuments(prev => [...prev, {
      category: uploadForm.category || 'Other',
      comments: uploadForm.comments,
      enteredUser: 'Nishit Kawane',
      enteredDate: new Date().toLocaleDateString(),
      fileName: file.name,
    }])
    setUploadForm({ category: '', comments: '' })
    setShowUpload(false)
  }

  return (
    <div className="space-y-4">
      {/* Upload toggle */}
      <div style={{ border: '1px solid var(--border-divider)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-table-head)', padding: '8px 14px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Upload Document</span>
          <button onClick={() => setShowUpload(p => !p)} style={{ background: 'var(--accent)', border: 'none', color: '#fff', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {showUpload ? '−' : '+'}
          </button>
        </div>
        {showUpload && (
          <div style={{ padding: 16 }} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EditSelect label="Category" value={uploadForm.category} onChange={v => setUploadForm(p => ({ ...p, category: v }))} options={docCategories.slice(1)} />
              <div style={{ gridColumn: 'span 2' }}>
                <EditInput label="Comments" value={uploadForm.comments} onChange={v => setUploadForm(p => ({ ...p, comments: v }))} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'var(--accent)', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13 }}>
                <Upload size={14} /> Choose File
                <input type="file" style={{ display: 'none' }} onChange={handleUpload} />
              </label>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Select a file to upload</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: '8px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem' }}>Documents</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Term :</span>
          <select value={term} onChange={e => setTerm(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
            <option>2025 - 2026</option><option>2024 - 2025</option><option>2023 - 2024</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Display Policy Documents :</span>
          <select value={displayPolicy} onChange={e => setDisplayPolicy(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
            <option>Yes</option><option>No</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Category :</span>
          <select value={category} onChange={e => setCategory(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
            {docCategories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Document list */}
      <div style={{ border: '1px solid var(--border-divider)', borderRadius: 6, overflow: 'hidden' }}>
        <PinkRowHeader>Document # : {docId} &nbsp;&nbsp; ({policyNum}) &nbsp;&nbsp; Standard &nbsp;&nbsp;
          <span style={{ color: '#fde68a', fontWeight: 700, cursor: 'pointer' }}>Upload Document for {docId}</span>
        </PinkRowHeader>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)' }}>
          <thead>
            <tr>
              <TH>Category</TH>
              <TH>Comments</TH>
              <TH>Entered User</TH>
              <TH>Entered Date</TH>
              <TH style={{ color: 'var(--accent)' }}>View</TH>
              <TH style={{ color: 'var(--accent)' }}>Delete</TH>
              <TH style={{ color: 'var(--accent)' }}>Edit</TH>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.83rem' }}>No documents uploaded.</td></tr>
            ) : documents.map((doc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-body)' }}>
                <TD>{doc.category}</TD>
                <TD>{doc.comments}</TD>
                <TD>{doc.enteredUser}</TD>
                <TD>{doc.enteredDate}</TD>
                <TD><button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12 }}>View</button></TD>
                <TD><button onClick={() => setDocuments(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>Delete</button></TD>
                <TD><button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12 }}>Edit</button></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Issuance Tab ──────────────────────────────────────────────────────────────
function IssuanceTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const [paymentPlan, setPaymentPlan] = useState('')
  const [paymentDueDate, setPaymentDueDate] = useState('')
  const [admitted, setAdmitted] = useState('Yes')
  const esAgentName = 'Johnson, William Joseph'
  const esAgentLicense = '3001998363'

  const paymentPlans = ['Full Pay', 'Two Pay', 'Quarterly', 'Monthly']

  const ratingRows = [
    { docId: '7707', coverage: 'Commercial Property', effectiveDate: '06/13/2025', policy: policy.policyNumber?.split(' ')[0] || '12124', issuingCarrier: 'Certain u...', pureAnnual: '$0.00', billed: '$0.00', accumulated: '$0.00', carrierFee: '$2,000.00', auraBrokerFee: '$2,000.00', stampingFee: '', processingFee: '', otherFees: '$0.00', surcharge: '', tax: '', total: '$4,000.00' },
  ]

  return (
    <div className="space-y-5">
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid var(--border-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FieldLabel>Payment Plan :</FieldLabel>
          <select value={paymentPlan} onChange={e => setPaymentPlan(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', padding: '5px 10px' }}>
            <option value="">-- Select --</option>
            {paymentPlans.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FieldLabel>Payment Due date :</FieldLabel>
          <input type="date" value={paymentDueDate} onChange={e => setPaymentDueDate(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', padding: '5px 10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FieldLabel>Admitted *</FieldLabel>
          <select value={admitted} onChange={e => setAdmitted(e.target.value)} className="form-input" style={{ fontSize: '0.82rem', padding: '5px 10px' }}>
            <option>Yes</option><option>No</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-label)', fontWeight: 600 }}>E&S Agent Name :</span>
          <input readOnly value={esAgentName} className="form-input" style={{ fontSize: '0.82rem', background: 'var(--bg-input)', cursor: 'default', minWidth: 220 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-label)', fontWeight: 600 }}>E&S Agent License # :</span>
          <input readOnly value={esAgentLicense} className="form-input" style={{ fontSize: '0.82rem', background: 'var(--bg-input)', cursor: 'default', minWidth: 120 }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>

      <SectionBar>Rating Information</SectionBar>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              {['Doc. Id.', 'Coverage', 'Effective Date', 'Policy', 'Issuing Carrier', 'Pure/Annual Premium', 'Billed Premium', 'Accumulated Premium', 'Carrier Fee', 'AURA Broker Fee', 'Stamping Fee', 'Processing Fee', 'Other Fees', 'Surcharge', 'Tax', 'Total'].map(h => <TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {ratingRows.map((r, i) => (
              <tr key={i}>
                <TD style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.docId}</TD>
                <TD>{r.coverage}</TD>
                <TD>{r.effectiveDate}</TD>
                <TD>{r.policy}</TD>
                <TD>{r.issuingCarrier}</TD>
                <TD>{r.pureAnnual}</TD>
                <TD>{r.billed}</TD>
                <TD>{r.accumulated}</TD>
                <TD>{r.carrierFee}</TD>
                <TD>{r.auraBrokerFee}</TD>
                <TD>{r.stampingFee}</TD>
                <TD>{r.processingFee}</TD>
                <TD>{r.otherFees}</TD>
                <TD>{r.surcharge}</TD>
                <TD>{r.tax}</TD>
                <TD style={{ fontWeight: 700, color: '#10b981' }}>{r.total}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Claims Tab ────────────────────────────────────────────────────────────────
function ClaimsTab({ policy, onNext, onPrev, isFirst, isLast }) {
  return (
    <div className="space-y-4">
      <SectionBar>Claims Information</SectionBar>
      <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No Claims</div>
        <div style={{ fontSize: 13 }}>No claims have been filed for this policy.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Risk Profile Tab (generic) ────────────────────────────────────────────────
function RiskProfileTab({ policy, onNext, onPrev, isFirst, isLast }) {
  const lob = policy.lob || ''
  const [data, setData] = useState({
    occupancy: '', constructionType: '', yearBuilt: '', squareFeet: '',
    stories: '', sprinkler: 'No', alarmSystem: 'No', roofAge: '',
    lastInspection: '', notes: '',
  })
  const set = k => v => setData(p => ({ ...p, [k]: v }))
  const yesNo = ['Yes', 'No']
  const constructions = ['Frame', 'Masonry', 'Steel', 'Mixed', 'Other']

  const claimTypes = ['EARTH MOVEMENT','ESCAPE OF WATER','FIRE','FLOOD','HAIL','HURRICANE','LIABILITY','LIGHTNING','MEDICAL EXPENSES','MOLD','OTHER','RAIN','ROOFDAMAGE','SEWER BACK-UP','SINKHOLE','SNOW','THEFT','TORNADO','TREEFALL','UNKNOWN','VANDALISM','WIND']
  const [claims, setClaims] = useState([{ type:'', date:'', settled:'', repaired:'', description:'', amount:'' }])

  const addClaim = () => setClaims(p => [...p, { type:'', date:'', settled:'', repaired:'', description:'', amount:'' }])
  const removeClaim = (idx) => setClaims(p => p.filter((_,i) => i !== idx))
  const updateClaim = (idx,key,val) => setClaims(p => p.map((c,i)=> i===idx ? { ...c, [key]: val } : c))


  return (
    <div className="space-y-4">
      <SectionBar>Risk Profile — {lob}</SectionBar>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <EditInput label="Occupancy" value={data.occupancy} onChange={set('occupancy')} />
        <EditSelect label="Construction Type" value={data.constructionType} onChange={set('constructionType')} options={constructions} />
        <EditInput label="Year Built" value={data.yearBuilt} onChange={set('yearBuilt')} />
        <EditInput label="Square Feet" value={data.squareFeet} onChange={set('squareFeet')} />
        <EditInput label="# of Stories" value={data.stories} onChange={set('stories')} />
        <EditSelect label="Sprinkler System" value={data.sprinkler} onChange={set('sprinkler')} options={yesNo} />
        <EditSelect label="Alarm System" value={data.alarmSystem} onChange={set('alarmSystem')} options={yesNo} />
        <EditInput label="Roof Age (Years)" value={data.roofAge} onChange={set('roofAge')} />
        <EditInput label="Last Inspection Date" value={data.lastInspection} onChange={set('lastInspection')} type="date" />
      </div>
      <div>
        <FieldLabel>Notes / Comments</FieldLabel>
        <textarea value={data.notes} onChange={e => set('notes')(e.target.value)}
          className="form-input w-full" rows={3} style={{ fontSize: '0.85rem', resize: 'vertical' }} />
      </div>

      {lob === 'Home Owners' && (
        <div className="space-y-3">
          <SectionBar>Claim Information</SectionBar>
          {claims.map((claim, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
              <EditSelect label="Claim Type" value={claim.type} onChange={(v) => updateClaim(idx, 'type', v)} options={claimTypes} />
              <EditInput label="Claim Date" type="date" value={claim.date} onChange={(v) => updateClaim(idx, 'date', v)} />
              <EditSelect label="Claim Settled" value={claim.settled} onChange={(v) => updateClaim(idx, 'settled', v)} options={yesNo} />
              <EditSelect label="Claim Fully Repaired" value={claim.repaired} onChange={(v) => updateClaim(idx, 'repaired', v)} options={yesNo} />
              <EditInput label="Description" value={claim.description} onChange={(v) => updateClaim(idx, 'description', v)} />
              <EditInput label="Claim Amount" value={claim.amount} onChange={(v) => updateClaim(idx, 'amount', v)} />
              <div className="flex gap-2">
                <button type="button" className="btn-primary" onClick={addClaim}>+</button>
                {claims.length > 1 && <button type="button" className="btn-secondary" onClick={() => removeClaim(idx)}>-</button>}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border-divider)' }}>
        <button className="btn-secondary" onClick={onPrev} disabled={isFirst} style={{ opacity: isFirst ? 0.4 : 1 }}>Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={isLast} style={{ opacity: isLast ? 0.4 : 1 }}>Next</button>
      </div>
    </div>
  )
}

// ── Placeholder for remaining tabs ────────────────────────────────────────────
function PlaceholderTab({ name, onNext, onPrev, isFirst, isLast }) {
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📄</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{name}</div>
      <div style={{ fontSize: 13 }}>This section is under construction.</div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PolicyDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialPolicy = location.state?.policy

  const [policy, setPolicy] = useState(initialPolicy)
  const [activeTab, setActiveTab] = useState('Policy Details')

  const handleAssignedToChange = (newAgent) => {
    setPolicy(p => ({ ...p, assignedTo: newAgent }))
  }

  if (!initialPolicy) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>No policy selected. <button className="btn-primary" style={{ marginLeft: 12 }} onClick={() => navigate('/')}>Go to Dashboard</button></p>
      </div>
    )
  }

  const tabs = LOB_TABS[policy.lob] || DEFAULT_TABS
  const tabIdx = tabs.indexOf(activeTab)
  const goNext = () => { if (tabIdx < tabs.length - 1) setActiveTab(tabs[tabIdx + 1]) }
  const goPrev = () => { if (tabIdx > 0) setActiveTab(tabs[tabIdx - 1]) }
  const navProps = { onNext: goNext, onPrev: goPrev, isFirst: tabIdx === 0, isLast: tabIdx === tabs.length - 1 }

  const renderTab = () => {
    switch (activeTab) {
      case 'Policy Details': return <PolicyDetailPanel policy={policy} {...navProps} />
      case 'Additional Locations': return <AdditionalLocationsTab policy={policy} {...navProps} />
      case 'Property': return <PropertyTab policy={policy} {...navProps} />
      case 'Proposal': return <ProposalTab policy={policy} {...navProps} />
      case 'Subjectivity': return <SubjectivityTab policy={policy} {...navProps} />
      case 'Log': return <LogTab policy={policy} {...navProps} />
      case 'Documents': return <DocumentsTab policy={policy} {...navProps} />
      case 'Issuance': return <IssuanceTab policy={policy} {...navProps} />
      case 'Claims': return <ClaimsTab policy={policy} {...navProps} />
      case 'Risk Profile': return <RiskProfileTab policy={policy} {...navProps} />
      default: return <PlaceholderTab name={activeTab} {...navProps} />
    }
  }

  return (
    <div className="space-y-0 animate-fade-in" style={{ padding: 0 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, boxShadow: 'var(--shadow-card)', overflow: 'hidden', margin: 0 }}>
        <PolicyHeader policy={policy} />

        {/* Tab bar + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-divider)', padding: '0 16px', background: 'var(--bg-card)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '12px 14px', fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ paddingRight: 4, paddingTop: 8, paddingBottom: 8 }}>
            <ActionsDropdown policy={policy} onAssignedToChange={handleAssignedToChange} />
          </div>
        </div>

        {/* Tab content */}
        <div style={{ padding: '24px 24px', background: 'var(--bg-body)' }}>
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
