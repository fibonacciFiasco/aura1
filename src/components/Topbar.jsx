import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Search, Bell, ChevronDown, LogOut, Settings, User, X, Sun, Moon } from 'lucide-react'

const TITLES = {
  '/': 'Dashboard',
  '/processing/quote': 'Quote',
  '/processing/renewal': 'Renewal Quote',
  '/processing/workers-comp': 'Workers Comp Quote',
  '/processing/homeowners': 'VAVE HomeOwners Quote',
  '/processing/flood': 'BRIT Flood Quote',
  '/processing/wind': 'Satinwood Wind Buy Back',
  '/processing/upload': 'Upload Master Proposal',
  '/processing/lender': 'Lender / REO Quote',
  '/processing/find': 'Find Transaction',
  '/reports': 'Reports & Analytics',
  '/admin/agents': 'Agents',
  '/admin/agent-states': 'Agent States',
  '/admin/commission-rates': 'Commission Rates',
  '/admin/carriers': 'Carriers',
  '/admin/clients': 'Clients',
  '/admin/users': 'Users',
  '/admin/roles': 'Roles',
}

export default function Topbar({ onLogout }) {
  const { user, notifications, theme, toggleTheme } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [search, setSearch] = useState('')

  const title = TITLES[location.pathname] || 'AURA Insurance Platform'
  const unread = notifications.length
  const isDark = theme === 'dark'

  return (
    <header
      style={{
        position: 'fixed', top: 0, right: 0, zIndex: 30,
        height: 64,
        left: 'var(--sidebar-width, 240px)',
        background: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border-topbar)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 16,
        transition: 'left 0.3s ease, background 0.25s ease',
      }}
    >
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontWeight: 700, color: 'var(--topbar-title)', fontSize: 16, margin: 0, lineHeight: 1 }}>{title}</h1>
        <div style={{ fontSize: 11, color: 'var(--topbar-sub)', marginTop: 3 }}>
          {location.pathname === '/' ? 'Welcome back, Admin' : `Processing › ${title}`}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', display: 'none' }} className="md:block">
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search policies, clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 8,
            paddingLeft: 30, paddingRight: 30, paddingTop: 7, paddingBottom: 7,
            width: 220, fontSize: 13, color: 'var(--text-primary)', outline: 'none',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* ── Theme Toggle ── */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark
          ? <><Sun size={13} /> Light</>
          : <><Moon size={13} /> Dark</>
        }
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowNotif(!showNotif); setShowUser(false) }}
          style={{
            position: 'relative', padding: 8, borderRadius: 8, border: 'none',
            background: 'var(--topbar-btn-bg)', cursor: 'pointer', color: 'var(--topbar-title)',
            display: 'flex', alignItems: 'center',
          }}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4, width: 16, height: 16,
              background: '#e85c5c', borderRadius: '50%', fontSize: 9, fontWeight: 700,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unread}
            </span>
          )}
        </button>
        {showNotif && (
          <div style={{
            position: 'absolute', right: 0, top: 48, width: 300,
            background: 'var(--bg-dropdown)', border: '1px solid var(--border-dropdown)',
            borderRadius: 10, boxShadow: 'var(--shadow-dropdown)', zIndex: 50,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>Notifications</span>
              <span style={{ fontSize: 11, color: 'var(--accent)' }}>{unread} new</span>
            </div>
            {notifications.map((n) => (
              <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-page)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-notif-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{n.text}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{n.time}</div>
              </div>
            ))}
            <div style={{ padding: '8px 16px', textAlign: 'center' }}>
              <button style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowUser(!showUser); setShowNotif(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px',
            borderRadius: 8, border: 'none', background: 'var(--topbar-btn-bg)',
            cursor: 'pointer', color: 'var(--topbar-title)',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {user.name.charAt(0)}
          </div>
          <span style={{ fontSize: 13, color: 'var(--topbar-title)' }} className="hidden sm:block">{user.name}</span>
          <ChevronDown size={13} style={{ color: 'var(--topbar-sub)' }} />
        </button>
        {showUser && (
          <div style={{
            position: 'absolute', right: 0, top: 48, width: 200,
            background: 'var(--bg-dropdown)', border: '1px solid var(--border-dropdown)',
            borderRadius: 10, boxShadow: 'var(--shadow-dropdown)', zIndex: 50,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-divider)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-heading)' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{user.email}</div>
            </div>
            {[
              { icon: User, label: 'Profile', action: () => navigate('/admin/user-profile') },
              { icon: Settings, label: 'Settings', action: () => navigate('/admin/users') },
              { icon: LogOut, label: 'Sign Out', action: () => onLogout && onLogout() },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={() => { setShowUser(false); action() }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-table-row-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
