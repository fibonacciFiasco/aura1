import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'

/* ── Report catalogue ─────────────────────────────────────── */
const REPORTS = [
  'Active Quote Policy Count',
  'BDX Aura Payment Report',
  'BDX Aura Premium Report',
  'Daily Log Report',
  'Expiration Report',
  'Get Agent Policy Count',
  'Invoice',
  'Log Report',
  'New Business By Division',
  'New Business By Division_NEW',
  'Retension Report',
  'Spicewood Transactions Report',
  'Wedding Report',
]

/* ── Shared option lists ─────────────────────────────────── */
const REPORT_TYPES_PDF_EXCEL = ['PDF', 'EXCEL']
const REPORT_TYPES_PDF       = ['PDF']
const CARRIER_TYPES          = ['SATIONWOOD', 'BRIT']
const DIVISIONS              = [
  'Arrowood Insurance Services, Inc.',
  'Aura Risk Management & Insurance Services, LLC',
  'D B Jones Associates',
  'SpiceWood',
]
const TX_STATUSES = [
  'New Business',
  'New Business Endorsement',
  'New Business Reinstatement',
  'Renewal',
  'Renewal Reinstatement',
]
const POLICY_STATUSES = [
  'Active',
  'Cancellation - Under Work',
  'Cancelled',
  'Closed',
  'DNR (Do Not Renew)',
  'Declined',
  'Declined Endorsement',
  'Declined Quote',
  'Deleted',
  'Endorsement - Submitted',
  'Endorsement - Under Work',
  'Expired Endorsement',
  'Expired Quote',
  'History',
  'Not Renew',
  'Quote',
  'Quote - Submitted',
  'Quote - Under Work',
  'Reinstatement - Under Work',
  'Renewal - Expired',
  'Renewal - Under Work',
  'Renewal In Process',
  'Renewal Quote',
  'Work In Progress',
]

/* ── Field schema per report ─────────────────────────────── */
const REPORT_FIELDS = {
  'Active Quote Policy Count': [
    { type: 'date', label: 'From', required: true },
    { type: 'date', label: 'To',   required: true },
  ],
  'BDX Aura Payment Report': [
    { type: 'date',   label: 'From',         required: true },
    { type: 'date',   label: 'To',           required: true },
    { type: 'select', label: 'Report Type',  required: true,  options: REPORT_TYPES_PDF_EXCEL, placeholder: '-- Select Report Type --' },
    { type: 'select', label: 'Carrier Type', required: true,  options: CARRIER_TYPES,          placeholder: '-- Select Carrier Type --' },
  ],
  'BDX Aura Premium Report': [
    { type: 'date',   label: 'From',         required: true },
    { type: 'date',   label: 'To',           required: true },
    { type: 'select', label: 'Report Type',  required: true,  options: REPORT_TYPES_PDF_EXCEL, placeholder: '-- Select Report Type --' },
    { type: 'select', label: 'Carrier Type', required: true,  options: CARRIER_TYPES,          placeholder: '-- Select Carrier Type --' },
  ],
  'Daily Log Report': [
    { type: 'select', label: 'Division',           required: false, options: DIVISIONS,              placeholder: '-- All Division --',           allOption: true },
    { type: 'select', label: 'Branch',             required: false, options: [],                     placeholder: '-- All Branch --',             allOption: true },
    { type: 'date',   label: 'From',               required: true },
    { type: 'date',   label: 'To',                 required: true },
    { type: 'select', label: 'Transaction Status', required: false, options: TX_STATUSES,            placeholder: '-- All Transaction Status --', allOption: true },
    { type: 'select', label: 'Report Type',        required: true,  options: REPORT_TYPES_PDF_EXCEL, placeholder: '-- Select Report Type --' },
  ],
  'Expiration Report': [
    { type: 'date', label: 'From', required: true },
    { type: 'date', label: 'To',   required: true },
  ],
  'Get Agent Policy Count': [
    { type: 'date', label: 'From', required: true },
    { type: 'date', label: 'To',   required: true },
  ],
  'Invoice': [
    { type: 'text',   label: 'Document Number', required: true,  placeholder: '0' },
    { type: 'select', label: 'Report Type',     required: true,  options: REPORT_TYPES_PDF, placeholder: '-- Select Report Type --' },
  ],
  'Log Report': [
    { type: 'select', label: 'Division',      required: false, options: DIVISIONS,              placeholder: '-- All Division --',     allOption: true },
    { type: 'select', label: 'Branch',        required: false, options: [],                     placeholder: '-- All Branch --',       allOption: true },
    { type: 'date',   label: 'From',          required: true },
    { type: 'date',   label: 'To',            required: true },
    { type: 'select', label: 'Report Type',   required: false, options: REPORT_TYPES_PDF_EXCEL, placeholder: '-- All Report Type --',  allOption: true },
    { type: 'select', label: 'Policy Status', required: false, options: POLICY_STATUSES,        placeholder: '-- All Policy Status --', allOption: true },
  ],
  'New Business By Division': [
    { type: 'select', label: 'Division',    required: true,  options: DIVISIONS,              placeholder: '-- Select Division --' },
    { type: 'date',   label: 'From',        required: true },
    { type: 'date',   label: 'To',          required: true },
    { type: 'select', label: 'Report Type', required: true,  options: REPORT_TYPES_PDF_EXCEL, placeholder: '-- Select Report Type --' },
  ],
  'New Business By Division_NEW': [
    { type: 'select', label: 'Division',              required: true,  options: DIVISIONS, placeholder: '-- Select Division --' },
    { type: 'select', label: 'Branch',                required: false, options: [],        placeholder: '-- Select Branch --' },
    { type: 'date',   label: 'Effective Date - From', required: true },
    { type: 'date',   label: 'Effective Date - To',   required: true },
  ],
  'Retension Report': [
    { type: 'date', label: 'From', required: true },
    { type: 'date', label: 'To',   required: true },
  ],
  'Spicewood Transactions Report': [
    { type: 'select', label: 'Division',                required: true,  options: DIVISIONS, placeholder: '-- Select Division --' },
    { type: 'select', label: 'Branch',                  required: false, options: [],        placeholder: '-- Select Branch --' },
    { type: 'date',   label: 'Transaction Date - From', required: true },
    { type: 'date',   label: 'Transaction Date - To',   required: true },
  ],
  'Wedding Report': [
    { type: 'date',   label: 'From',          required: true },
    { type: 'date',   label: 'To',            required: true },
    { type: 'select', label: 'Report Type',   required: true,  options: REPORT_TYPES_PDF_EXCEL, placeholder: '-- Select Report Type --' },
    { type: 'select', label: 'Policy Status', required: true,  options: POLICY_STATUSES,        placeholder: '-- Select Policy Status --' },
  ],
}

/* ── Field renderers ─────────────────────────────────────── */
function DateField({ label, required }) {
  return (
    <div>
      <label className="block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-label)' }}>
        {label}{required && <span style={{ color: '#f87171' }}> *</span>}
      </label>
      <input type="date" className="form-input w-full" style={{ colorScheme: 'dark' }} />
    </div>
  )
}

function SelectField({ label, required, options, placeholder }) {
  return (
    <div>
      <label className="block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-label)' }}>
        {label}{required && <span style={{ color: '#f87171' }}> *</span>}
      </label>
      <select className="form-input w-full">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function TextField({ label, required, placeholder }) {
  return (
    <div>
      <label className="block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-label)' }}>
        {label}{required && <span style={{ color: '#f87171' }}> *</span>}
      </label>
      <input type="text" className="form-input w-full" placeholder={placeholder || ''} />
    </div>
  )
}

function Field({ f }) {
  if (f.type === 'date')   return <DateField   label={f.label} required={f.required} />
  if (f.type === 'select') return <SelectField label={f.label} required={f.required} options={f.options} placeholder={f.placeholder} />
  return <TextField label={f.label} required={f.required} placeholder={f.placeholder} />
}

/* ── Main page ───────────────────────────────────────────── */
export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('')
  const [formKey, setFormKey] = useState(0)

  const fields = selectedReport ? (REPORT_FIELDS[selectedReport] || []) : []

  function handleSelect(e) {
    setSelectedReport(e.target.value)
    setFormKey(k => k + 1)
  }

  function handleReset() {
    setFormKey(k => k + 1)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reports" subtitle="Generate insurance system reports" />

      <div className="card-glass p-6">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-heading)' }}>
          Reports
        </h2>

        {/* Report selector */}
        <div className="mb-6" style={{ maxWidth: '360px' }}>
          <label className="block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-label)' }}>
            Select Report
          </label>
          <select className="form-input w-full" value={selectedReport} onChange={handleSelect}>
            <option value="">-- Select Report --</option>
            {REPORTS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Dynamic fields */}
        {selectedReport && (
          <div key={formKey}>
            <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--border-divider)' }}>
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  background: 'var(--accent-muted)',
                  color: 'var(--text-mono)',
                  border: '1px solid var(--border-input-focus)',
                }}
              >
                {selectedReport}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {fields.map((f, i) => <Field key={i} f={f} />)}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="btn-secondary" onClick={handleReset}>Reset</button>
          <button className="btn-primary">Generate Report</button>
        </div>
      </div>
    </div>
  )
}
