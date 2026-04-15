require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 3000);
const BACKBOARD_BASE_URL =
  process.env.BACKBOARD_BASE_URL || "https://app.backboard.io/api";
const BACKBOARD_API_KEY = process.env.BACKBOARD_API_KEY;

if (!BACKBOARD_API_KEY) {
  console.error("Missing BACKBOARD_API_KEY in environment.");
  process.exit(1);
}

async function backboardRequest(path, options = {}) {
  const response = await fetch(`${BACKBOARD_BASE_URL}${path}`, {
    ...options,
    headers: {
      "X-API-Key": BACKBOARD_API_KEY,
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error("Backboard API request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function createAssistant() {
  const payload = {
    name: process.env.BACKBOARD_ASSISTANT_NAME || "Lens Assistant",
    system_prompt:
      process.env.BACKBOARD_SYSTEM_PROMPT ||
      "You are a concise assistant for Snapchat Lens interactions.",
  };

  const result = await backboardRequest("/assistants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return result.assistant_id;
}

async function createThread(assistantId) {
  const result = await backboardRequest(`/assistants/${assistantId}/threads`, {
    method: "POST",
  });

  return result.thread_id;
}

async function sendMessage({
  threadId,
  content,
  stream = false,
  memory = "Auto",
  llmProvider,
  modelName,
}) {
  const form = new URLSearchParams();
  form.set("content", content);
  form.set("stream", String(Boolean(stream)));

  if (memory) form.set("memory", memory);
  if (llmProvider) form.set("llm_provider", llmProvider);
  if (modelName) form.set("model_name", modelName);

  return backboardRequest(`/threads/${threadId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/backboard/message", async (req, res) => {
  try {
    const { content, assistantId, threadId, stream, memory, llmProvider, modelName } =
      req.body || {};

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        error: "Invalid request",
        detail: "`content` (string) is required.",
      });
    }

    let resolvedAssistantId =
      assistantId || process.env.BACKBOARD_ASSISTANT_ID || "";

    if (!resolvedAssistantId) {
      resolvedAssistantId = await createAssistant();
    }

    let resolvedThreadId = threadId || "";
    if (!resolvedThreadId) {
      resolvedThreadId = await createThread(resolvedAssistantId);
    }

    const result = await sendMessage({
      threadId: resolvedThreadId,
      content,
      stream,
      memory,
      llmProvider,
      modelName,
    });

    return res.json({
      assistantId: resolvedAssistantId,
      threadId: resolvedThreadId,
      response: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: "Backboard request failed",
      detail: error.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backboard proxy listening on http://localhost:${PORT}`);
});
