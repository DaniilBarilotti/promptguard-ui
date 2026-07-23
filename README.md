# PromptGuard UI

Frontend частина системи виявлення атак типу **prompt injection** на LLM-застосунки.

Розроблено під час виробничої практики у [DevBrother](https://devbrother.com), Харків.

🔗 **[Live Demo](https://promptguard-ui.vercel.app)** · [Команда](https://github.com/kirataske/prompt-guard)

---

## Що це

PromptGuard — командний проєкт безпеки. Система перехоплює запити до LLM і перевіряє їх на наявність prompt injection перед тим як вони потраплять до моделі.

**Моя частина** — фронтенд: чат-інтерфейс і панель безпеки.

Повна архітектура системи:
```
Frontend → Node.js guardrail-proxy → Python detector (3-level ML) → LLM API
```

---

## Функціонал

- **Чат з LLM** — відображення запитів і відповідей з markdown рендерингом
- **Статус кожного запиту** — ✓ чистий · ⚠ підозрілий · ✕ заблоковано
- **Підсвічування** — конкретний фрагмент тексту що спрацював виділяється у повідомленні
- **Тип атаки** — direct_injection, system_prompt_leak, role_play, obfuscation, payload_splitting, indirect_injection
- **Лог інцидентів** — фільтри, час, фрагмент, рівень детектора
- **Red Team режим** — готові приклади всіх типів атак для демо
- **Темна / світла тема** — зберігається у localStorage
- **Українська / English** — перемикач мови інтерфейсу

---

## Запуск

```bash
git clone https://github.com/DaniilBarilotti/promptguard-ui
cd promptguard-ui
npm install
cp .env.example .env
npm run dev
```

Відкрийте [http://localhost:5173](http://localhost:5173)

За замовчуванням `VITE_USE_MOCK=true` — працює без бекенду.

### Підключення до реального API

```env
VITE_USE_MOCK=false
VITE_PROXY_URL=http://localhost:3000
```

---

## Стек

`React 18` · `Vite` · `axios` · `react-markdown` · `CSS Custom Properties`

---

## Пов'язані репозиторії

- [Node.js guardrail-proxy](https://github.com/kirataske/prompt-guard/tree/feat/node-proxy)
- [Python ML detector](https://github.com/kirataske/prompt-guard/tree/feat/python-detector)

