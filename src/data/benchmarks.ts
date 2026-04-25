import { Position } from '../types'

export interface PositionBenchmark {
  heightInches: number
  weightLbs: number
  wingspanInches: number
  standingReachInches: number
  cmjHeightCm: number
  laneAgilitySeconds: number
  sprint34Seconds: number
  proAgilitySeconds: number
  quickBoardTouches: number
  // elite thresholds
  eliteCmjCm: number
  eliteLaneAgility: number
  eliteSprint34: number
  eliteProAgility: number
  eliteQuickBoard: number
}

export const BENCHMARKS: Record<Position, PositionBenchmark> = {
  PG: {
    heightInches: 73.5,
    weightLbs: 188,
    wingspanInches: 78,
    standingReachInches: 97.5,
    cmjHeightCm: 76.2,
    laneAgilitySeconds: 11.10,
    sprint34Seconds: 3.20,
    proAgilitySeconds: 3.00,
    quickBoardTouches: 97,
    eliteCmjCm: 86.4,   // 34"
    eliteLaneAgility: 10.6,
    eliteSprint34: 3.00,
    eliteProAgility: 2.80,
    eliteQuickBoard: 108,
  },
  SG: {
    heightInches: 75.5,
    weightLbs: 201,
    wingspanInches: 80.5,
    standingReachInches: 101,
    cmjHeightCm: 76.2,
    laneAgilitySeconds: 11.15,
    sprint34Seconds: 3.20,
    proAgilitySeconds: 2.95,
    quickBoardTouches: 94,
    eliteCmjCm: 88.9,   // 35"
    eliteLaneAgility: 10.5,
    eliteSprint34: 2.97,
    eliteProAgility: 2.75,
    eliteQuickBoard: 105,
  },
  SF: {
    heightInches: 78,
    weightLbs: 214,
    wingspanInches: 83,
    standingReachInches: 104,
    cmjHeightCm: 74.9,
    laneAgilitySeconds: 11.35,
    sprint34Seconds: 3.30,
    proAgilitySeconds: 3.00,
    quickBoardTouches: 91,
    eliteCmjCm: 88.9,   // 35"
    eliteLaneAgility: 10.7,
    eliteSprint34: 3.05,
    eliteProAgility: 2.85,
    eliteQuickBoard: 102,
  },
  PF: {
    heightInches: 80,
    weightLbs: 233,
    wingspanInches: 85,
    standingReachInches: 107,
    cmjHeightCm: 73.7,
    laneAgilitySeconds: 11.55,
    sprint34Seconds: 3.30,
    proAgilitySeconds: 3.10,
    quickBoardTouches: 89,
    eliteCmjCm: 86.4,   // 34"
    eliteLaneAgility: 10.9,
    eliteSprint34: 3.10,
    eliteProAgility: 2.90,
    eliteQuickBoard: 100,
  },
  C: {
    heightInches: 82,
    weightLbs: 246,
    wingspanInches: 87,
    standingReachInches: 109.5,
    cmjHeightCm: 70.8,
    laneAgilitySeconds: 11.80,
    sprint34Seconds: 3.40,
    proAgilitySeconds: 3.15,
    quickBoardTouches: 88,
    eliteCmjCm: 81.3,   // 32"
    eliteLaneAgility: 11.1,
    eliteSprint34: 3.20,
    eliteProAgility: 2.95,
    eliteQuickBoard: 98,
  },
}

export const OVERHEAD_SQUAT_FAULTS = [
  'Feet turn out excessively',
  'Heels rise off ground',
  'Knees cave inward (valgus)',
  'Knees bow outward (varus)',
  'Excessive forward trunk lean',
  'Arms fall forward',
  'Lumbar hyperextension',
  'Lumbar flexion (butt wink)',
  'Asymmetrical weight shift',
  'Limited shoulder mobility / arms drift',
]

export const SINGLE_LEG_SQUAT_FAULTS = [
  'Knee caves inward (valgus)',
  'Trunk lateral lean',
  'Contralateral hip drop',
  'Excessive forward trunk lean',
  'Heel rise',
  'Foot pronation / arch collapse',
  'Pelvic rotation',
  'Insufficient depth',
  'Balance loss',
]

// NBA combine all-time records for context
export const COMBINE_RECORDS = {
  laneAgility: { value: 9.65, holder: 'Jamison Brewer', year: 2001 },
  sprint34: { value: 2.87, holder: 'Devin Carter', year: 2024 },
  shuttle: { value: 2.58, holder: 'Grant Nelson', year: 2025 },
  standingVertical: { value: 41.5, holder: 'Keon Johnson', year: 2021 },
  maxVertical: { value: 48.0, holder: 'Keon Johnson', year: 2021 },
}
