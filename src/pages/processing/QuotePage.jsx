// Enhanced Claims + Multi Agent Version
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { RETAIL_AGENTS } from '../../utils/constants'

const divisions = [
  'Arrowood Insurance Services, Inc.',
  'Aura Risk Management & Insurance Services, LLC',
  'D B Jones Associates'
]

const states = [
'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
'Wisconsin','Wyoming'
]

const policyTypes = ['Monoline', 'Package']

const lineOfBusiness = [
'Business Auto','Auto - Personal','Bond - Misc.','Business Owners Policy','Cargo','Crime','Cyber/Network Liability',
'Directors and Officers','Dwelling Fire','Earthquake - Personal','Employment Related Practices Liability',
'Errors and Omissions','Excess Liability','Commercial Excess Liability','General Liability - Commercial',
'Home Owners','Inland Marine - Commercial','Professional Liability','Commercial Property',
'Umbrella - Commercial','Workers Compensation','Tenant Discrimination','Liquor Liability',
'Transaction Liability Private Enterpise','Product Liability','Boiler & Machinery',
'Commercial - Windstorm Deductible Buy Back','Employment Practices Liability','Equipment Floater','Fiduciary',
'Fiduciary Liability','Foreign Liability','Garage & Dealers (Simplified)','Personal Flood','Personal Umbrella',
'Pollution Liability','Professional Liability / Errors & Omissions','Transportation',
'Sexual Abuse and Molestation coverage'
]

const billingTypes = ['Agency Billing', 'Direct Billing']
const clientTypes = ['Company/Organization', 'Individual', 'Trust', 'Partnership']
const businessTypes = [
  'Retail','Wholesale','Manufacturing','Services','Construction',
  'Real Estate','Hospitality','Healthcare','Technology','Transportation','Other',
]
const corporationTypes = ['C-Corporation','S-Corporation','LLC','LLP','Sole Proprietor','Partnership','Non-Profit','Trust','Other']

// ── Mock company database for auto-fill ──────────────────────────────────────
const COMPANY_DATABASE = {
  'acme corp': {
    clientType: 'Company/Organization',
    natureOfBusiness: 'Manufacturing',
    typeOfBusiness: 'Manufacturing',
    corporation: 'C-Corporation',
    naicsCode: '332999',
    establishmentDate: '03/1985',
    yearsInBusiness: '40',
    sicCode: '3490',
    addressLine1: '100 Industrial Blvd',
    addressLine2: '',
    zip: '90001',
    state: 'California',
    county: 'Los Angeles',
    city: 'Los Angeles',
    telephone: '213-555-0100',
    fax: '213-555-0101',
  },
  'sunrise hospitality': {
    clientType: 'Company/Organization',
    natureOfBusiness: 'Hospitality & Hotels',
    typeOfBusiness: 'Hospitality',
    corporation: 'LLC',
    naicsCode: '721110',
    establishmentDate: '06/2001',
    yearsInBusiness: '24',
    sicCode: '7011',
    addressLine1: '500 Sunset Strip',
    addressLine2: 'Suite 200',
    zip: '90028',
    state: 'California',
    county: 'Los Angeles',
    city: 'Hollywood',
    telephone: '310-555-0200',
    fax: '310-555-0201',
  },
  'green valley construction': {
    clientType: 'Company/Organization',
    natureOfBusiness: 'General Contracting',
    typeOfBusiness: 'Construction',
    corporation: 'S-Corporation',
    naicsCode: '236220',
    establishmentDate: '09/1998',
    yearsInBusiness: '27',
    sicCode: '1521',
    addressLine1: '780 Builder Way',
    addressLine2: '',
    zip: '78701',
    state: 'Texas',
    county: 'Travis',
    city: 'Austin',
    telephone: '512-555-0300',
    fax: '512-555-0301',
  },
}

// ── Reusable components ───────────────────────────────────────────────────────
const Input = ({ label, placeholder, type = 'text', value, onChange }) => (
  <div>
    <label className="text-xs text-slate-400 block mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value !== undefined ? value : undefined}
      onChange={onChange}
      className="form-input w-full"
    />
  </div>
)

const Select = ({ label, options, value, onChange }) => (
  <div>
    <label className="text-xs text-slate-400 block mb-1">{label}</label>
    <select className="form-input w-full" value={value !== undefined ? value : undefined} onChange={onChange}>
      <option value="">--- Select ---</option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </div>
)

// ── Step 2: Business & Address with auto-fill ────────────────────────────────
function BusinessAddressStep({ onBack, onFieldsChange, onSave }) {
  const [showMailing, setShowMailing] = useState(false)
  const [fields, setFields] = useState({
    companyName: '',
    clientType: '',
    natureOfBusiness: '',
    typeOfBusiness: '',
    corporation: '',
    naicsCode: '',
    establishmentDate: '',
    yearsInBusiness: '',
    sicCode: '',
    addressLine1: '',
    addressLine2: '',
    zip: '',
    state: '',
    county: '',
    city: '',
    telephone: '',
    fax: '',
  })

  const setField = (key) => (e) => setFields((prev) => {
    const next = { ...prev, [key]: e.target.value }
    if (onFieldsChange) onFieldsChange(next)
    return next
  })

  const handleCompanyNameChange = (e) => {
    const name = e.target.value
    const key = name.toLowerCase().trim()
    const data = COMPANY_DATABASE[key]
    if (data) {
      setFields({ companyName: name, ...data })
    } else {
      setFields((prev) => ({ ...prev, companyName: name }))
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Company Name — triggers auto-fill */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Company Name</label>
          <input
            type="text"
            placeholder="Type company name…"
            value={fields.companyName}
            onChange={handleCompanyNameChange}
            list="company-suggestions"
            className="form-input w-full"
          />
          <datalist id="company-suggestions">
            {Object.keys(COMPANY_DATABASE).map((k) => (
              <option key={k} value={k.replace(/\b\w/g, (c) => c.toUpperCase())} />
            ))}
          </datalist>
        </div>

        <Select label="Client Type" options={clientTypes} value={fields.clientType} onChange={setField('clientType')} />
        <Input label="Nature of Business" placeholder="Nature of Business" value={fields.natureOfBusiness} onChange={setField('natureOfBusiness')} />
        <Select label="Type of Business" options={businessTypes} value={fields.typeOfBusiness} onChange={setField('typeOfBusiness')} />

        <Select label="Corporation" options={corporationTypes} value={fields.corporation} onChange={setField('corporation')} />
        <Input label="NAICS Code" placeholder="NAICS Code" value={fields.naicsCode} onChange={setField('naicsCode')} />
        <Input label="Establishment Date (MM/YYYY)" placeholder="MM/YYYY" value={fields.establishmentDate} onChange={setField('establishmentDate')} />
        <Input label="Year(s) In Business" placeholder="Years" value={fields.yearsInBusiness} onChange={setField('yearsInBusiness')} />

        <Input label="SIC Code" placeholder="SIC Code" value={fields.sicCode} onChange={setField('sicCode')} />
      </div>

      {/* Physical Address */}
      <div className="mt-8 border-t border-slate-700 pt-5">
        <h3 className="text-lg font-semibold text-white mb-1">Physical Address</h3>
        <p className="text-xs text-slate-400 mb-4">Select the applicable LOB(s) to this location.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Address Line 1*" placeholder="Address Line 1" value={fields.addressLine1} onChange={setField('addressLine1')} />
          <Input label="Address Line 2" placeholder="Address Line 2" value={fields.addressLine2} onChange={setField('addressLine2')} />
          <Input label="Telephone Number" placeholder="123-456-7890" value={fields.telephone} onChange={setField('telephone')} />
          <Input label="Fax" placeholder="123-456-7890" value={fields.fax} onChange={setField('fax')} />
          <Input label="Zip*" placeholder="Zip" value={fields.zip} onChange={setField('zip')} />
          <Select label="State*" options={states} value={fields.state} onChange={setField('state')} />
          <Input label="County*" placeholder="County" value={fields.county} onChange={setField('county')} />
          <Input label="City*" placeholder="City" value={fields.city} onChange={setField('city')} />
        </div>
      </div>

      {/* Mailing Address toggle */}
      <div className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={showMailing}
          onChange={() => setShowMailing(!showMailing)}
          className="h-4 w-4"
        />
        <label className="text-sm text-slate-300">
          If Mailing Address different than Physical Address
        </label>
      </div>

      {showMailing && (
        <div className="mt-8 border-t border-slate-700 pt-5">
          <h3 className="text-lg font-semibold text-white mb-4">Mailing Address</h3>
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
      )}

      <div className="flex justify-between gap-3 mt-8">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => { setFields({}); setShowMailing(false); }}>Reset</button>
          <button className="btn-primary" onClick={() => { if (onSave) onSave(); }}>Save Quote</button>
        </div>
      </div>
    </>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function generatePolicyNumber(lob) {
  const prefix = (lob || 'POL').substring(0, 3).toUpperCase().replace(/\s/g, '')
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${rand}-${num}`
}

function saveQuoteToStorage(quote) {
  try {
    const existing = JSON.parse(localStorage.getItem('aura-quotes') || '[]')
    const fmt = (v) => v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'
    const newEntry = {
      id: Date.now(),
      policyNumber: generatePolicyNumber(quote.lob),
      name: quote.companyName || quote.retailAgentContactName || 'New Quote',
      effectiveDate: quote.effectiveDate ? new Date(quote.effectiveDate).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
      expirationDate: quote.expiryDate ? new Date(quote.expiryDate).toLocaleDateString('en-US') : '',
      status: 'Quote',
      transactionStatus: 'New Business',
      lastModifiedBy: 'Admin User',
      annualPremium: 0,
      writtenPremium: 0,
      billedPremium: 0,
      annualPremiumStr: '$0.00',
      writtenPremiumStr: '$0.00',
      billedPremiumStr: '$0.00',
      lob: quote.lob || 'General Liability - Commercial',
      policyState: quote.policyState || '',
      policyType: quote.policyType || '',
      division: quote.division || '',
      branch: quote.branch || '',
      retailAgent: quote.retailAgent || '',
      retailAgentContactName: quote.retailAgentContactName || '',
      retailAgentContactEmail: quote.retailAgentContactEmail || '',
      billingType: quote.billingType || '',
      auraBrokerName: quote.auraBrokerName || '',
      issuingCarrier: quote.issuingCarrier || '',
      billingCarrier: quote.billingCarrier || '',
      bor: quote.bor || 'no',
    }
    existing.unshift(newEntry)
    localStorage.setItem('aura-quotes', JSON.stringify(existing))
    return newEntry
  } catch (e) {
    console.error('Failed to save quote', e)
    return null
  }
}

// ── Main QuotePage ────────────────────────────────────────────────────────────
export default function QuotePage() {
  const [step, setStep] = useState(1)
  const [bor, setBor] = useState(null)
  const [saved, setSaved] = useState(false)
  const [businessFields, setBusinessFields] = useState({})

  const [step1, setStep1] = useState({
    division: '', branch: '', effectiveDate: '', expiryDate: '',
    policyState: '', policyType: '', lob: '', retailAgent: '',
    retailAgentContactName: '', retailAgentContactEmail: '',
    billingType: '', auraBrokerName: '', auraBrokerEmail: '',
    issuingCarrier: '', billingCarrier: '',
  })

  const setS1 = (key) => (e) => setStep1(prev => ({ ...prev, [key]: e.target.value }))

  const handleSaveQuote = () => {
    const combined = { ...step1, bor, ...businessFields }
    const result = saveQuoteToStorage(combined)
    if (result) {
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    }
  }

  const handleReset = () => {
    setStep1({
      division: '', branch: '', effectiveDate: '', expiryDate: '',
      policyState: '', policyType: '', lob: '', retailAgent: '',
      retailAgentContactName: '', retailAgentContactEmail: '',
      billingType: '', auraBrokerName: '', auraBrokerEmail: '',
      issuingCarrier: '', billingCarrier: '',
    })
    setBor(null)
    setSaved(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={step === 1 ? 'Policy Detail' : 'Business & Address Information'}
        subtitle="AURA quote and policy processing"
      />

      {saved && (
        <div style={{ background: '#10b98122', border: '1px solid #10b981', borderRadius: 8, padding: '10px 16px', color: '#10b981', fontSize: 13, fontWeight: 600 }}>
          ✓ Quote saved! It will now appear in the Dashboard under Latest Policies.
        </div>
      )}

      <div className="card-glass p-6">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select label="Division" options={divisions} value={step1.division} onChange={setS1('division')} />
              <Select label="Branch" options={divisions} value={step1.branch} onChange={setS1('branch')} />
              <Input label="Requested Effective Date" placeholder="dd-mm-yyyy" type="date" value={step1.effectiveDate} onChange={setS1('effectiveDate')} />
              <Input label="Expiry Date" placeholder="dd-mm-yyyy" type="date" value={step1.expiryDate} onChange={setS1('expiryDate')} />

              <Select label="Policy State" options={states} value={step1.policyState} onChange={setS1('policyState')} />
              <Select label="Policy Type" options={policyTypes} value={step1.policyType} onChange={setS1('policyType')} />
              <Select label="Line Of Business" options={lineOfBusiness} value={step1.lob} onChange={setS1('lob')} />
              <Select label="Retail Agent" options={RETAIL_AGENTS} value={step1.retailAgent} onChange={setS1('retailAgent')} />

              <Input label="Retail Agent Contact Name" placeholder="Agent Name" value={step1.retailAgentContactName} onChange={setS1('retailAgentContactName')} />
              <Input label="Retail Agent Contact Email" placeholder="Agent Email" value={step1.retailAgentContactEmail} onChange={setS1('retailAgentContactEmail')} />
              <Select label="Billing Type" options={billingTypes} value={step1.billingType} onChange={setS1('billingType')} />
              <Input label="AURA Broker Name" placeholder="Broker Name" value={step1.auraBrokerName} onChange={setS1('auraBrokerName')} />

              <Input label="AURA Broker Email" placeholder="Broker Email" value={step1.auraBrokerEmail} onChange={setS1('auraBrokerEmail')} />
              <Input label="Issuing Carrier" placeholder="Issuing Carrier" value={step1.issuingCarrier} onChange={setS1('issuingCarrier')} />
              <Input label="Billing Carrier" placeholder="Billing Carrier" value={step1.billingCarrier} onChange={setS1('billingCarrier')} />

              {/* BOR */}
              <div>
                <label className="text-xs text-slate-400 block mb-2">BOR</label>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input type="radio" name="bor" value="yes" checked={bor === 'yes'} onChange={() => setBor('yes')} className="h-4 w-4" />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input type="radio" name="bor" value="no" checked={bor === 'no'} onChange={() => setBor('no')} className="h-4 w-4" />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button className="btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          </>
        )}

        {step === 2 && (
          <BusinessAddressStep
            onBack={() => setStep(1)}
            onFieldsChange={setBusinessFields}
            onSave={handleSaveQuote}
          />
        )}
      </div>
    </div>
  )
}
