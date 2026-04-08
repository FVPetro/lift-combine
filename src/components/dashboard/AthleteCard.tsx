import { useNavigate } from 'react-router-dom'
import { Athlete } from '../../types'
import { scoreSession, formatHeight, getScoreColor, getScoreBg } from '../../utils/scoring'
import { ChevronRight, Activity } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  athlete: Athlete
}

const POSITION_COLORS: Record<string, string> = {
  PG: 'bg-blue-600 text-white border-blue-700',
  SG: 'bg-purple-600 text-white border-purple-700',
  SF: 'bg-emerald-600 text-white border-emerald-700',
  PF: 'bg-orange-600 text-white border-orange-700',
  C: 'bg-red-600 text-white border-red-700',
}

export default function AthleteCard({ athlete }: Props) {
  const navigate = useNavigate()
  const latestSession = athlete.sessions[athlete.sessions.length - 1]
  const scores = latestSession ? scoreSession(latestSession, athlete.position) : null

  return (
    <button
      onClick={() => navigate(`/athlete/${athlete.id}`)}
      className="group w-full text-left card-glow p-5 hover:border-brand/40 hover:bg-navy-700/60 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {athlete.photo ? (
            <img
              src={athlete.photo}
              alt={athlete.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-navy-600 group-hover:ring-brand/30 transition-all"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }}
            />
          ) : null}
          {(!athlete.photo) && (
            <div className="w-16 h-16 rounded-2xl bg-navy-700 flex items-center justify-center ring-2 ring-navy-600">
              <span className="text-xl font-bold text-slate-400">
                {athlete.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <span className={clsx(
            'absolute -bottom-1.5 -right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-lg border',
            POSITION_COLORS[athlete.position]
          )}>
            {athlete.position}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base leading-tight group-hover:text-brand transition-colors">
                {athlete.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{athlete.school ?? 'Undeclared'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand transition-colors flex-shrink-0 mt-0.5" />
          </div>

          {/* Physical stats */}
          <div className="flex items-center gap-3 mt-2">
            {[
              { label: 'HT', value: formatHeight(athlete.heightInches) },
              { label: 'WT', value: `${athlete.weightLbs} lb` },
              { label: 'WS', value: formatHeight(athlete.wingspanInches) },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-[10px] text-slate-600 font-semibold uppercase">{stat.label}</div>
                <div className="text-xs text-slate-300 font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score row */}
      {scores ? (
        <div className="mt-4 pt-4 border-t border-navy-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Readiness Score
              </span>
            </div>
            <span className={clsx('text-xs font-bold', getScoreColor(scores.overall))}>
              {scores.overall}/100
            </span>
          </div>

          {/* Score bar */}
          <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${scores.overall}%`,
                background: scores.overall >= 80
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : scores.overall >= 60
                  ? 'linear-gradient(90deg, #eab308, #facc15)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
            />
          </div>

          {/* Domain scores */}
          <div className="grid grid-cols-5 gap-1 mt-3">
            {[
              { label: 'SPD', value: scores.speed },
              { label: 'PWR', value: scores.power },
              { label: 'AGI', value: scores.agility },
              { label: 'MOB', value: scores.mobility },
              { label: 'SYM', value: scores.symmetry },
            ].map(d => (
              <div key={d.label} className="text-center">
                <div className={clsx(
                  'text-[10px] font-bold rounded-lg py-0.5 border',
                  d.value ? getScoreBg(d.value) : 'text-slate-600 bg-navy-800 border-navy-600'
                )}>
                  {d.value || '—'}
                </div>
                <div className="text-[9px] text-slate-600 mt-0.5 font-semibold">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-navy-700 text-center text-xs text-slate-600">
          No sessions recorded
        </div>
      )}

      {/* Session count */}
      <div className="mt-3 text-[10px] text-slate-600">
        {athlete.sessions.length} session{athlete.sessions.length !== 1 ? 's' : ''} recorded
        {latestSession && ` · Last: ${new Date(latestSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
      </div>
    </button>
  )
}
