import { useState } from 'react'
import { useApp } from './ctx/AppContext.jsx'
import { useChat } from './hooks/useChat.js'
import ChatWindow from './components/Chat/ChatWindow.jsx'
import SecurityPanel from './components/Security/SecurityPanel.jsx'

function TopBtn({ onClick, children }) {
  const [hov, setHov] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={() => { setPressed(true); setTimeout(() => setPressed(false), 200); onClick() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '4px 11px', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
        borderRadius: 8, border: '1px solid var(--bd)',
        background: hov ? 'var(--s3)' : 'var(--s2)',
        color: hov ? 'var(--tx2)' : 'var(--tx3)',
        transition: 'all .15s ease',
        transform: pressed ? 'scale(.97)' : 'scale(1)',
        fontFamily: 'var(--m)', letterSpacing: '.02em',
      }}
    >
      {children}
    </button>
  )
}

export default function App() {
  const { theme, lang, str, toggleTheme, toggleLang } = useApp()
  const { msgs, incidents, loading, error, send } = useChat(str.mockReplies)
  const [prefill, setPrefill] = useState('')

  function handleAttack(text) { setPrefill(text); send(text) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 16px', borderBottom: '1px solid var(--bd2)',
        background: 'var(--s1)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--tx)' }}>
            PromptGuard
          </span>
          <span style={{
            fontSize: 9.5, fontWeight: 500, letterSpacing: '.06em',
            color: 'var(--blue)', padding: '2px 6px',
            border: '1px solid var(--blue-bd)', borderRadius: 5,
            background: 'var(--blue-bg)', textTransform: 'uppercase',
          }}>
            beta
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <TopBtn onClick={toggleTheme}>
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </TopBtn>
          <TopBtn onClick={toggleLang}>
            {lang === 'uk' ? 'EN' : 'УК'}
          </TopBtn>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', flex: 1, overflow: 'hidden' }}>
        <ChatWindow
          msgs={msgs} loading={loading} error={error} onSend={send}
          prefill={prefill} onPrefillClear={() => setPrefill('')}
        />
        <SecurityPanel incidents={incidents} msgs={msgs} onRedTeamAttack={handleAttack} />
      </div>
    </div>
  )
}
