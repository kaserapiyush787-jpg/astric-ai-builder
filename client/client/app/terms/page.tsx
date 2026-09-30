"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "40px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
        Terms & Conditions
      </h1>

      <p style={{ color: "#6b7280" }}>
        Last Updated: July 2026
      </p>

      <hr style={{ margin: "30px 0" }} />

      <h2>1. Acceptance of Terms</h2>

      <p>
        By using ASTRIC AI Builder, you agree to comply with these Terms &
        Conditions.
      </p>

      <h2>2. Free Trial</h2>

      <p>
        Every new user receives a free 10-day trial. After the trial expires,
        an active paid plan is required to continue using premium features.
      </p>

      <h2>3. Subscription Plans</h2>

      <ul>
        <li>Starter – ₹199/month</li>
        <li>Pro – ₹499/month</li>
        <li>Enterprise – ₹1999/year</li>
      </ul>

      <h2>4. User Responsibilities</h2>

      <p>
        Users are responsible for the content they generate and publish through
        ASTRIC AI Builder.
      </p>

      <h2>5. Payments</h2>

      <p>
        Subscription payments are processed securely. Paid plans are activated
        after successful payment confirmation.
      </p>

      <h2>6. Account Termination</h2>

      <p>
        We may suspend accounts involved in abuse, fraud, or illegal activity.
      </p>

      <h2>7. Privacy</h2>

      <p>
        User data is stored securely. Personal information is handled according
        to our Privacy Policy.
      </p>

      <h2>8. Contact</h2>

      <p>
        Email: support@astricai.com
      </p>

      <div style={{ marginTop: "40px" }}>
        <Link
          href="/dashboard"
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}