import { useRef } from 'react'
import { Athlete } from '../../../types'
import { generateRecommendations } from '../../../utils/recommendations'
import { scoreSession, getScoreColor, getScoreLabel, formatHeight, cmToInches, getAsymmetryColor } from '../../../utils/scoring'
import { BENCHMARKS } from '../../../data/benchmarks'
import { format } from 'date-fns'
import { Download, Printer, FileText, Zap } from 'lucide-react'
import clsx from 'clsx'

interface Props { athlete: Athlete }

function ScoreDot({ score }: { score: number }) {
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#84cc16' : score >= 55 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444'
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm" style={{ background: `${color}20`, color, border: `1px solid ${color}50` }}>
      {score}
    </span>
  )
}

export default function ExportTab({ athlete }: Props) {
  const printRef = useRef<HTMLDivElement>(null)
  const { sessions, position } = athlete

  const handlePrint = () => window.print()

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No assessment data to export yet.</p>
      </div>
    )
  }

  const latest = sessions[sessions.length - 1]
  const scores = scoreSession(latest, position)
  const bm = BENCHMARKS[position]
  const { recommendations, supplements, injuryFlags } = generateRecommendations(athlete, latest)
  const today = format(new Date(), 'MMMM d, yyyy')
  const sessionDate = format(new Date(latest.date), 'MMMM d, yyyy')

  const age = athlete.dateOfBirth
    ? Math.floor((Date.now() - new Date(athlete.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="animate-fade-in">
      {/* Controls */}
      <div className="flex gap-3 mb-6 no-print">
        <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
        <div className="text-slate-500 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Use your browser's Print dialog → Save as PDF for a clean export
        </div>
      </div>

      {/* Print document */}
      <div ref={printRef} className="card-glow p-8 max-w-4xl mx-auto print:shadow-none print:border-0 print:p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-navy-600 print:border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center print:hidden">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest print:text-gray-400">LIFT Sports Management</div>
              <div className="text-2xl font-black text-white print:text-black">Athlete Assessment Report</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-xs print:text-gray-400">Generated</div>
            <div className="text-white font-semibold text-sm print:text-black">{today}</div>
            <div className="text-slate-500 text-xs mt-1 print:text-gray-400">Assessment: {sessionDate}</div>
          </div>
        </div>

        {/* Athlete info */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-4">
              {athlete.photo && (
                <img src={athlete.photo} alt="" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-navy-600 print:ring-gray-200" />
              )}
              <div>
                <h1 className="text-3xl font-black text-white print:text-black">{athlete.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-brand font-bold text-lg">{athlete.position}</span>
                  <span className="text-slate-400 print:text-gray-500">{athlete.school ?? 'N/A'}</span>
                  {age && <span className="text-slate-400 print:text-gray-500">Age {age}</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                ['Height', formatHeight(athlete.heightInches)],
                ['Weight', `${athlete.weightLbs} lbs`],
                ['Wingspan', formatHeight(athlete.wingspanInches)],
                ['St. Reach', formatHeight(athlete.standingReachInches)],
              ].map(([label, val]) => (
                <div key={label} className="bg-navy-900 print:bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider print:text-gray-400">{label}</div>
                  <div className="text-white font-bold text-sm mt-1 print:text-black">{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-navy-900 print:bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className={clsx('text-6xl font-black', getScoreColor(scores.overall))}>{scores.overall}</div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1 print:text-gray-400">Overall Score</div>
            <div className={clsx('mt-2 text-xs font-black px-3 py-1 rounded-full border',
              scores.overall >= 85 ? 'bg-green-500/15 border-green-500/30 text-green-400' :
              scores.overall >= 70 ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' :
              'bg-red-500/15 border-red-500/30 text-red-400'
            )}>
              {getScoreLabel(scores.overall)}
            </div>
            <div className="text-[10px] text-slate-600 mt-2 text-center print:text-gray-400">vs. {position} Combine Avg</div>
          </div>
        </div>

        {/* Scores grid */}
        <div className="mb-8">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 print:text-gray-400">Performance Domain Scores</h2>
          <div className="grid grid-cols-5 gap-3">
            {([
              ['Speed', scores.speed],
              ['Power', scores.power],
              ['Agility', scores.agility],
              ['Mobility', scores.mobility],
              ['Symmetry', scores.symmetry],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="bg-navy-900 print:bg-gray-50 rounded-xl p-3 text-center">
                <ScoreDot score={val} />
                <div className="text-slate-400 text-xs font-semibold mt-2 print:text-gray-500">{label}</div>
                <div className="text-[10px] text-slate-600 print:text-gray-400">{getScoreLabel(val)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Test results table */}
        <div className="mb-8">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 print:text-gray-400">Test Results</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-600 print:border-gray-200">
                <th className="text-left text-slate-500 font-semibold py-2 print:text-gray-400">Test</th>
                <th className="text-center text-slate-500 font-semibold py-2 print:text-gray-400">Result</th>
                <th className="text-center text-slate-500 font-semibold py-2 print:text-gray-400">{position} Avg</th>
                <th className="text-center text-slate-500 font-semibold py-2 print:text-gray-400">Status</th>
                <th className="text-left text-slate-500 font-semibold py-2 print:text-gray-400">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 print:divide-gray-100">
              {latest.overheadSquat && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">Overhead Squat</td>
                  <td className="text-center font-bold text-white print:text-black">{latest.overheadSquat.faults.length} faults</td>
                  <td className="text-center text-slate-500 print:text-gray-400">0 faults ideal</td>
                  <td className="text-center"><ScoreDot score={latest.overheadSquat.faults.length === 0 ? 100 : latest.overheadSquat.faults.length <= 2 ? 65 : 35} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400 truncate max-w-xs">{latest.overheadSquat.notes || latest.overheadSquat.faults.slice(0, 2).join(', ')}</td>
                </tr>
              )}
              {latest.cmj && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">CMJ Height</td>
                  <td className="text-center font-bold text-white print:text-black">{cmToInches(latest.cmj.jumpHeightCm)}</td>
                  <td className="text-center text-slate-500 print:text-gray-400">{cmToInches(bm.cmjHeightCm)}</td>
                  <td className="text-center"><ScoreDot score={Math.min(100, Math.round((latest.cmj.jumpHeightCm / bm.cmjHeightCm) * 100))} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400">{latest.cmj.asymmetryPct.toFixed(1)}% asymmetry</td>
                </tr>
              )}
              {latest.singleLegHip && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">Single Leg Hip</td>
                  <td className="text-center font-bold text-white print:text-black">{latest.singleLegHip.leftForceN}N / {latest.singleLegHip.rightForceN}N</td>
                  <td className="text-center text-slate-500 print:text-gray-400">L/R</td>
                  <td className="text-center"><ScoreDot score={Math.max(0, 100 - latest.singleLegHip.asymmetryPct * 4)} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400">{latest.singleLegHip.asymmetryPct.toFixed(1)}% asymmetry</td>
                </tr>
              )}
              {latest.singleLegJump && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">Single Leg Hop</td>
                  <td className="text-center font-bold text-white print:text-black">LSI {latest.singleLegJump.lsi.toFixed(1)}%</td>
                  <td className="text-center text-slate-500 print:text-gray-400">&gt;95% ideal</td>
                  <td className="text-center"><ScoreDot score={Math.max(0, latest.singleLegJump.lsi - 10)} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400">L: {cmToInches(latest.singleLegJump.leftHeightCm)} R: {cmToInches(latest.singleLegJump.rightHeightCm)}</td>
                </tr>
              )}
              {latest.laneAgility && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">Lane Agility</td>
                  <td className="text-center font-bold text-white print:text-black">{latest.laneAgility.timeSeconds}s</td>
                  <td className="text-center text-slate-500 print:text-gray-400">{bm.laneAgilitySeconds}s</td>
                  <td className="text-center"><ScoreDot score={Math.min(100, Math.round((bm.laneAgilitySeconds / latest.laneAgility.timeSeconds) * 100))} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400">{latest.laneAgility.notes}</td>
                </tr>
              )}
              {latest.sprint34 && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">3/4 Court Sprint</td>
                  <td className="text-center font-bold text-white print:text-black">{latest.sprint34.timeSeconds}s</td>
                  <td className="text-center text-slate-500 print:text-gray-400">{bm.sprint34Seconds}s</td>
                  <td className="text-center"><ScoreDot score={Math.min(100, Math.round((bm.sprint34Seconds / latest.sprint34.timeSeconds) * 100))} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400">{latest.sprint34.notes}</td>
                </tr>
              )}
              {latest.shuttle && (
                <tr>
                  <td className="py-2.5 text-slate-300 print:text-black">Reactive Shuttle</td>
                  <td className="text-center font-bold text-white print:text-black">{latest.shuttle.timeSeconds}s</td>
                  <td className="text-center text-slate-500 print:text-gray-400">{bm.shuttleSeconds}s</td>
                  <td className="text-center"><ScoreDot score={Math.min(100, Math.round((bm.shuttleSeconds / latest.shuttle.timeSeconds) * 100))} /></td>
                  <td className="text-slate-500 text-xs print:text-gray-400">{latest.shuttle.notes}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Injury flags */}
        {injuryFlags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-black text-red-500 uppercase tracking-widest mb-3">Risk Flags</h2>
            {injuryFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 text-red-400 text-sm mb-1.5 print:text-red-700">
                <span className="font-bold">!</span>{flag}
              </div>
            ))}
          </div>
        )}

        {/* Top recommendations */}
        <div className="mb-8">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 print:text-gray-400">Priority Recommendations</h2>
          <div className="space-y-3">
            {recommendations.filter(r => r.priority !== 'low').slice(0, 3).map((rec, i) => (
              <div key={i}>
                <div className="font-bold text-white text-sm print:text-black">{i + 1}. {rec.title}</div>
                <p className="text-slate-400 text-xs mt-0.5 print:text-gray-500">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-navy-600 print:border-gray-200 pt-4 flex items-center justify-between">
          <div className="text-slate-600 text-xs print:text-gray-400">
            LIFT Sports Management · Confidential
          </div>
          <div className="text-slate-600 text-xs print:text-gray-400">
            {athlete.name} · {sessionDate} · {athlete.position}
          </div>
        </div>
      </div>
    </div>
  )
}
