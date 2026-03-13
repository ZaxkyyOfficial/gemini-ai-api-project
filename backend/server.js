const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Using the correct Generative AI package for CommonJS
// In case @google/genai fails, we will fallback to standard SDK structure, but let's try the new one
try {
  const { GoogleGenAI } = require("@google/genai");
  // Ensure we load the backend/.env file regardless of where the server is started from.
  dotenv.config({ path: path.join(__dirname, ".env") });

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // Wait, the new SDK might be initialized differently, but we'll try this
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-2.5-flash"; // Or 1.5 if 2.5 is not available

  const systemInstruction = `Kamu adalah EcoSphere AI, asisten pribadi masa depan untuk produktivitas hijau. 
  Gunakan gaya bahasa casual, sopan (seperti Sobat Bumi, Guys). 
  Domain ahli: perubahan iklim, energi, pengelolaan limbah. 
  Selalu ingat preferensi pengguna dalam konteks chat history. 
  Jika ditanya hal di luar lingkungan atau produktivitas hijau, arahkan kembali dengan sopan ke topik kelestarian bumi.`;

  const userSessions = {};

  const hasGeminiApiKey = Boolean(process.env.GEMINI_API_KEY);

  const fallbackTips = {
    energy: [
      "Matikan perangkat elektronik saat tidak digunakan dan gunakan lampu LED hemat energi.",
      "Gunakan peralatan listrik berlabel energi A++ dan manfaatkan sinar matahari untuk penerangan.",
      "Atur AC di suhu 24-26°C dan jangan biarkan pintu atau jendela terbuka terlalu lama.",
    ],
    waste: [
      "Pisahkan sampah organik dan non-organik, lalu daur ulang plastik dan kertas.",
      "Kurangi penggunaan plastik sekali pakai dengan membawa tas kain dan botol minum sendiri.",
      "Komposkan sampah organik seperti sisa makanan untuk mengurangi limbah ke TPA.",
    ],
    transport: [
      "Gunakan transportasi umum atau carpooling untuk mengurangi emisi karbon.",
      "Berjalan kaki atau naik sepeda untuk perjalanan singkat agar lebih ramah lingkungan.",
      "Pertimbangkan kendaraan listrik atau hibrida jika memungkinkan.",
    ],
    general: [
      "Mulailah langkah kecil: matikan lampu saat keluar ruangan dan kurangi penggunaan plastik.",
      "Pilih produk dengan kemasan ramah lingkungan dan gunakan ulang bila memungkinkan.",
      "Tanam pohon atau dukung inisiatif lokal yang menjaga kelestarian lingkungan.",
    ],
  };

  function getFallbackReply(message) {
    const normalized = (message || "").toLowerCase();
    if (/(energi|listrik|hemat|ac|led|lampu)/.test(normalized)) {
      return fallbackTips.energy[
        Math.floor(Math.random() * fallbackTips.energy.length)
      ];
    }
    if (/(sampah|limbah|daur ulang|recycle|plastik)/.test(normalized)) {
      return fallbackTips.waste[
        Math.floor(Math.random() * fallbackTips.waste.length)
      ];
    }
    if (
      /(kendaraan|mobil|motor|transport|angkutan|bus|kereta)/.test(normalized)
    ) {
      return fallbackTips.transport[
        Math.floor(Math.random() * fallbackTips.transport.length)
      ];
    }
    if (/^(halo|hi|hai|helo|apa|boleh)/.test(normalized)) {
      return "Halo Sobat Bumi! Ada yang bisa aku bantu seputar gaya hidup hijau atau penghematan energi hari ini?";
    }
    return fallbackTips.general[
      Math.floor(Math.random() * fallbackTips.general.length)
    ];
  }

  async function generateReply(message, history) {
    if (!hasGeminiApiKey) {
      return getFallbackReply(message);
    }

    try {
      const prompt = [
        systemInstruction,
        ...history.map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
        ),
        "Assistant:",
      ].join("\n");

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      return response.text ?? getFallbackReply(message);
    } catch (err) {
      console.warn(
        "Gemini API call failed, using fallback reply:",
        err?.message || err,
      );
      return getFallbackReply(message);
    }
  }

  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message } = req.body;

      try {
        fs.appendFileSync(
          path.join(__dirname, "request.log"),
          `${new Date().toISOString()} [${sessionId}] ${message}\n`,
        );
      } catch {
        // ignore logging errors
      }

      if (!sessionId || !message) {
        return res
          .status(400)
          .json({ error: "sessionId and message are required" });
      }

      if (!userSessions[sessionId]) {
        userSessions[sessionId] = [];
      }

      const history = userSessions[sessionId];
      history.push({ role: "user", content: message });

      console.log(`Incoming chat (session=${sessionId}):`, message);

      const aiText = await generateReply(message, history);
      console.log(`AI response (session=${sessionId}):`, aiText);

      history.push({ role: "assistant", content: aiText });
      res.json({ reply: aiText });
    } catch (error) {
      const errMsg = `Error with Gemini API: ${error?.message || error}\n${error?.stack || ""}\n`;
      console.error(errMsg);
      try {
        fs.appendFileSync(
          path.join(__dirname, "error.log"),
          `${new Date().toISOString()} - ${errMsg}\n`,
        );
      } catch (writeErr) {
        console.error("Failed to write error.log:", writeErr);
      }
      res.status(500).json({ error: "Telah terjadi kesalahan pada server." });
    }
  });

  app.listen(port, () => {
    console.log(
      `Backend server running on http://localhost:${port} (pid=${process.pid})`,
    );
    try {
      fs.writeFileSync(
        path.join(__dirname, "startup.log"),
        `started ${new Date().toISOString()} pid=${process.pid}\n`,
      );
    } catch (writeErr) {
      console.error("Failed to write startup.log:", writeErr);
    }
  });
} catch (e) {
  console.error("Initialization error:", e);
}
