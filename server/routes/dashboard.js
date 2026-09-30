const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Total Projects
    const { count: totalProjects } = await supabase
      .from("Ai")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    // Published Websites
    const { count: totalPublished } = await supabase
      .from("published_sites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    res.json({
      success: true,
      totalProjects: totalProjects || 0,
      totalPublished: totalPublished || 0,
      totalViews: 0,
      currentPlan: "FREE",
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;