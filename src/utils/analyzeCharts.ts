import { CMJRep } from '../types'

export interface CMJAnalysisResult {
  reps: CMJRep[]
  avgJumpHeightIn: number
  avgConPeakForceAsymPct: number
  avgEccBrakingImpulseAsymPct: number
}

export async function analyzeCMJCharts(
  imageDataUrls: string[],
  apiKey: string
): Promise<CMJAnalysisResult> {
  const imageContent = imageDataUrls.map(url => {
    const [header, data] = url.split(',')
    const mediaType = (header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg') as
      | 'image/jpeg'
      | 'image/png'
      | 'image/gif'
      | 'image/webp'
    return {
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: mediaType, data },
    }
  })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            {
              type: 'text',
              text: `These are CMJ (Countermovement Jump) screenshots from a force plate system (e.g. VALD ForceDecks or Hawkin Dynamics).

Extract all per-rep data and return ONLY a valid JSON object — no explanation, no markdown:

{
  "reps": [
    {
      "rep": 1,
      "jumpHeightIn": <jump height in inches as a number>,
      "flightContractionRatio": <flight:contraction time ratio as a number, or null>,
      "conPeakForceAsymPct": <concentric peak force asymmetry % as a positive number, or null>,
      "conPeakForceSide": <"L" or "R" for dominant side, or null>,
      "eccBrakingImpulseAsymPct": <eccentric braking impulse asymmetry % as a positive number, or null>,
      "eccBrakingImpulseSide": <"L" or "R" for dominant side, or null>
    }
  ],
  "avgJumpHeightIn": <average jump height in inches>,
  "avgConPeakForceAsymPct": <average concentric peak force asymmetry %>,
  "avgEccBrakingImpulseAsymPct": <average eccentric braking impulse asymmetry %>
}`,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data.content[0].text.trim()
  // Strip any markdown code fences if present
  const clean = text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(clean) as CMJAnalysisResult
}
