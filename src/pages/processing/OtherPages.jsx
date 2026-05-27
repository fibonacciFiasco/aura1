import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/PageHeader'
import { RETAIL_AGENTS } from '../../utils/constants'

// ── Shared data ──────────────────────────────────────────────────────────────

const STANDARD_BRANCHES = [
  'AURA Binding Authority (ABA)',
  'Aura Risk Management & Insurance Services, LLC',
  'Lender Placed/Real Estate Owned Insurance Services',
  'Rubicon M&A Insurance Services',
  'Transportation',
  'zzGrayStone',
]

const DIVISIONS = ['Aura Risk Management & Insurance Services, LLC']
const POLICY_TYPES = ['Monoline', 'Package']
const BILLING_TYPES = ['Agency Billing', 'Direct Billing']
const DESIGNATIONS = ['M.D./MD', 'D.O./DO']
const BUSINESS_TYPES = [
  'Retail','Wholesale','Manufacturing','Services','Construction',
  'Real Estate','Hospitality','Healthcare','Technology','Transportation','Other',
]

const states = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

// ── Reusable field components ────────────────────────────────────────────────

const FieldLabel = ({ children, required }) => (
  <label style={{
    fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em',
    color: 'var(--accent)', display: 'block', marginBottom: '4px',
  }}>
    {children}{required && <span style={{ color: 'var(--accent)' }}> *</span>}
  </label>
)

const Input = ({ label, placeholder, type = 'text', required, defaultValue }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <input
      type={type} placeholder={placeholder} defaultValue={defaultValue}
      className="form-input w-full" style={{ fontSize: '0.85rem' }}
    />
  </div>
)

const SelectField = ({ label, options, placeholder, required, defaultValue }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <select className="form-input w-full" style={{ fontSize: '0.85rem' }} defaultValue={defaultValue || ''}>
      <option value="">{placeholder || '--- Select ---'}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

// ── Section header bar ───────────────────────────────────────────────────────

const SectionBar = ({ title }) => (
  <div style={{
    background: 'var(--accent-muted)', borderRadius: '8px 8px 0 0',
    padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>{title}</span>
    <button style={{
      background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px',
      width: '28px', height: '28px', fontSize: '1.2rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }}>−</button>
  </div>
)

const Divider = () => <div style={{ borderTop: '1px solid var(--border-divider)', marginTop: '0.25rem' }} />

// ── Reusable address block ───────────────────────────────────────────────────

const AddressBlock = ({ title }) => (
  <div style={{ borderTop: '1px solid var(--border-divider)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '1rem' }}>{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input label="Address Line 1" placeholder="Address Line 1" required />
      <Input label="Address Line 2" placeholder="Address Line 2" />
      <Input label="Telephone Number" placeholder="123-456-7890" />
      <Input label="Fax" placeholder="123-456-7890" />
      <Input label="Zip Code" placeholder="Zip" />
      <SelectField label="State" options={states} />
      <Input label="County" placeholder="County" />
      <Input label="City" placeholder="City" />
    </div>
  </div>
)

const ToggleAddress = ({ label, title }) => {
  const [show, setShow] = useState(false)
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
        <input type="checkbox" checked={show} onChange={() => setShow(!show)} className="h-4 w-4" style={{ accentColor: 'var(--accent)' }} />
        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</label>
      </div>
      {show && <AddressBlock title={title} />}
    </>
  )
}

// ── Step action buttons ──────────────────────────────────────────────────────

const StepActions = ({ onBack, onContinue, isLast }) => (
  <div className="flex justify-between gap-3 pt-3" style={{ borderTop: '1px solid var(--border-divider)' }}>
    {onBack
      ? <button className="btn-secondary" onClick={onBack}>Back</button>
      : <div />}
    <div className="flex gap-3">
      <button className="btn-secondary">Reset</button>
      {isLast
        ? <button className="btn-primary">Save Quote</button>
        : <button className="btn-primary" onClick={onContinue}>Next</button>}
    </div>
  </div>
)

// ── Shared first-row (Division · Branch · Eff Date · Exp Date · Policy State) ─

const TopRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
    <SelectField label="Division" options={DIVISIONS} defaultValue="Aura Risk Management & Insurance Services, LLC" required />
    <SelectField label="Branch" options={STANDARD_BRANCHES} placeholder="--- Select Branch ---" required />
    <Input label="Requested Effective Date" placeholder="dd-mm-yyyy" type="date" required />
    <Input label="Expiry Date" placeholder="dd-mm-yyyy" type="date" required />
    <SelectField label="Policy State" options={states} placeholder="--- Select State ---" required />
  </div>
)

// ════════════════════════════════════════════════════════════════════════════
// RENEWAL QUOTE
// ════════════════════════════════════════════════════════════════════════════

export function RenewalPage() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={step === 1 ? 'Renewal Quote' : 'Renewal Quote - Address Information'} subtitle="AURA quote and policy processing" />
      <div className="card-glass overflow-hidden">
        <SectionBar title="Policy Detail" />
        <div className="p-6 space-y-4">
          {step === 1 && <>
            <TopRow />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectField label="Policy Type" options={POLICY_TYPES} defaultValue="Monoline" required />
              <Input label="Line of Business" placeholder="--- Select Line of Business ---" required />
              <SelectField label="Retail Agent" options={RETAIL_AGENTS} placeholder="--- Select Agent ---" required />
              <Input label="Retail Agent Contact Name" placeholder="Agent Name" required />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" required />
              <SelectField label="Billing Type" options={BILLING_TYPES} placeholder="-- Select --" />
              <Input label="AURA Broker Name" placeholder="Broker Name" required />
              <Input label="AURA Broker Email" placeholder="Broker Email" required />
            </div>
            <StepActions onContinue={() => setStep(2)} />
          </>}
          {step === 2 && <>
            <AddressBlock title="Physical Address" />
            <ToggleAddress label="If Mailing Address different than Physical Address" title="Mailing Address" />
            <StepActions onBack={() => setStep(1)} isLast />
          </>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// WORKERS COMP
// ════════════════════════════════════════════════════════════════════════════

export function WorkersCompPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Upload Workers Compensation Application Details" subtitle="Workers compensation processing" />
      <div className="card-glass p-6">
        <Input label="Category" placeholder="--- Select Category ---" />
        <div className="mt-6">
          <label className="text-sm block mb-2" style={{ color: 'var(--text-label)' }}>Comments</label>
          <textarea className="form-input w-full" style={{ minHeight: 120 }}></textarea>
        </div>
        <div className="mt-6">
          <label className="text-sm block mb-2" style={{ color: 'var(--text-label)' }}>File</label>
          <div style={{ border: '2px dashed var(--border-input)', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Drag file here OR Just click</p>
            <input type="file" multiple className="mt-4" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button className="btn-secondary">Reset</button>
          <button className="btn-primary">Upload</button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// VAVE HOMEOWNERS QUOTE
// Line of Business: Home Owners (fixed)
// Client Type: Person/Individual (default)
// Issuing Carrier: Vave Home Owner | Billing Carrier: Ballantyne Brokers Ltd
// Designation options: M.D./MD, D.O./DO
// ════════════════════════════════════════════════════════════════════════════

export function HomeownersPage() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={step === 1 ? 'VAVE HomeOwners Quote' : 'VAVE HomeOwners - Address Information'}
        subtitle="AURA quote and policy processing"
      />
      <div className="card-glass overflow-hidden">
        <SectionBar title="Policy Detail" />
        <div className="p-6 space-y-4">
          {step === 1 && <>
            <TopRow />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Policy Type" options={POLICY_TYPES} defaultValue="Monoline" required />
              <SelectField label="Line of Business" options={['Home Owners']} defaultValue="Home Owners" required />
              <SelectField label="Retail Agent" options={RETAIL_AGENTS} placeholder="--- Select Agent ---" required />
              <Input label="Retail Agent Contact Name" placeholder="Agent Name" required />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Billing Type" options={BILLING_TYPES} placeholder="-- Select --" />
              <Input label="AURA Broker Name" placeholder="Broker Name" required />
              <Input label="AURA Broker Email" placeholder="Broker Email" required />
              <Input label="Issuing Carrier" defaultValue="Vave Home Owner" placeholder="Vave Home Owner" />
              <Input label="Billing Carrier" defaultValue="Ballantyne Brokers Ltd" placeholder="Ballantyne Brokers Ltd" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <SelectField label="Client Type" options={['Person/Individual','Company/Organization']} defaultValue="Person/Individual" required />
              <Input label="First Name" placeholder="First Name" required />
              <Input label="Middle Name" placeholder="Middle Name" />
              <Input label="Last Name" placeholder="Last Name" required />
              <Input label="Professional License No" placeholder="License No" />
              <SelectField label="Designation" options={DESIGNATIONS} placeholder="-- Designation --" />
            </div>
            <StepActions onContinue={() => setStep(2)} />
          </>}
          {step === 2 && <>
            <AddressBlock title="Physical Address" />
            <ToggleAddress label="If Mailing Address different than Physical Address" title="Mailing Address" />
            <StepActions onBack={() => setStep(1)} isLast />
          </>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// BRIT FLOOD QUOTE
// Line of Business: Personal Flood (fixed)
// Client Type: Person/Individual (default)
// Issuing Carrier: BRIT - Certain Underwriters at Lloyd's of London
// Designation options: M.D./MD, D.O./DO
// ════════════════════════════════════════════════════════════════════════════

export function FloodPage() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={step === 1 ? 'BRIT Flood Quote' : 'BRIT Flood - Address Information'}
        subtitle="AURA quote and policy processing"
      />
      <div className="card-glass overflow-hidden">
        <SectionBar title="Policy Detail" />
        <div className="p-6 space-y-4">
          {step === 1 && <>
            <TopRow />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Policy Type" options={POLICY_TYPES} defaultValue="Monoline" required />
              <SelectField label="Line of Business" options={['Personal Flood']} defaultValue="Personal Flood" required />
              <SelectField label="Retail Agent" options={RETAIL_AGENTS} placeholder="--- Select Agent ---" required />
              <Input label="Retail Agent Contact Name" placeholder="Agent Name" required />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Billing Type" options={BILLING_TYPES} placeholder="-- Select --" />
              <Input label="AURA Broker Name" placeholder="Broker Name" required />
              <Input label="AURA Broker Email" placeholder="Broker Email" required />
              <Input label="Issuing Carrier" defaultValue="BRIT - Certain Underwriters at Lloyd's of London" placeholder="Issuing Carrier" />
              <Input label="Billing Carrier" defaultValue="Ballantyne Brokers Ltd" placeholder="Ballantyne Brokers Ltd" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <SelectField label="Client Type" options={['Person/Individual','Company/Organization']} defaultValue="Person/Individual" required />
              <Input label="First Name" placeholder="First Name" required />
              <Input label="Middle Name" placeholder="Middle Name" />
              <Input label="Last Name" placeholder="Last Name" required />
              <Input label="Professional License No" placeholder="License No" />
              <SelectField label="Designation" options={DESIGNATIONS} placeholder="-- Designation --" />
            </div>
            <StepActions onContinue={() => setStep(2)} />
          </>}
          {step === 2 && <>
            <AddressBlock title="Physical Address" />
            <ToggleAddress label="If Mailing Address different than Physical Address" title="Mailing Address" />
            <StepActions onBack={() => setStep(1)} isLast />
          </>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SATINWOOD WIND BUY BACK QUOTE
// Line of Business: Commercial - Windstorm Deductible Buy Back (fixed)
// Client Type: Company/Organization (default)
// Issuing Carrier: Satinwood Underwriting Limited
// ════════════════════════════════════════════════════════════════════════════

export function WindPage() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={step === 1 ? 'Satinwood Wind Buy Back Quote' : 'Satinwood Wind Buy Back - Address Information'}
        subtitle="AURA quote and policy processing"
      />
      <div className="card-glass overflow-hidden">
        <SectionBar title="Policy Detail" />
        <div className="p-6 space-y-4">
          {step === 1 && <>
            <TopRow />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Policy Type" options={POLICY_TYPES} defaultValue="Monoline" required />
              <SelectField
                label="Line of Business"
                options={['Commercial - Windstorm Deductible Buy Back']}
                defaultValue="Commercial - Windstorm Deductible Buy Back"
                required
              />
              <SelectField label="Retail Agent" options={RETAIL_AGENTS} placeholder="--- Select Agent ---" required />
              <Input label="Retail Agent Contact Name" placeholder="Agent Name" required />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Billing Type" options={BILLING_TYPES} placeholder="-- Select --" />
              <Input label="AURA Broker Name" placeholder="Broker Name" required />
              <Input label="AURA Broker Email" placeholder="Broker Email" required />
              <Input label="Issuing Carrier" defaultValue="Satinwood Underwriting Limited" placeholder="Issuing Carrier" />
              <Input label="Billing Carrier" defaultValue="Ballantyne Brokers Ltd" placeholder="Ballantyne Brokers Ltd" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Client Type" options={['Company/Organization','Person/Individual']} defaultValue="Company/Organization" required />
              <Input label="Company Name" placeholder="Company Name" required />
              <SelectField label="Type of Business" options={BUSINESS_TYPES} placeholder="--- Select Business Type ---" />
              <Input label="Establishment Date" placeholder="MM/YYYY" />
              <Input label="Year(s) In Business" placeholder="" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Nature of Business" placeholder="" />
              <Input label="NAICS Code" placeholder="" />
              <Input label="SIC Code" placeholder="" />
            </div>
            <StepActions onContinue={() => setStep(2)} />
          </>}
          {step === 2 && <>
            <AddressBlock title="Physical Address" />
            <ToggleAddress label="If Mailing Address different than Physical Address" title="Mailing Address" />
            <StepActions onBack={() => setStep(1)} isLast />
          </>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// LENDER / REO QUOTE
// ════════════════════════════════════════════════════════════════════════════

export function LenderPage() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={step === 1 ? 'Lender/REO Quote' : 'Lender/REO - Address Information'}
        subtitle="AURA quote and policy processing"
      />
      <div className="card-glass overflow-hidden">
        <SectionBar title="Policy Detail" />
        <div className="p-6 space-y-4">
          {step === 1 && <>
            <TopRow />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Policy Type" options={POLICY_TYPES} defaultValue="Monoline" required />
              <Input label="Line of Business" placeholder="--- Select Line of Business ---" required />
              <SelectField label="Retail Agent" options={RETAIL_AGENTS} placeholder="--- Select Agent ---" required />
              <Input label="Retail Agent Contact Name" placeholder="Agent Name" required />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SelectField label="Billing Type" options={BILLING_TYPES} placeholder="-- Select --" />
              <Input label="AURA Broker Name" placeholder="Broker Name" required />
              <Input label="AURA Broker Email" placeholder="Broker Email" required />
              <Input label="Borrower Name" placeholder="Borrower Name" />
              <Input label="Coverage Type" placeholder="Coverage Type" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Bank" placeholder="Select Bank" />
              <Input label="Additional Insured" placeholder="Additional Insured" />
              <Input label="Company Name" placeholder="Company Name" />
              <Input label="Type of Business" placeholder="Business Type" />
            </div>
            <StepActions onContinue={() => setStep(2)} />
          </>}
          {step === 2 && <>
            <AddressBlock title="Mailing Address" />
            <ToggleAddress label="If Property Address different than Mailing Address" title="Property Address" />
            <StepActions onBack={() => setStep(1)} isLast />
          </>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// FIND TRANSACTION
// ════════════════════════════════════════════════════════════════════════════

const POLICY_STATUSES = [
  'Active','Cancellation - Under Work','Cancelled','Closed','DNR (Do Not Renew)',
  'Declined','Declined Endorsement','Declined Quote','Deleted','Endorsement - Submitted',
  'Endorsement - Under Work','Expired Endorsement','Expired Quote','History','Not Renew',
  'Quote','Quote - Submitted','Quote - Under Work','Reinstatement - Under Work',
  'Renewal - Expired','Renewal - Under Work','Renewal In Process','Renewal Quote','Work In Progress',
]

export function FindTransactionPage() {
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const { theme } = useApp()

  const toggleStatus = (status) =>
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )

  return (
    <div style={{ padding: 24, background: 'var(--bg-body)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ borderBottom: '1px solid var(--border-divider)', padding: '16px 24px', background: 'var(--bg-table-head)' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>Find Transaction</h1>
        </div>
        <div style={{ padding: 24, borderBottom: '1px solid var(--border-divider)', background: 'var(--bg-card)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)', marginTop: 0 }}>Search Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-label)', marginBottom: 6 }}>
                Policy Status
                {selectedStatuses.length > 0 && (
                  <span style={{ marginLeft: 6, background: 'var(--accent)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10 }}>
                    {selectedStatuses.length}
                  </span>
                )}
              </label>
              <div style={{ border: '1px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-card)', maxHeight: 200, overflowY: 'auto', fontSize: 13 }}>
                {POLICY_STATUSES.map((status) => {
                  const checked = selectedStatuses.includes(status)
                  return (
                    <label key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', cursor: 'pointer', background: checked ? 'var(--accent-muted)' : 'transparent', borderBottom: '1px solid var(--border-divider)', transition: 'background 0.15s' }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleStatus(status)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
                      <span style={{ color: checked ? 'var(--accent)' : 'var(--text-primary)', fontWeight: checked ? 600 : 400 }}>{status}</span>
                    </label>
                  )
                })}
              </div>
              {selectedStatuses.length > 0 && (
                <button onClick={() => setSelectedStatuses([])} style={{ marginTop: 4, fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Clear selection
                </button>
              )}
            </div>
            <Input label="Doc Id" placeholder="Document No." />
            <Input label="Policy Type" placeholder="-- All --" />
            <Input label="Branch" placeholder="-- All --" />
            <Input label="Practice State" placeholder="-- All --" />
            <Input label="Line Of Business" placeholder="-- All --" />
            <Input label="Quote / Policy Number" placeholder="Enter quote / policy number" />
            <Input label="Agent Name" placeholder="Agent Name" />
            <Input label="Policy Holder" placeholder="Enter Policy Holder Name" />
            <Input label="Location" placeholder="Address Line 1" />
            <Input label="Effective Date From" placeholder="dd-mm-yyyy" type="date" />
            <Input label="Modified Date From" placeholder="dd-mm-yyyy" type="date" />
          </div>
          {selectedStatuses.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {selectedStatuses.map(s => (
                <span key={s} style={{ background: 'var(--accent-muted)', border: '1px solid var(--border-input)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {s}
                  <button onClick={() => toggleStatus(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button className="btn-secondary" onClick={() => setSelectedStatuses([])}>Reset</button>
            <button className="btn-primary">Find</button>
          </div>
        </div>
        <div style={{ padding: 24, background: 'var(--bg-card-hover)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)', marginTop: 0, marginBottom: 16 }}>Find Transaction Result</h2>
          <div style={{ border: '1px solid var(--border-card)', borderRadius: 8, background: 'var(--bg-card)', minHeight: 100, display: 'flex', alignItems: 'center', padding: '16px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>
            No results matched your criteria.
          </div>
        </div>
      </div>
    </div>
  )
}
