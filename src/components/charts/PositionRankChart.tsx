import { AssessmentSession, Position } from '../../types'
import { COMBINE_HISTORY, getPercentileRank } from '../../data/combineHistory'
import { cmToInches } from '../../utils/scoring'
import clsx from 'clsx'

interface Props {
  session: AssessmentSession
  position: Position
}

interface MetricRow {
  label: string
  value: string
  rank: number
  total: number
  percentile: number
  higherIsBetter: boolean
}

export default function PositionRankChart({ session, position }: Props) {
  const history = COMBINE_HISTORY[position]

  const rows: MetricRow[] = []

  if (session.cmj) {
    const dataset = history.map(h => h.cmjHeightCm)
    const { rank, total, percentile } = getPercentileRank(session.cmj.jumpHeightCm, dataset, true)
    rows.push({ label: 'CMJ Height', value: cmToInches(session.cmj.jumpHeightCm), rank, total, percentile, higherIsBetter: true })
  }

  if (session.laneAgility) {
    const dataset = history.map(h => h.laneAgilitySeconds)
    const { rank, total, percentile } = getPercentileRank(session.laneAgility.timeSeconds, dataset, false)
    rows.push({ label: 'Lane Agility', value: `${session.laneAgility.timeSeconds}s`, rank, total, percentile, higherIsBetter: false })
  }

  if (session.sprint34) {
    const dataset = history.map(h => h.sprint34Seconds)
    const { rank, total, percentile } = getPercentileRank(session.sprint34.timeSeconds, dataset, false)
    rows.push({ label: '3/4 Sprint', value: `${session.sprint34.timeSeconds}s`, rank, total, percentile, higherIsBetter: false })
  }

  if (session.shuttle) {
    const dataset = history.map(h => h.shuttleSeconds)
    const { rank, total, percentile } = getPercentileRank(session.shuttle.timeSeconds, dataset, false)
    rows.push({ label: 'Shuttle', value: `${session.shuttle.timeSeconds}s`, rank, total, percentile, higherIsBetter: false })
  }

  if (rows.length === 0) return null

  const getBarColor = (p: number) => {
    if (p >= 75) return 'bg-emerald-500'
    if (p >= 50) return 'bg-green-500'
    if (p >= 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTextColor = (p: number) => {
    if (p >= 75) return 'text-emerald-400'
    if (p >= 50) return 'text-green-400'
    if (p >= 25) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRankSuffix = (n: number) => {
    if (n === 1) return 'st'
    if (n === 2) return 'nd'
    if (n === 3) return 'rd'
    return 'th'
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-sm">Position Rankings</h3>
        <span className="text-[10px] text-slate-500 bg-navy-800 border border-navy-700 px-2 py-1 rounded-lg font-semibold uppercase tracking-wider">
          {position} · {history.length} athletes · 2024–25
        </span>
      </div>

      <div className="space-y-4">
        {rows.map(row => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-semibold w-24">{row.label}</span>
                <span className="text-white text-xs font-bold">{row.value}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx('text-xs font-black', getTextColor(row.percentile))}>
                  {row.rank}{getRankSuffix(row.rank)} / {row.total}
                </span>
                <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-full', {
                  'bg-emerald-500/15 text-emerald-400': row.percentile >= 75,
                  'bg-green-500/15 text-green-400': row.percentile >= 50 && row.percentile < 75,
                  'bg-yellow-500/15 text-yellow-400': row.percentile >= 25 && row.percentile < 50,
                  'bg-red-500/15 text-red-400': row.percentile < 25,
                })}>
                  {row.percentile}th %ile
                </span>
              </div>
            </div>

            {/* Percentile bar */}
            <div className="relative h-2.5 bg-navy-800 rounded-full overflow-hidden">
              {/* Quartile markers */}
              {[25, 50, 75].map(q => (
                <div key={q} className="absolute top-0 bottom-0 w-px bg-navy-600 z-10" style={{ left: `${q}%` }} />
              ))}
              <div
                className={clsx('h-full rounded-full transition-all duration-700', getBarColor(row.percentile))}
                style={{ width: `${Math.max(2, row.percentile)}%` }}
              />
            </div>

            <div className="flex justify-between text-[9px] text-slate-600 mt-0.5 px-0.5">
              <span>Bottom</span>
              <span>25th</span>
              <span>50th</span>
              <span>75th</span>
              <span>Top</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
