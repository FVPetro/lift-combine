import { useState } from 'react'
import { Athlete } from '../../types'
import { useStore } from '../../store/useStore'
import { formatHeight, scoreSession, getScoreColor } from '../../utils/scoring'
import { Camera, Edit2, Check, X, User } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  athlete: Athlete
}

const POSITION_COLORS: Record<string, string> = {
  PG: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SG: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  SF: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  PF: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  C: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function ProfileHeader({ athlete }: Props) {
  const updateAthlete = useStore(s => s.updateAthlete)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    name: athlete.name,
    school: athlete.school ?? '',
    notes: athlete.notes ?? '',
    heightInches: athlete.heightInches,
    weightLbs: athlete.weightLbs,
    wingspanInches: athlete.wingspanInches,
    standingReachInches: athlete.standingReachInches,
    position: athlete.position,
  })

  const latestSession = athlete.sessions[athlete.sessions.length - 1]
  const scores = latestSession ? scoreSession(latestSession, athlete.position) : null

  const saveEdit = () => {
    updateAthlete(athlete.id, draft)
    setEditing(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateAthlete(athlete.id, { photo: ev.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const overallScore = scores?.overall ?? null

  return (
    <div className="bg-navy-900 border-b border-navy-700">
      {/* Hero gradient strip */}
      <div className="h-28 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand/10 via-transparent to-transparent" />
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand/5 rounded-full blur-3xl" />
      </div>

      <div className="px-6 pb-6 -mt-14 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          {/* Photo */}
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-navy-900 bg-navy-700">
              {athlete.photo ? (
                <img src={athlete.photo} alt={athlete.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-600" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {overallScore !== null && (
              <div className={clsx(
                'absolute -bottom-2 -right-2 w-9 h-9 rounded-xl border-2 border-navy-900 flex items-center justify-center text-xs font-black',
                overallScore >= 80 ? 'bg-green-500 text-white'
                : overallScore >= 60 ? 'bg-yellow-500 text-black'
                : 'bg-red-500 text-white'
              )}>
                {overallScore}
              </div>
            )}
          </div>

          {/* Name / meta */}
          <div className="flex-1 min-w-0 mt-2">
            {editing ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  className="input-field text-xl font-bold py-1.5 max-w-xs"
                />
                <select
                  value={draft.position}
                  onChange={e => setDraft(d => ({ ...d, position: e.target.value as typeof draft.position }))}
                  className="input-field py-1.5 w-20"
                >
                  {['PG','SG','SF','PF','C'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-white">{athlete.name}</h1>
                <span className={clsx(
                  'text-xs font-bold px-2 py-0.5 rounded-lg border',
                  POSITION_COLORS[athlete.position]
                )}>
                  {athlete.position}
                </span>
              </div>
            )}

            {editing ? (
              <input
                value={draft.school}
                onChange={e => setDraft(d => ({ ...d, school: e.target.value }))}
                className="input-field py-1 text-sm mt-1 max-w-xs"
                placeholder="School / Team"
              />
            ) : (
              <p className="text-slate-400 text-sm mt-0.5">{athlete.school ?? 'No school listed'} · {athlete.agency}</p>
            )}
          </div>

          {/* Edit controls */}
          <div className="flex items-center gap-2 sm:ml-auto">
            {editing ? (
              <>
                <button onClick={saveEdit} className="btn-primary flex items-center gap-1.5 py-2 px-3 text-sm">
                  <Check className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="btn-ghost py-2 px-3 text-sm">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-ghost flex items-center gap-1.5 py-2 px-3 text-sm">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Physical stats row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {editing ? (
            <>
              {[
                { label: 'Height (in)', key: 'heightInches' as const },
                { label: 'Weight (lbs)', key: 'weightLbs' as const },
                { label: 'Wingspan (in)', key: 'wingspanInches' as const },
                { label: 'Stand. Reach (in)', key: 'standingReachInches' as const },
              ].map(({ label, key }) => (
                <div key={key} className="bg-navy-800 rounded-xl p-3 border border-navy-600">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</div>
                  <input
                    type="number"
                    value={draft[key]}
                    onChange={e => setDraft(d => ({ ...d, [key]: parseFloat(e.target.value) }))}
                    className="input-field py-1 text-sm w-full"
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { label: 'Height', value: formatHeight(athlete.heightInches) },
                { label: 'Weight', value: `${athlete.weightLbs} lbs` },
                { label: 'Wingspan', value: formatHeight(athlete.wingspanInches) },
                { label: 'Standing Reach', value: formatHeight(athlete.standingReachInches) },
              ].map(stat => (
                <div key={stat.label} className="bg-navy-800 rounded-xl p-3 border border-navy-700 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                  <div className="text-lg font-bold text-white mt-0.5">{stat.value}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Notes */}
        {editing ? (
          <div className="mt-3">
            <textarea
              value={draft.notes}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              rows={2}
              className="input-field text-sm w-full resize-none"
              placeholder="Athlete notes..."
            />
          </div>
        ) : athlete.notes ? (
          <p className="mt-4 text-sm text-slate-400 italic border-l-2 border-brand/40 pl-3">
            {athlete.notes}
          </p>
        ) : null}
      </div>
    </div>
  )
}
