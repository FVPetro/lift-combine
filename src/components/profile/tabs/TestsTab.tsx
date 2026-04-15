import { useState, useRef } from 'react'
import { Athlete, AssessmentSession, MovementAssessment, CMJData, CMJRep, ForceSymmetryData, JumpSymmetryData, TimedTest, ProAgilityData } from '../../../types'
import { useStore } from '../../../store/useStore'
import { OVERHEAD_SQUAT_FAULTS, SINGLE_LEG_SQUAT_FAULTS } from '../../../data/benchmarks'
import { scoreSession, getScoreBg, cmToInches, formatHeight } from '../../../utils/scoring'
import AsymmetryBar from '../../charts/AsymmetryBar'
import { Plus, ChevronDown, ChevronUp, Upload, X, CheckCircle2, Circle, Save, Trash2, Camera, Minus } from 'lucide-react'
import { BENCHMARKS } from '../../../data/benchmarks'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props { athlete: Athlete }

function SessionModal({ athleteId, onClose, onSave }: { athleteId: string; onClose: () => void; onSave: (s: AssessmentSession) => void }) {
  const [label, setLabel] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="card-glow p-6 w-full max-w-sm">
        <h3 className="font-bold text-white text-lg mb-4">New Assessment Session</h3>
        <div className="space-y-3">
          <div>
            <label className="label">Session Label</label>
            <input value={label} onChange={e => setLabel(e.target.value)} className="input-field" placeholder="e.g. Pre-Draft Combine, 6-Week Retest" autoFocus />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            disabled={!label}
            onClick={() => {
              onSave({ id: `s${Date.now()}`, athleteId, date, label, })
              onClose()
            }}
            className="btn-primary flex-1"
          >Create</button>
        </div>
      </div>
    </div>
  )
}

// ---- Movement Assessment Module (Overhead Squat / SL Squat) ----
function MovementModule({
  title, faultList, data, onSave,
}: { title: string; faultList: string[]; data?: MovementAssessment; onSave: (d: MovementAssessment) => void }) {
  const [open, setOpen] = useState(false)
  const [faults, setFaults] = useState<string[]>(data?.faults ?? [])
  const [notes, setNotes] = useState(data?.notes ?? '')
  const [images, setImages] = useState<string[]>(data?.images ?? [])
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleFault = (f: string) =>
    setFaults(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target!.result as string])
      reader.readAsDataURL(file)
    })
  }

  const save = () => { onSave({ faults, notes, images }); setOpen(false) }
  const isComplete = data !== undefined

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 hover:bg-navy-700/40 transition-colors">
        <div className="flex items-center gap-3">
          {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />}
          <div className="text-left">
            <div className="font-semibold text-white text-sm">{title}</div>
            {isComplete && <div className="text-xs text-slate-500 mt-0.5">{data.faults.length} fault{data.faults.length !== 1 ? 's' : ''} identified</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full border',
              data.faults.length === 0 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
              data.faults.length <= 2 ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' :
              'bg-red-500/15 border-red-500/30 text-red-400'
            )}>
              {data.faults.length === 0 ? 'PASS' : `${data.faults.length} FAULT${data.faults.length > 1 ? 'S' : ''}`}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-navy-700">
          {/* Faults */}
          <div className="pt-3">
            <label className="label">Movement Faults</label>
            <div className="grid grid-cols-1 gap-1.5">
              {faultList.map(fault => (
                <label key={fault} className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors',
                  faults.includes(fault) ? 'bg-red-500/15 border border-red-500/30' : 'bg-navy-900 border border-transparent hover:border-navy-600'
                )}>
                  <input type="checkbox" checked={faults.includes(fault)} onChange={() => toggleFault(fault)} className="hidden" />
                  <div className={clsx('w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors',
                    faults.includes(fault) ? 'bg-red-500' : 'bg-navy-700 border border-navy-600'
                  )}>
                    {faults.includes(fault) && <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={clsx('text-sm', faults.includes(fault) ? 'text-red-300' : 'text-slate-400')}>{fault}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Clinical Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-field resize-none text-sm" placeholder="Observations, compensations, context..." />
          </div>

          {/* Images */}
          <div>
            <label className="label">Upload Images / VALD Screenshots</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-900">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-navy-600 hover:border-brand flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-brand transition-colors">
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-semibold">ADD</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImage} className="hidden" />
            </div>
          </div>

          <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Assessment
          </button>
        </div>
      )}
    </div>
  )
}

// ---- CMJ Module ----
function CMJModule({ data, onSave }: { data?: CMJData; onSave: (d: CMJData) => void }) {
  const [open, setOpen] = useState(false)
  const [vals, setVals] = useState<Partial<CMJData>>(data ?? {})
  const [notes, setNotes] = useState(data?.notes ?? '')
  const [images, setImages] = useState<string[]>(data?.images ?? [])
  const [reps, setReps] = useState<CMJRep[]>(data?.reps ?? [{ rep: 1 }])
  const fileRef = useRef<HTMLInputElement>(null)

  const n = (k: keyof CMJData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVals(prev => ({ ...prev, [k]: parseFloat(e.target.value) || 0 }))

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target!.result as string])
      reader.readAsDataURL(file)
    })
  }

  const updateRep = (i: number, field: 'conPeakForcePct' | 'eccPeakForcePct', val: string) => {
    setReps(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: parseFloat(val) || undefined } : r))
  }

  const addRep = () => setReps(prev => [...prev, { rep: prev.length + 1 }])
  const removeRep = (i: number) => setReps(prev => prev.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, rep: idx + 1 })))

  const avg = (field: 'conPeakForcePct' | 'eccPeakForcePct') => {
    const vs = reps.map(r => r[field]).filter((v): v is number => v != null && v > 0)
    return vs.length ? (vs.reduce((a, b) => a + b, 0) / vs.length).toFixed(1) : '—'
  }

  const save = () => {
    onSave({ ...vals as CMJData, notes, images, reps })
    setOpen(false)
  }

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 hover:bg-navy-700/40 transition-colors">
        <div className="flex items-center gap-3">
          {data ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />}
          <div className="text-left">
            <div className="font-semibold text-white text-sm">CMJ — ForceDecks</div>
            {data && <div className="text-xs text-slate-500 mt-0.5">
              {cmToInches(data.jumpHeightCm)} jump · {data.asymmetryPct.toFixed(1)}% asym
              {data.peakPowerWkg ? <span className="ml-1 text-brand">· {data.peakPowerWkg} W/kg</span> : null}
              {data.rsi ? <span className="ml-1 text-cyan-400">· RSI {data.rsi}</span> : null}
              {data.reps?.length ? <span className="ml-1 text-emerald-400">· {data.reps.length} reps</span> : null}
            </div>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-navy-700 pt-3">

          {/* Summary fields */}
          <div className="grid grid-cols-2 gap-3">
            {([
              ['jumpHeightCm', 'Jump Height (cm)', '72.4'],
              ['rsiModified', 'RSI-Modified', '0.42'],
              ['asymmetryPct', 'Asymmetry Index (%)', '6.5'],
              ['peakPowerW', 'Peak Power (W)', '4200'],
              ['flightTimeMs', 'Flight Time (ms)', '610'],
              ['contractionTimeMs', 'Contraction Time (ms)', '800'],
            ] as [keyof CMJData, string, string][]).map(([k, label, ph]) => (
              <div key={k}>
                <label className="label text-[10px]">{label}</label>
                <input type="number" step="0.01" placeholder={ph}
                  value={(vals[k] as number) || ''} onChange={n(k)} className="input-field text-sm py-2" />
              </div>
            ))}
          </div>

          {/* ForceDecks Performance Metrics */}
          <div className="bg-navy-900 rounded-xl p-3 space-y-3">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ForceDecks Performance</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-[10px]">Power Output (W/kg)</label>
                <input type="number" step="0.1" placeholder="e.g. 60"
                  value={(vals.peakPowerWkg as number) || ''}
                  onChange={e => setVals(prev => ({ ...prev, peakPowerWkg: parseFloat(e.target.value) || undefined }))}
                  className="input-field text-sm py-2" />
              </div>
              <div>
                <label className="label text-[10px]">RSI Score</label>
                <input type="number" step="0.01" placeholder="e.g. 1.0"
                  value={(vals.rsi as number) || ''}
                  onChange={e => setVals(prev => ({ ...prev, rsi: parseFloat(e.target.value) || undefined }))}
                  className="input-field text-sm py-2" />
              </div>
            </div>
            <div>
              <label className="label text-[10px]">Force Production Speed (RFD Category)</label>
              <input type="text" placeholder="e.g. Above Average, Strong, Elite"
                value={(vals.rfdLabel as string) || ''}
                onChange={e => setVals(prev => ({ ...prev, rfdLabel: e.target.value || undefined }))}
                className="input-field text-sm py-2" />
            </div>
          </div>

          {/* Per-rep force inputs */}
          <div className="bg-navy-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-navy-700">
              <span className="text-xs font-bold text-white">Per-Rep Force Data</span>
              <button onClick={addRep} className="flex items-center gap-1 text-[11px] text-brand hover:text-brand/80 font-semibold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Rep
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-navy-800">
                    <th className="px-3 py-2 text-left w-10">Rep</th>
                    <th className="px-3 py-2 text-right">Con. Peak Force (%)</th>
                    <th className="px-3 py-2 text-right">Ecc. Peak Force (%)</th>
                    <th className="px-3 py-2 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {reps.map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-bold text-white">{r.rep}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number" step="0.1" placeholder="e.g. 2.1"
                          value={r.conPeakForcePct ?? ''}
                          onChange={e => updateRep(i, 'conPeakForcePct', e.target.value)}
                          className="input-field text-sm py-1 text-right w-full"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number" step="0.1" placeholder="e.g. 6.6"
                          value={r.eccPeakForcePct ?? ''}
                          onChange={e => updateRep(i, 'eccPeakForcePct', e.target.value)}
                          className="input-field text-sm py-1 text-right w-full"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => removeRep(i)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Averages row */}
                  <tr className="bg-navy-800 text-[11px] font-bold text-white">
                    <td className="px-3 py-2">AVG</td>
                    <td className="px-3 py-2 text-right text-emerald-400">{avg('conPeakForcePct')}%</td>
                    <td className="px-3 py-2 text-right text-emerald-400">{avg('eccPeakForcePct')}%</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SD and CoV */}
            <div className="border-t border-navy-700 px-3 py-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Con. Peak Force</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label text-[10px]">SD</label>
                    <input type="number" step="0.1" placeholder="e.g. 2"
                      value={(vals.conPeakForceSD) || ''}
                      onChange={e => setVals(prev => ({ ...prev, conPeakForceSD: parseFloat(e.target.value) || undefined }))}
                      className="input-field text-sm py-1" />
                  </div>
                  <div>
                    <label className="label text-[10px]">CoV (%)</label>
                    <input type="number" step="0.1" placeholder="e.g. 203"
                      value={(vals.conPeakForceCoV) || ''}
                      onChange={e => setVals(prev => ({ ...prev, conPeakForceCoV: parseFloat(e.target.value) || undefined }))}
                      className="input-field text-sm py-1" />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Ecc. Peak Force</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label text-[10px]">SD</label>
                    <input type="number" step="0.1" placeholder="e.g. 6"
                      value={(vals.eccPeakForceSD) || ''}
                      onChange={e => setVals(prev => ({ ...prev, eccPeakForceSD: parseFloat(e.target.value) || undefined }))}
                      className="input-field text-sm py-1" />
                  </div>
                  <div>
                    <label className="label text-[10px]">CoV (%)</label>
                    <input type="number" step="0.1" placeholder="e.g. 96"
                      value={(vals.eccPeakForceCoV) || ''}
                      onChange={e => setVals(prev => ({ ...prev, eccPeakForceCoV: parseFloat(e.target.value) || undefined }))}
                      className="input-field text-sm py-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes / VALD Summary</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-field resize-none text-sm" />
          </div>

          {/* Chart upload */}
          <div>
            <label className="label">Upload VALD Graphs / Screenshots</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-900">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-navy-600 hover:border-brand flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-brand transition-colors">
                <Upload className="w-5 h-5" /><span className="text-[9px] font-semibold">UPLOAD</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple onChange={handleImage} className="hidden" />
            </div>
          </div>

          {data && (
            <div className="bg-navy-900 rounded-xl p-3">
              <AsymmetryBar leftValue={vals.conPeakForceN ? vals.conPeakForceN * (1 - (vals.asymmetryPct ?? 0) / 200) : 0}
                rightValue={vals.conPeakForceN ? vals.conPeakForceN * (1 + (vals.asymmetryPct ?? 0) / 200) : 0}
                asymmetryPct={vals.asymmetryPct ?? 0} unit="N" />
            </div>
          )}

          <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save CMJ Data
          </button>
        </div>
      )}
    </div>
  )
}

// ---- Force Symmetry Module (SL Hip / SL Jump) ----
function ForceSymModule({ title, subtitle, data, onSave, isJump }: {
  title: string; subtitle: string; data?: ForceSymmetryData | JumpSymmetryData; onSave: (d: any) => void; isJump?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [vals, setVals] = useState<Record<string, number>>(
    data ? Object.fromEntries(Object.entries(data).filter(([, v]) => typeof v === 'number').map(([k, v]) => [k, v as number])) : {}
  )
  const [notes, setNotes] = useState((data as any)?.notes ?? '')
  const [images, setImages] = useState<string[]>((data as any)?.images ?? [])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target!.result as string])
      reader.readAsDataURL(file)
    })
  }

  const fields: [string, string, string][] = isJump
    ? [['leftHeightCm', 'Left Hop Height (cm)', '44'], ['rightHeightCm', 'Right Hop Height (cm)', '46'], ['leftRSIMod', 'Left RSI-Mod', '0.38'], ['rightRSIMod', 'Right RSI-Mod', '0.41'], ['leftMeanRSI', 'Left Mean RSI (Flight/Contact)', '0.42'], ['rightMeanRSI', 'Right Mean RSI (Flight/Contact)', '0.44'], ['lsi', 'Limb Symmetry Index (%)', '95.6']]
    : [['leftForceN', 'Left Force (N)', '320'], ['rightForceN', 'Right Force (N)', '340'], ['asymmetryPct', 'Asymmetry (%)', '6.3']]

  const isComplete = data !== undefined
  const leftVal = isJump ? (vals.leftHeightCm ?? 0) : (vals.leftForceN ?? 0)
  const rightVal = isJump ? (vals.rightHeightCm ?? 0) : (vals.rightForceN ?? 0)
  const asymPct = isJump ? (100 - (vals.lsi ?? 100)) : (vals.asymmetryPct ?? 0)

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 hover:bg-navy-700/40 transition-colors">
        <div className="flex items-center gap-3">
          {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />}
          <div className="text-left">
            <div className="font-semibold text-white text-sm">{title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{isComplete ? subtitle : 'Not yet assessed'}</div>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-navy-700 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(([k, label, ph]) => (
              <div key={k} className={k === 'lsi' || k === 'asymmetryPct' ? 'col-span-2' : ''}>
                <label className="label text-[10px]">{label}</label>
                <input type="number" step="0.01" placeholder={ph}
                  value={vals[k] || ''} onChange={e => setVals(prev => ({ ...prev, [k]: parseFloat(e.target.value) || 0 }))}
                  className="input-field text-sm py-2" />
              </div>
            ))}
          </div>
          {(leftVal > 0 && rightVal > 0) && (
            <div className="bg-navy-900 rounded-xl p-3">
              <AsymmetryBar leftValue={leftVal} rightValue={rightVal} asymmetryPct={asymPct}
                unit={isJump ? 'cm' : 'N'} />
            </div>
          )}
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-field resize-none text-sm" />
          </div>
          <div>
            <label className="label">Upload VALD Graphs</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-900">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-navy-600 hover:border-brand flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-brand transition-colors">
                <Upload className="w-5 h-5" /><span className="text-[9px] font-semibold">UPLOAD</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImage} className="hidden" />
            </div>
          </div>
          <button onClick={() => { onSave({ ...vals, notes, images }); setOpen(false) }} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      )}
    </div>
  )
}

// ---- Pro Agility Module (L/R split) ----
function ProAgilityModule({ data, onSave }: { data?: ProAgilityData; onSave: (d: ProAgilityData) => void }) {
  const [open, setOpen] = useState(false)
  const [right, setRight] = useState(data?.rightTimeSeconds?.toString() ?? '')
  const [left, setLeft] = useState(data?.leftTimeSeconds?.toString() ?? '')
  const [notes, setNotes] = useState(data?.notes ?? '')
  const [images, setImages] = useState<string[]>(data?.images ?? [])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target!.result as string])
      reader.readAsDataURL(file)
    })
  }

  const isComplete = data !== undefined
  const r = parseFloat(right)
  const l = parseFloat(left)
  const avg = r > 0 && l > 0 ? ((r + l) / 2).toFixed(2) : null
  const diff = r > 0 && l > 0 ? Math.abs(r - l).toFixed(3) : null

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 hover:bg-navy-700/40 transition-colors">
        <div className="flex items-center gap-3">
          {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />}
          <div className="text-left">
            <div className="font-semibold text-white text-sm">Pro Agility (5-10-5)</div>
            {isComplete
              ? <div className="text-xs text-slate-500 mt-0.5">R: {data.rightTimeSeconds}s · L: {data.leftTimeSeconds}s</div>
              : <div className="text-xs text-slate-500 mt-0.5">Laser timing gate · Right & Left</div>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-navy-700 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Right Start (sec)</label>
              <input type="number" step="0.001" value={right} onChange={e => setRight(e.target.value)}
                className="input-field text-xl font-bold text-center" placeholder="0.000" />
            </div>
            <div>
              <label className="label">Left Start (sec)</label>
              <input type="number" step="0.001" value={left} onChange={e => setLeft(e.target.value)}
                className="input-field text-xl font-bold text-center" placeholder="0.000" />
            </div>
          </div>
          {avg && (
            <div className="bg-navy-900 rounded-xl px-4 py-3 flex justify-between text-xs">
              <div className="text-center">
                <div className="text-slate-500 mb-0.5">Average</div>
                <div className="font-black text-white text-base">{avg}s</div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-0.5">Difference</div>
                <div className={clsx('font-black text-base', parseFloat(diff!) <= 0.1 ? 'text-emerald-400' : parseFloat(diff!) <= 0.2 ? 'text-yellow-400' : 'text-red-400')}>
                  {diff}s
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 mb-0.5">Better Side</div>
                <div className="font-black text-brand text-base">{r <= l ? 'Right' : 'Left'}</div>
              </div>
            </div>
          )}
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-field resize-none text-sm" />
          </div>
          <div>
            <label className="label">Upload Laser System Screenshots</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-900">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-navy-600 hover:border-brand flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-brand transition-colors">
                <Upload className="w-5 h-5" /><span className="text-[9px] font-semibold">UPLOAD</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImage} className="hidden" />
            </div>
          </div>
          <button
            disabled={!right || !left}
            onClick={() => { onSave({ rightTimeSeconds: parseFloat(right), leftTimeSeconds: parseFloat(left), notes, images }); setOpen(false) }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Pro Agility
          </button>
        </div>
      )}
    </div>
  )
}

// ---- Timed Test Module ----
function TimedModule({ title, subtitle, data, onSave, benchmark }: {
  title: string; subtitle: string; data?: TimedTest; onSave: (d: TimedTest) => void; benchmark?: number
}) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(data?.timeSeconds?.toString() ?? '')
  const [notes, setNotes] = useState(data?.notes ?? '')
  const [images, setImages] = useState<string[]>(data?.images ?? [])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target!.result as string])
      reader.readAsDataURL(file)
    })
  }

  const isComplete = data !== undefined
  const t = parseFloat(time)
  const vsAvg = benchmark && t > 0 ? ((benchmark / t) * 100).toFixed(0) : null

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 hover:bg-navy-700/40 transition-colors">
        <div className="flex items-center gap-3">
          {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />}
          <div className="text-left">
            <div className="font-semibold text-white text-sm">{title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{isComplete ? `${data.timeSeconds}s` : subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && benchmark && (
            <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full border', getScoreBg(parseFloat(vsAvg!)))}>
              {data.timeSeconds <= benchmark ? 'ELITE' : `${((benchmark / data.timeSeconds) * 100).toFixed(0)}%`}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-navy-700 pt-3">
          <div>
            <label className="label">Time (seconds)</label>
            <input type="number" step="0.001" value={time} onChange={e => setTime(e.target.value)} className="input-field text-2xl font-bold text-center" placeholder="0.000" />
            {benchmark && t > 0 && (
              <div className="text-center mt-1.5 text-xs text-slate-500">
                Position avg: <span className="text-white font-semibold">{benchmark}s</span>
                {t <= benchmark
                  ? <span className="text-emerald-400 ml-2 font-bold">✓ BEATS BENCHMARK by {(benchmark - t).toFixed(3)}s</span>
                  : <span className="text-orange-400 ml-2">+{(t - benchmark).toFixed(3)}s off benchmark</span>}
              </div>
            )}
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-field resize-none text-sm" />
          </div>
          <div>
            <label className="label">Upload Laser System Screenshots</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-900">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-navy-600 hover:border-brand flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-brand transition-colors">
                <Upload className="w-5 h-5" /><span className="text-[9px] font-semibold">UPLOAD</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImage} className="hidden" />
            </div>
          </div>
          <button
            disabled={!time}
            onClick={() => { onSave({ timeSeconds: parseFloat(time), notes, images }); setOpen(false) }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      )}
    </div>
  )
}

// ---- Main Tests Tab ----
export default function TestsTab({ athlete }: Props) {
  const { sessions, position, id: athleteId } = athlete
  const addSession = useStore(s => s.addSession)
  const updateSession = useStore(s => s.updateSession)
  const deleteSession = useStore(s => s.deleteSession)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    sessions.length ? sessions[sessions.length - 1].id : null
  )
  const [showModal, setShowModal] = useState(false)
  const bm = BENCHMARKS[position]

  const active = sessions.find(s => s.id === activeSessionId)
  const upd = (partial: Partial<AssessmentSession>) =>
    active && updateSession(athleteId, active.id, partial)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Session selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {sessions.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSessionId(s.id)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
              activeSessionId === s.id
                ? 'bg-brand border-brand text-white'
                : 'border-navy-600 text-slate-400 hover:text-white hover:border-navy-500 bg-navy-800'
            )}
          >
            {s.label} <span className="text-[10px] opacity-60 ml-1">{format(new Date(s.date), 'MMM d')}</span>
          </button>
        ))}
        <button onClick={() => setShowModal(true)} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3">
          <Plus className="w-3.5 h-3.5" /> New Session
        </button>
      </div>

      {!active ? (
        <div className="text-center py-20 text-slate-500">
          <Plus className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Create a session to start entering test data.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Session header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-lg">{active.label}</h2>
              <div className="text-slate-500 text-sm">{format(new Date(active.date), 'MMMM d, yyyy')}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={clsx('text-sm font-bold px-3 py-1.5 rounded-xl border', getScoreBg(scoreSession(active, position).overall))}>
                {scoreSession(active, position).overall} Overall
              </div>
              <button
                onClick={() => { if (confirm('Delete this session?')) { deleteSession(athleteId, active.id); setActiveSessionId(sessions.find(s => s.id !== active.id)?.id ?? null) } }}
                className="btn-ghost p-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Movement screens */}
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider px-1">Movement Screens</div>
              <MovementModule title="Overhead Squat Assessment" faultList={OVERHEAD_SQUAT_FAULTS}
                data={active.overheadSquat} onSave={d => upd({ overheadSquat: d })} />
              <MovementModule title="Single Leg Squat Assessment" faultList={SINGLE_LEG_SQUAT_FAULTS}
                data={active.singleLegSquat} onSave={d => upd({ singleLegSquat: d })} />
            </div>

            {/* ForceDecks tests */}
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider px-1">ForceDecks Tests</div>
              <CMJModule data={active.cmj} onSave={d => upd({ cmj: d })} />
              <ForceSymModule title="Single Leg Hip (ForceDecks)" subtitle="ForceDecks isometric hip test"
                data={active.singleLegHip} onSave={d => upd({ singleLegHip: d })} />
              <ForceSymModule title="Single Leg Hop (ForceDecks)" subtitle="LSI & height symmetry"
                data={active.singleLegJump} onSave={d => upd({ singleLegJump: d })} isJump />
            </div>

            {/* Laser tests */}
            <div className="space-y-2 lg:col-span-2">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider px-1">Laser Timing Tests</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TimedModule title="3/4 Court Sprint" subtitle="Laser timing gate" data={active.sprint34}
                  onSave={d => upd({ sprint34: d })} benchmark={bm.sprint34Seconds} />
                <ProAgilityModule data={active.proAgility} onSave={d => upd({ proAgility: d })} />
                <TimedModule title="Lane Agility" subtitle="Laser timing gate" data={active.laneAgility}
                  onSave={d => upd({ laneAgility: d })} benchmark={bm.laneAgilitySeconds} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <SessionModal
          athleteId={athleteId}
          onClose={() => setShowModal(false)}
          onSave={s => {
            addSession(athleteId, s)
            setActiveSessionId(s.id)
          }}
        />
      )}
    </div>
  )
}
