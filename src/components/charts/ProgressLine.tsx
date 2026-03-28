import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'

interface DataPoint {
  date: string
  value: number
  label: string
}

interface Props {
  data: DataPoint[]
  benchmark?: number
  unit?: string
  lowerIsBetter?: boolean
  color?: string
}

const CustomTooltip = ({ active, payload, label, unit, lowerIsBetter }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value
    return (
      <div className="bg-navy-800 border border-navy-600 rounded-xl px-3 py-2 text-xs shadow-xl">
        <div className="text-slate-400 mb-1">{payload[0].payload.label}</div>
        <div className="text-white font-bold text-base">{val}{unit}</div>
      </div>
    )
  }
  return null
}

export default function ProgressLine({ data, benchmark, unit = '', lowerIsBetter = false, color = '#f97316' }: Props) {
  if (data.length === 0) return (
    <div className="h-32 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
  )

  const values = data.map(d => d.value)
  const min = Math.min(...values, benchmark ?? Infinity) * (lowerIsBetter ? 0.97 : 0.93)
  const max = Math.max(...values, benchmark ?? -Infinity) * 1.05

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={d => format(new Date(d), 'MMM d')}
          tick={{ fill: '#64748b', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[min, max]}
          tick={{ fill: '#64748b', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => v >= 10 ? v.toFixed(1) : v.toFixed(2)}
          width={32}
        />
        {benchmark && (
          <ReferenceLine
            y={benchmark}
            stroke="rgba(148,163,184,0.4)"
            strokeDasharray="4 4"
            label={{ value: 'Avg', fill: '#64748b', fontSize: 9 }}
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ fill: color, r: 6, strokeWidth: 2, stroke: 'rgba(249,115,22,0.4)' }}
        />
        <Tooltip content={<CustomTooltip unit={unit} lowerIsBetter={lowerIsBetter} />} />
      </LineChart>
    </ResponsiveContainer>
  )
}
