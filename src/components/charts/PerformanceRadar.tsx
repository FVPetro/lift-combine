import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts'
import { ScoreBreakdown } from '../../types'

interface Props {
  scores: ScoreBreakdown
  benchmarkScores?: ScoreBreakdown
}

const AXES = [
  { key: 'speed', label: 'SPEED' },
  { key: 'power', label: 'POWER' },
  { key: 'agility', label: 'AGILITY' },
  { key: 'mobility', label: 'MOBILITY' },
  { key: 'symmetry', label: 'SYMMETRY' },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800 border border-navy-600 rounded-xl px-3 py-2 text-xs shadow-xl">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function PerformanceRadar({ scores, benchmarkScores }: Props) {
  const data = AXES.map(({ key, label }) => ({
    axis: label,
    athlete: scores[key as keyof ScoreBreakdown],
    benchmark: benchmarkScores ? benchmarkScores[key as keyof ScoreBreakdown] : 75,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid
          gridType="polygon"
          stroke="rgba(255,255,255,0.07)"
          strokeDasharray="0"
        />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}
          tickLine={false}
        />
        {/* Benchmark polygon */}
        <Radar
          name="Position Avg"
          dataKey="benchmark"
          stroke="rgba(148,163,184,0.5)"
          fill="rgba(148,163,184,0.05)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
        {/* Athlete polygon */}
        <Radar
          name="Athlete"
          dataKey="athlete"
          stroke="#f97316"
          fill="rgba(249,115,22,0.18)"
          strokeWidth={2}
          dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
