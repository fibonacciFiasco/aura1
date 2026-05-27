
const addAgent = () => {
  setAgents([
    ...agents,
    {
      agentId: '',
      notes: '',
      agentName: '',
      effectiveDate: '',
      signature: '',
      isActive: 'Yes',
      address1: '',
      address2: '',
      telephone: '',
      fax: '',
      zip: '',
      state: '',
      county: '',
      city: ''
    }
  ]);
};

import React, { useState } from 'react'
import CrudTable from '../../components/CrudTable'
import Modal from '../../components/Modal'
import { FormInput, FormSelect } from '../../components/FormInput'
import PageHeader from '../../components/PageHeader'
import { mockAgents, mockCarriers, mockClients, mockUsers } from '../../utils/mockData'
import toast from 'react-hot-toast'
import { Search, User } from 'lucide-react'

// ─── US States list ────────────────────────────────────────────────────────────
const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

// ─── All possible Agent States ─────────────────────────────────────────────────
const AGENT_STATES = [
  'Active','Inactive','Pending','Suspended','Terminated','On Leave',
  'Under Review','Probation','Licensed','Unlicensed',
]

// ─── Client Types ──────────────────────────────────────────────────────────────
const CLIENT_TYPES = [
  'Person/Individual',
  'Company/Organization',
  'Bank',
]

// ─── Mock data ─────────────────────────────────────────────────────────────────
const mockAgentStates = [
  { id: 1, agentId: 'AGT-001', agentName: 'James Martinez',  stateName: 'Active' },
  { id: 2, agentId: 'AGT-002', agentName: 'Sarah Thompson',  stateName: 'Active' },
  { id: 3, agentId: 'AGT-003', agentName: 'Andrew Williams', stateName: 'Inactive' },
  { id: 4, agentId: 'AGT-004', agentName: 'Rita Chen',       stateName: 'Active' },
  { id: 5, agentId: 'AGT-005', agentName: 'Kevin Patel',     stateName: 'Pending' },
]

const mockCommissions = [
  { id: 1, agentId: 'AGT-001', stateName: 'Texas',      carrierName: 'Nationwide Insurance' },
  { id: 2, agentId: 'AGT-002', stateName: 'California', carrierName: 'Liberty Mutual' },
  { id: 3, agentId: 'AGT-003', stateName: 'Florida',    carrierName: 'Allstate Corporation' },
  { id: 4, agentId: 'AGT-004', stateName: 'New York',   carrierName: 'Travelers Group' },
  { id: 5, agentId: 'AGT-005', stateName: 'Illinois',   carrierName: 'Hartford Financial' },
]

const mockRoles = [
  { id: 1, roleId: 'ROLE-001', roleName: 'Super Admin' },
  { id: 2, roleId: 'ROLE-002', roleName: 'Manager' },
  { id: 3, roleId: 'ROLE-003', roleName: 'Agent' },
  { id: 4, roleId: 'ROLE-004', roleName: 'Viewer' },
  { id: 5, roleId: 'ROLE-005', roleName: 'Auditor' },
]

const mockClientsFresh = [
  { id: 1, clientName: 'Riverside Corp Holdings',  email: 'dkim@riverside.com',    clientType: 'Company/Organization' },
  { id: 2, clientName: 'Oakwood Manufacturing LLC', email: 'lpark@oakwood.com',    clientType: 'Company/Organization' },
  { id: 3, clientName: 'David Kim',                 email: 'david.kim@gmail.com',  clientType: 'Person/Individual' },
  { id: 4, clientName: 'First National Bank',       email: 'info@fnb.com',         clientType: 'Bank' },
  { id: 5, clientName: 'Amy Johnson',               email: 'ajohnson@mail.com',    clientType: 'Person/Individual' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS PAGE  — Full agent form with sections (Agent Info, Client Info, etc.)
// ═══════════════════════════════════════════════════════════════════════════════

const COUNTY_BY_STATE = {
  Texas: ['Anderson','Bexar','Collin','Dallas','Harris','Tarrant','Travis'],
  California: ['Alameda','Los Angeles','Orange','San Diego','San Francisco','Santa Clara'],
  Florida: ['Broward','Hillsborough','Miami-Dade','Orange','Palm Beach','Pinellas'],
  'New York': ['Bronx','Kings','New York','Queens','Richmond','Suffolk'],
  Illinois: ['Cook','DuPage','Kane','Lake','McHenry','Will'],
}
const CITY_BY_STATE = {
  Texas: ['Austin','Berryville','Dallas','Houston','San Antonio'],
  California: ['Los Angeles','Oakland','San Diego','San Francisco','San Jose'],
  Florida: ['Jacksonville','Miami','Orlando','Tampa'],
  'New York': ['Buffalo','New York City','Rochester','Syracuse'],
  Illinois: ['Aurora','Chicago','Naperville','Rockford'],
}

const AGENT_CLIENT_TYPES = ['Person/Individual','Company/Organization','Bank']
const AGENT_DESIGNATIONS = ['Mr.','Mrs.','Ms.','Dr.','Prof.']

const MOCK_AGENT_FULL_DATA = {
  1: {
    agentId: '100', agentName: '*Churchill & Associates Insurance Services, Inc.',
    effectiveDate: '01-01-2000', notes: '',
    isActive: 'Yes', addressLine1: 'address line 1222dd', addressLine2: 'address line 2',
    telephone: '(813) 782-82', fax: '', zip: '75763', state: 'Texas',
    county: 'Anderson', city: 'Berryville',
    clientSections: [
      { id: 'client', title: 'Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '', isActive: '' },
      { id: 'contact', title: 'Contact Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
      { id: 'compliance', title: 'Compliance Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
      { id: 'accounting', title: 'Accounting Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
    ]
  },
  2: {
    agentId: '101', agentName: 'Sarah Thompson', effectiveDate: '03-15-2010', notes: '',
    isActive: 'Yes', addressLine1: '500 Main St', addressLine2: '', telephone: '(555) 123-4567',
    fax: '', zip: '90001', state: 'California', county: 'Los Angeles', city: 'Los Angeles',
    clientSections: [
      { id: 'client', title: 'Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '', isActive: '' },
      { id: 'contact', title: 'Contact Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
      { id: 'compliance', title: 'Compliance Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
      { id: 'accounting', title: 'Accounting Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
    ]
  },
}

const emptyAgentForm = () => ({
  agentId: '', agentName: '', effectiveDate: '', notes: '', signature: null,
  isActive: 'Yes', addressLine1: '', addressLine2: '', telephone: '', fax: '',
  zip: '', state: '', county: '', city: '',
  clientSections: [
    { id: 'client', title: 'Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '', isActive: '' },
    { id: 'contact', title: 'Contact Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
    { id: 'compliance', title: 'Compliance Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
    { id: 'accounting', title: 'Accounting Client Information', clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '', gender: '', telephone: '', fax: '', email: '', birthPlace: '', dateOfBirth: '', socialSecurityNo: '', designation: '' },
  ]
})

// Shared styles
const lbl = { fontSize: 12, fontWeight: 600, color: '#4caf91', marginBottom: 4, display: 'block' }
const inp = { width: '100%' }
const selectStyle = { ...inp, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }

function AgentSectionHeader({ title, open, onToggle, onAdd, onRemove, showRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(74,124,106,0.15)', borderLeft: '3px solid #4caf91', padding: '10px 16px', borderRadius: '4px 4px 0 0' }}>
      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-heading)' }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {onAdd && (
          <button onClick={onAdd} title="Add another agent section" style={{ width: 28, height: 28, borderRadius: 4, border: 'none', background: '#4a7c6a', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        )}
        {showRemove && onRemove && (
          <button onClick={onRemove} title="Remove this agent section" style={{ width: 28, height: 28, borderRadius: 4, border: 'none', background: '#4a7c6a', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        )}
        <button onClick={onToggle} style={{ width: 28, height: 28, borderRadius: 4, border: 'none', background: '#374a43', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {open ? '−' : '+'}
        </button>
      </div>
    </div>
  )
}

function ClientInfoSection({ section, onChange }) {
  const [open, setOpen] = useState(true)
  const f = (key) => (e) => onChange(key, e.target.value)

  return (
    <div className="card-glass" style={{ overflow: 'visible', marginBottom: 16 }}>
      <AgentSectionHeader title={section.title} open={open} onToggle={() => setOpen(o => !o)} />
      {open && (
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px 14px', marginBottom: 14 }}>
            <div>
              <label style={lbl}>Client Type</label>
              <select className="form-input" style={selectStyle} value={section.clientType} onChange={f('clientType')}>
                {AGENT_CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>First Name <span style={{ color: '#f87171' }}>*</span></label>
              <input className="form-input" style={inp} placeholder="First Name" value={section.firstName} onChange={f('firstName')} />
            </div>
            <div>
              <label style={lbl}>Middle Name</label>
              <input className="form-input" style={inp} placeholder="Middle Name" value={section.middleName} onChange={f('middleName')} />
            </div>
            <div>
              <label style={lbl}>Last Name <span style={{ color: '#f87171' }}>*</span></label>
              <input className="form-input" style={inp} placeholder="Last Name" value={section.lastName} onChange={f('lastName')} />
            </div>
            <div>
              <label style={lbl}>Gender</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 6 }}>
                {['Male','Female'].map(g => (
                  <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                    <input type="radio" name={`gender-${section.id}`} value={g} checked={section.gender === g} onChange={f('gender')} style={{ accentColor: '#4caf91' }} />
                    {g}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={lbl}>Telephone number</label>
              <input className="form-input" style={inp} placeholder="Telephone number" value={section.telephone} onChange={f('telephone')} />
            </div>
            <div>
              <label style={lbl}>Fax</label>
              <input className="form-input" style={inp} placeholder="Fax" value={section.fax} onChange={f('fax')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px 14px' }}>
            <div>
              <label style={lbl}>Email</label>
              <input className="form-input" style={inp} placeholder="Email" value={section.email} onChange={f('email')} />
            </div>
            <div>
              <label style={lbl}>Birth Place</label>
              <input className="form-input" style={inp} placeholder="Birth Place" value={section.birthPlace} onChange={f('birthPlace')} />
            </div>
            <div>
              <label style={lbl}>Date of Birth</label>
              <input className="form-input" style={inp} type="date" value={section.dateOfBirth} onChange={f('dateOfBirth')} />
            </div>
            <div>
              <label style={lbl}>Social Security No.</label>
              <input className="form-input" style={inp} placeholder="Social Security No." value={section.socialSecurityNo} onChange={f('socialSecurityNo')} />
            </div>
            <div>
              <label style={lbl}>Designation</label>
              <select className="form-input" style={selectStyle} value={section.designation} onChange={f('designation')}>
                <option value="">-- Designation --</option>
                {AGENT_DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {section.id === 'client' && (
              <div>
                <label style={lbl}>Is Active</label>
                <select className="form-input" style={selectStyle} value={section.isActive || ''} onChange={f('isActive')}>
                  <option value="">-- Select --</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function AgentsPage() {
  const emptyAgentInfo = () => ({ _uid: Date.now() + Math.random(), open: true, agentId: '', agentName: '', effectiveDate: '', notes: '', signature: null, isActive: 'Yes', addressLine1: '', addressLine2: '', telephone: '', fax: '', zip: '', state: '', county: '', city: '' })
  const emptyClientSections = () => emptyAgentForm().clientSections

  const [agents, setAgents] = useState(
    mockAgents.map(a => ({ ...a, ...(MOCK_AGENT_FULL_DATA[a.id] || {}), agentName: MOCK_AGENT_FULL_DATA[a.id]?.agentName || a.name }))
  )
  const [view, setView] = useState('list')     // 'list' | 'form'
  const [selectedAgent, setSelectedAgent] = useState(null)  // existing agent being viewed/edited
  const [agentSections, setAgentSections] = useState([emptyAgentInfo()])
  const [clientSections, setClientSections] = useState(emptyClientSections())
  const [searchName, setSearchName] = useState('')

  // Update a field in a specific agent info section
  const setAgentField = (uid, key) => (e) => {
    setAgentSections(prev => prev.map(s => s._uid === uid ? { ...s, [key]: e.target.value } : s))
  }

  // Toggle open/close for a specific agent info section
  const toggleAgentSection = (uid) => {
    setAgentSections(prev => prev.map(s => s._uid === uid ? { ...s, open: !s.open } : s))
  }

  // Add a new duplicate agent info section
  const addAgentSection = () => {
    setAgentSections(prev => [...prev, emptyAgentInfo()])
  }

  // Remove an agent info section (only if more than one)
  const removeAgentSection = (uid) => {
    setAgentSections(prev => prev.filter(s => s._uid !== uid))
  }

  const updateClientSection = (sectionId, key, value) => {
    setClientSections(prev => prev.map(s => s.id === sectionId ? { ...s, [key]: value } : s))
  }

  const openAdd = () => {
    setSelectedAgent(null)
    setAgentSections([emptyAgentInfo()])
    setClientSections(emptyClientSections())
    setView('form')
  }

  const openEdit = (agent) => {
    setSelectedAgent(agent)
    const info = { ...emptyAgentInfo(), ...agent, open: true }
    setAgentSections([info])
    setClientSections(agent.clientSections || emptyClientSections())
    setView('form')
  }

  const handleDelete = (agent) => {
    setAgents(d => d.filter(a => a.id !== agent.id))
    toast.success('Agent removed')
  }

  const handleSave = () => {
    if (agentSections.some(s => !s.agentName)) return toast.error('Agent name is required for all agents')
    if (selectedAgent) {
      // On edit, only the first section updates the selected agent
      setAgents(d => d.map(a => a.id === selectedAgent.id ? { ...a, ...agentSections[0], clientSections } : a))
      toast.success('Agent updated')
    } else {
      const newAgents = agentSections.map((s, i) => ({ ...s, id: Date.now() + i, clientSections }))
      setAgents(d => [...d, ...newAgents])
      toast.success(agentSections.length > 1 ? `${agentSections.length} agents created` : 'Agent created')
    }
    setView('list')
  }

  const handleDiscard = () => { setView('list'); setSelectedAgent(null) }
  const handleReset = () => {
    if (selectedAgent) {
      const info = { ...emptyAgentInfo(), ...selectedAgent, open: true }
      setAgentSections([info])
      setClientSections(selectedAgent.clientSections || emptyClientSections())
    } else {
      setAgentSections([emptyAgentInfo()])
      setClientSections(emptyClientSections())
    }
  }

  const filtered = agents.filter(a =>
    (a.agentName || a.name || '').toLowerCase().includes(searchName.toLowerCase())
  )

  // ── FORM VIEW ─────────────────────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Breadcrumb header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)' }}>
            ✏ {selectedAgent ? 'Edit Agent' : 'Add Agent'}
          </span>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            🏠 / <span style={{ color: 'var(--text-secondary)' }}>Admin</span> / <span style={{ color: 'var(--text-muted)' }}>Agent</span>
          </div>
        </div>

        {/* Agent Information Sections — one per agent */}
        {agentSections.map((sec, idx) => (
          <div key={sec._uid} className="card-glass" style={{ overflow: 'visible' }}>
            <AgentSectionHeader
              title={agentSections.length > 1 ? `Agent Information ${idx + 1}` : 'Agent Information'}
              open={sec.open}
              onToggle={() => toggleAgentSection(sec._uid)}
              onAdd={idx === agentSections.length - 1 ? addAgentSection : undefined}
              onRemove={() => removeAgentSection(sec._uid)}
              showRemove={agentSections.length > 1}
            />
            {sec.open && (
              <div style={{ padding: '18px 20px 22px' }}>
                {/* Row 1: Agent ID, Agent Name, Effective Date, Notes, Signature */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 2fr 1.5fr', gap: '10px 16px', marginBottom: 14 }}>
                  <div>
                    <label style={lbl}>Agent ID <span style={{ color: '#f87171' }}>*</span></label>
                    <input className="form-input" style={inp} placeholder="e.g. 100" value={sec.agentId} onChange={setAgentField(sec._uid, 'agentId')} />
                  </div>
                  <div>
                    <label style={lbl}>Agent Name <span style={{ color: '#f87171' }}>*</span></label>
                    <input className="form-input" style={inp} placeholder="Agent / Company Name" value={sec.agentName} onChange={setAgentField(sec._uid, 'agentName')} />
                  </div>
                  <div>
                    <label style={lbl}>Effective Date <span style={{ color: '#f87171' }}>*</span></label>
                    <input className="form-input" style={inp} type="date" value={sec.effectiveDate} onChange={setAgentField(sec._uid, 'effectiveDate')} />
                  </div>
                  <div>
                    <label style={lbl}>Notes</label>
                    <textarea className="form-input" style={{ ...inp, resize: 'none', height: 36 }} placeholder="Notes" value={sec.notes} onChange={setAgentField(sec._uid, 'notes')} />
                  </div>
                  <div>
                    <label style={lbl}>Signature</label>
                    <input className="form-input" type="file" style={inp} onChange={e => setAgentSections(prev => prev.map(s => s._uid === sec._uid ? { ...s, signature: e.target.files[0] } : s))} />
                  </div>
                </div>

                {/* Row 2: Is Active, Address Line1, Address Line2, Telephone, Fax */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1.5fr', gap: '10px 16px', marginBottom: 14 }}>
                  <div>
                    <label style={lbl}>Is Active <span style={{ color: '#f87171' }}>*</span></label>
                    <select className="form-input" style={selectStyle} value={sec.isActive} onChange={setAgentField(sec._uid, 'isActive')}>
                      <option>Yes</option><option>No</option>
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Address Line1 <span style={{ color: '#f87171' }}>*</span></label>
                    <input className="form-input" style={inp} placeholder="Address Line 1" value={sec.addressLine1} onChange={setAgentField(sec._uid, 'addressLine1')} />
                  </div>
                  <div>
                    <label style={lbl}>Address Line2</label>
                    <input className="form-input" style={inp} placeholder="Address Line 2" value={sec.addressLine2} onChange={setAgentField(sec._uid, 'addressLine2')} />
                  </div>
                  <div>
                    <label style={lbl}>Telephone Number</label>
                    <input className="form-input" style={inp} placeholder="Telephone" value={sec.telephone} onChange={setAgentField(sec._uid, 'telephone')} />
                  </div>
                  <div>
                    <label style={lbl}>Fax</label>
                    <input className="form-input" style={inp} placeholder="Fax" value={sec.fax} onChange={setAgentField(sec._uid, 'fax')} />
                  </div>
                </div>

                {/* Row 3: Zip, State, County, City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1.5fr', gap: '10px 16px' }}>
                  <div>
                    <label style={lbl}>Zip <span style={{ color: '#f87171' }}>*</span></label>
                    <input className="form-input" style={inp} placeholder="Zip Code" value={sec.zip} onChange={setAgentField(sec._uid, 'zip')} />
                  </div>
                  <div>
                    <label style={lbl}>State <span style={{ color: '#f87171' }}>*</span></label>
                    <select className="form-input" style={selectStyle} value={sec.state} onChange={e => setAgentSections(prev => prev.map(s => s._uid === sec._uid ? { ...s, state: e.target.value, county: '', city: '' } : s))}>
                      <option value="">--- Select ---</option>
                      {US_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>County <span style={{ color: '#f87171' }}>*</span></label>
                    <select className="form-input" style={selectStyle} value={sec.county} onChange={setAgentField(sec._uid, 'county')}>
                      <option value="">--- Select ---</option>
                      {(COUNTY_BY_STATE[sec.state] || []).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>City <span style={{ color: '#f87171' }}>*</span></label>
                    <select className="form-input" style={selectStyle} value={sec.city} onChange={setAgentField(sec._uid, 'city')}>
                      <option value="">--- Select ---</option>
                      {(CITY_BY_STATE[sec.state] || []).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Client / Contact / Compliance / Accounting sections (shared) */}
        {clientSections.map(section => (
          <ClientInfoSection
            key={section.id}
            section={section}
            onChange={(key, val) => updateClientSection(section.id, key, val)}
          />
        ))}

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
          <button onClick={handleDiscard} className="btn-secondary">Discard</button>
          <button onClick={handleReset} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #4caf91', background: 'transparent', color: '#4caf91', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Reset</button>
          <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#4a7c6a', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            {selectedAgent ? 'Save Changes' : agentSections.length > 1 ? `Add ${agentSections.length} Agents` : 'Add Agent'}
          </button>
        </div>
      </div>
    )
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)' }}>✏ Agents</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            🏠 / <span style={{ color: 'var(--text-secondary)' }}>Admin</span> / <span style={{ color: 'var(--text-muted)' }}>Agents</span>
          </div>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 6, border: 'none', background: '#4a7c6a', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>+ Add Agent</button>
        </div>
      </div>

      {/* Search */}
      <div className="card-glass" style={{ padding: '16px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-heading)', marginBottom: 12 }}>Search Agents</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ ...lbl, color: '#4caf91' }}>Agent Name</label>
            <input className="form-input" placeholder="Search by name…" value={searchName} onChange={e => setSearchName(e.target.value)} />
          </div>
          <button onClick={() => setSearchName('')} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#64748b', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Reset</button>
        </div>
      </div>

      {/* Table */}
      <CrudTable
        title="Agent Directory"
        columns={[
          { key: 'agentId', label: 'Agent ID', mono: true },
          { key: 'agentName', label: 'Agent Name' },
          { key: 'isActive', label: 'Is Active', render: (val) => (
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: val === 'Yes' ? 'var(--badge-active-bg)' : 'var(--badge-inactive-bg)', color: val === 'Yes' ? 'var(--badge-active-text)' : 'var(--badge-inactive-text)' }}>{val || 'Yes'}</span>
          )},
          { key: 'state', label: 'State' },
        ]}
        data={filtered}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add Agent"
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT STATES PAGE  — Agent ID, Agent Name, State Name <all possible states>
// ═══════════════════════════════════════════════════════════════════════════════
export function AgentStatesPage() {
  const [data, setData]       = useState(mockAgentStates)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})

  const openAdd  = () => { setEditing(null); setForm({ agentId: '', agentName: '', stateName: AGENT_STATES[0] }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row }); setModal(true) }
  const handleDelete = (row) => { setData(d => d.filter(r => r.id !== row.id)); toast.success('Record removed') }
  const handleSave = () => {
    if (!form.agentId)   return toast.error('Agent ID is required')
    if (!form.agentName) return toast.error('Agent Name is required')
    if (editing) {
      setData(d => d.map(r => r.id === editing.id ? { ...r, ...form } : r))
      toast.success('Agent state updated')
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      toast.success('Agent state added')
    }
    setModal(false)
  }

  const stateColor = (val) => {
    const map = {
      'Active':       { bg: 'var(--badge-active-bg)',   color: 'var(--badge-active-text)' },
      'Inactive':     { bg: 'var(--badge-inactive-bg)', color: 'var(--badge-inactive-text)' },
      'Pending':      { bg: 'var(--badge-pending-bg)',  color: 'var(--badge-pending-text)' },
      'Suspended':    { bg: 'rgba(239,68,68,0.12)',      color: '#f87171' },
      'Terminated':   { bg: 'rgba(239,68,68,0.15)',      color: '#ef4444' },
      'On Leave':     { bg: 'rgba(245,158,11,0.12)',     color: '#f59e0b' },
      'Under Review': { bg: 'rgba(139,92,246,0.12)',     color: '#a78bfa' },
      'Probation':    { bg: 'rgba(249,115,22,0.12)',     color: '#fb923c' },
      'Licensed':     { bg: 'rgba(6,182,212,0.12)',      color: '#06b6d4' },
      'Unlicensed':   { bg: 'rgba(100,116,139,0.12)',    color: 'var(--text-muted)' },
    }
    return map[val] || { bg: 'rgba(100,116,139,0.12)', color: 'var(--text-muted)' }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Agent State" subtitle="Manage agent state records" />
      <CrudTable
        title="Agent States"
        columns={[
          { key: 'agentId',   label: 'Agent ID',   mono: true },
          { key: 'agentName', label: 'Agent Name' },
          { key: 'stateName', label: 'State Name',
            render: (val) => {
              const { bg, color } = stateColor(val)
              return (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color }}>
                  {val}
                </span>
              )
            }
          },
        ]}
        data={data}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add Agent State"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Agent State' : 'Add Agent State'}>
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="Agent ID"   value={form.agentId   || ''} onChange={e => setForm(f => ({ ...f, agentId:   e.target.value }))} placeholder="e.g. AGT-001" />
          <FormInput label="Agent Name" value={form.agentName || ''} onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))} placeholder="Full name" />
          <FormSelect label="State Name" value={form.stateName || AGENT_STATES[0]} onChange={e => setForm(f => ({ ...f, stateName: e.target.value }))} options={AGENT_STATES} />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e293b]">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add'}</button>
        </div>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMISSION RATES PAGE  — Agent ID, State Name, Carrier Name
// ═══════════════════════════════════════════════════════════════════════════════
export function CommissionRatesPage() {
  const [data, setData]       = useState(mockCommissions)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})

  const openAdd  = () => { setEditing(null); setForm({ agentId: '', stateName: US_STATES[0], carrierName: mockCarriers[0]?.name || '' }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row }); setModal(true) }
  const handleDelete = (row) => { setData(d => d.filter(r => r.id !== row.id)); toast.success('Rate removed') }
  const handleSave = () => {
    if (!form.agentId) return toast.error('Agent ID is required')
    if (editing) {
      setData(d => d.map(r => r.id === editing.id ? { ...r, ...form } : r))
      toast.success('Commission rate updated')
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      toast.success('Commission rate added')
    }
    setModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Commission Rates" subtitle="Configure agent commission schedules" />
      <CrudTable
        title="Commission Schedules"
        columns={[
          { key: 'agentId',     label: 'Agent ID',     mono: true },
          { key: 'stateName',   label: 'State Name' },
          { key: 'carrierName', label: 'Carrier Name' },
        ]}
        data={data}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add Rate"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Commission Rate' : 'Add Commission Rate'}>
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="Agent ID" value={form.agentId || ''} onChange={e => setForm(f => ({ ...f, agentId: e.target.value }))} placeholder="e.g. AGT-001" />
          <FormSelect label="State Name" value={form.stateName || US_STATES[0]} onChange={e => setForm(f => ({ ...f, stateName: e.target.value }))} options={US_STATES} />
          <FormSelect label="Carrier Name" value={form.carrierName || ''} onChange={e => setForm(f => ({ ...f, carrierName: e.target.value }))} options={mockCarriers.map(c => c.name)} />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e293b]">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Rate'}</button>
        </div>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARRIERS PAGE  — Carrier Code, Carrier Name
// ═══════════════════════════════════════════════════════════════════════════════
export function CarriersPage() {
  const [data, setData]       = useState(mockCarriers.map(c => ({ id: c.id, carrierCode: c.code, carrierName: c.name })))
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})

  const openAdd  = () => { setEditing(null); setForm({ carrierCode: '', carrierName: '' }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row }); setModal(true) }
  const handleDelete = (row) => { setData(d => d.filter(r => r.id !== row.id)); toast.success('Carrier removed') }
  const handleSave = () => {
    if (!form.carrierCode) return toast.error('Carrier code is required')
    if (!form.carrierName) return toast.error('Carrier name is required')
    if (editing) {
      setData(d => d.map(r => r.id === editing.id ? { ...r, ...form } : r))
      toast.success('Carrier updated')
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      toast.success('Carrier added')
    }
    setModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Carriers" subtitle="Insurance carrier management" />
      <CrudTable
        title="Carrier Directory"
        columns={[
          { key: 'carrierCode', label: 'Carrier Code', mono: true },
          { key: 'carrierName', label: 'Carrier Name' },
        ]}
        data={data}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add Carrier"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Carrier' : 'Add Carrier'}>
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="Carrier Code" value={form.carrierCode || ''} onChange={e => setForm(f => ({ ...f, carrierCode: e.target.value.toUpperCase() }))} placeholder="e.g. NW" />
          <FormInput label="Carrier Name" value={form.carrierName || ''} onChange={e => setForm(f => ({ ...f, carrierName: e.target.value }))} placeholder="Full carrier name" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e293b]">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Carrier'}</button>
        </div>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENTS PAGE  — Search view + inline Manage Client form
// ═══════════════════════════════════════════════════════════════════════════════

const DESIGNATIONS = ['Mr.','Mrs.','Ms.','Dr.','Prof.','Rev.','Hon.']
const COUNTY_MAP = {
  Texas: ['Travis','Harris','Dallas','Bexar','Tarrant'],
  California: ['Los Angeles','San Diego','San Francisco','Orange','Alameda'],
  Florida: ['Miami-Dade','Broward','Palm Beach','Hillsborough','Orange'],
  'New York': ['New York','Kings','Queens','Bronx','Richmond'],
  Illinois: ['Cook','DuPage','Lake','Will','Kane'],
}
const CITIES = ['Austin','Houston','Dallas','San Antonio','Los Angeles','San Diego','Miami','New York','Chicago']
const emptyForm = {
  clientType: 'Person/Individual', firstName: '', middleName: '', lastName: '',
  professionalLicenseNo: '', designation: '', birthPlace: '', dateOfBirth: '',
  gender: '', addressLine1: '', addressLine2: '', zip: '', state: '', county: '',
  city: '', telephone: '', fax: '', email: '',
}

export function ClientsPage() {
  const [data, setData]         = useState(mockClientsFresh)
  const [view, setView]         = useState('list')   // 'list' | 'form'
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState({ ...emptyForm })
  const [searchName, setSearchName]   = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchType, setSearchType]   = useState('')
  const [formOpen, setFormOpen] = useState(true)

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setView('form')
    setFormOpen(true)
  }
  const openEdit = (row) => {
    setEditing(row)
    setForm({ ...emptyForm, ...row })
    setView('form')
    setFormOpen(true)
  }
  const handleDiscard = () => { setView('list'); setEditing(null) }
  const handleReset   = () => setForm({ ...emptyForm })
  const handleSave    = () => {
    if (!form.firstName && !form.clientName) return toast.error('First name is required')
    const clientName = form.clientType === 'Person/Individual'
      ? [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' ')
      : form.firstName
    const record = { ...form, clientName, email: form.email, id: editing?.id || Date.now() }
    if (editing) {
      setData(d => d.map(r => r.id === editing.id ? record : r))
      toast.success('Client updated')
    } else {
      setData(d => [...d, record])
      toast.success('Client added')
    }
    setView('list')
    setEditing(null)
  }

  const filtered = data.filter(r => {
    const nm = (r.clientName || '').toLowerCase().includes(searchName.toLowerCase())
    const em = (r.email || '').toLowerCase().includes(searchEmail.toLowerCase())
    const tp = searchType ? r.clientType === searchType : true
    return nm && em && tp
  })

  const typeStyle = (t) => ({
    'Person/Individual':    { bg: 'rgba(6,182,212,0.12)',  color: '#06b6d4' },
    'Company/Organization': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
    'Bank':                 { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  }[t] || { bg: 'rgba(100,116,139,0.12)', color: 'var(--text-muted)' })

  // ── shared label style ──────────────────────────────────────────────────────
  const lbl = { fontSize: 12, fontWeight: 600, color: '#4caf91', marginBottom: 4, display: 'block' }
  const inp = { width: '100%' }

  // ── form section header ─────────────────────────────────────────────────────
  const SectionHeader = ({ title }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(74,124,106,0.12)', borderLeft: '3px solid #4caf91',
      padding: '10px 16px', borderRadius: '4px 4px 0 0', marginBottom: 0,
    }}>
      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-heading)' }}>{title}</span>
      <button
        onClick={() => setFormOpen(o => !o)}
        style={{ width: 28, height: 28, borderRadius: 4, border: 'none', background: '#4a7c6a', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >{formOpen ? '−' : '+'}</button>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════════
  // FORM VIEW — Manage Client
  // ══════════════════════════════════════════════════════════════════════════════
  if (view === 'form') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Page title bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)' }}>✏ Manage Client</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            🏠 / <span style={{ color: 'var(--text-secondary)' }}>Admin</span> / <span style={{ color: 'var(--text-muted)' }}>Client</span>
          </div>
        </div>

        <div className="card-glass" style={{ overflow: 'visible' }}>
          <SectionHeader title="Company/Personal Information" />

          {formOpen && (
            <div style={{ padding: '20px 20px 24px' }}>
              {/* Client Type */}
              <div style={{ marginBottom: 20, maxWidth: 200 }}>
                <label style={lbl}>Client Type</label>
                <select className="form-input" style={{ ...inp, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                  value={form.clientType} onChange={f('clientType')}>
                  {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Row 1: First / Middle / Last / License / Designation / BirthPlace */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '12px 16px', marginBottom: 16 }}>
                <div>
                  <label style={lbl}>First Name <span style={{ color: '#f87171' }}>*</span></label>
                  <input className="form-input" style={inp} placeholder="First Name" value={form.firstName} onChange={f('firstName')} />
                </div>
                <div>
                  <label style={lbl}>Middle Name</label>
                  <input className="form-input" style={inp} placeholder="Middle Name" value={form.middleName} onChange={f('middleName')} />
                </div>
                <div>
                  <label style={lbl}>Last Name <span style={{ color: '#f87171' }}>*</span></label>
                  <input className="form-input" style={inp} placeholder="Last Name" value={form.lastName} onChange={f('lastName')} />
                </div>
                <div>
                  <label style={lbl}>Professional License No</label>
                  <input className="form-input" style={inp} placeholder="" value={form.professionalLicenseNo} onChange={f('professionalLicenseNo')} />
                </div>
                <div>
                  <label style={lbl}>Designation</label>
                  <select className="form-input" style={{ ...inp, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                    value={form.designation} onChange={f('designation')}>
                    <option value="">-- Designation --</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Birth Place</label>
                  <input className="form-input" style={inp} placeholder="Birth Place" value={form.birthPlace} onChange={f('birthPlace')} />
                </div>
              </div>

              {/* Row 2: DOB + Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px 16px', marginBottom: 20 }}>
                <div>
                  <label style={lbl}>Date of Birth</label>
                  <input className="form-input" style={inp} type="date" value={form.dateOfBirth} onChange={f('dateOfBirth')} />
                </div>
                <div>
                  <label style={lbl}>Gender</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 8 }}>
                    {['Male','Female'].map(g => (
                      <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
                        <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={f('gender')} style={{ accentColor: '#4caf91', width: 14, height: 14 }} />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border-card)', margin: '0 -20px 20px', opacity: 0.4 }} />

              {/* Row 3: Address Line1 / Line2 / Zip / State / County */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1.5fr', gap: '12px 16px', marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Address Line 1 <span style={{ color: '#f87171' }}>*</span></label>
                  <input className="form-input" style={inp} placeholder="Address Line1" value={form.addressLine1} onChange={f('addressLine1')} />
                </div>
                <div>
                  <label style={lbl}>Address Line 2</label>
                  <input className="form-input" style={inp} placeholder="Address Line2" value={form.addressLine2} onChange={f('addressLine2')} />
                </div>
                <div>
                  <label style={lbl}>Zip <span style={{ color: '#f87171' }}>*</span></label>
                  <input className="form-input" style={inp} placeholder="Zip Code" value={form.zip} onChange={f('zip')} />
                </div>
                <div>
                  <label style={lbl}>State <span style={{ color: '#f87171' }}>*</span></label>
                  <select className="form-input" style={{ ...inp, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                    value={form.state} onChange={e => { f('state')(e); setForm(p => ({ ...p, county: '' })) }}>
                    <option value="">--- Select ---</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>County <span style={{ color: '#f87171' }}>*</span></label>
                  <select className="form-input" style={{ ...inp, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                    value={form.county} onChange={f('county')}>
                    <option value="">--- Select ---</option>
                    {(COUNTY_MAP[form.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 4: City / Telephone / Fax / Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 2fr', gap: '12px 16px', marginBottom: 28 }}>
                <div>
                  <label style={lbl}>City <span style={{ color: '#f87171' }}>*</span></label>
                  <select className="form-input" style={{ ...inp, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                    value={form.city} onChange={f('city')}>
                    <option value="">--- Select ---</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Telephone Number</label>
                  <input className="form-input" style={inp} placeholder="Telephone number" value={form.telephone} onChange={f('telephone')} />
                </div>
                <div>
                  <label style={lbl}>Fax</label>
                  <input className="form-input" style={inp} placeholder="Fax" value={form.fax} onChange={f('fax')} />
                </div>
                <div>
                  <label style={lbl}>Email</label>
                  <input className="form-input" style={inp} type="email" placeholder="Email" value={form.email} onChange={f('email')} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border-card)', paddingTop: 20 }}>
                <button onClick={handleDiscard} className="btn-secondary">Discard</button>
                <button onClick={handleReset} style={{
                  padding: '8px 20px', borderRadius: 6, border: '1px solid #4caf91',
                  background: 'transparent', color: '#4caf91', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>Reset</button>
                <button onClick={handleSave} style={{
                  padding: '8px 20px', borderRadius: 6, border: 'none',
                  background: '#4a7c6a', color: '#fff', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{editing ? 'Save' : 'Add'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // LIST VIEW — Client search + table
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header with + Add */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-heading)' }}>✏ Client</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            🏠 / <span style={{ color: 'var(--text-secondary)' }}>Admin</span> / <span style={{ color: 'var(--text-muted)' }}>Client</span>
          </div>
          <button onClick={openAdd} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            borderRadius: 6, border: 'none', background: '#4a7c6a', color: '#fff',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>+ Add</button>
        </div>
      </div>

      {/* Search card */}
      <div className="card-glass" style={{ padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-heading)', marginBottom: 16 }}>Search</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 220px auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ ...lbl, color: '#4caf91' }}>Name</label>
            <input className="form-input" placeholder="Enter Client Name" value={searchName} onChange={e => setSearchName(e.target.value)} />
          </div>
          <div>
            <label style={{ ...lbl, color: '#4caf91' }}>Email</label>
            <input className="form-input" placeholder="Enter Client email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ ...lbl, color: '#4caf91' }}>Client Type</label>
            <select className="form-input" style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
              value={searchType} onChange={e => setSearchType(e.target.value)}>
              <option value="">-- All --</option>
              {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setSearchName(''); setSearchEmail(''); setSearchType('') }} style={{
              padding: '8px 18px', borderRadius: 6, border: 'none', background: '#64748b',
              color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Reset</button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px',
              borderRadius: 6, border: 'none', background: '#4a7c6a', color: '#fff',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              <Search size={13} /> Find
            </button>
          </div>
        </div>
      </div>

      {/* Results table */}
      <CrudTable
        title="Client Directory"
        columns={[
          { key: 'clientName', label: 'Client Name' },
          { key: 'email',      label: 'Email' },
          { key: 'clientType', label: 'Client Type',
            render: (val) => {
              const { bg, color } = typeStyle(val)
              return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color }}>{val}</span>
            }
          },
        ]}
        data={filtered}
        onEdit={openEdit}
        onDelete={(row) => { setData(d => d.filter(r => r.id !== row.id)); toast.success('Client removed') }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// USERS PAGE  — User Name, Email, Is Active (Yes / No)
// ═══════════════════════════════════════════════════════════════════════════════
export function UsersPage() {
  const [data, setData] = useState(
    mockUsers.map(u => ({ id: u.id, userName: u.name, email: u.email, isActive: u.status === 'Active' ? 'Yes' : 'No' }))
  )
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})

  const openAdd  = () => { setEditing(null); setForm({ userName: '', email: '', isActive: 'Yes' }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row }); setModal(true) }
  const handleDelete = (row) => { setData(d => d.filter(r => r.id !== row.id)); toast.success('User removed') }
  const handleSave = () => {
    if (!form.userName) return toast.error('User name is required')
    if (!form.email)    return toast.error('Email is required')
    if (editing) {
      setData(d => d.map(r => r.id === editing.id ? { ...r, ...form } : r))
      toast.success('User updated')
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      toast.success('User added')
    }
    setModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users" subtitle="System user management" />
      <CrudTable
        title="System Users"
        columns={[
          { key: 'userName', label: 'User Name' },
          { key: 'email',    label: 'Email' },
          { key: 'isActive', label: 'Is Active',
            render: (val) => (
              <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: val === 'Yes' ? 'var(--badge-active-bg)'   : 'var(--badge-inactive-bg)',
                color:      val === 'Yes' ? 'var(--badge-active-text)' : 'var(--badge-inactive-text)',
              }}>{val}</span>
            )
          },
        ]}
        data={data}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add User"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit User' : 'Add User'}>
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="User Name" value={form.userName || ''} onChange={e => setForm(f => ({ ...f, userName: e.target.value }))} placeholder="Full name" />
          <FormInput label="Email" type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
          <FormSelect label="Is Active" value={form.isActive || 'Yes'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value }))} options={['Yes', 'No']} />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e293b]">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add User'}</button>
        </div>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROLES PAGE  — Role ID, Role Name
// ═══════════════════════════════════════════════════════════════════════════════
export function RolesPage() {
  const [data, setData]       = useState(mockRoles)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState({})

  const openAdd  = () => { setEditing(null); setForm({ roleId: '', roleName: '' }); setModal(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row }); setModal(true) }
  const handleDelete = (row) => { setData(d => d.filter(r => r.id !== row.id)); toast.success('Role removed') }
  const handleSave = () => {
    if (!form.roleId)   return toast.error('Role ID is required')
    if (!form.roleName) return toast.error('Role name is required')
    if (editing) {
      setData(d => d.map(r => r.id === editing.id ? { ...r, ...form } : r))
      toast.success('Role updated')
    } else {
      setData(d => [...d, { ...form, id: Date.now() }])
      toast.success('Role added')
    }
    setModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Roles" subtitle="Access control and permission management" />
      <CrudTable
        title="System Roles"
        columns={[
          { key: 'roleId',   label: 'Role ID',   mono: true },
          { key: 'roleName', label: 'Role Name' },
        ]}
        data={data}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add Role"
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Role' : 'Add Role'}>
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="Role ID"   value={form.roleId   || ''} onChange={e => setForm(f => ({ ...f, roleId:   e.target.value }))} placeholder="e.g. ROLE-006" />
          <FormInput label="Role Name" value={form.roleName || ''} onChange={e => setForm(f => ({ ...f, roleName: e.target.value }))} placeholder="e.g. Supervisor" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e293b]">
          <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">{editing ? 'Save Changes' : 'Add Role'}</button>
        </div>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVE USERS PAGE  — live username search with highlighted matches
// ═══════════════════════════════════════════════════════════════════════════════
const allActiveUsers = mockUsers
  .filter(u => u.status === 'Active')
  .map(u => ({ id: u.id, userName: u.name, email: u.email, role: u.role, lastLogin: u.lastLogin }))

export function SearchIdPage() {
  const [query, setQuery] = useState('')

  const results = allActiveUsers.filter(u =>
    u.userName.toLowerCase().includes(query.toLowerCase())
  )

  const highlight = (text) => {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: 'rgba(6,182,212,0.25)', color: 'var(--stat-cyan-icon)', borderRadius: 2, padding: '0 2px' }}>
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Active Users" subtitle="Search active system users by username" />

      <div className="card-glass p-5">
        <div style={{ position: 'relative', maxWidth: 480 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 36, paddingTop: 10, paddingBottom: 10, fontSize: 14, width: '100%' }}
            placeholder="Search usernames…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="card-glass" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-heading)', margin: 0 }}>Active Users</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-table-head)', padding: '3px 10px', borderRadius: 12 }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-table-head)' }}>
                {['Username', 'Email', 'Role', 'Last Login'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-table)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                    No active users match "{query}"
                  </td>
                </tr>
              ) : results.map(u => (
                <tr key={u.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-table)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--stat-cyan-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={13} color="var(--stat-cyan-icon)" />
                      </div>
                      <span style={{ fontWeight: 500 }}>{highlight(u.userName)}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'var(--bg-table-head)', color: 'var(--text-label)' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


<button
  type="button"
  onClick={addAgent}
  style={{
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '16px'
  }}
>
  +
</button>

