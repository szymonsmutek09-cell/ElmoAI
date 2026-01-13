require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ==========================
# OPENAI – BEZPIECZNY KLUCZ
========================== */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY=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
});

/* FRONTEND */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* CHAT API */
app.post("/chat", async (req, res) => {
  console.log("📩 REQUEST:", req.body);

  try {
    const { message, style, mode } = req.body;

    const systemPrompt = `
Jesteś ekspertem w dziedzinie: ${mode}.
Odpowiadasz w stylu: ${style}.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = response.output_text || "Brak odpowiedzi od AI.";

    res.json({ reply });

  } catch (err) {
    console.error("❌ BACKEND ERROR:", err);
    res.status(500).json({ reply: "Błąd backendu – sprawdź serwer." });
  }
});

/* START */
app.listen(3000, () => {
  console.log("✅ Serwer działa: http://localhost:3000");
});
