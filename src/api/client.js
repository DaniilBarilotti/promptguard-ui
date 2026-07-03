// POST /  — Node guardrail-proxy
// req: { userIp: string, prompt: string }
// res: { status: "ok", response: string }
// TODO: після підключення analyzePrompt у Node — оновити adaptResponse()

const MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const BASE = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000'

function adaptResponse(data) {
  // поки не підключив детектор — все приходить як clean
  // TODO: розширити тут
  return {
    status:  'clean',
    verdict: null,
    reply:   data.response ?? null,
  }
}

const mockQueue = [
  { status: 'clean', verdict: { risk: 'none', attackType: null, suspiciousFragment: null }, replyKey: 0 },
  { status: 'blocked', verdict: { risk: 'high', attackType: 'system_prompt_leak', suspiciousFragment: 'ignore previous instructions', detectionLevel: 2, confidence: 0.93 }, replyKey: null },
  { status: 'suspicious', verdict: { risk: 'medium', attackType: 'role_play_bypass', suspiciousFragment: 'without restrictions', detectionLevel: 1, confidence: 0.71 }, replyKey: null },
  { status: 'clean', verdict: { risk: 'none', attackType: null, suspiciousFragment: null }, replyKey: 1 },
]
let mockIdx = 0

async function mockSend(mockReplies) {
  await new Promise(r => setTimeout(r, 380 + Math.random() * 280))
  const r = mockQueue[mockIdx % mockQueue.length]
  mockIdx++
  return { ...r, reply: r.replyKey != null ? mockReplies[r.replyKey] : null }
}

export async function sendMessage(sessionId, text, mockReplies) {
  if (MOCK) return mockSend(mockReplies)

  const res = await fetch(`${BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userIp: '127.0.0.1', prompt: text }),
  })

  if (!res.ok) throw new Error(`proxy ${res.status}`)
  return adaptResponse(await res.json())
}

export async function getIncidents() {
  // TODO: чи буде окремий роут для логу інцидентів
  return { incidents: [] }
}
