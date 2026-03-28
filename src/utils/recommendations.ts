import { Athlete, AssessmentSession, Recommendation, WarmupExercise, Supplement } from '../types'
import { scoreSession } from './scoring'

export interface FullRecommendations {
  scores: ReturnType<typeof scoreSession>
  recommendations: Recommendation[]
  warmup: WarmupExercise[]
  supplements: Supplement[]
  injuryFlags: string[]
}

export function generateRecommendations(athlete: Athlete, session: AssessmentSession): FullRecommendations {
  const scores = scoreSession(session, athlete.position)
  const recommendations: Recommendation[] = []
  const injuryFlags: string[] = []

  // --- SYMMETRY / INJURY FLAGS ---
  if (session.singleLegHip && session.singleLegHip.asymmetryPct > 15) {
    injuryFlags.push(`Hip force asymmetry at ${session.singleLegHip.asymmetryPct.toFixed(1)}% — above 15% clinical threshold. Sports medicine consult recommended.`)
  }
  if (session.singleLegJump && session.singleLegJump.lsi < 85) {
    injuryFlags.push(`Single-leg jump LSI at ${session.singleLegJump.lsi.toFixed(1)}% — below 85% return-to-sport threshold. Monitor closely.`)
  }
  if (session.cmj && session.cmj.asymmetryPct > 12) {
    injuryFlags.push(`CMJ bilateral asymmetry at ${session.cmj.asymmetryPct.toFixed(1)}% — possible compensatory loading pattern.`)
  }

  // --- SPEED ---
  if (scores.speed < 75) {
    recommendations.push({
      category: 'speed',
      priority: scores.speed < 55 ? 'high' : 'medium',
      title: 'Linear Speed Development',
      description: `Sprint time is ${scores.speed < 65 ? 'significantly' : 'slightly'} below ${athlete.position} combine average. Focus on acceleration mechanics and top-end velocity.`,
      exercises: [
        'A-Skip / B-Skip — 2×20m, mechanics focus',
        'Resisted sprint starts (sled) — 4×15m at 10-15% BW',
        'Wicket runs — 2×30m for stride frequency',
        'Flying 10s — 6 reps from 20m build-up',
        'Block starts — 4×10m drive phase work',
      ],
    })
  }

  // --- AGILITY ---
  if (scores.agility < 75) {
    recommendations.push({
      category: 'agility',
      priority: scores.agility < 55 ? 'high' : 'medium',
      title: 'Change of Direction & Lateral Quickness',
      description: `Lane agility is ${scores.agility < 65 ? 'significantly' : 'slightly'} below ${athlete.position} benchmark. Emphasis on deceleration, hip loading, and reactive cuts.`,
      exercises: [
        '5-10-5 shuttle — 6 reps, focus on low hip position at transitions',
        'Lateral bound-to-stick — 3×5 each direction',
        'Defensive slide with band resistance — 3×20 sec',
        'T-drill — 6 reps, time each rep',
        'Mirror drill with partner — 4×10 sec reactive sequences',
      ],
    })
  }

  // --- POWER ---
  if (scores.power < 75) {
    recommendations.push({
      category: 'power',
      priority: scores.power < 55 ? 'high' : 'medium',
      title: 'Explosive Power & Vertical Development',
      description: `CMJ height is below the ${athlete.position} combine average. Plyometric loading and rate of force development work needed.`,
      exercises: [
        'Countermovement jumps — 4×4 max intent, 2min rest',
        'Depth drops from 30cm box — 3×5 (reactive landing focus)',
        'Contrast sets: Heavy trap bar deadlift (3RM) → immediate CMJ × 3',
        'Single-leg broad jumps — 3×4 each leg',
        'Ankle stiffness drills — pogo jumps 3×15',
      ],
    })
  }

  // --- MOBILITY ---
  if (scores.mobility < 75) {
    const ohFaults = session.overheadSquat?.faults ?? []
    const slFaults = session.singleLegSquat?.faults ?? []
    const heelRise = ohFaults.includes('Heels rise off ground')
    const valgus = slFaults.includes('Knee caves inward (valgus)') || ohFaults.includes('Knees cave inward (valgus)')
    const shoulderIssue = ohFaults.includes('Arms fall forward') || ohFaults.includes('Limited shoulder mobility / arms drift')

    const exercises = [
      'World\'s greatest stretch — 2×5 each side',
      '90/90 hip mobility — 2×60 sec each side',
      'Deep squat hold with supported reach — 3×30 sec',
    ]
    if (heelRise) exercises.push('Wall ankle dorsiflexion stretch — 3×45 sec each side', 'Elevated heel goblet squat — 3×8')
    if (valgus) exercises.push('Clamshells with band — 3×15 each', 'Hip abductor isometric holds — 3×30 sec')
    if (shoulderIssue) exercises.push('Prone Y-T-W raises — 3×10 each', 'Doorway chest/lat stretch — 3×45 sec')

    recommendations.push({
      category: 'mobility',
      priority: scores.mobility < 55 ? 'high' : 'medium',
      title: 'Movement Quality & Joint Mobility',
      description: `Movement screens show ${(ohFaults.length + slFaults.length)} total faults. Addressing joint mobility and movement patterns will directly improve athletic output.`,
      exercises,
    })
  }

  // --- SYMMETRY ---
  if (scores.symmetry < 70) {
    recommendations.push({
      category: 'symmetry',
      priority: scores.symmetry < 50 ? 'high' : 'medium',
      title: 'Bilateral Symmetry & Unilateral Loading',
      description: `Force asymmetry is above optimal thresholds. Unilateral training should be prioritized to address limb imbalances and reduce injury risk.`,
      exercises: [
        'Bulgarian split squat (rear-foot elevated) — 3×8 each, lead with weaker side',
        'Single-leg RDL — 3×10 each side with KB',
        'Step-up with knee drive — 3×8 each leg',
        'Single-leg press — 3×10, match load both sides',
        'Single-leg ForceDecks re-test in 4 weeks',
      ],
    })
  }

  // Always include recovery recommendation
  recommendations.push({
    category: 'recovery',
    priority: 'low',
    title: 'Recovery & Tissue Quality',
    description: 'Structured recovery between high-intensity sessions will improve adaptation and reduce soft tissue injury risk.',
    exercises: [
      'Foam roll quads, IT band, thoracic spine — 8 min pre-session',
      'Cold water immersion (10-12°C, 10 min) post max-effort sessions',
      'Sleep target: 8-9 hours. Track HRV with Whoop/Oura if available',
      'Active recovery day: 30-min low-intensity bike or pool walk',
    ],
  })

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // --- WARMUP PROTOCOL ---
  const warmup: WarmupExercise[] = [
    { name: 'Bike / Row Ergometer', sets: '1', duration: '5 min', notes: 'RPE 4-5, gradual build' },
    { name: 'Leg Swings (front/back & lateral)', sets: '2', duration: '10 reps each', notes: 'Hold wall for balance' },
    { name: 'Hip 90/90 Rotations', sets: '2', duration: '8 each side' },
    { name: 'Inchworm to Downward Dog', sets: '2', duration: '6 reps' },
    { name: 'Lateral Lunge to Hip Stretch', sets: '2', duration: '8 each side' },
    { name: 'Glute Bridge with Hold', sets: '2', duration: '10 reps, 3-sec hold' },
    { name: 'Mini-Band Lateral Walk', sets: '2', duration: '15 steps each direction', notes: 'Medium resistance band' },
    { name: 'Pogos / Ankle Activations', sets: '2', duration: '20 reps', notes: 'Stiff ankle, quick ground contact' },
    { name: 'A-Skip', sets: '2', duration: '20m', notes: 'Focus on knee drive and arm mechanics' },
    { name: 'Build-up Run', sets: '2', duration: '40m', notes: '60% → 80% → 90% intensity' },
  ]

  if (session.overheadSquat?.faults.includes('Heels rise off ground')) {
    warmup.splice(4, 0, { name: 'Ankle Dorsiflexion Mob (wall drill)', sets: '2', duration: '45 sec each', notes: 'Priority — ankle mobility deficit detected' })
  }
  if (session.singleLegSquat?.faults.includes('Knee caves inward (valgus)')) {
    warmup.splice(6, 0, { name: 'Clamshell + Hip Abductor Activation', sets: '2', duration: '15 reps each', notes: 'Priority — hip valgus pattern detected' })
  }

  // --- SUPPLEMENTS ---
  const supplements: Supplement[] = [
    {
      name: 'Vitamin D3 + K2',
      dose: '5,000 IU D3 / 100mcg K2',
      timing: 'Morning with food',
      reason: 'Supports bone density, muscle function, immune health — especially critical for indoor athletes.',
    },
    {
      name: 'Omega-3 Fish Oil (EPA/DHA)',
      dose: '3-4g EPA+DHA daily',
      timing: 'With meals',
      reason: 'Anti-inflammatory support, joint health, neural function. Higher dose indicated for training load.',
    },
    {
      name: 'Magnesium Glycinate',
      dose: '400mg',
      timing: '30-60 min before sleep',
      reason: 'Improves sleep quality, reduces muscle cramping, supports recovery and CNS function.',
    },
  ]

  if (scores.power < 80) {
    supplements.push({
      name: 'Creatine Monohydrate',
      dose: '5g daily',
      timing: 'Post-workout or any consistent time',
      reason: 'Evidence-based performance enhancer for explosive power and CMJ. No loading phase required.',
    })
  }

  if (scores.symmetry < 70 || injuryFlags.length > 0) {
    supplements.push({
      name: 'Collagen Peptides + Vitamin C',
      dose: '15g collagen + 200mg Vit C',
      timing: '30-60 min before training',
      reason: 'Supports tendon and ligament synthesis. Indicated given asymmetry patterns and tissue load.',
    })
  }

  supplements.push({
    name: 'Protein Target',
    dose: `${Math.round(athlete.weightLbs * 0.45 * 0.8)}-${Math.round(athlete.weightLbs * 0.45 * 1.0)}g/day`,
    timing: 'Distributed across 4-5 meals',
    reason: `Body weight–based protein target (0.8-1.0g/kg) for muscle preservation and adaptation during combine prep.`,
  })

  return { scores, recommendations, warmup, supplements, injuryFlags }
}
