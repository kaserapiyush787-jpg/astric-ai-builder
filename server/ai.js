const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    const fullPrompt = `
You are a professional AI Website Builder.

Create a complete modern responsive website.

Rules:
- Return ONLY HTML code.
- Include CSS inside <style>.
- Include JavaScript inside <script>.
- No markdown.
- No explanation.

Website request:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: fullPrompt,
    });

    res.json({
      success: true,
      code: response.text,
    });

  } catch (err) {
    console.error("Gemini Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;