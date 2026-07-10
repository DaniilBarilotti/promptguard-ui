// ============================================================
// NODE GUARDRAIL-PROXY — повний контракт (README підтверджено)
//
// POST /
//   req:  { userIp: string (IPv4), prompt: string (max 1000) }
//   200:  { status: "ok", response: string }
//   403:  { status: "injection_detected", incident: {
//             id, userIp, attackType, severity, verdict, segment } }
//   429:  { status: "genai_daily_limitreached" | "genai_minute_limitreached", message }
//   400:  { status: "invalid_form", ... }
//   500:  { status: "internal_err_occured", message }
//
// GET /incidents
//   200:  { status: "ok", incidents: [
//             { id, userIp, attackType, severity, verdict, segment, userPromptId } ] }
// ============================================================

const MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const BASE = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000'

// attackType від Node/Python → ключ для ATTACK_NAMES в attacks.js
const ATTACK_MAP = {
  prompt_injection:   'direct_injection',
  jailbreak:          'role_play_bypass',
  indirect_injection: 'indirect_rag',
  obfuscation:        'obfuscation',
  role_play:          'role_play_bypass',
  unknown:            'direct_injection',
  none:               null,
}

// severity від Node → risk для UI
const SEVERITY_MAP = {
  low:    'low',
  medium: 'medium',
  high:   'high',
}

// перетворює incident-об'єкт від Node у формат що чекають компоненти
function incidentToVerdict(inc) {
  return {
    risk:               SEVERITY_MAP[inc.severity] || inc.severity || null,
    attackType:         ATTACK_MAP[inc.attackType] ?? inc.attackType ?? null,
    suspiciousFragment: inc.segment   || null,
    detectionLevel:     null,   // Node не повертає рівень детектора у цьому полі
    confidence:         null,
  }
}

// ─── Mock ────────────────────────────────────────────────────
const mockQueue = [
  { status: 'clean', verdict: null, replyKey: 0 },
  {
    status: 'blocked',
    verdict: { risk: 'high', attackType: 'direct_injection', suspiciousFragment: 'ignore previous instructions', detectionLevel: 2, confidence: 0.93 },
    replyKey: null,
  },
  {
    status: 'suspicious',
    verdict: { risk: 'medium', attackType: 'role_play_bypass', suspiciousFragment: 'without restrictions', detectionLevel: 1, confidence: 0.71 },
    replyKey: null,
  },
  { status: 'clean', verdict: null, replyKey: 1 },
]
let mockIdx = 0

async function mockSend(mockReplies) {
  await new Promise(r => setTimeout(r, 380 + Math.random() * 280))
  const r = mockQueue[mockIdx % mockQueue.length]
  mockIdx++
  return { ...r, reply: r.replyKey != null ? mockReplies[r.replyKey] : null }
}

// ─── Реальні виклики ─────────────────────────────────────────

export async function sendMessage(sessionId, text, mockReplies) {
  if (MOCK) return mockSend(mockReplies)

  const res = await fetch(`${BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userIp: '127.0.0.1', prompt: text }),
  })

  const data = await res.json()

  // 403 — детектор зловив ін'єкцію
  if (res.status === 403 && data.status === 'injection_detected') {
    return {
      status:  data.incident.verdict,   // "blocked" або "suspicious"
      verdict: incidentToVerdict(data.incident),
      reply:   null,
    }
  }

  // 429 — rate limit
  if (res.status === 429) {
    throw new Error(data.message || 'Rate limit reached')
  }

  // 400, 500
  if (!res.ok) {
    throw new Error(data.message || `proxy ${res.status}`)
  }

  // 200 — чистий запит, LLM відповіла
  return {
    status:  'clean',
    verdict: null,
    reply:   data.response || null,
  }
}

// GET /incidents — лог інцидентів із проксі
export async function getIncidents() {
  if (MOCK) return { incidents: [] }

  const res = await fetch(`${BASE}/incidents`)
  if (!res.ok) return { incidents: [] }
  const data = await res.json()

  // адаптуємо поля під формат компонентів
  const incidents = (data.incidents || []).map(inc => ({
    id:                 inc.id,
    ts:                 new Date(),
    status:             inc.verdict,
    attackType:         ATTACK_MAP[inc.attackType] ?? inc.attackType ?? null,
    suspiciousFragment: inc.segment   || null,
    risk:               SEVERITY_MAP[inc.severity] || null,
    detectionLevel:     null,
    confidence:         null,
  }))

  return { incidents }
}
