import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, FileText, RefreshCw, Briefcase, Home, Droplets,
  Wind, Upload, Building2, Search, BarChart3, Users, MapPin,
  DollarSign, Truck, UserCircle, Shield, ChevronDown, ChevronRight,
  Menu, X, Zap
} from 'lucide-react'

// AURA Logo SVG — angular "A" matching brand logo
const AuraLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left leg of A */}
    <polygon points="4,38 16,6 22,22 13,38" fill="#7aab6a"/>
    {/* Right leg of A */}
    <polygon points="16,6 40,38 30,38 22,22" fill="#a8cc80"/>
    {/* Crossbar gap cutout */}
    <polygon points="10,32 18,32 20,27 14,27" fill="var(--bg-sidebar)" opacity="1"/>
  </svg>
)

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', exact: true },
  {
    label: 'Processing', icon: Zap,
    children: [
      { label: 'Quote', icon: FileText, to: '/processing/quote' },
      { label: 'Renewal Quote', icon: RefreshCw, to: '/processing/renewal' },
      { label: 'Workers Comp', icon: Briefcase, to: '/processing/workers-comp' },
      { label: 'Spicewood Quote', icon: FileText, to: '/processing/spicewood' },
      { label: 'VAVE HomeOwners', icon: Home, to: '/processing/homeowners' },
      { label: 'BRIT Flood', icon: Droplets, to: '/processing/flood' },
      { label: 'Satinwood Wind Buy Back', icon: Wind, to: '/processing/wind' },
      { label: 'Upload Master', icon: Upload, to: '/processing/upload' },
      { label: 'Lender/REO', icon: Building2, to: '/processing/lender' },
      { label: 'Find Transaction', icon: Search, to: '/processing/find' },
    ],
  },
  { label: 'Reports', icon: BarChart3, to: '/reports' },
  {
    label: 'Admin', icon: Shield,
    children: [
      { label: 'Agents', icon: Users, to: '/admin/agents' },
      { label: 'Agent States', icon: MapPin, to: '/admin/agent-states' },
      { label: 'Commission Rates', icon: DollarSign, to: '/admin/commission-rates' },
      { label: 'Carriers', icon: Truck, to: '/admin/carriers' },
      { label: 'Clients', icon: UserCircle, to: '/admin/clients' },
      { label: 'Users', icon: Users, to: '/admin/users' },
      { label: 'Roles', icon: Shield, to: '/admin/roles' },
      { label: 'Agent Search', icon: Search, to: '/admin/search-id' },
    ],
  },
]

const NavGroup = ({ group, collapsed }) => {
  const location = useLocation()
  const isActive = group.children?.some(c => location.pathname === c.to || location.pathname.startsWith(c.to))
  const [open, setOpen] = useState(isActive || false)

  if (!group.children) {
    return (
      <NavLink
        to={group.to}
        end={group.exact}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        title={collapsed ? group.label : undefined}
      >
        <group.icon size={16} style={{ flexShrink: 0 }} />
        {!collapsed && <span>{group.label}</span>}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`nav-item w-full justify-between ${isActive ? 'font-semibold' : ''}`}
        title={collapsed ? group.label : undefined}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <group.icon size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>{group.label}</span>}
        </div>
        {!collapsed && (
          <span style={{ marginLeft: 'auto' }}>
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </span>
        )}
      </button>
      {open && !collapsed && (
        <div style={{ marginLeft: 8, paddingLeft: 16, borderLeft: '1px solid var(--border-nav)' }}>
          {group.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) => `nav-item text-xs ${isActive ? 'active' : ''}`}
              style={{ padding: '6px 16px', fontSize: 12 }}
            >
              <child.icon size={13} style={{ flexShrink: 0 }} />
              <span>{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, user } = useApp()

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: sidebarCollapsed ? 72 : 240,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-sidebar)',
        transition: 'width 0.3s ease, background 0.25s ease',
      }}
    >
      {/* Logo area */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        padding: '14px 14px', borderBottom: '1px solid var(--border-sidebar)',
        minHeight: 64,
      }}>
        <div style={{ flexShrink: 0 }}>
          <AuraLogo size={36} />
        </div>

        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 300,
              fontSize: 26,
              color: '#ffffff',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}>
              URA
            </div>
            <div style={{
              fontSize: 9,
              color: 'var(--logo-sub)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: 3,
              fontFamily: 'monospace',
            }}>
              Insurance Platform
            </div>
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            marginLeft: 'auto', padding: 6, borderRadius: 6, border: 'none',
            background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-nav)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {sidebarCollapsed ? <Menu size={14} /> : <X size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((item) => (
            <NavGroup key={item.label} group={item} collapsed={sidebarCollapsed} />
          ))}
        </div>
      </nav>

      {/* User footer */}
      <div style={{ borderTop: '1px solid var(--border-sidebar)', padding: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 8,
          borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            {user.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-nav)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'var(--logo-sub)', whiteSpace: 'nowrap' }}>{user.role}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
