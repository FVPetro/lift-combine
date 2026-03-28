import { Athlete, AssessmentSession } from '../../../types'
import { scoreSession, getScoreColor, getScoreBg, getScoreLabel, getAsymmetryColor, formatHeight, cmToInches } from '../../../utils/scoring'
import { BENCHMARKS } from '../../../data/benchmarks'
import PerformanceRadar from '../../charts/PerformanceRadar'
import ProgressLine from '../../charts/ProgressLine'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Star } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props { athlete: Athlete }

function TrendIcon({ values }: { values: number[] }) {
  if (values.length < 2) return <Minus className="w-3 h-3 text-slate-500" />
  const diff = values[values.length - 1] - values[values.length - 2]
  if (Math.abs(diff) < 0.5) return <Minus className="w-3 h-3 text-slate-500" />
  return diff > 0
    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
    : <TrendingDown className="w-3 h-3 text-red-400" />
}

export default function OverviewTab({ athlete }: Props) {
  const { sessions, position } = athlete
  const bm = BENCHMARKS[position]

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No assessments yet</p>
        <p className="text-sm mt-1">Go to the Tests tab to add the first session.</p>
      </div>
    )
  }

  const latest = sessions[sessions.length - 1]
  const scores = scoreSession(latest, position)

  // Progress data for charts
  const sprintData = sessions.filter(s => s.sprint34).map(s => ({
    date: s.date, value: s.sprint34!.timeSeconds, label: s.label,
  }))
  const jumpData = sessions.filter(s => s.cmj).map(s => ({
    date: s.date, value: Math.round((s.cmj!.jumpHeightCm / 2.54) * 10) / 10, label: s.label,
  }))
  const agilityData = sessions.filter(s => s.laneAgility).map(s => ({
    date: s.date, value: s.laneAgility!.timeSeconds, label: s.label,
  }))
  const overallData = sessions.map(s => ({
    date: s.date, value: scoreSession(s, position).overall, label: s.label,
  }))

  // Benchmark comparison for key metrics
  const comparisons = [
    {
      label: 'CMJ Height',
      athlete: latest.cmj ? Math.round((latest.cmj.jumpHeightCm / 2.54) * 10) / 10 : null,
      benchmark: Math.round((bm.cmjHeightCm / 2.54) * 10) / 10,
      unit: '"',
      higher: true,
    },
    {
      label: 'Lane Agility',
      athlete: latest.laneAgility?.timeSeconds ?? null,
      benchmark: bm.laneAgilitySeconds,
      unit: 's',
      higher: false,
    },
    {
      label: '3/4 Sprint',
      athlete: latest.sprint34?.timeSeconds ?? null,
      benchmark: bm.sprint34Seconds,
      unit: 's',
      higher: false,
    },
    {
      label: 'Shuttle',
      athlete: latest.shuttle?.timeSeconds ?? null,
      benchmark: bm.shuttleSeconds,
      unit: 's',
      higher: false,
    },
  ]

  const domainLabels: [keyof typeof scores, string, string][] = [
    ['speed', 'Speed', 'Based on 3/4 court sprint time compared to position benchmarks.'],
    ['power', 'Power', 'Based on countermovement jump (CMJ) height — measures explosive leg power.'],
    ['agility', 'Agility', 'Based on lane agility and shuttle run times — measures change of direction speed.'],
    ['mobility', 'Mobility', 'Based on hip mobility and flexibility assessments — measures joint range of motion.'],
    ['symmetry', 'Symmetry', 'Based on left/right asymmetry across jump and hip force tests — lower asymmetry = higher score.'],
  ]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Score summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Overall */}
        <div className="sm:col-span-1 card p-4 flex flex-col items-center justify-center relative group">
          <div className={clsx('text-5xl font-black', getScoreColor(scores.overall))}>{scores.overall}</div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">Overall</div>
          <div className={clsx('text-[10px] font-black mt-1 px-2 py-0.5 rounded-full border', getScoreBg(scores.overall))}>
            {getScoreLabel(scores.overall)}
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-navy-700 border border-navy-600 text-slate-300 text-[11px] rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center">
            Weighted composite of all domain scores — speed, power, agility, mobility, and symmetry.
          </div>
        </div>
        {domainLabels.map(([key, label, tooltip]) => {
          const val = scores[key]
          return (
            <div key={key} className="card p-4 flex flex-col items-center justify-center relative group">
              <div className={clsx('text-3xl font-black', getScoreColor(val))}>{val || '—'}</div>
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">{label}</div>
              {val > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon values={sessions.map(s => scoreSession(s, position)[key])} />
                </div>
              )}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-navy-700 border border-navy-600 text-slate-300 text-[11px] rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center">
                {tooltip}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white text-sm">Performance Profile</h3>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-brand inline-block rounded" /> Athlete</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-500 inline-block rounded border-dashed border-slate-500" /> {position} Avg</span>
            </div>
          </div>
          <PerformanceRadar scores={scores} />
        </div>

        {/* Benchmark comparison bars */}
        <div className="card p-5">
          <h3 className="font-bold text-white text-sm mb-4">vs. {position} Combine Benchmark</h3>
          <div className="space-y-4">
            {comparisons.map(c => {
              if (c.athlete === null) return null
              const pct = c.higher
                ? Math.min(120, (c.athlete / c.benchmark) * 100)
                : Math.min(120, (c.benchmark / c.athlete) * 100)
              const diff = c.higher ? c.athlete - c.benchmark : c.benchmark - c.athlete
              const better = diff > 0

              return (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-semibold">{c.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Avg: {c.benchmark}{c.unit}</span>
                      <span className={clsx('font-bold', better ? 'text-emerald-400' : 'text-red-400')}>
                        {better ? '+' : ''}{diff.toFixed(2)}{c.unit}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-navy-700 overflow-hidden relative">
                    {/* Benchmark marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-500/60 z-10" style={{ left: '83.3%' }} />
                    <div
                      className={clsx('h-full rounded-full transition-all duration-700', {
                        'bg-emerald-500': pct >= 95,
                        'bg-green-500': pct >= 80 && pct < 95,
                        'bg-yellow-500': pct >= 65 && pct < 80,
                        'bg-orange-500': pct >= 50 && pct < 65,
                        'bg-red-500': pct < 50,
                      })}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] mt-1">
                    <span className="font-bold text-white">{c.athlete}{c.unit}</span>
                    <span className="text-slate-600">{Math.round(pct)}% of benchmark</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress charts */}
      {sessions.length > 1 && (
        <div className="card p-5">
          <h3 className="font-bold text-white text-sm mb-4">Progress Over Time</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-2">Overall Score</div>
              <ProgressLine data={overallData} color="#f97316" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-2">Jump Height (in)</div>
              <ProgressLine data={jumpData} benchmark={Math.round((bm.cmjHeightCm / 2.54) * 10) / 10} unit='"' color="#818cf8" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-2">Lane Agility (s)</div>
              <ProgressLine data={agilityData} benchmark={bm.laneAgilitySeconds} unit="s" lowerIsBetter color="#22c55e" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-2">3/4 Sprint (s)</div>
              <ProgressLine data={sprintData} benchmark={bm.sprint34Seconds} unit="s" lowerIsBetter color="#06b6d4" />
            </div>
          </div>
        </div>
      )}

      {/* Asymmetry summary */}
      {(latest.cmj || latest.singleLegHip || latest.singleLegJump) && (
        <div className="card p-5">
          <h3 className="font-bold text-white text-sm mb-4">Asymmetry Summary <span className="text-slate-500 font-normal text-xs ml-1">— latest session</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latest.cmj && (
              <div className="bg-navy-900 rounded-xl p-3 relative group">
                <div className="text-slate-500 text-xs font-semibold mb-2">CMJ Bilateral</div>
                <div className={clsx('text-2xl font-black', getAsymmetryColor(latest.cmj.asymmetryPct))}>
                  {latest.cmj.asymmetryPct.toFixed(1)}%
                </div>
                <div className="text-slate-600 text-xs mt-0.5">asymmetry index</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-navy-700 border border-navy-600 text-slate-300 text-[11px] rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center">
                  Measures left vs. right force imbalance during a bilateral countermovement jump. Calculated as: |Left − Right| / Average × 100. Lower % = more symmetrical. Under 10% is ideal.
                </div>
              </div>
            )}
            {latest.singleLegHip && (
              <div className="bg-navy-900 rounded-xl p-3 relative group">
                <div className="text-slate-500 text-xs font-semibold mb-2">Hip Force</div>
                <div className={clsx('text-2xl font-black', getAsymmetryColor(latest.singleLegHip.asymmetryPct))}>
                  {latest.singleLegHip.asymmetryPct.toFixed(1)}%
                </div>
                <div className="text-slate-600 text-xs mt-0.5">L/R asymmetry</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-navy-700 border border-navy-600 text-slate-300 text-[11px] rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center">
                  Compares peak isometric hip force between left and right legs. Calculated as: |Left − Right| / Average × 100. Over 15% exceeds the clinical threshold and warrants a sports medicine review.
                </div>
              </div>
            )}
            {latest.singleLegJump && (
              <div className="bg-navy-900 rounded-xl p-3 relative group">
                <div className="text-slate-500 text-xs font-semibold mb-2">SL Hop LSI</div>
                <div className={clsx('text-2xl font-black', getAsymmetryColor(100 - latest.singleLegJump.lsi))}>
                  {latest.singleLegJump.lsi.toFixed(1)}%
                </div>
                <div className="text-slate-600 text-xs mt-0.5">limb symmetry index</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-navy-700 border border-navy-600 text-slate-300 text-[11px] rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center">
                  Limb Symmetry Index — compares single-leg hop height between left and right. Calculated as: Weaker Leg / Stronger Leg × 100. 95%+ is ideal; below 85% is the return-to-sport threshold.
                </div>
              </div>
            )}
          </div>
          {(latest.singleLegHip?.asymmetryPct ?? 0) > 15 && (
            <div className="flex items-start gap-2 mt-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs">Hip force asymmetry exceeds 15% clinical threshold. Sports medicine consultation recommended.</p>
            </div>
          )}
        </div>
      )}

      {/* Session timeline */}
      <div className="card p-5">
        <h3 className="font-bold text-white text-sm mb-4">Session History</h3>
        <div className="space-y-2">
          {[...sessions].reverse().map((s, i) => {
            const sc = scoreSession(s, position)
            return (
              <div key={s.id} className="flex items-center gap-4 bg-navy-900 rounded-xl px-4 py-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-slate-400 text-xs font-bold">
                  {sessions.length - i}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{s.label}</div>
                  <div className="text-slate-500 text-xs">{format(new Date(s.date), 'MMMM d, yyyy')}</div>
                </div>
                <div className={clsx('text-2xl font-black', getScoreColor(sc.overall))}>{sc.overall}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
