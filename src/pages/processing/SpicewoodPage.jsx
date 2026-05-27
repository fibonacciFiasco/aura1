import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { RETAIL_AGENTS } from '../../utils/constants'

// ── Spicewood-specific data ──────────────────────────────────────────────────

const spicewoodBranches = [
  'AL/TN/MO/KS McDermott',
  'Aura EOS LRO',
  'Cumberland Property Mgmt, LLC',
  'General - Spicewood',
  'McDermott Road Partners, LLC',
  'McKinney Capital',
  'Nationwide Hospitality, LLC',
  'PARJ - Spicewood',
  'PRSM II, LLC',
  'Spicewood Risk Hotels',
  'Spicewood Risk Services, LLC',
]

const spicewoodLineOfBusiness = [
  'General Liability - Commercial',
  'Commercial Property',
  'Umbrella - Commercial',
  'Personal Umbrella',
]

const states = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
  'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
  'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

const policyTypes = ['Monoline', 'Package']
const billingTypes = ['Agency Billing', 'Direct Billing']
const clientTypes = ['Company/Organization', 'Individual', 'Trust', 'Partnership']
const businessTypes = [
  'Retail','Wholesale','Manufacturing','Services','Construction',
  'Real Estate','Hospitality','Healthcare','Technology','Transportation','Other',
]

// ── Reusable field components ────────────────────────────────────────────────

const RequiredMark = () => <span style={{ color: 'var(--accent)' }}> *</span>

const FieldLabel = ({ children, required }) => (
  <label style={{
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
    color: 'var(--accent)',
    display: 'block',
    marginBottom: '4px',
  }}>
    {children}{required && <RequiredMark />}
  </label>
)

const Input = ({ label, placeholder, type = 'text', required }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <input
      type={type}
      placeholder={placeholder}
      className="form-input w-full"
      style={{ fontSize: '0.85rem' }}
    />
  </div>
)

const Select = ({ label, options, placeholder, required }) => (
  <div>
    <FieldLabel required={required}>{label}</FieldLabel>
    <select className="form-input w-full" style={{ fontSize: '0.85rem' }}>
      <option value="">{placeholder || '--- Select ---'}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

// ── Address section ──────────────────────────────────────────────────────────

const AddressSection = ({ title }) => (
  <div className="mt-8 pt-5" style={{ borderTop: '1px solid var(--border-divider)' }}>
    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '1rem' }}>
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input label="Address Line 1" placeholder="Address Line 1" />
      <Input label="Address Line 2" placeholder="Address Line 2" />
      <Input label="Telephone Number" placeholder="123-456-7890" />
      <Input label="Fax" placeholder="123-456-7890" />
      <Input label="Zip Code" placeholder="Zip" />
      <Select label="State" options={states} />
      <Input label="County" placeholder="County" />
      <Input label="City" placeholder="City" />
    </div>
  </div>
)

// ── Section header bar (matching image style) ────────────────────────────────

const SectionBar = ({ title }) => (
  <div style={{
    background: 'var(--accent-muted)',
    borderRadius: '8px 8px 0 0',
    padding: '10px 16px',
    marginBottom: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>{title}</span>
    <button
      style={{
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        width: '28px',
        height: '28px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >−</button>
  </div>
)

// ── Main page ────────────────────────────────────────────────────────────────

export default function SpicewoodPage() {
  const [step, setStep] = useState(1)
  const [showMailing, setShowMailing] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={step === 1 ? 'Policy Detail' : 'Business & Address Information'}
        subtitle="Spicewood — quote and policy processing"
      />

      {/* ── STEP 1: Policy Detail ── */}
      {step === 1 && (
        <div className="card-glass overflow-hidden">
          <SectionBar title="Policy Detail" />

          <div className="p-6 space-y-6">

            {/* Row 1: Division · Branch · Effective Date · Policy State · Policy Type */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Division is fixed to SpiceWood */}
              <div>
                <FieldLabel required>Division</FieldLabel>
                <select className="form-input w-full" style={{ fontSize: '0.85rem' }} defaultValue="SpiceWood">
                  <option value="SpiceWood">SpiceWood</option>
                </select>
              </div>

              <Select
                label="Branch"
                options={spicewoodBranches}
                placeholder="--- Select Branch ---"
                required
              />

              <Input label="Effective Date" placeholder="dd-mm-yyyy" type="date" required />

              <Select label="Policy State" options={states} required />

              <Select label="Policy Type" options={policyTypes} required />
            </div>

            {/* Row 2: Line of Business · Retail Agent · Retail Agent Contact Name · Retail Agent Contact Email */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Line of Business"
                options={spicewoodLineOfBusiness}
                placeholder="--- Select Line of Business ---"
                required
              />

              <Select
                label="Retail Agent"
                options={RETAIL_AGENTS}
                placeholder="--- Select Agent ---"
                required
              />

              <Input label="Retail Agent Contact Name" placeholder="Agent Name" required />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" required />
            </div>

            {/* Row 3: Billing Type · AURA Broker Name · AURA Broker Email */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select label="Billing Type" options={billingTypes} />
              <Input label="AURA Broker Name" placeholder="Broker Name" required />
              <Input label="AURA Broker Email" placeholder="Broker Email" required />
              {/* empty cell to maintain grid alignment */}
              <div />
            </div>

            {/* Row 4: Client Type · Company Name · Type of Business · Establishment Date · Year(s) In Business */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select label="Client Type" options={clientTypes} placeholder="Company/Organization" required />
              <Input label="Company Name" placeholder="Company Name" required />
              <Select label="Type of Business" options={businessTypes} placeholder="--- Select Business Type ---" />
              <Input label="Establishment Date" placeholder="MM/YYYY" />
              <Input label="Year(s) In Business" placeholder="" />
            </div>

            {/* Row 5: Nature of Business · NAICS Code · SIC Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Nature of Business" placeholder="" />
              <Input label="NAICS Code" placeholder="" />
              <Input label="SIC Code" placeholder="" />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2" style={{ borderTop: '1px solid var(--border-divider)' }}>
              <button className="btn-secondary">Reset</button>
              <button className="btn-primary" onClick={() => setStep(2)}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Business & Address ── */}
      {step === 2 && (
        <div className="card-glass overflow-hidden">
          <SectionBar title="Business & Address Information" />

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select label="Client Type" options={clientTypes} placeholder="Company/Organization" />
              <Input label="Company Name" placeholder="Company Name" />
              <Select label="Type of Business" options={businessTypes} placeholder="--- Select Business Type ---" />
              <Input label="Establishment Date" placeholder="MM/YYYY" />
              <Input label="Year(s) In Business" placeholder="Years" />
              <Input label="Nature of Business" placeholder="Nature of Business" />
              <Input label="NAICS Code" placeholder="NAICS Code" />
              <Input label="SIC Code" placeholder="SIC Code" />
            </div>

            <AddressSection title="Physical Address" />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={showMailing}
                onChange={() => setShowMailing(!showMailing)}
                className="h-4 w-4"
                style={{ accentColor: 'var(--accent)' }}
              />
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                If Mailing Address different than Physical Address
              </label>
            </div>

            {showMailing && <AddressSection title="Mailing Address" />}

            <div className="flex justify-between gap-3 pt-2" style={{ borderTop: '1px solid var(--border-divider)' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <div className="flex gap-3">
                <button className="btn-secondary">Reset</button>
                <button className="btn-primary">Save Quote</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
