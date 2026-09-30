const express = require("express");
const router = express.Router();

const axios = require("axios");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const os = require("os");

const supabase = require("../config/supabase");

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
const NETLIFY_TEAM_ID = process.env.NETLIFY_TEAM_ID;

// Publish Website
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      project_id,
      subdomain,
      html,
    } = req.body;

    if (!user_id || !project_id || !subdomain || !html) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

   // Create Netlify Site

const createSite = await axios.post(
  "https://api.netlify.com/api/v1/sites",
  {
    name: subdomain,
  },
  {
    headers: {
      Authorization: `Bearer ${NETLIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
  }
);

const site = createSite.data;

const siteId = site.id;
const siteUrl = site.ssl_url || site.url;
console.log("Netlify Site Created:", siteId);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;