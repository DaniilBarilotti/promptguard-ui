import { useApp } from '../../ctx/AppContext.jsx'

function ts(d) {
  return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function IncRow({ inc }) {
  const { str } = useApp()
  const isBlocked = inc.status === 'blocked'
  const color  = isBlocked ? 'var(--red)'    : 'var(--yellow)'
  const bdCol  = isBlocked ? 'var(--red-bd)' : 'var(--yellow-bd)'

  return (
    <div className="fade-up" style={{
      marginBottom: 8, borderRadius: 'var(--r)',
      background: 'var(--s2)',
      border: '1px solid var(--bd2)',
      borderLeft: `3px solid ${bdCol}`,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color }}>
            {isBlocked ? '✕' : '⚠'} {str.attacks[inc.attackType] || inc.attackType || '—'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--tx4)', fontFamily: 'var(--m)' }}>
            {ts(inc.ts)}
          </span>
        </div>

        {inc.suspiciousFragment && (
          <div style={{
            fontFamily: 'var(--m)', fontSize: 11, color: 'var(--tx3)',
            background: 'var(--bg)', padding: '5px 8px',
            borderRadius: 6, marginBottom: 7, wordBreak: 'break-all',
            borderLeft: `2px solid ${bdCol}`,
          }}>
            "{inc.suspiciousFragment}"
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--tx4)' }}>
          {inc.detectionLevel != null && <span>{str.levelLabel} {inc.detectionLevel}</span>}
          {inc.confidence     != null && <span>{Math.round(inc.confidence * 100)}% {str.confLabel}</span>}
        </div>
      </div>
    </div>
  )
}

function StatCard({ n, label, color }) {
  return (
    <div style={{
      background: 'var(--s2)', border: '1px solid var(--bd2)',
      borderRadius: 'var(--r)', padding: '10px 6px', textAlign: 'center',
      transition: 'border-color .2s',
    }}>
      <div style={{ fontSize: 22, fontWeight: 600, color, fontFamily: 'var(--m)', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 10, color: 'var(--tx4)', marginTop: 4, letterSpacing: '.02em' }}>{label}</div>
    </div>
  )
}

export default function IncidentLog({ incidents, msgs }) {
  const { str } = useApp()
  const userMsgs = msgs.filter(m => m.role === 'user' && m.status !== 'pending')
  const cc = userMsgs.filter(m => m.status === 'clean').length
  const sc = incidents.filter(i => i.status === 'suspicious').length
  const bc = incidents.filter(i => i.status === 'blocked').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, padding: '12px 12px 0', flexShrink: 0 }}>
        <StatCard n={cc} label={str.statClean}      color="var(--green)"  />
        <StatCard n={sc} label={str.statSuspicious} color="var(--yellow)" />
        <StatCard n={bc} label={str.statBlocked}    color="var(--red)"    />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {incidents.length === 0
          ? <div style={{ textAlign: 'center', color: 'var(--tx4)', fontSize: 12, paddingTop: 24 }}>
              {str.noIncidents}
            </div>
          : incidents.map(inc => <IncRow key={inc.id} inc={inc} />)
        }
      </div>
    </div>
  )
}
