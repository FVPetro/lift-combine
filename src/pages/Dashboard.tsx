import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAthletes, useCurrentUser, useStore } from '../store/useStore'
import { scoreSession } from '../utils/scoring'
import { formatHeight, getScoreBg, getScoreColor } from '../utils/scoring'
import { Users, Plus, Search, LogOut, Zap, TrendingUp, Activity, Award } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

const POSITION_COLORS: Record<string, string> = {
  PG: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  SG: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SF: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  PF: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  C: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function Dashboard() {
  const athletes = useAthletes()
  const user = useCurrentUser()
  const logout = useStore(s => s.logout)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterPos, setFilterPos] = useState<string>('ALL')

  const filtered = athletes.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.school?.toLowerCase().includes(search.toLowerCase())
    const matchPos = filterPos === 'ALL' || a.position === filterPos
    return matchSearch && matchPos
  })

  // Compute stats for header cards
  const allScores = athletes.flatMap(a =>
    a.sessions.length ? [scoreSession(a.sessions[a.sessions.length - 1], a.position).overall] : []
  )
  const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b) / allScores.length) : 0
  const eliteCount = allScores.filter(s => s >= 85).length
  const totalSessions = athletes.reduce((acc, a) => acc + a.sessions.length, 0)

  return (
    <div className="min-h-screen bg-navy-950 bg-grid">
      {/* Top Nav */}
      <header className="border-b border-navy-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-white tracking-tight">LIFT</span>
              <span className="text-slate-500 text-sm ml-2 font-medium">Combine Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {user?.avatar && (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-600" />
              )}
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-white">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.title}</div>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login') }} className="btn-ghost p-2">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Athletes', value: athletes.length, sub: 'active profiles' },
            { icon: Activity, label: 'Avg Score', value: avgScore, sub: 'across roster' },
            { icon: TrendingUp, label: 'Sessions', value: totalSessions, sub: 'assessments logged' },
            { icon: Award, label: 'Elite', value: eliteCount, sub: 'above 85 overall' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-brand" />
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
              </div>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search athletes or schools..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
              <button
                key={pos}
                onClick={() => setFilterPos(pos)}
                className={clsx(
                  'px-3 py-2 rounded-xl text-xs font-bold border transition-all',
                  filterPos === pos
                    ? 'bg-brand border-brand text-white'
                    : 'border-navy-600 text-slate-400 hover:text-white hover:border-navy-500'
                )}
              >
                {pos}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/athlete/new')} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add Athlete
          </button>
        </div>

        {/* Athlete grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No athletes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(athlete => {
              const latestSession = athlete.sessions[athlete.sessions.length - 1]
              const scores = latestSession ? scoreSession(latestSession, athlete.position) : null

              return (
                <button
                  key={athlete.id}
                  onClick={() => navigate(`/athlete/${athlete.id}`)}
                  className="card-glow p-5 text-left hover:border-brand/40 transition-all duration-200 group w-full"
                >
                  <div className="flex items-start gap-4">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      {athlete.photo ? (
                        <img
                          src={athlete.photo}
                          alt={athlete.name}
                          className="w-16 h-16 rounded-xl object-cover ring-2 ring-navy-600 group-hover:ring-brand/40 transition-all"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-navy-700 flex items-center justify-center text-xl font-black text-slate-400">
                          {athlete.name[0]}
                        </div>
                      )}
                      <span className={clsx(
                        'absolute -bottom-1.5 -right-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-md border',
                        POSITION_COLORS[athlete.position]
                      )}>
                        {athlete.position}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-base group-hover:text-brand transition-colors truncate">{athlete.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5 truncate">{athlete.school ?? 'Independent'}</div>
                      <div className="flex gap-3 mt-2 text-xs text-slate-400">
                        <span>{formatHeight(athlete.heightInches)}</span>
                        <span>{athlete.weightLbs} lbs</span>
                      </div>
                    </div>

                    {/* Score */}
                    {scores && (
                      <div className="flex-shrink-0 text-right">
                        <div className={clsx('text-3xl font-black', getScoreColor(scores.overall))}>
                          {scores.overall}
                        </div>
                        <div className="text-slate-600 text-[10px] font-semibold uppercase tracking-wider">Overall</div>
                      </div>
                    )}
                  </div>

                  {/* Mini score bars */}
                  {scores && (
                    <div className="mt-4 grid grid-cols-5 gap-1.5">
                      {([
                        ['SPD', scores.speed],
                        ['PWR', scores.power],
                        ['AGI', scores.agility],
                        ['MOB', scores.mobility],
                        ['SYM', scores.symmetry],
                      ] as [string, number][]).map(([label, val]) => (
                        <div key={label} className="text-center">
                          <div className="h-1.5 rounded-full bg-navy-700 mb-1 overflow-hidden">
                            <div
                              className={clsx('h-full rounded-full transition-all', {
                                'bg-emerald-500': val >= 85,
                                'bg-green-500': val >= 70 && val < 85,
                                'bg-yellow-500': val >= 55 && val < 70,
                                'bg-orange-500': val >= 40 && val < 55,
                                'bg-red-500': val < 40,
                              })}
                              style={{ width: `${Math.min(100, val)}%` }}
                            />
                          </div>
                          <div className="text-[9px] text-slate-600 font-semibold">{label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Session count */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-700">
                    <span className="text-slate-600 text-xs">
                      {athlete.sessions.length} session{athlete.sessions.length !== 1 ? 's' : ''}
                    </span>
                    {latestSession && (
                      <span className="text-slate-600 text-xs">
                        Last: {format(new Date(latestSession.date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
