"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {

      setLoading(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              "https://astric-ai-builder-dycr.vercel.app/reset-password",
          }
        );

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Password reset link has been sent to your email."
      );

      setEmail("");

    } catch (err) {

      alert("Something went wrong.");

    } finally {

      setLoading(false);

    }

  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 15px 40px rgba(0,0,0,.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>

          <h1
            style={{
              fontSize: "32px",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            ⚡ ASTRIC AI
          </h1>

          <h2>Forgot Password</h2>

          <p
            style={{
              color: "#6b7280",
              lineHeight: "26px",
            }}
          >
            Enter your registered email to receive a password reset link.
          </p>

        </div>

        <label>Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "10px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleResetPassword}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading
            ? "Sending..."
            : "📧 Send Reset Link"}
        </button>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Link
            href="/login"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </main>
  );
}
