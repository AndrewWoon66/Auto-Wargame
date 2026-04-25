const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const ILMU_API_KEY = process.env.ILMU_API_KEY;
const ILMU_ENDPOINT = "https://api.ilmu.ai/anthropic/v1/messages";
const MODEL = "ilmu-glm-5.1";

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    keyConfigured: !!ILMU_API_KEY,
    model: MODEL,
  });
});

// Test connection to ILMU
app.get("/api/test", async (req, res) => {
  if (!ILMU_API_KEY) {
    return res.status(500).json({ error: "ILMU_API_KEY not set in .env file" });
  }
  try {
    const response = await fetch(ILMU_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ILMU_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 50,
        messages: [{ role: "user", content: "Reply with exactly: WARGAME_OK" }],
      }),
    });

    // 1. Read raw text first to prevent HTML parsing crashes
    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      throw new Error(`ILMU API connection test failed (Status ${response.status}). Expected JSON but got HTML/Text. The API might be temporarily overloaded.`);
    }

    if (!response.ok) throw new Error(JSON.stringify(data));
    
    const text = data.content?.map((b) => b.text || "").join("") || "";
    res.json({ success: true, response: text });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Main GLM call — used for every simulation stage
app.post("/api/glm", async (req, res) => {
  if (!ILMU_API_KEY) {
    return res.status(500).json({ error: "ILMU_API_KEY not set in .env file" });
  }
  const { messages, maxTokens = 1200 } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }
  
  try {
    const response = await fetch(ILMU_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ILMU_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages,
      }),
    });

    // 1. Read raw text first to prevent HTML parsing crashes
    const rawText = await response.text(); 
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      throw new Error(`ILMU API returned an invalid format (Status ${response.status}). The API might be overloaded. Try launching the simulation again!`);
    }

    // 2. Check for JSON-formatted errors from the API
    if (!response.ok) throw new Error(JSON.stringify(data));

    const text = data.content?.map((b) => b.text || "").join("") || "";
    const usage = data.usage || {};
    res.json({ text, usage });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ Auto-Wargame backend running on http://localhost:${PORT}`);
  console.log(`   API Key: ${ILMU_API_KEY ? "✓ Configured" : "✗ MISSING — check .env"}`);
  console.log(`   Model:   ${MODEL}\n`);
});
