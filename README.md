# PromptGuard UI

A React chat interface and incident dashboard for an LLM guardrail system.

[Demo](https://promptguard-ui.vercel.app) · [Team repository](https://github.com/kirataske/prompt-guard) · [Portfolio](https://daniilbarilotti.github.io/Portfolio/)

## Project context and contribution

The existing project documents development during a DevBrother internship. This repository contains the frontend: chat messages, request verdicts, suspicious-fragment highlighting, incident views, example prompts and API integration. The Node proxy and Python detector belong to the separate team repository; they are not implemented here.

## Features

- Markdown rendering for chat responses.
- Clean, suspicious and blocked request states.
- Attack metadata and highlighted fragments.
- Session incident view and predefined red-team examples.
- English / Ukrainian interface and light / dark themes.

## Run locally

```bash
git clone https://github.com/DaniilBarilotti/promptguard-ui.git
cd promptguard-ui
npm ci
cp .env.example .env
npm run dev
```

The app uses React 18, Vite, axios, react-markdown and CSS custom properties. `npm run build` creates a production bundle.

## Demo versus connected mode

`VITE_USE_MOCK=true` runs without a backend. Mock replies cycle through predefined verdicts **independently of the submitted prompt**. They demonstrate UI states; they do not detect attacks, measure confidence or provide real security protection.

To connect the separate proxy:

```env
VITE_USE_MOCK=false
VITE_PROXY_URL=http://localhost:3000
```

Frontend environment variables are public. Do not put secrets or provider API keys in them.

## API contract

| Request | Expected behaviour |
| --- | --- |
| `POST /` with `{ sessionId, prompt }` | Successful response uses `{ status: "ok", response }` |
| HTTP 403, `status: injection_detected` | Display `incident.verdict`, severity, attack type and segment |
| HTTP 429 | Display a rate-limit error |
| `GET /incidents` | Map returned incidents to dashboard items |

`src/api/client.js` normalises proxy responses. `src/hooks/useChat.js` manages chat state; `src/components/` separates chat, security and red-team presentation.

## Limitations

Backend enforcement is essential; frontend display is not a security boundary. Real-mode incident loading currently returns an empty array on failure, so an unavailable API can look like an empty incident log. The repository does not establish detector accuracy or production readiness.
