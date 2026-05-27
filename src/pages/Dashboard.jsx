import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, UserCircle, FileText } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, Sector
} from 'recharts'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import Pagination from '../components/Pagination'
import { mockPremiumData, mockAppStats, mockPolicies } from '../utils/mockData'
import { fetchPolicies, fetchPolicyStats } from '../api/policyApi'
import { formatCurrency, formatDate } from '../utils/helpers'

const COLORS = ['#10b981', '#f59e0b', '#06b6d4', '#ef4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow-dropdown)' }}>
        <div style={{ fontWeight: 600, color: 'var(--tooltip-text)', marginBottom: 6 }}>{label}</div>
        {payload.map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            <span style={{ color: 'var(--tooltip-sub)' }}>{p.name}:</span>
            <span style={{ color: 'var(--tooltip-text)', fontWeight: 600, fontFamily: 'monospace' }}>{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const ActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-heading)" style={{ fontSize: 22, fontWeight: 700 }}>
        {(percent * 100).toFixed(0)}%
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="var(--text-secondary)" style={{ fontSize: 11 }}>
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  )
}


const QUOTE_ACTIONS = [
  'Close Quote',
  'Decline Quote',
  'Discard',
  'Aura Proposal',
  'Generate Proposal',
  'Invalidate Quote',
  'Issue Policy',
  'Transfer Quote/Policy'
]

const POLICY_LOBS = [
  'Commercial - Windstorm Deductible Buy Back',
  'Cyber/Network Liability',
  'Boiler & Machinery',
  'Home Owners',
  'Crime'
]

const getActionsByLOB = (lob, status='QUOTE') => {
  if (lob === 'Commercial Property') return QUOTE_ACTIONS

  if (POLICY_LOBS.includes(lob) || status === 'POLICY') {
    return [
      'Cancel Policy',
      'Create Endorsement',
      'Do Not Renew (DNR)',
      'Generate Invoice',
      'Get Policy Documents',
      'Not Renew Policy (Renewal Not Taken)',
      'Transfer Quote/Policy'
    ]
  }

  return QUOTE_ACTIONS
}


const POLICY_ACTIONS = [
  { label: 'Cancel Policy', danger: false },
  { label: 'Create Endorsement', danger: false },
  { label: 'Do Not Renew (DNR)', icon: '!', danger: true },
  { label: 'Generate Invoice', danger: false },
  { label: 'Get Policy Documents', danger: false },
  { label: 'Not Renew Policy (Renewal Not Taken)', icon: '!', danger: true },
]

function PolicyActionsMenu({ policy, onClose, navigate }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 200,
      background: 'var(--bg-card)', border: '1px solid var(--border-card)',
      borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      minWidth: 260, overflow: 'hidden',
    }}>
      {getActionsByLOB(policy?.lob, policy?.status).map((item, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); if(item === 'Aura Proposal'){navigate('/processing/aura-proposal')} onClose() }}
          style={{
            width: '100%', textAlign: 'left', padding: '10px 16px',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-primary)',
            borderBottom: i < POLICY_ACTIONS.length - 1 ? '1px solid var(--border-divider)' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          {false && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: '50%',
              background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, flexShrink: 0,
            }}>{item.icon}</span>
          )}
          {item}
        </button>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [policies, setPolicies] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, quote: 0, totalAnnualPremium: 0 })
  const perPage = 5

  // Merge localStorage saved quotes with policies list
  const mergeLocalQuotes = (pols) => {
    try {
      const local = JSON.parse(localStorage.getItem('aura-quotes') || '[]')
      // Prepend saved quotes so they appear first (most recent at top)
      return [...local, ...pols]
    } catch { return pols }
  }

  useEffect(() => {
    Promise.all([fetchPolicies(), fetchPolicyStats()])
      .then(([pols, st]) => {
        const merged = mergeLocalQuotes(pols)
        setPolicies(merged)
        setStats(st)
      })
      .catch(() => {
        // Backend not running — fall back to mock data + local quotes
        const merged = mergeLocalQuotes(mockPolicies)
        setPolicies(merged)
        setStats({
          total: merged.length,
          active: merged.filter(p => p.status === 'Active').length,
          quote: merged.filter(p => p.status === 'Quote').length,
          totalAnnualPremium: merged.reduce((s, p) => s + (p.annualPremium || 0), 0),
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const paginated = policies.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
          <StatCard icon={Users} label="Total Users" value={stats.total} change={stats.totalChange} color="cyan" loading={loading} />
        </div>
        <div onClick={() => navigate('/admin/agents')} style={{ cursor: 'pointer' }}>
          <StatCard icon={UserCheck} label="Active Agents" value={stats.active} change={stats.activeChange} color="violet" loading={loading} />
        </div>
        <div onClick={() => navigate('/admin/clients')} style={{ cursor: 'pointer' }}>
          <StatCard icon={UserCircle} label="Total Clients" value={stats.quote} change={stats.quoteChange} color="emerald" loading={loading} />
        </div>
        <div onClick={() => navigate('/processing/find')} style={{ cursor: 'pointer' }}>
          <StatCard icon={FileText} label="Policies Issued" value={stats.total} change={stats.totalChange} color="amber" loading={loading} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Premium Bar Chart */}
        <div className="card-glass p-5" style={{ minHeight: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 15, margin: 0 }}>Policy Premium Analysis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: '4px 0 0' }}>Monthly premium overview — Jun 2025 to May 2026</p>
            </div>
            <select className="form-input" style={{ width: 90, padding: '6px 10px', fontSize: 12 }}>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          {loading ? (
            <div className="skeleton" style={{ height: 260, borderRadius: 8 }} />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockPremiumData} barGap={2} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={50} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
                <Bar dataKey="premium" name="Monthly Premium" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut Chart */}
        <div className="card-glass p-5" style={{ minHeight: 420 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 15, margin: 0 }}>Application Requests</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: '4px 0 0' }}>Current quarter breakdown</p>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div className="skeleton" style={{ width: 176, height: 176, borderRadius: '50%' }} />
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 16, borderRadius: 4 }} />)}
              </div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={mockAppStats}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={110}
                    dataKey="value"
                    activeIndex={activeIndex}
                    activeShape={<ActiveShape />}
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                  >
                    {mockAppStats.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                {mockAppStats.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ height: 4, borderRadius: 4, width: `${item.value * 1.5}px`, background: COLORS[i], opacity: 0.5 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-heading)' }}>{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Latest Policies Table */}
      <div className="card-glass" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-table)' }}>
          <div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 15, margin: 0 }}>Latest Policies</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: '3px 0 0' }}>{policies.length} total records</p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-table-head)' }}>
                {['Policy No', 'Name', 'LOB', 'Effective Date', 'Expiration Date', 'Status', 'Transaction Status', 'Last Modified By', 'Annual Premium', 'Written Premium', 'Billed Premium'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em', maxWidth: '220px', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'break-word', lineHeight: '1.4', borderBottom: '1px solid var(--border-table)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-table)' }}>
                    {[...Array(12)].map((_, j) => (
                      <td key={j} style={{ padding: '12px 16px' }}>
                        <div className="skeleton" style={{ height: 14, borderRadius: 4, width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="table-row-hover"
                    style={{ borderBottom: '1px solid var(--border-table)', cursor: 'pointer' }}
                    onClick={() => navigate('/processing/policy-detail', { state: { policy: p } })}
                  >
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-mono)', fontWeight: 600, whiteSpace: 'nowrap' }}>{p.policyNumber}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--text-primary)',  overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'break-word', lineHeight: '1.4' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', maxWidth: '220px', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'break-word', lineHeight: '1.4' }}><div style={{maxWidth:'220px',whiteSpace:'normal',wordBreak:'normal',overflowWrap:'break-word',lineHeight:'1.4'}}>{p.lob}</div></td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.effectiveDate}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.expirationDate}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={p.status} /></td>
                    <td style={{ padding: '12px 16px' }}><Badge status={p.transactionStatus} /></td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{p.lastModifiedBy}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'monospace' }}>{p.annualPremiumStr || formatCurrency(p.annualPremium)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{p.writtenPremiumStr || formatCurrency(p.writtenPremium)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{p.billedPremiumStr || formatCurrency(p.billedPremium)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={policies.length} perPage={perPage} onChange={setPage} />
      </div>
    </div>
  )
}
