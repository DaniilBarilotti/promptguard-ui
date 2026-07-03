import { useEffect, useRef } from 'react'
import { useApp } from '../../ctx/AppContext.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChatInput from './ChatInput.jsx'

export default function ChatWindow({ msgs, loading, error, onSend, prefill, onPrefillClear }) {
  const { str } = useApp()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  // перевіряємо чи останнє повідомлення від юзера і воно clean — тоді показуємо typing
  const lastMsg = msgs[msgs.length - 1]
  const showTyping = loading && lastMsg?.status === 'clean'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* хедер */}
      <div style={{
        padding: '12px 18px', borderBottom: '1px solid var(--bd2)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--s1)', flexShrink: 0,
      }}>
        {/* пульсуючий live-dot */}
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green)', display: 'inline-block',
          animation: 'livePulse 2s ease infinite',
        }} />
        <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.01em' }}>
          {str.chatTitle}
        </span>
        {/* TODO: взяти назву моделі з /api/status коли Node додасть ендпоінт */}
        <span style={{
          marginLeft: 'auto', fontSize: 11, color: 'var(--tx4)',
          padding: '3px 9px', border: '1px solid var(--bd)',
          borderRadius: 999, fontFamily: 'var(--m)', letterSpacing: '.02em',
        }}>
          Gemini · {str.proxyLabel}
        </span>
      </div>

      {/* повідомлення */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {msgs.length === 0 && !loading && (
          <div className="fade-in" style={{
            margin: 'auto', textAlign: 'center',
            color: 'var(--tx4)', fontSize: 13, lineHeight: 2.1,
          }}>
            <div style={{ fontSize: 32, marginBottom: 10, filter: 'grayscale(.3)' }}>🛡</div>
            {str.emptyChat.split('\n').map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}

        {msgs.map((m, i) => <MessageBubble key={m.id} msg={m} index={i} />)}

        {/* typing indicator — тільки коли LLM відповідає на чистий запит */}
        {showTyping && <TypingIndicator label={str.llm} />}

        {error && (
          <div className="fade-up" style={{
            padding: '10px 14px', borderRadius: 'var(--r)',
            background: 'var(--red-bg)', border: '1px solid var(--red-bd)',
            color: 'var(--red)', fontSize: 12,
          }}>
            ✕ {str.proxyError}: {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} loading={loading} prefill={prefill} onPrefillClear={onPrefillClear} />
    </div>
  )
}
