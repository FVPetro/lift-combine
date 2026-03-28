interface Props {
  size?: 'sm' | 'md' | 'lg'
}

export default function LiftLogo({ size = 'md' }: Props) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 48 : 36

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon mark */}
      <svg width={dim} height={dim} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Vertical bar of L */}
        <rect x="2" y="2" width="9" height="24" fill="white" rx="1.5" />
        {/* Horizontal bar of L */}
        <rect x="2" y="19" width="24" height="7" fill="white" rx="1.5" />
        {/* Cyan accent — top-right corner of L */}
        <rect x="15" y="2" width="11" height="11" fill="#22d3ee" rx="1.5" />
      </svg>

      {/* Wordmark */}
      <div>
        <div
          className={
            size === 'lg'
              ? 'text-2xl font-black tracking-tight text-white leading-none'
              : size === 'sm'
              ? 'text-base font-black tracking-tight text-white leading-none'
              : 'text-lg font-black tracking-tight text-white leading-none'
          }
        >
          LIFT
        </div>
        <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase leading-none mt-0.5">
          Basketball
        </div>
      </div>
    </div>
  )
}
