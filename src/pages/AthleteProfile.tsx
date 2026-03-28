import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAthlete, useStore } from '../store/useStore'
import { formatHeight, scoreSession, getScoreColor, getScoreBg } from '../utils/scoring'
import OverviewTab from '../components/profile/tabs/OverviewTab'
import TestsTab from '../components/profile/tabs/TestsTab'
import InsightsTab from '../components/profile/tabs/InsightsTab'
import ExportTab from '../components/profile/tabs/ExportTab'
import { ArrowLeft, Zap, Edit2, Save, X, BarChart2, Dumbbell, Lightbulb, Download } from 'lucide-react'
import clsx from 'clsx'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'tests', label: 'Tests', icon: Dumbbell },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'export', label: 'Export', icon: Download },
] as const

type TabId = typeof TABS[number]['id']

const POSITION_COLORS: Record<string, string> = {
  PG: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  SG: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SF: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  PF: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  C: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function AthleteProfile() {
  const { id } = useParams<{ id: string }>()
  const athlete = useAthlete(id!)
  const updateAthlete = useStore(s => s.updateAthlete)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [editingNotes, setEditingNotes] = useState(false)
  const [draftNotes, setDraftNotes] = useState(athlete?.notes ?? '')

  if (!athlete) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-xl font-bold mb-2">Athlete not found</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const latestSession = athlete.sessions[athlete.sessions.length - 1]
  const scores = latestSession ? scoreSession(latestSession, athlete.position) : null

  const saveNotes = () => {
    updateAthlete(athlete.id, { notes: draftNotes })
    setEditingNotes(false)
  }

  return (
    <div className="min-h-screen bg-navy-950 bg-grid">
      {/* Top Nav */}
      <header className="border-b border-navy-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-40 no-print">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand" />
            <span className="text-slate-500 font-medium text-sm">Roster</span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-white">{athlete.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Profile header */}
        <div className="card-glow p-6 mb-6 no-print">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              {athlete.photo ? (
                <img src={athlete.photo} alt={athlete.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-navy-600" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-navy-700 flex items-center justify-center text-3xl font-black text-slate-400">
                  {athlete.name[0]}
                </div>
              )}
              <span className={clsx('absolute -bottom-2 -right-2 text-xs font-black px-2 py-1 rounded-lg border', POSITION_COLORS[athlete.position])}>
                {athlete.position}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black text-white">{athlete.name}</h1>
              <div className="text-slate-400 text-sm mt-0.5">{athlete.school ?? 'Independent'} · {athlete.agency}</div>

              {/* Physical stats */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                {[
                  ['Height', formatHeight(athlete.heightInches)],
                  ['Weight', `${athlete.weightLbs} lbs`],
                  ['Wingspan', formatHeight(athlete.wingspanInches)],
                  ['St. Reach', formatHeight(athlete.standingReachInches)],
                ].map(([label, val]) => (
                  <div key={label} className="text-sm">
                    <span className="text-slate-500">{label}: </span>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mt-3">
                {editingNotes ? (
                  <div className="flex items-start gap-2">
                    <textarea
                      value={draftNotes}
                      onChange={e => setDraftNotes(e.target.value)}
                      rows={2}
                      autoFocus
                      className="input-field resize-none text-sm flex-1"
                    />
                    <button onClick={saveNotes} className="btn-primary p-2 flex-shrink-0"><Save className="w-4 h-4" /></button>
                    <button onClick={() => setEditingNotes(false)} className="btn-secondary p-2 flex-shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 group">
                    <p className="text-slate-400 text-sm flex-1">{athlete.notes ?? 'No notes. Click to add.'}</p>
                    <button
                      onClick={() => { setDraftNotes(athlete.notes ?? ''); setEditingNotes(true) }}
                      className="opacity-0 group-hover:opacity-100 btn-ghost p-1.5 flex-shrink-0 transition-opacity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Score */}
            {scores && (
              <div className="flex-shrink-0 text-center">
                <div className={clsx('text-6xl font-black', getScoreColor(scores.overall))}>{scores.overall}</div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Overall</div>
                <div className={clsx('text-xs font-bold mt-2 px-3 py-1.5 rounded-full border', getScoreBg(scores.overall))}>
                  {scores.overall >= 95 ? 'ELITE' : scores.overall >= 85 ? 'ABOVE AVG' : scores.overall >= 70 ? 'AVERAGE' : scores.overall >= 55 ? 'BELOW AVG' : 'NEEDS WORK'}
                </div>
                <div className="text-slate-600 text-[10px] mt-1">{athlete.sessions.length} session{athlete.sessions.length !== 1 ? 's' : ''}</div>
              </div>
            )}
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mb-5 bg-navy-900 p-1 rounded-2xl w-fit no-print">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeTab === tabId
                  ? 'bg-brand text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'overview' && <OverviewTab athlete={athlete} />}
          {activeTab === 'tests' && <TestsTab athlete={athlete} />}
          {activeTab === 'insights' && <InsightsTab athlete={athlete} />}
          {activeTab === 'export' && <ExportTab athlete={athlete} />}
        </div>
      </main>
    </div>
  )
}
