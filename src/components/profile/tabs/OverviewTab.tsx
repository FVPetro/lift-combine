import { Athlete, AssessmentSession } from '../../../types'
import { scoreSession, getScoreColor, getScoreBg, getScoreLabel, getAsymmetryColor, formatHeight, cmToInches } from '../../../utils/scoring'
import { BENCHMARKS } from '../../../data/benchmarks'
import PerformanceRadar from '../../charts/PerformanceRadar'
import ProgressLine from '../../charts/ProgressLine'
import PositionRankChart from '../../charts/PositionRankChart'
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
      label: 'Pro Agility (avg)',
      athlete: latest.proAgility
        ? parseFloat(((latest.proAgility.rightTimeSeconds + latest.proAgility.leftTimeSeconds) / 2).toFixed(2))
        : null,
      benchmark: bm.proAgilitySeconds,
      unit: 's',
      higher: false,
    },
  ]

  interface DomainInfo {
    key: keyof typeof scores
    label: string
    what: string
    how: string
    ranges: { min: number; max: number; label: string; color: string; meaning: string }[]
  }

  const domainInfo: DomainInfo[] = [
    {
      key: 'speed',
      label: 'Speed',
      what: 'How fast this player moves compared to draft-level players at their position.',
      how: 'Measured by 3/4 court sprint & reactive shuttle run vs. position average.',
      ranges: [
        { min: 90, max: 100, label: 'Elite', color: 'text-emerald-400', meaning: 'Top-tier speed — stands out at any combine.' },
        { min: 75, max: 89, label: 'Above Avg', color: 'text-green-400', meaning: 'Competitive speed — no concerns for scouts.' },
        { min: 60, max: 74, label: 'Average', color: 'text-yellow-400', meaning: 'Functional but not a strength — monitor.' },
        { min: 0, max: 59, label: 'Needs Work', color: 'text-red-400', meaning: 'Speed gap — needs training before combine.' },
      ],
    },
    {
      key: 'power',
      label: 'Power',
      what: 'How explosive this player is off the floor — finishing, rebounding, and first-step burst.',
      how: 'Measured by countermovement jump (CMJ) height via ForceDecks vs. position average.',
      ranges: [
        { min: 90, max: 100, label: 'Elite', color: 'text-emerald-400', meaning: 'Elite explosiveness — can dominate above the rim.' },
        { min: 75, max: 89, label: 'Above Avg', color: 'text-green-400', meaning: 'Good power — competitive at the next level.' },
        { min: 60, max: 74, label: 'Average', color: 'text-yellow-400', meaning: 'Average athleticism — explosive training recommended.' },
        { min: 0, max: 59, label: 'Needs Work', color: 'text-red-400', meaning: 'Power deficit — prioritize before combine.' },
      ],
    },
    {
      key: 'agility',
      label: 'Agility',
      what: 'How quickly this player can cut, change direction, and react laterally.',
      how: 'Measured by lane agility drill vs. position average.',
      ranges: [
        { min: 90, max: 100, label: 'Elite', color: 'text-emerald-400', meaning: 'Elite lateral quickness — can guard any position.' },
        { min: 75, max: 89, label: 'Above Avg', color: 'text-green-400', meaning: 'Solid change of direction — scouts will notice.' },
        { min: 60, max: 74, label: 'Average', color: 'text-yellow-400', meaning: 'Functional agility — watch in game situations.' },
        { min: 0, max: 59, label: 'Needs Work', color: 'text-red-400', meaning: 'Lateral movement is a concern — address now.' },
      ],
    },
    {
      key: 'mobility',
      label: 'Mobility',
      what: 'Joint range of motion and overall movement quality — a key indicator of injury risk.',
      how: 'Based on overhead squat and single-leg squat fault count from movement screens.',
      ranges: [
        { min: 90, max: 100, label: 'Excellent', color: 'text-emerald-400', meaning: 'Clean movement — very low injury risk.' },
        { min: 75, max: 89, label: 'Good', color: 'text-green-400', meaning: 'Minor restrictions — manageable with maintenance.' },
        { min: 60, max: 74, label: 'Fair', color: 'text-yellow-400', meaning: 'Noticeable restrictions — needs targeted mobility work.' },
        { min: 0, max: 59, label: 'Concern', color: 'text-red-400', meaning: 'Movement limitations — elevated injury risk flag.' },
      ],
    },
    {
      key: 'symmetry',
      label: 'Symmetry',
      what: 'Left vs. right side balance — imbalances are the leading cause of non-contact injuries.',
      how: 'Measured by CMJ force asymmetry, hip strength, and single-leg hop tests.',
      ranges: [
        { min: 90, max: 100, label: 'Excellent', color: 'text-emerald-400', meaning: 'Highly balanced — very low injury risk.' },
        { min: 75, max: 89, label: 'Good', color: 'text-green-400', meaning: 'Minor imbalance — within safe range.' },
        { min: 60, max: 74, label: 'Moderate', color: 'text-yellow-400', meaning: 'Noticeable imbalance — address in training.' },
        { min: 0, max: 59, label: 'High Risk', color: 'text-red-400', meaning: 'Significant asymmetry — medical review recommended.' },
      ],
    },
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
          {/* Overall tooltip */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-navy-800 border border-navy-600 text-slate-300 text-[11px] rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
            <div className="font-bold text-white text-xs mb-1">Overall Readiness Score</div>
            <div className="text-slate-400 mb-2">Composite of all 5 domains. This is the number scouts and agents should focus on first.</div>
            <div className="space-y-1">
              {[
                { range: '90–100', label: 'Elite', color: 'text-emerald-400', desc: 'Ready — physically exceptional' },
                { range: '75–89', label: 'Above Avg', color: 'text-green-400', desc: 'Competitive — no red flags' },
                { range: '60–74', label: 'Average', color: 'text-yellow-400', desc: 'Functional — some gaps to close' },
                { range: '0–59', label: 'Needs Work', color: 'text-red-400', desc: 'Not ready — address before combine' },
              ].map(r => (
                <div key={r.range} className={clsx('flex items-center justify-between', scores.overall >= r.range.split('–').map(Number)[0] && scores.overall <= (r.range.includes('+') ? 100 : r.range.split('–').map(Number)[1]) ? 'opacity-100' : 'opacity-40')}>
                  <span className={clsx('font-bold', r.color)}>{r.range}</span>
                  <span className="text-slate-300 ml-2 flex-1">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {domainInfo.map((info) => {
          const val = scores[info.key]
          const activeRange = info.ranges.find(r => val >= r.min && val <= r.max)
          return (
            <div key={info.key} className="card p-4 flex flex-col items-center justify-center relative group">
              <div className={clsx('text-3xl font-black', getScoreColor(val))}>{val || '—'}</div>
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">{info.label}</div>
              {val > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon values={sessions.map(s => scoreSession(s, position)[info.key])} />
                </div>
              )}
              {/* Rich tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-navy-800 border border-navy-600 text-[11px] rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                <div className="font-bold text-white text-xs mb-0.5">{info.label} Score</div>
                <div className="text-slate-400 mb-1">{info.what}</div>
                <div className="text-slate-500 text-[10px] mb-2 italic">{info.how}</div>
                <div className="space-y-1 border-t border-navy-600 pt-2">
                  {info.ranges.map(r => {
                    const isActive = val >= r.min && val <= r.max
                    return (
                      <div key={r.min} className={clsx('flex gap-2 items-start rounded px-1.5 py-1 transition-all', isActive ? 'bg-navy-700' : 'opacity-40')}>
                        <span className={clsx('font-black text-[10px] w-14 flex-shrink-0', r.color)}>{r.min === 0 ? `0–${r.max}` : `${r.min}–${r.max}`}</span>
                        <div>
                          <span className={clsx('font-bold', r.color)}>{r.label}</span>
                          <span className="text-slate-400 ml-1">{r.meaning}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {activeRange && (
                  <div className={clsx('mt-2 text-center text-[10px] font-bold rounded-lg py-1', activeRange.color)}>
                    Current: {val} — {activeRange.label}
                  </div>
                )}
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

      {/* Position Rankings */}
      <PositionRankChart session={latest} position={position} />

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
