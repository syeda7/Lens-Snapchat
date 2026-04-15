# Backboard Proxy for Lens

This small Node.js server keeps your Backboard API key on the backend.

## 1) Setup

```bash
cd api
npm install
cp .env.example .env
```

Edit `.env` and set `BACKBOARD_API_KEY`.

## 2) Run

```bash
npm run dev
```

Server starts on `http://localhost:3000` by default.

## 3) Test

```bash
curl -X POST "http://localhost:3000/api/backboard/message" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Give me 3 Snapchat lens ideas",
    "memory": "Auto"
  }'
```

Response includes `assistantId`, `threadId`, and Backboard response payload.

## Request body

```json
{
  "content": "string (required)",
  "assistantId": "string (optional)",
  "threadId": "string (optional)",
  "stream": false,
  "memory": "Auto",
  "llmProvider": "openai",
  "modelName": "gpt-4o"
}
```

## Lens integration idea

1. From your Lens script, call your own backend endpoint (not Backboard directly).
2. Store `threadId` per user/session so conversation context is preserved.
3. Never ship your Backboard API key in Lens assets or client-side scripts.
