import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate automatic review reply endpoint
app.post("/api/generate-reply", async (req, res) => {
  try {
    const { reviewText, reviewerName, rating, businessName = "Körperglanz Shapeline", tone = "friendly and professional" } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if API key is not yet set in environment
      const defaultReply = rating >= 4
        ? `Vielen Dank für Ihre wunderbare Bewertung, ${reviewerName || 'liebe(r) Kund(in)'}! Es freut uns sehr, dass Sie bei ${businessName} so zufrieden waren. Wir freuen uns schon auf Ihren nächsten Besuch!`
        : `Vielen Dank für Ihr Feedback, ${reviewerName || 'lieber Kunde'}. Wir bedauern, dass nicht alles perfekt war. Bitte kontaktieren Sie uns direkt bei ${businessName}, damit wir eine Lösung finden können.`;
      return res.json({ reply: defaultReply });
    }

    const prompt = `Du bist ein freundlicher, hochprofessioneller Kundenservice-Assistent für das lokale Unternehmen "${businessName}".
Schreibe eine kurze, charmante und direkte Antwort auf die folgende Google-Bewertung von "${reviewerName || 'einem Kunden'}".

Bewertung (${rating} von 5 Sternen): "${reviewText || 'Super Service!'}"

Richtlinien:
- Tonalität: ${tone}
- Sprache: Deutsch (oder in der Sprache der Bewertung, falls Englisch)
- Länge: Maximal 2-3 kurze Sätze.
- Drücke echten Dank aus und erwähne kurz den Servicenamen/Ort wenn passend.
- Keine Platzhalter. Keine Anführungszeichen um den Text. Schreibe direkt die fertige Antwort.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const reply = response.text ? response.text.trim() : "Vielen Dank für Ihre tolle Bewertung!";
    return res.json({ reply });
  } catch (error) {
    console.error("Error generating review reply:", error);
    res.status(500).json({
      error: "Anwort konnte nicht generiert werden.",
      fallbackReply: "Vielen Dank für Ihre fantastische Bewertung! Wir freuen uns sehr auf Ihren nächsten Besuch bei uns."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Lokal] Server running at http://localhost:${PORT}`);
  });
}

startServer();
