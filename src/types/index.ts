export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C'

export interface CustomInsights {
  exercises?: Record<string, string[]>   // keyed by recommendation title
  warmup?: WarmupExercise[]
}

export interface Athlete {
  id: string
  name: string
  position: Position
  heightInches: number
  weightLbs: number
  wingspanInches: number
  standingReachInches: number
  dateOfBirth: string
  school?: string
  agency?: string
  photo?: string
  notes?: string
  sessions: AssessmentSession[]
  createdAt: string
  customInsights?: CustomInsights
}

export interface AssessmentSession {
  id: string
  athleteId: string
  date: string
  label: string
  overheadSquat?: MovementAssessment
  singleLegSquat?: MovementAssessment
  cmj?: CMJData
  singleLegJump?: JumpSymmetryData
  laneAgility?: TimedTest
  sprint34?: TimedTest
  shuttle?: TimedTest
  proAgility?: ProAgilityData
  quickBoard?: QuickBoardData
  repeatedHop?: RepeatedHopData
  dropJump?: DropJumpData
}

export interface MovementAssessment {
  faults: string[]
  notes?: string
  images?: string[]
}

export interface CMJRep {
  rep: number
  conPeakForcePct?: number
  eccPeakForcePct?: number
}

export interface CMJData {
  jumpHeightCm: number
  rsiModified: number
  conPeakForceN?: number
  eccMeanForceN?: number
  asymmetryPct: number
  peakPowerW: number
  peakPowerWkg?: number
  rsi?: number
  rfdLabel?: string
  flightTimeMs: number
  contractionTimeMs: number
  // Aggregate stats for force metrics
  conPeakForceSD?: number
  conPeakForceCoV?: number
  eccPeakForceSD?: number
  eccPeakForceCoV?: number
  notes?: string
  images?: string[]
  reps?: CMJRep[]
}

export interface ForceSymmetryData {
  leftForceN: number
  rightForceN: number
  asymmetryPct: number
  notes?: string
  images?: string[]
}

export interface JumpSymmetryData {
  leftHeightCm: number
  rightHeightCm: number
  leftRSIMod: number
  rightRSIMod: number
  leftMeanRSI?: number
  rightMeanRSI?: number
  lsi: number
  notes?: string
  images?: string[]
}

export interface TimedTest {
  timeSeconds: number
  notes?: string
  images?: string[]
}

export interface ProAgilityData {
  rightTimeSeconds: number
  leftTimeSeconds: number
  notes?: string
  images?: string[]
}

export interface QuickBoardData {
  touches: number
  notes?: string
  images?: string[]
}

export interface RepeatedHopData {
  rsi: number
  peakForceN: number
  impulseAsymmetryPct: number
  activeStiffnessAsymmetryPct: number
  contactTimeMs: number
  cov: number
  notes?: string
  images?: string[]
}

export interface DropJumpData {
  rsi: number
  peakImpactForceN: number
  peakLandingForceN: number
  impactAsymmetryPct: number
  landingAsymmetryPct: number
  groundContactTimeMs: number
  notes?: string
  images?: string[]
}

export interface MockUser {
  id: string
  name: string
  email: string
  password: string
  role: 'trainer' | 'agent' | 'admin'
  title: string
  avatar?: string
}

export interface ScoreBreakdown {
  overall: number
  speed: number
  power: number
  agility: number
  mobility: number
  symmetry: number
}

export interface Recommendation {
  category: 'speed' | 'power' | 'agility' | 'mobility' | 'symmetry' | 'recovery'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  exercises: string[]
}

export interface WarmupExercise {
  name: string
  sets: string
  duration: string
  notes?: string
}

export interface Supplement {
  name: string
  dose: string
  timing: string
  reason: string
}
