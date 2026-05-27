import React, { Suspense, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import QuotePage from './pages/processing/QuotePage'
import SpicewoodPage from './pages/processing/SpicewoodPage'
import UploadPage from './pages/processing/UploadPage'
import PolicyDetailPage from './pages/processing/PolicyDetailPage'
import {
  RenewalPage, WorkersCompPage, HomeownersPage,
  FloodPage, WindPage, LenderPage, FindTransactionPage
} from './pages/processing/OtherPages'
import {
  AgentsPage, AgentStatesPage, CommissionRatesPage,
  CarriersPage, ClientsPage, UsersPage, RolesPage, SearchIdPage
} from './pages/admin/AdminPages'
import UserProfilePage from './pages/admin/UserProfilePage'
import LoginPage from './pages/LoginPage'

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#070d1a' }}>
    <div className="text-center">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div className="text-slate-500 text-sm">Loading InsureAdmin Pro...</div>
    </div>
  </div>
)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('aura-auth') === 'true')

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <MainLayout onLogout={() => { localStorage.removeItem('aura-auth'); setIsAuthenticated(false) }}>
          <Routes>
            {/* Default redirect to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Processing */}
            <Route path="/processing/quote" element={<QuotePage />} />
            <Route path="/processing/renewal" element={<RenewalPage />} />
            <Route path="/processing/workers-comp" element={<WorkersCompPage />} />
            <Route path="/processing/spicewood" element={<SpicewoodPage />} />
            <Route path="/processing/aura-proposal" element={<UploadPage />} />
            <Route path="/processing/homeowners" element={<HomeownersPage />} />
            <Route path="/processing/flood" element={<FloodPage />} />
            <Route path="/processing/wind" element={<WindPage />} />
            <Route path="/processing/upload" element={<UploadPage />} />
            <Route path="/processing/policy-detail" element={<PolicyDetailPage />} />
            <Route path="/processing/lender" element={<LenderPage />} />
            <Route path="/processing/find" element={<FindTransactionPage />} />
            {/* Reports */}
            <Route path="/reports" element={<Reports />} />
            {/* Admin */}
            <Route path="/admin/agents" element={<AgentsPage />} />
            <Route path="/admin/agent-states" element={<AgentStatesPage />} />
            <Route path="/admin/commission-rates" element={<CommissionRatesPage />} />
            <Route path="/admin/carriers" element={<CarriersPage />} />
            <Route path="/admin/clients" element={<ClientsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/roles" element={<RolesPage />} />
            <Route path="/admin/search-id" element={<SearchIdPage />} />
            <Route path="/admin/user-profile" element={<UserProfilePage />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MainLayout>
      </Suspense>
    </AppProvider>
  )
}
