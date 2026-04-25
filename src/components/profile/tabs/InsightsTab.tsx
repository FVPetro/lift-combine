import { useState } from 'react'
import { Athlete, Recommendation, WarmupExercise } from '../../../types'
import { generateRecommendations } from '../../../utils/recommendations'
import { getScoreColor, getScoreBg, getScoreLabel } from '../../../utils/scoring'
import { useStore } from '../../../store/useStore'
import PerformanceRadar from '../../charts/PerformanceRadar'
import {
  Zap, Shield, Wind, Move, Flame, Heart, AlertTriangle, ChevronRight,
  Dumbbell, Clock, Pill, Apple, Sunrise, Pencil, X, Plus, Check, RotateCcw
} from 'lucide-react'
import clsx from 'clsx'

interface Props { athlete: Athlete }

const CATEGORY_ICONS: Record<string, any> = {
  speed: Wind, power: Zap, agility: Move, mobility: Flame, symmetry: Shield, recovery: Heart,
}
const CATEGORY_COLORS: Record<string, string> = {
  speed: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  power: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
  agility: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
  mobility: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  symmetry: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  recovery: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
}
const PRIORITY_STYLES = {
  high: 'bg-red-500/15 border-red-500/40 text-red-300',
  medium: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
  low: 'bg-slate-500/15 border-slate-500/40 text-slate-300',
}

export default function InsightsTab({ athlete }: Props) {
  const updateAthlete = useStore(s => s.updateAthlete)
  const { sessions, position } = athlete

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No data to analyze yet</p>
        <p className="text-sm mt-1">Complete at least one assessment session to generate insights.</p>
      </div>
    )
  }

  const latest = sessions[sessions.length - 1]
  const { scores, recommendations, warmup: autoWarmup, supplements, injuryFlags } = generateRecommendations(athlete, latest)

  const domainLabels: [keyof typeof scores, string][] = [
    ['speed', 'Speed'], ['power', 'Power'], ['agility', 'Agility'],
    ['mobility', 'Mobility'], ['symmetry', 'Symmetry'],
  ]

  // ── Exercise editing state ──────────────────────────────────────────────
  const [editingEx, setEditingEx] = useState(false)
  const [exMap, setExMap] = useState<Record<string, string[]>>(
    () => athlete.customInsights?.exercises ?? {}
  )
  const [addExInput, setAddExInput] = useState<Record<string, string>>({})

  const getExercises = (rec: Recommendation): string[] =>
    exMap[rec.title] !== undefined ? exMap[rec.title] : rec.exercises

  const persistExMap = (next: Record<string, string[]>) => {
    setExMap(next)
    updateAthlete(athlete.id, {
      customInsights: { ...athlete.customInsights, exercises: next },
    })
  }

  const removeExercise = (title: string, idx: number) => {
    const current = getExercises(recommendations.find(r => r.title === title)!)
    persistExMap({ ...exMap, [title]: current.filter((_, i) => i !== idx) })
  }

  const addExercise = (title: string) => {
    const val = (addExInput[title] ?? '').trim()
    if (!val) return
    const current = getExercises(recommendations.find(r => r.title === title)!)
    persistExMap({ ...exMap, [title]: [...current, val] })
    setAddExInput(prev => ({ ...prev, [title]: '' }))
  }

  const resetExercises = () => {
    const cleared: Record<string, string[]> = {}
    persistExMap(cleared)
  }

  // ── Warmup editing state ────────────────────────────────────────────────
  const [editingWarmup, setEditingWarmup] = useState(false)
  const [localWarmup, setLocalWarmup] = useState<WarmupExercise[]>(
    () => athlete.customInsights?.warmup ?? autoWarmup
  )
  const [newName, setNewName] = useState('')
  const [newSets, setNewSets] = useState('2')
  const [newDuration, setNewDuration] = useState('')

  const persistWarmup = (next: WarmupExercise[]) => {
    setLocalWarmup(next)
    updateAthlete(athlete.id, {
      customInsights: { ...athlete.customInsights, warmup: next },
    })
  }

  const removeWarmup = (idx: number) => persistWarmup(localWarmup.filter((_, i) => i !== idx))

  const addWarmup = () => {
    if (!newName.trim() || !newDuration.trim()) return
    persistWarmup([...localWarmup, { name: newName.trim(), sets: newSets, duration: newDuration.trim() }])
    setNewName('')
    setNewSets('2')
    setNewDuration('')
  }

  const resetWarmup = () => {
    setLocalWarmup(autoWarmup)
    updateAthlete(athlete.id, {
      customInsights: { ...athlete.customInsights, warmup: undefined },
    })
  }

  const isExCustomized = Object.keys(exMap).length > 0
  const isWarmupCustomized = athlete.customInsights?.warmup !== undefined

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Risk Flags */}
      {injuryFlags.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            {injuryFlags.length} Risk Flag{injuryFlags.length > 1 ? 's' : ''} Detected
          </div>
          {injuryFlags.map((flag, i) => (
            <div key={i} className="flex items-start gap-2 text-red-300 text-sm">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {flag}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar + scores */}
        <div className="card p-5">
          <h3 className="font-bold text-white text-sm mb-3">Performance Profile vs. {position} Average</h3>
          <PerformanceRadar scores={scores} />
          <div className="grid grid-cols-5 gap-2 mt-3">
            {domainLabels.map(([key, label]) => {
              const val = scores[key]
              return (
                <div key={key} className="text-center">
                  <div className={clsx('text-xl font-black', getScoreColor(val))}>{val || '—'}</div>
                  <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Priority focus areas */}
        <div className="card p-5">
          <h3 className="font-bold text-white text-sm mb-3">
            Priority Focus Areas
            <span className="text-slate-500 font-normal ml-2 text-xs">— auto-generated from test data</span>
          </h3>
          <div className="space-y-3">
            {recommendations.filter(r => r.priority !== 'low').slice(0, 4).map((rec, i) => {
              const Icon = CATEGORY_ICONS[rec.category]
              return (
                <div key={i} className="bg-navy-900 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border', CATEGORY_COLORS[rec.category])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{rec.title}</span>
                        <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border', PRIORITY_STYLES[rec.priority])}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            {recommendations.filter(r => r.priority !== 'low').length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">
                All domains performing at or above benchmark. Maintain current programming.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Exercise Prescriptions ─────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-white text-sm">Exercise Prescription</h3>
            {isExCustomized && !editingEx && (
              <span className="text-[10px] bg-brand/20 border border-brand/30 text-brand px-2 py-0.5 rounded-full font-bold">CUSTOMIZED</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {editingEx && isExCustomized && (
              <button
                onClick={resetExercises}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to auto
              </button>
            )}
            <button
              onClick={() => setEditingEx(e => !e)}
              className={clsx(
                'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all',
                editingEx
                  ? 'bg-brand border-brand text-white'
                  : 'border-navy-600 text-slate-400 hover:text-white hover:border-navy-500'
              )}
            >
              {editingEx
                ? <><Check className="w-3.5 h-3.5" /> Done</>
                : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => {
            const Icon = CATEGORY_ICONS[rec.category]
            const exercises = getExercises(rec)
            const inputVal = addExInput[rec.title] ?? ''
            return (
              <div key={i} className="bg-navy-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={clsx('w-4 h-4', CATEGORY_COLORS[rec.category].split(' ')[0])} />
                  <span className="font-bold text-white text-xs uppercase tracking-wide flex-1">{rec.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {exercises.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-400 group">
                      {editingEx ? (
                        <button
                          onClick={() => removeExercise(rec.title, j)}
                          className="w-4 h-4 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                        >
                          <X className="w-2.5 h-2.5 text-red-400" />
                        </button>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-navy-700 flex items-center justify-center text-[9px] font-bold text-slate-500 flex-shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                      )}
                      <span className={clsx(editingEx && 'text-slate-300')}>{ex}</span>
                    </li>
                  ))}
                  {exercises.length === 0 && (
                    <li className="text-xs text-slate-600 italic">No exercises — add one below</li>
                  )}
                </ul>

                {/* Add exercise input */}
                {editingEx && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={e => setAddExInput(prev => ({ ...prev, [rec.title]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addExercise(rec.title)}
                      placeholder="Add exercise..."
                      className="input-field text-xs py-1.5 flex-1 min-w-0"
                    />
                    <button
                      onClick={() => addExercise(rec.title)}
                      disabled={!inputVal.trim()}
                      className="w-8 h-8 rounded-xl bg-brand/20 hover:bg-brand/40 border border-brand/30 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Warmup Protocol ────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-white text-sm">Individualized Warmup Protocol</h3>
            <span className="text-slate-500 text-xs">~12-15 min</span>
            {isWarmupCustomized && !editingWarmup && (
              <span className="text-[10px] bg-brand/20 border border-brand/30 text-brand px-2 py-0.5 rounded-full font-bold">CUSTOMIZED</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {editingWarmup && isWarmupCustomized && (
              <button
                onClick={resetWarmup}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to auto
              </button>
            )}
            <button
              onClick={() => setEditingWarmup(e => !e)}
              className={clsx(
                'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all',
                editingWarmup
                  ? 'bg-brand border-brand text-white'
                  : 'border-navy-600 text-slate-400 hover:text-white hover:border-navy-500'
              )}
            >
              {editingWarmup
                ? <><Check className="w-3.5 h-3.5" /> Done</>
                : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {localWarmup.map((ex, i) => (
            <div key={i} className="flex items-center gap-4 bg-navy-900 rounded-xl px-4 py-3">
              {editingWarmup ? (
                <button
                  onClick={() => removeWarmup(i)}
                  className="w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-[11px] font-black text-brand flex-shrink-0">
                  {i + 1}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{ex.name}</span>
                  {ex.notes?.includes('Priority') && (
                    <span className="text-[10px] bg-orange-500/20 border border-orange-500/30 text-orange-400 px-2 py-0.5 rounded-full font-bold">PRIORITY</span>
                  )}
                </div>
                {ex.notes && !ex.notes.includes('Priority') && (
                  <div className="text-slate-500 text-xs mt-0.5">{ex.notes}</div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white text-xs font-semibold">{ex.sets} × {ex.duration}</div>
              </div>
            </div>
          ))}

          {localWarmup.length === 0 && (
            <div className="text-center py-6 text-slate-600 text-sm">No warmup exercises — add one below.</div>
          )}

          {/* Add warmup row */}
          {editingWarmup && (
            <div className="bg-navy-900/60 border border-dashed border-navy-600 rounded-xl px-4 py-3 space-y-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Add Exercise</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Exercise name..."
                  className="input-field text-sm py-1.5 flex-1 min-w-0"
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={newSets}
                    onChange={e => setNewSets(e.target.value)}
                    placeholder="Sets"
                    className="input-field text-sm py-1.5 w-16 text-center"
                  />
                  <span className="text-slate-500 text-sm flex items-center">×</span>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addWarmup()}
                    placeholder="Duration / reps..."
                    className="input-field text-sm py-1.5 flex-1 min-w-0"
                  />
                </div>
                <button
                  onClick={addWarmup}
                  disabled={!newName.trim() || !newDuration.trim()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-brand/20 hover:bg-brand/30 border border-brand/30 text-brand transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supplementation */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-brand" />
          <h3 className="font-bold text-white text-sm">Supplementation Protocol</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supplements.map((sup, i) => (
            <div key={i} className="bg-navy-900 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-bold text-white text-sm">{sup.name}</div>
                <div className="text-brand font-bold text-xs whitespace-nowrap">{sup.dose}</div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
                <Clock className="w-3 h-3" />
                {sup.timing}
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{sup.reason}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-3 flex items-start gap-1.5">
          <Apple className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          Supplement recommendations are general performance guidelines. Consult a registered dietitian or physician before starting any new protocol.
        </p>
      </div>
    </div>
  )
}
