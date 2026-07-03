import { useState, useCallback, useRef } from 'react'
import { sendMessage } from '../api/client.js'

const SESSION_ID = crypto.randomUUID()

export function useChat(mockReplies) {
  const [msgs,      setMsgs]      = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const uid = useRef(0)

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return
    const id = ++uid.current

    setMsgs(prev => [...prev, { id, role: 'user', text, status: 'pending', verdict: null, ts: new Date() }])
    setLoading(true)
    setError(null)

    try {
      const data = await sendMessage(SESSION_ID, text, mockReplies)

      setMsgs(prev => prev.map(m => m.id === id ? { ...m, status: data.status, verdict: data.verdict } : m))

      if (data.status === 'clean' && data.reply) {
        setMsgs(prev => [...prev, {
          id: ++uid.current, role: 'assistant', text: data.reply,
          status: 'clean', verdict: null, ts: new Date(),
        }])
      }

      if (data.status !== 'clean') {
        setIncidents(prev => [{ id, ts: new Date(), status: data.status, ...data.verdict }, ...prev])
      }
    } catch (err) {
      setError(err.message)
      setMsgs(prev => prev.filter(m => m.id !== id))
    } finally {
      setLoading(false)
    }
  }, [loading, mockReplies])

  return { msgs, incidents, loading, error, send }
}
