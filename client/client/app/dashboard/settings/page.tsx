"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

const {
  data: { user },
} = await supabase.auth.getUser();

const user_id = user?.id;

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  

  const saveSettings = () => {
    alert("✅ Settings Saved Successfully");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "10px",
        }}
      >
        ⚙️ Settings
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "30px",
        }}
      >
        Manage your ASTRIC AI Builder preferences.
      </p>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          maxWidth: "700px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>General Settings</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <span>🌙 Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <span>📧 Email Notifications</span>
          <input
            type="checkbox"
            checked={emailNotify}
            onChange={() => setEmailNotify(!emailNotify)}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <span>💾 Auto Save Projects</span>
          <input
            type="checkbox"
            checked={autoSave}
            onChange={() => setAutoSave(!autoSave)}
          />
        </div>

        <button
          onClick={saveSettings}
          style={{
            width: "100%",
            padding: "14px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          💾 Save Settings
        </button>
      </div>
    </main>
  );
}