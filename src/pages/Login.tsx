import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Eye, EyeOff, Zap, Lock, Mail, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const ok = login(email, password)
    setLoading(false)
    if (ok) navigate('/')
    else setError('Invalid email or password.')
  }

  const quickLogin = (e: string, p: string) => {
    setEmail(e)
    setPassword(p)
  }

  return (
    <div className="min-h-screen bg-navy-950 bg-grid flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center glow-orange">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black tracking-tight text-white">LIFT</div>
              <div className="text-xs text-slate-400 font-medium tracking-widest uppercase">Sports Management</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Combine Performance Tracker</p>
        </div>

        {/* Card */}
        <div className="card-glow p-8">
          <h1 className="text-xl font-bold text-white mb-6">Sign in to your account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@lift.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-10 pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 h-12"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-navy-600">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Demo Accounts</p>
            <div className="space-y-2">
              {[
                { label: 'Trainer', email: 'trainer@lift.com', role: 'Head of Performance' },
                { label: 'Agent', email: 'agent@lift.com', role: 'Senior Agent' },
              ].map(u => (
                <button
                  key={u.email}
                  onClick={() => quickLogin(u.email, 'password')}
                  className="w-full flex items-center justify-between bg-navy-900 hover:bg-navy-700 border border-navy-600 rounded-xl px-4 py-2.5 transition-colors group"
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-300 group-hover:text-white">{u.label}</div>
                    <div className="text-xs text-slate-500">{u.role}</div>
                  </div>
                  <div className="text-xs text-slate-600 group-hover:text-brand font-mono transition-colors">{u.email}</div>
                </button>
              ))}
            </div>
            <p className="text-slate-600 text-xs mt-2 text-center">Password: <span className="font-mono text-slate-500">password</span></p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2025 Lift Sports Management. All rights reserved.
        </p>
      </div>
    </div>
  )
}
