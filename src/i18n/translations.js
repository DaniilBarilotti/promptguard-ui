// всі рядки інтерфейсу — UK і EN
// якщо додаєте новий текст — спочатку сюди, потім у компонент через useLang()

const t = {
  uk: {
    // чат
    chatTitle:      'PromptGuard Chat',
    proxyLabel:     'guardrail-proxy',
    placeholder:    'Введіть повідомлення...',
    send:           'Надіслати →',
    checking:       'Перевірка...',
    emptyChat:      'Кожен запит проходить через детектор\nперед тим як потрапити в LLM',
    you:            'ви',
    llm:            'LLM',
    blockedNote:    'Запит зупинено — до LLM не дійшов',
    proxyError:     "Помилка з'єднання з проксі",

    // статуси
    statusClean:    'чистий',
    statusSuspicious: 'підозрілий',
    statusBlocked:  'заблоковано',
    statusPending:  'перевірка...',

    // панель безпеки
    secPanel:       'Панель безпеки',
    tabIncidents:   'Інциденти',
    tabRedTeam:     'Red Team',
    noIncidents:    'Інцидентів ще не було',
    statClean:      'чистих',
    statSuspicious: 'підозр.',
    statBlocked:    'заблок.',
    levelLabel:     'рівень',
    confLabel:      'впевненість',

    // red team
    rtDesc:    'Клік — атака підставиться в чат і відправиться. Для демо детектора.',

    // типи атак
    attacks: {
      direct_injection:   "Пряма ін'єкція",
      indirect_rag:       'Непряма (RAG)',
      system_prompt_leak: 'Витік system prompt',
      role_play_bypass:   'Role-play обхід',
      obfuscation:        'Обфускація',
      payload_splitting:  'Payload splitting',
    },

    // моделі
    mockReplies: [
      'Привіт! Готовий відповідати на питання про кібербезпеку.',
      'Звичайно, ось докладніша інформація...',
    ],
  },

  en: {
    chatTitle:      'PromptGuard Chat',
    proxyLabel:     'guardrail-proxy',
    placeholder:    'Type a message...',
    send:           'Send →',
    checking:       'Checking...',
    emptyChat:      'Every request passes through the detector\nbefore reaching the LLM',
    you:            'you',
    llm:            'LLM',
    blockedNote:    'Request stopped — never reached the LLM',
    proxyError:     'Proxy connection error',

    statusClean:       'clean',
    statusSuspicious:  'suspicious',
    statusBlocked:     'blocked',
    statusPending:     'checking...',

    secPanel:       'Security Panel',
    tabIncidents:   'Incidents',
    tabRedTeam:     'Red Team',
    noIncidents:    'No incidents yet',
    statClean:      'clean',
    statSuspicious: 'suspic.',
    statBlocked:    'blocked',
    levelLabel:     'level',
    confLabel:      'confidence',

    rtDesc: 'Click an attack — it will be sent to the chat instantly. For detector demo.',

    attacks: {
      direct_injection:   'Direct injection',
      indirect_rag:       'Indirect (RAG)',
      system_prompt_leak: 'System prompt leak',
      role_play_bypass:   'Role-play bypass',
      obfuscation:        'Obfuscation',
      payload_splitting:  'Payload splitting',
    },

    mockReplies: [
      'Hello! Ready to answer questions about cybersecurity.',
      'Sure, here is more detailed information...',
    ],
  },
}

export default t
