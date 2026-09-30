"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setErrorMessage(error.message);
        return;
      }

      if (!data.user) {
        setErrorMessage("Login failed. User account was not returned.");
        return;
      }

      // Keep user ID for your existing dashboard/project logic
      localStorage.setItem("user_id", data.user.id);

      setSuccessMessage("Login successful. Opening dashboard...");

      // Give Supabase session a moment to persist
      setTimeout(() => {
        router.replace("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Unexpected login error:", error);

      setErrorMessage(
        "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617,#1e3a8a,#2563eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(380px,520px)",
          background: "rgba(255,255,255,.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow: "0 25px 70px rgba(0,0,0,.35)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            padding: "70px",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.10)",
              border: "1px solid rgba(255,255,255,.15)",
              marginBottom: "25px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ⚡ ASTRIC AI BUILDER
          </div>

          <h1
            style={{
              fontSize: "58px",
              lineHeight: "1.15",
              margin: "0 0 25px",
              fontWeight: "800",
            }}
          >
            Welcome Back to
            <br />
            ASTRIC AI Builder
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#dbeafe",
              lineHeight: "34px",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            Log in to continue building professional AI-powered websites,
            manage your projects and publish them online.
          </p>

          <div
            style={{
              marginTop: "55px",
              fontSize: "18px",
              lineHeight: "42px",
            }}
          >
            <div>✅ AI Website Generator</div>
            <div>✅ Cloud Project Storage</div>
            <div>✅ Live Preview</div>
            <div>✅ One Click Publish</div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "55px",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              margin: "0 0 10px",
              color: "#3468d6",
            }}
          >
            Login
          </h2>

          <p
            style={{
              color: "#6b7280",
              margin: "0 0 35px",
            }}
          >
            Sign in to your account.
          </p>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              ❌ {errorMessage}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              ✅ {successMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "18px",
              }}
            >
              <label
                htmlFor="email"
                style={{
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={inputStyle}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    padding: "15px",
                    fontSize: "16px",
                    color: "#111827",
                    background: "#fff",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  style={{
                    border: "none",
                    background: "#f3f4f6",
                    padding: "15px",
                    cursor: "pointer",
                    fontWeight: "700",
                    color: "#374151",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                marginTop: "18px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#2558be",
                  fontSize: "14px",
                }}
              >
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                href="/forget-password"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "25px",
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                fontSize: "17px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s ease",
              }}
            >
              {loading ? "Signing In..." : "🚀 Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "30px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "#e5e7eb",
              }}
            />

            <span
              style={{
                margin: "0 15px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              OR
            </span>

            <div
              style={{
                flex: 1,
                height: "1px",
                background: "#e5e7eb",
              }}
            />
          </div>

          {/* GOOGLE UI */}
          <button
            type="button"
            onClick={() =>
              setErrorMessage(
                "Google login is not connected yet. Email and password login is active."
              )
            }
            style={googleButton}
          >
            Continue with Google
          </button>

          {/* SIGNUP */}
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <span
              style={{
                color: "#6b7280",
              }}
            >
              Don't have an account?
            </span>

            <Link
              href="/signup"
              style={{
                marginLeft: "8px",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Create Account
            </Link>
          </div>

          {/* SECURITY */}
          <div
            style={{
              marginTop: "35px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "18px",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                margin: "0 0 8px",
              }}
            >
              🔒 Secure Login
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: "24px",
                margin: 0,
              }}
            >
              Your account is protected using secure authentication and
              encrypted cloud storage.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================
   STYLES
========================= */

const inputStyle = {
  width: "100%",
  padding: "15px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box" as const,
  color: "#111827",
  background: "#ffffff",
};

const googleButton = {
  width: "100%",
  padding: "15px",
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
};