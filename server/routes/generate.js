const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const supabase = require("../config/supabase");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", async (req, res) => {

  try {

    const {
      prompt,
      user_id,
    } = req.body;

    // Validation

    if (!prompt || !user_id) {

      return res.status(400).json({
        success: false,
        error: "Prompt and user_id are required",
      });

    }

    // Load User Profile

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {

      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });

    }

    // FREE Plan Checks

    if (profile.plan !== "PRO") {

      const now = new Date();

      const trialEnd = new Date(
        profile.trial_end
      );

      // Trial Expired

      if (now > trialEnd) {

        return res.status(403).json({

          success: false,

          upgrade: true,

          error:
            "Your 10-day free trial has expired. Upgrade to Pro for ₹199.",

        });

      }

      // Points Check

      if (profile.ai_points < 300) {

        return res.status(403).json({

          success: false,

          upgrade: true,

          error:
            "Not enough ASTRIC Points. Upgrade to Pro for ₹199.",

        });

      }

    }

    // AI Prompt

    const fullPrompt = `
You are a professional AI Website Builder.

Create a complete responsive website.

Rules:

- Return only HTML.
- Put CSS inside <style>.
- Put JavaScript inside <script>.
- Do not use markdown.
- Do not explain anything.

Website Request:

${prompt}
`;

    // Part 2 से आगे...
    // Generate Website

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const generatedCode = response.text;

    // Remaining Points

    let remainingPoints = profile.ai_points;

    // FREE Plan → Deduct 300 Points

    if (profile.plan !== "PRO") {

      remainingPoints = profile.ai_points - 300;

      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            ai_points: remainingPoints,
          })
          .eq("id", user_id);

      if (updateError) {

        return res.status(500).json({
          success: false,
          error: updateError.message,
        });

      }

    }

    // Auto Save Project

    const { data: project, error: projectError } =
      await supabase
        .from("ai_projects")
        .insert([
          {
            user_id: user_id,
            name: prompt.substring(0, 50),
            prompt: prompt,
            html: generatedCode,
            status: "draft",
          },
        ])
        .select()
        .single();

    if (projectError) {

      return res.status(500).json({
        success: false,
        error: projectError.message,
      });

    }

    return res.json({
      success: true,
      code: generatedCode,
      project_id: project.id,
      ai_points: remainingPoints,
      plan: profile.plan,
      trial_end: profile.trial_end,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }

});

module.exports = router;