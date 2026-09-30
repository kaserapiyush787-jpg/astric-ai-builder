"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!terms) {
      setErrorMessage(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * We only create the Auth account here.
       *
       * The Supabase database trigger
       * "on_auth_user_created"
       * automatically creates the profile.
       */

      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: cleanName,
            },
          },
        });

      if (error) {
        console.error(
          "SUPABASE SIGNUP ERROR:",
          error
        );

        setErrorMessage(error.message);
        return;
      }

      if (!data.user) {
        setErrorMessage(
          "Account could not be created. Please try again."
        );
        return;
      }

      /*
       * Save user id locally.
       */
      localStorage.setItem(
        "user_id",
        data.user.id
      );

      /*
       * If email confirmation is disabled,
       * Supabase usually creates a session.
       */

      if (data.session) {
        setSuccessMessage(
          "Account created successfully. Opening dashboard..."
        );

        setTimeout(() => {
          router.replace("/dashboard");
        }, 700);

        return;
      }

      /*
       * If email confirmation is enabled.
       */

      setSuccessMessage(
        "Account created successfully. Please check your email to verify your account."
      );

      setTimeout(() => {
        router.replace("/login");
      }, 1500);

    } catch (error) {
      console.error(
        "UNEXPECTED SIGNUP ERROR:",
        error
      );

      setErrorMessage(
        "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength =
    password.length >= 12
      ? "Strong password"
      : password.length >= 8
      ? "Good password"
      : password.length > 0
      ? "Password too short"
      : "";

  const passwordStrengthWidth =
    password.length >= 12
      ? "100%"
      : password.length >= 8
      ? "70%"
      : password.length > 0
      ? "35%"
      : "0%";

  const passwordStrengthColor =
    password.length >= 12
      ? "#22c55e"
      : password.length >= 8
      ? "#f59e0b"
      : "#ef4444";

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
          gridTemplateColumns:
            "minmax(0,1fr) minmax(380px,520px)",
          background: "rgba(255,255,255,.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 25px 70px rgba(0,0,0,.35)",
        }}
      >

        {/* =========================
            LEFT SIDE
        ========================== */}

        <div
          style={{
            padding: "70px",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background:
                "rgba(255,255,255,.10)",
              border:
                "1px solid rgba(255,255,255,.15)",
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
            Create your AI Website in Minutes
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#dbeafe",
              lineHeight: "34px",
              maxWidth: "550px",
              margin: 0,
            }}
          >
            Join ASTRIC AI Builder and generate
            beautiful, responsive websites using
            Artificial Intelligence.
          </p>

          <div
            style={{
              marginTop: "60px",
              fontSize: "18px",
              lineHeight: "45px",
            }}
          >
            <div>✅ AI Website Generator</div>
            <div>✅ Live Code Editor</div>
            <div>✅ Cloud Projects</div>
            <div>✅ One Click Publish</div>
          </div>
        </div>

        {/* =========================
            SIGNUP CARD
        ========================== */}

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
              color: "#111827",
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color: "#6b7280",
              margin: "0 0 30px",
            }}
          >
            Start building with AI for free.
          </p>

          {/* ERROR */}

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

          {/* SUCCESS */}

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

          <form onSubmit={handleSignup}>

            {/* FULL NAME */}

            <label
              htmlFor="name"
              style={labelStyle}
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
              style={inputStyle}
            />

            {/* EMAIL */}

            <label
              htmlFor="email"
              style={labelStyle}
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              style={inputStyle}
            />

            {/* PASSWORD */}

            <label
              htmlFor="password"
              style={labelStyle}
            >
              Password
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border:
                  "1px solid #d1d5db",
                borderRadius: "12px",
                overflow: "hidden",
                marginTop: "8px",
                background: "#ffffff",
              }}
            >
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  padding: "15px",
                  fontSize: "16px",
                  color: "#111827",
                  background: "#ffffff",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                disabled={loading}
                style={{
                  border: "none",
                  background: "#f3f4f6",
                  padding: "15px",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {/* PASSWORD STRENGTH */}

            <div
              style={{
                marginTop: "15px",
                background: "#f3f4f6",
                borderRadius: "999px",
                overflow: "hidden",
                height: "8px",
              }}
            >
              <div
                style={{
                  width:
                    passwordStrengthWidth,
                  background:
                    passwordStrengthColor,
                  height: "100%",
                  transition: "0.3s",
                }}
              />
            </div>

            {passwordStrength && (
              <p
                style={{
                  marginTop: "8px",
                  color:
                    password.length >= 8
                      ? "#15803d"
                      : "#b91c1c",
                  fontSize: "14px",
                }}
              >
                {passwordStrength}
              </p>
            )}

            <p
              style={{
                marginTop: "8px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Use at least 8 characters for
              a secure password.
            </p>

            {/* TERMS */}

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "20px",
                marginBottom: "25px",
              }}
            >
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) =>
                  setTerms(e.target.checked)
                }
                disabled={loading}
                style={{
                  marginTop: "4px",
                }}
              />

              <label
                htmlFor="terms"
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  lineHeight: "24px",
                  cursor: "pointer",
                }}
              >
                By creating an account,
                you agree to our
                <strong>
                  {" "}
                  Terms of Service{" "}
                </strong>
                and
                <strong>
                  {" "}
                  Privacy Policy
                </strong>.
              </label>
            </div>

            {/* SIGNUP BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#ffffff",
                border: "none",
                borderRadius: "14px",
                fontSize: "17px",
                fontWeight: "700",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Creating Account..."
                : "🚀 Create Account"}
            </button>
          </form>

          {/* LOGIN */}

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <span
              style={{
                color: "#6b7280",
              }}
            >
              Already have an account?
            </span>

            <Link
              href="/login"
              style={{
                marginLeft: "8px",
                color: "#2563eb",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </div>

          {/* SECURITY */}

          <div
            style={{
              marginTop: "35px",
              padding: "18px",
              borderRadius: "14px",
              background: "#eff6ff",
              border:
                "1px solid #bfdbfe",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#2563eb",
                margin: "0 0 8px",
              }}
            >
              🛡 Secure Signup
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: "22px",
                margin: 0,
              }}
            >
              Your account is protected
              with secure authentication
              and encrypted data storage.
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

const labelStyle = {
  display: "block",
  marginTop: "18px",
  fontWeight: "700",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "8px",
  marginBottom: "15px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box" as const,
  color: "#111827",
  background: "#ffffff",
};