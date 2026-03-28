interface Props {
  leftValue: number
  rightValue: number
  leftLabel?: string
  rightLabel?: string
  unit?: string
  asymmetryPct: number
}

export default function AsymmetryBar({
  leftValue,
  rightValue,
  leftLabel = 'LEFT',
  rightLabel = 'RIGHT',
  unit = 'N',
  asymmetryPct,
}: Props) {
  const total = leftValue + rightValue
  const leftPct = (leftValue / total) * 100
  const rightPct = (rightValue / total) * 100

  const asymColor =
    asymmetryPct <= 5 ? '#22c55e' :
    asymmetryPct <= 10 ? '#eab308' :
    asymmetryPct <= 15 ? '#f97316' : '#ef4444'

  const weakSide = leftValue < rightValue ? 'L' : 'R'

  return (
    <div className="space-y-2">
      {/* Labels */}
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-300">{leftLabel}</span>
        <span className="text-slate-300">{rightLabel}</span>
      </div>

      {/* Bar */}
      <div className="relative h-5 rounded-full overflow-hidden bg-navy-900 flex">
        <div
          className="h-full rounded-l-full transition-all duration-700"
          style={{ width: `${leftPct}%`, background: leftValue < rightValue ? '#ef4444' : '#22c55e' }}
        />
        <div className="w-0.5 bg-navy-800 z-10 flex-shrink-0" />
        <div
          className="h-full rounded-r-full transition-all duration-700 flex-1"
          style={{ background: rightValue < leftValue ? '#ef4444' : '#22c55e' }}
        />
        {/* Center marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2" />
      </div>

      {/* Values */}
      <div className="flex justify-between text-xs">
        <span className="font-bold text-white">{leftValue.toFixed(0)}<span className="text-slate-500 font-normal ml-0.5">{unit}</span></span>
        <div className="text-center">
          <span className="font-black text-xs" style={{ color: asymColor }}>{asymmetryPct.toFixed(1)}%</span>
          <span className="text-slate-600 text-[10px] ml-1">asym</span>
          {asymmetryPct > 10 && (
            <span className="ml-1 text-[10px] font-bold" style={{ color: asymColor }}>({weakSide} weak)</span>
          )}
        </div>
        <span className="font-bold text-white">{rightValue.toFixed(0)}<span className="text-slate-500 font-normal ml-0.5">{unit}</span></span>
      </div>
    </div>
  )
}
