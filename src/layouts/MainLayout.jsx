import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useApp } from '../context/AppContext'

export default function MainLayout({ children, onLogout }) {
  const { sidebarCollapsed } = useApp()
  const sidebarW = sidebarCollapsed ? '72px' : '240px'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', transition: 'background 0.25s ease' }}>
      <style>{`:root { --sidebar-width: ${sidebarW}; }`}</style>
      <Sidebar />
      <div style={{ marginLeft: sidebarW, transition: 'margin-left 0.3s ease' }}>
        <Topbar onLogout={onLogout} />
        <main style={{ paddingTop: 64, minHeight: '100vh' }}>
          <div style={{ padding: 24 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
