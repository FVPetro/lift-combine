import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Position } from '../types'
import { ArrowLeft, Zap, User } from 'lucide-react'

const POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']

export default function NewAthlete() {
  const addAthlete = useStore(s => s.addAthlete)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    position: 'PG' as Position,
    heightFt: '6',
    heightIn: '0',
    weightLbs: '',
    wingspanFt: '6',
    wingspanIn: '0',
    reachFt: '8',
    reachIn: '0',
    dateOfBirth: '',
    school: '',
    agency: 'Lift Sports Management',
    notes: '',
  })

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = `a${Date.now()}`
    addAthlete({
      id,
      name: form.name,
      position: form.position,
      heightInches: parseInt(form.heightFt) * 12 + parseInt(form.heightIn),
      weightLbs: parseFloat(form.weightLbs),
      wingspanInches: parseInt(form.wingspanFt) * 12 + parseInt(form.wingspanIn),
      standingReachInches: parseInt(form.reachFt) * 12 + parseInt(form.reachIn),
      dateOfBirth: form.dateOfBirth,
      school: form.school || undefined,
      agency: form.agency || undefined,
      notes: form.notes || undefined,
      sessions: [],
      createdAt: new Date().toISOString().split('T')[0],
    })
    navigate(`/athlete/${id}`)
  }

  return (
    <div className="min-h-screen bg-navy-950 bg-grid">
      <header className="border-b border-navy-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand" />
            <span className="font-bold text-white">New Athlete Profile</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-glow p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-brand" />
              <h2 className="font-bold text-white">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full Name *</label>
                <input value={form.name} onChange={f('name')} required className="input-field" placeholder="First Last" />
              </div>
              <div>
                <label className="label">Position *</label>
                <select value={form.position} onChange={f('position')} className="input-field bg-navy-900">
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={f('dateOfBirth')} className="input-field" />
              </div>
              <div>
                <label className="label">School / University</label>
                <input value={form.school} onChange={f('school')} className="input-field" placeholder="e.g. Duke University" />
              </div>
              <div>
                <label className="label">Agency</label>
                <input value={form.agency} onChange={f('agency')} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card-glow p-6">
            <h2 className="font-bold text-white mb-5">Physical Measurements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="label">Height</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="number" value={form.heightFt} onChange={f('heightFt')} min="5" max="8" className="input-field text-center" />
                    <div className="text-center text-slate-600 text-xs mt-1">ft</div>
                  </div>
                  <div className="flex-1">
                    <input type="number" value={form.heightIn} onChange={f('heightIn')} min="0" max="11" className="input-field text-center" />
                    <div className="text-center text-slate-600 text-xs mt-1">in</div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label className="label">Weight (lbs) *</label>
                <input type="number" value={form.weightLbs} onChange={f('weightLbs')} required className="input-field" placeholder="185" />
              </div>
              <div className="col-span-2">
                <label className="label">Wingspan</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="number" value={form.wingspanFt} onChange={f('wingspanFt')} min="5" max="9" className="input-field text-center" />
                    <div className="text-center text-slate-600 text-xs mt-1">ft</div>
                  </div>
                  <div className="flex-1">
                    <input type="number" value={form.wingspanIn} onChange={f('wingspanIn')} min="0" max="11" className="input-field text-center" />
                    <div className="text-center text-slate-600 text-xs mt-1">in</div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label className="label">Standing Reach</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="number" value={form.reachFt} onChange={f('reachFt')} min="7" max="10" className="input-field text-center" />
                    <div className="text-center text-slate-600 text-xs mt-1">ft</div>
                  </div>
                  <div className="flex-1">
                    <input type="number" value={form.reachIn} onChange={f('reachIn')} min="0" max="11" className="input-field text-center" />
                    <div className="text-center text-slate-600 text-xs mt-1">in</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-glow p-6">
            <label className="label">General Notes</label>
            <textarea value={form.notes} onChange={f('notes')} rows={3} className="input-field resize-none" placeholder="Initial observations, injury history, goals..." />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create Profile</button>
          </div>
        </form>
      </main>
    </div>
  )
}
