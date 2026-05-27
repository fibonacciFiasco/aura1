import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'

const lbl = { fontSize: 12, fontWeight: 600, color: '#4caf91', marginBottom: 4, display: 'block' }
const selectStyle = {
  width: '100%',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '1rem',
  paddingRight: '2.5rem',
}

const Field = ({ label, required, children }) => (
  <div>
    <label style={lbl}>{label}{required && <span style={{ color: '#f87171' }}> *</span>}</label>
    {children}
  </div>
)

const TextInput = ({ label, required, placeholder, type = 'text', value, onChange }) => (
  <Field label={label} required={required}>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="form-input w-full" />
  </Field>
)

const SelectInput = ({ label, required, options, value, onChange }) => (
  <Field label={label} required={required}>
    <select value={value} onChange={onChange} className="form-input w-full" style={selectStyle}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </Field>
)

const CheckField = ({ label, checkLabel, checked, onChange }) => (
  <Field label={label}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 15, height: 15, accentColor: '#4caf91', cursor: 'pointer' }} />
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{checkLabel}</span>
    </div>
  </Field>
)

const Section = ({ title, children }) => (
  <div className="card-glass p-5 mb-6">
    <h2 className="text-xl font-semibold text-white mb-5">{title}</h2>
    {children}
  </div>
)

// Role tree definition
const ROLE_TREE = [
  { id: 'access_all_divisions',   label: 'Access to All Divisions',           children: [] },
  { id: 'access_all_reports',     label: 'Access to All Reports',             children: [] },
  {
    id: 'agent', label: 'AGENT',
    children: [
      { id: 'search_agent', label: 'SEARCH AGENT' },
      { id: 'view_agent',   label: 'VIEW AGENT' },
    ]
  },
  {
    id: 'carrier', label: 'CARRIER',
    children: [
      { id: 'add_carrier',    label: 'ADD CARRIER' },
      { id: 'edit_carrier',   label: 'EDIT CARRIER' },
      { id: 'search_carrier', label: 'SEARCH CARRIER' },
      { id: 'view_carrier',   label: 'VIEW CARRIER' },
    ]
  },
  {
    id: 'client', label: 'CLIENT',
    children: [
      { id: 'add_client',    label: 'ADD CLIENT' },
      { id: 'edit_client',   label: 'EDIT CLIENT' },
      { id: 'search_client', label: 'SEARCH CLIENT' },
      { id: 'view_client',   label: 'VIEW CLIENT' },
    ]
  },
  { id: 'access_arrowwood',       label: 'Access to Arrowwood Division',      children: [] },
  { id: 'access_aura',            label: 'Access to AURA Division',           children: [] },
  { id: 'access_db_jones',        label: 'Access to D B Jones Division',      children: [] },
  { id: 'access_spicewood_div',   label: 'Access to Spicewood Division',      children: [] },
  { id: 'home_owners_quote',      label: 'Home Owners Quote',                 children: [] },
  { id: 'lender_quote',           label: 'Lender / Real Estate Owned Quote',  children: [] },
  {
    id: 'quote', label: 'Quote',
    children: [
      { id: 'add_quote', label: 'ADD QUOTE' },
    ]
  },
  { id: 'report',                 label: 'Report',                            children: [] },
  {
    id: 'role', label: 'ROLE',
    children: [
      { id: 'add_role',  label: 'ADD ROLE' },
      { id: 'edit_role', label: 'EDIT ROLE' },
    ]
  },
  { id: 'satinwood_quote',        label: 'Satinwood Windhail Buy Back Quote', children: [] },
  {
    id: 'spicewood_quote', label: 'Spicewood Quote',
    children: [
      { id: 'spicewood_add_quote',    label: 'SPICEWOOD ADD QUOTE' },
      { id: 'spicewood_edit_quote',   label: 'SPICEWOOD EDIT QUOTE' },
      { id: 'spicewood_search_quote', label: 'SPICEWOOD SEARCH QUOTE' },
      { id: 'spicewood_view_quote',   label: 'SPICEWOOD VIEW QUOTE' },
    ]
  },
  { id: 'super_admin',            label: 'Super Admin',                       children: [] },
  {
    id: 'user', label: 'USER',
    children: [
      { id: 'add_user',    label: 'ADD USER' },
      { id: 'edit_user',   label: 'EDIT USER' },
      { id: 'search_user', label: 'SEARCH USER' },
      { id: 'view_user',   label: 'VIEW USER' },
    ]
  },
  { id: 'user1_a',                label: 'USER1',                             children: [] },
  { id: 'user1_b',                label: 'USER1',                             children: [] },
  { id: 'user1_c',                label: 'USER1',                             children: [] },
]

// Build initial selected state — all off
const buildInitialSelected = () => {
  const s = {}
  ROLE_TREE.forEach(r => {
    s[r.id] = false
    r.children.forEach(c => { s[c.id] = false })
  })
  return s
}

// Power icon SVG
const PowerIcon = ({ color = '#4caf91', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
    <line x1="12" y1="2" x2="12" y2="12"/>
  </svg>
)

// Status of a parent: 'all' | 'partial' | 'none'
function parentStatus(role, selected) {
  if (role.children.length === 0) return selected[role.id] ? 'all' : 'none'
  const childSelected = role.children.filter(c => selected[c.id]).length
  if (childSelected === 0 && !selected[role.id]) return 'none'
  if (childSelected === role.children.length && selected[role.id]) return 'all'
  return 'partial'
}

const STATUS_COLORS = {
  all:     { bg: '#4a7c6a', border: '#4caf91', text: '#fff' },
  partial: { bg: '#7c6a4a', border: '#cf9f61', text: '#fff' },
  none:    { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', text: 'var(--text-secondary)' },
}

function RolesAssignSection({ selected, setSelected }) {
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  const toggleParent = (role) => {
    const status = parentStatus(role, selected)
    // If all selected → deselect all; else → select all
    const newVal = status !== 'all'
    setSelected(prev => {
      const next = { ...prev, [role.id]: newVal }
      role.children.forEach(c => { next[c.id] = newVal })
      return next
    })
  }

  const toggleChild = (parentId, childId) => {
    setSelected(prev => {
      const next = { ...prev, [childId]: !prev[childId] }
      // auto-update parent: if any child on → parent on
      const parent = ROLE_TREE.find(r => r.id === parentId)
      if (parent) {
        const anyChild = parent.children.some(c => next[c.id])
        next[parentId] = anyChild
      }
      return next
    })
  }

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { status: 'all',     label: 'All Role Assign' },
          { status: 'partial', label: 'Partial Role Assign' },
          { status: 'none',    label: 'No Role Assign' },
        ].map(({ status, label }) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: STATUS_COLORS[status].bg, border: `1.5px solid ${STATUS_COLORS[status].border}` }} />
            {label}
          </div>
        ))}
      </div>

      {/* Grid of role buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 16px' }}>
        {ROLE_TREE.map(role => {
          const status = parentStatus(role, selected)
          const colors = STATUS_COLORS[status]
          const isOpen = expanded[role.id]
          const hasChildren = role.children.length > 0

          return (
            <div key={role.id}>
              {/* Parent button */}
              <button
                onClick={() => { toggleParent(role); if (hasChildren && !isOpen) toggleExpand(role.id) }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: isOpen && hasChildren ? '6px 6px 0 0' : 6,
                  border: `1.5px solid ${colors.border}`,
                  background: colors.bg,
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <span style={{ flex: 1, textAlign: 'center' }}>{role.label}</span>
                {hasChildren && (
                  <span
                    onClick={e => { e.stopPropagation(); toggleExpand(role.id) }}
                    style={{ fontSize: 11, opacity: 0.7, cursor: 'pointer', userSelect: 'none' }}
                  >
                    {isOpen ? '▲' : '▼'}
                  </span>
                )}
              </button>

              {/* Children dropdown */}
              {hasChildren && isOpen && (
                <div style={{ border: `1.5px solid ${colors.border}`, borderTop: 'none', borderRadius: '0 0 6px 6px', background: 'rgba(0,0,0,0.25)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {role.children.map(child => (
                    <div
                      key={child.id}
                      onClick={() => toggleChild(role.id, child.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 2px', borderRadius: 4 }}
                    >
                      <PowerIcon color={selected[child.id] ? '#4caf91' : '#444'} size={17} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: selected[child.id] ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                        {child.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  const [selected, setSelected] = useState(buildInitialSelected())
  const [loginForm, setLoginForm] = useState({
    userId: 'AURA0001', userName: 'nish', password: '', rePassword: '',
    userType: 'Internal', userLevel: 'Administrator',
  })
  const [personalForm, setPersonalForm] = useState({
    firstName: 'Nish', middleName: 'A', lastName: 'Patel',
    telephone: '555-555-5555', mobile: '222-277-7777', fax: '333-333-3333',
    email: 'nkawane@easyway3e.com', department: '', designation: '',
    expiryDate: '', passwordExpDate: '',
    isEmployee: true, isBlastEmail: true, isLock: false,
    signature: null,
  })
  const setL = k => e => setLoginForm(p => ({ ...p, [k]: e.target.value }))
  const setP = k => e => setPersonalForm(p => ({ ...p, [k]: e.target.value }))
  const setCheck = k => e => setPersonalForm(p => ({ ...p, [k]: e.target.checked }))

  const handleSave = () => {
    const assigned = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    alert(`Saved!\nUser: ${loginForm.userName}\nRoles: ${assigned.join(', ') || 'None'}`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Manage User" subtitle="Admin user profile management" />

      <Section title="Login Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput label="User ID" required value={loginForm.userId} onChange={setL('userId')} placeholder="AURA0001" />
          <TextInput label="User Name" required value={loginForm.userName} onChange={setL('userName')} placeholder="Username" />
          <TextInput label="Password" required type="password" value={loginForm.password} onChange={setL('password')} placeholder="Password" />
          <TextInput label="Re-type Password" required type="password" value={loginForm.rePassword} onChange={setL('rePassword')} placeholder="Re-enter password" />
          <SelectInput
            label="User Type" required value={loginForm.userType} onChange={setL('userType')}
            options={[
              { value: '', label: '--- Select ---' },
              { value: 'Internal', label: 'Internal' },
              { value: 'Employee', label: 'Employee' },
              { value: 'External', label: 'External' },
            ]}
          />
          <SelectInput
            label="User Level" required value={loginForm.userLevel} onChange={setL('userLevel')}
            options={[
              { value: '', label: '- Select -' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Supervisor', label: 'Supervisor' },
              { value: 'Manager', label: 'Manager' },
              { value: 'Super User', label: 'Super User' },
              { value: 'Administrator', label: 'Administrator' },
            ]}
          />
        </div>
      </Section>

      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <TextInput label="First Name" required value={personalForm.firstName} onChange={setP('firstName')} placeholder="First Name" />
          <TextInput label="Middle Name" value={personalForm.middleName} onChange={setP('middleName')} placeholder="Middle Name" />
          <TextInput label="Last Name" required value={personalForm.lastName} onChange={setP('lastName')} placeholder="Last Name" />
          <TextInput label="Telephone" required value={personalForm.telephone} onChange={setP('telephone')} placeholder="555-555-5555" />
          <TextInput label="Mobile" value={personalForm.mobile} onChange={setP('mobile')} placeholder="222-277-7777" />
          <TextInput label="Fax" value={personalForm.fax} onChange={setP('fax')} placeholder="333-333-3333" />

          <TextInput label="Email" required value={personalForm.email} onChange={setP('email')} placeholder="email@example.com" />
          <TextInput label="Department" value={personalForm.department} onChange={setP('department')} placeholder="Department" />
          <TextInput label="Designation" value={personalForm.designation} onChange={setP('designation')} placeholder="Designation" />
          <TextInput label="Expiry Date" type="date" value={personalForm.expiryDate} onChange={setP('expiryDate')} placeholder="dd-mm-yyyy" />
          <TextInput label="Password Exp. Date" type="date" value={personalForm.passwordExpDate} onChange={setP('passwordExpDate')} placeholder="dd-mm-yyyy" />
          <CheckField label="Employee" checkLabel="Is Employee?" checked={personalForm.isEmployee} onChange={setCheck('isEmployee')} />

          <CheckField label="Blast Email" checkLabel="Is Blast Email?" checked={personalForm.isBlastEmail} onChange={setCheck('isBlastEmail')} />
          <CheckField label="Lock" checkLabel="Is Lock?" checked={personalForm.isLock} onChange={setCheck('isLock')} />
          <Field label="Signature">
            <input type="file" className="form-input w-full" onChange={e => setPersonalForm(p => ({ ...p, signature: e.target.files[0] }))} />
          </Field>
        </div>
      </Section>

      <Section title="Role(s) Assign">
        <RolesAssignSection selected={selected} setSelected={setSelected} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Assign Agent(s)">
          <div className="mb-4"><input placeholder="Search Agents" className="form-input w-full"/></div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {['Churchill Insurance','Galligan Associates','Heffernan Insurance','Tsuneishi Agency','Century Insurance'].map((item)=>(
              <div key={item} className="bg-slate-800 rounded p-3 flex items-center justify-between">
                <div className='flex items-center gap-3'><input type='checkbox' defaultChecked className='w-4 h-4 accent-emerald-500'/><span>{item}</span></div><button className="text-emerald-400">●</button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Assign Carrier(s)">
          <div className="mb-4"><input placeholder="Search Carriers" className="form-input w-full"/></div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {['At-Bay Insurance','RSUI Indemnity','Mitsui Insurance','Protexure Insurance','Accredited Specialty'].map((item)=>(
              <div key={item} className="bg-slate-800 rounded p-3 flex items-center justify-between">
                <div className='flex items-center gap-3'><input type='checkbox' defaultChecked className='w-4 h-4 accent-emerald-500'/><span>{item}</span></div><button className="text-emerald-400">●</button>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={() => setSelected(buildInitialSelected())}>Reset</button>
        <button className="btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}
