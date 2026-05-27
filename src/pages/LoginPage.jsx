import React, { useState } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function LoginPage({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email === 'admin@aura.com' && password === 'Aura123!') {
      localStorage.setItem('aura-auth', 'true')
      onLogin()
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.4),transparent_35%)]"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-wide">AURA Portal</h1>
          <p className="text-slate-300 mt-2 text-sm">Secure insurance management platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-200 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aura.com"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/70 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-200 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/70 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-[1.01] transition-all duration-200 shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Demo Login: admin@aura.com / Aura123!
        </div>
      </div>
    </div>
  )
}
