import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState('dark') // dark is default

  const [user] = useState({
    name: 'Admin User',
    email: 'admin@insureproadmin.com',
    role: 'Super Admin',
    avatar: null,
  })
  const [notifications] = useState([
    { id: 1, text: '5 policies expiring this week', type: 'warning', time: '2h ago' },
    { id: 2, text: 'New quote submitted by Agent Martinez', type: 'info', time: '4h ago' },
    { id: 3, text: 'Batch upload completed: 47 records', type: 'success', time: '1d ago' },
  ])

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <AppContext.Provider value={{
      sidebarCollapsed,
      setSidebarCollapsed,
      user,
      notifications,
      theme,
      toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
