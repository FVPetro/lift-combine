import { AssessmentSession, Position, ScoreBreakdown } from '../types'
import { BENCHMARKS } from '../data/benchmarks'

// Normalize a "higher is better" metric against benchmark → 0-110
function scoreHigher(value: number, benchmark: number): number {
  return Math.min(110, Math.round((value / benchmark) * 100))
}

// Normalize a "lower is better" metric against benchmark → 0-110
function scoreLower(value: number, benchmark: number): number {
  return Math.min(110, Math.round((benchmark / value) * 100))
}

// Score asymmetry: 0% = 100, 10% = 60, 20% = 20, >25% = 0
function scoreAsymmetry(pct: number): number {
  return Math.max(0, Math.round(100 - pct * 4))
}

// Score movement quality based on fault count
function scoreMovement(faultCount: number): number {
  if (faultCount === 0) return 100
  if (faultCount === 1) return 82
  if (faultCount === 2) return 65
  if (faultCount === 3) return 45
  return 25
}

export function scoreSession(session: AssessmentSession, position: Position): ScoreBreakdown {
  const bm = BENCHMARKS[position]
  const scores: number[] = []

  // Speed (sprint + shuttle)
  const speedScores: number[] = []
  if (session.sprint34) speedScores.push(scoreLower(session.sprint34.timeSeconds, bm.sprint34Seconds))
  if (session.shuttle) speedScores.push(scoreLower(session.shuttle.timeSeconds, bm.shuttleSeconds))
  const speed = speedScores.length ? Math.round(speedScores.reduce((a, b) => a + b, 0) / speedScores.length) : 0

  // Power (CMJ jump height)
  const powerScores: number[] = []
  if (session.cmj) powerScores.push(scoreHigher(session.cmj.jumpHeightCm, bm.cmjHeightCm))
  const power = powerScores.length ? Math.round(powerScores.reduce((a, b) => a + b, 0) / powerScores.length) : 0

  // Agility (lane agility)
  const agilityScores: number[] = []
  if (session.laneAgility) agilityScores.push(scoreLower(session.laneAgility.timeSeconds, bm.laneAgilitySeconds))
  const agility = agilityScores.length ? Math.round(agilityScores.reduce((a, b) => a + b, 0) / agilityScores.length) : 0

  // Mobility (movement quality from squat assessments)
  const mobilityScores: number[] = []
  if (session.overheadSquat) mobilityScores.push(scoreMovement(session.overheadSquat.faults.length))
  if (session.singleLegSquat) mobilityScores.push(scoreMovement(session.singleLegSquat.faults.length))
  const mobility = mobilityScores.length ? Math.round(mobilityScores.reduce((a, b) => a + b, 0) / mobilityScores.length) : 0

  // Symmetry (asymmetry from force tests)
  const symmetryScores: number[] = []
  if (session.cmj) symmetryScores.push(scoreAsymmetry(session.cmj.asymmetryPct))
  if (session.singleLegHip) symmetryScores.push(scoreAsymmetry(session.singleLegHip.asymmetryPct))
  if (session.singleLegJump) symmetryScores.push(scoreAsymmetry(100 - session.singleLegJump.lsi))
  const symmetry = symmetryScores.length ? Math.round(symmetryScores.reduce((a, b) => a + b, 0) / symmetryScores.length) : 0

  // Overall — weighted average of completed domains
  const domainScores = [speed, power, agility, mobility, symmetry].filter(s => s > 0)
  const overall = domainScores.length
    ? Math.min(100, Math.round(domainScores.reduce((a, b) => a + b, 0) / domainScores.length))
    : 0

  if (speed) scores.push(speed)
  if (power) scores.push(power)
  if (agility) scores.push(agility)
  if (mobility) scores.push(mobility)
  if (symmetry) scores.push(symmetry)

  return { overall, speed, power, agility, mobility, symmetry }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-400'
  if (score >= 75) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
  if (score >= 75) return 'bg-green-500/20 border-green-500/40 text-green-300'
  if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
  if (score >= 40) return 'bg-orange-500/20 border-orange-500/40 text-orange-300'
  return 'bg-red-500/20 border-red-500/40 text-red-300'
}

export function getScoreLabel(score: number): string {
  if (score >= 95) return 'ELITE'
  if (score >= 85) return 'ABOVE AVG'
  if (score >= 70) return 'AVERAGE'
  if (score >= 55) return 'BELOW AVG'
  return 'NEEDS WORK'
}

export function getAsymmetryColor(pct: number): string {
  if (pct <= 5) return 'text-emerald-400'
  if (pct <= 10) return 'text-yellow-400'
  if (pct <= 15) return 'text-orange-400'
  return 'text-red-400'
}

export function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12)
  const inch = Math.round(inches % 12)
  return `${ft}'${inch}"`
}

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10
}

export function cmToInches(cm: number): string {
  const totalInches = cm / 2.54
  const ft = Math.floor(totalInches / 12)
  const inch = Math.round((totalInches % 12) * 10) / 10
  return ft > 0 ? `${ft}'${inch}"` : `${inch}"`
}
