const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

// ==========================
// Save Project
// ==========================
router.post("/save", async (req, res) => {
  router.put("/:id", async (req, res) => {
  // Update Project
});
  try {
    const { name, prompt, html, css, javascript,user_id } = req.body;

    const { data, error } = await supabase
      .from("Ai")
      .insert([
        {
          name,
          prompt,
          html,
          css,
          javascript,
          user_id,
        },
      ])
      .select();

    if (error) {
      console.log("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Project Saved Successfully",
      project: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ==========================
// Get All Projects
// ==========================
router.get("/", async (req, res) => {
  try {
    const user_id = req.query.user_id;

    const { data, error } = await supabase
      .from("Ai")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      projects: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ==========================
// Get Single Project
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user_id =req.query.user_id;

    const { data, error } = await supabase
      .from("Ai")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      project: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ==========================
// Delete Project
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("Ai")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// ==========================
// Update Project
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { html } = req.body;

    const { data, error } = await supabase
      .from("Ai")
      .update({
        html,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Project Updated Successfully",
      project: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;