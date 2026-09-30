"use client";

import Link from "next/link";
import { useState } from "react";

export default function UpgradePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Free Trial",
      badge: "CURRENT PLAN",
      price: "10",
      priceLabel: "Days",
      description:
        "Explore ASTRIC AI Builder and experience the core website-building workflow before upgrading.",
      features: [
        "AI Website Builder",
        "Unlimited AI Generations",
        "Live Website Preview",
        "Save Projects",
        "Basic Templates",
        "Cloud Project Workspace",
      ],
      button: "Current Plan",
      disabled: true,
      theme: "free",
    },
    {
      name: "Starter",
      badge: "FOR BEGINNERS",
      price: "₹199",
      priceLabel: "/ Month",
      description:
        "A simple plan for individuals who want to create professional websites with AI.",
      features: [
        "10 AI Websites / Month",
        "Premium Templates",
        "Export HTML, CSS & JS",
        "Custom Branding",
        "Project Storage",
        "Email Support",
      ],
      button: "Upgrade to Starter",
      disabled: false,
      theme: "starter",
    },
    {
      name: "Pro",
      badge: "MOST POPULAR",
      price: "₹499",
      priceLabel: "/ Month",
      description:
        "Designed for freelancers, developers and professionals building websites regularly.",
      features: [
        "30 AI Websites / Month",
        "30 Saved Projects",
        "Premium Components",
        "Custom Domain",
        "Advanced AI Features",
        "Priority Support",
        "Export Source Code",
        "Professional Publishing",
      ],
      button: "Choose Pro",
      disabled: false,
      theme: "pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      badge: "FOR TEAMS",
      price: "₹1999",
      priceLabel: "/ Year",
      description:
        "A business-focused plan for teams that need collaboration and advanced platform capabilities.",
      features: [
        "Everything in Pro",
        "Team Collaboration",
        "API Access",
        "Advanced AI Features",
        "Multiple Projects",
        "Business Tools",
        "Dedicated Support",
        "Priority Assistance",
      ],
      button: "Contact Sales",
      disabled: false,
      theme: "enterprise",
    },
  ];

  const comparison = [
    ["AI Website Builder", "✓", "✓", "✓", "✓"],
    ["AI Generations", "Unlimited", "10 / Month", "30 / Month", "Advanced"],
    ["Live Preview", "✓", "✓", "✓", "✓"],
    ["Saved Projects", "Basic", "✓", "30", "Multiple"],
    ["Premium Templates", "—", "✓", "✓", "✓"],
    ["Custom Branding", "—", "✓", "✓", "✓"],
    ["Source Code Export", "—", "✓", "✓", "✓"],
    ["Custom Domain", "—", "—", "✓", "✓"],
    ["API Access", "—", "—", "—", "✓"],
    ["Team Collaboration", "—", "—", "—", "✓"],
    ["Support", "Community", "Email", "Priority", "Dedicated"],
  ];

  const faqs = [
    {
      question: "What happens after my 10-day free trial?",
      answer:
        "After the trial period, you can choose a paid ASTRIC AI Builder plan according to the features and usage you need.",
    },
    {
      question: "Can I upgrade from Starter to Pro later?",
      answer:
        "Yes. Your plan structure can be upgraded as your website-building requirements increase.",
    },
    {
      question: "Can I export my website code?",
      answer:
        "Code export is included in the paid plans listed on this page. The exported project can include HTML, CSS and JavaScript according to the plan.",
    },
    {
      question: "Does Pro include custom domains?",
      answer:
        "Yes. Custom domain support is listed as a Pro feature in the current ASTRIC AI Builder plan structure.",
    },
    {
      question: "Is Enterprise suitable for teams?",
      answer:
        "The Enterprise plan is designed around team collaboration, API access, advanced features and dedicated support.",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #172554 0%, #030712 38%, #020617 100%)",
        color: "#ffffff",
        paddingBottom: "80px",
        overflowX: "hidden",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          width: "100%",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          background: "rgba(2,6,23,.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "22px",
              fontWeight: "850",
              letterSpacing: "-.5px",
            }}
          >
            ⚡ ASTRIC AI
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ← Dashboard
            </Link>

            <Link
              href="/dashboard/upgrede"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#111827",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "85px 22px 65px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 15px",
            borderRadius: "999px",
            background: "rgba(59,130,246,.12)",
            border: "1px solid rgba(96,165,250,.22)",
            color: "#93c5fd",
            fontSize: "13px",
            fontWeight: "800",
            marginBottom: "25px",
          }}
        >
          ⚡ ASTRIC AI BUILDER PLANS
        </div>

        <h1
          style={{
            fontSize: "clamp(42px,7vw,76px)",
            lineHeight: "1.02",
            letterSpacing: "-3px",
            margin: "0 auto 25px",
            fontWeight: "900",
            maxWidth: "950px",
          }}
        >
          Build More.
          <br />
          <span
            style={{
              background:
                "linear-gradient(90deg,#60a5fa,#a78bfa,#c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Without Limits.
          </span>
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            color: "#94a3b8",
            fontSize: "19px",
            lineHeight: "32px",
          }}
        >
          Start with the ASTRIC AI free trial and upgrade when
          you need more AI generation, projects, publishing
          capabilities and professional development tools.
        </p>

        {/* TRIAL STATUS */}

        <div
          style={{
            maxWidth: "720px",
            margin: "38px auto 0",
            padding: "18px 22px",
            borderRadius: "18px",
            background: "rgba(255,255,255,.055)",
            border: "1px solid rgba(255,255,255,.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />

          <span
            style={{
              color: "#e2e8f0",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            Your ASTRIC AI Builder trial includes access
            to the core website-building experience.
          </span>
        </div>
      </section>

      {/* =====================================================
          PRICING
      ===================================================== */}

      <section
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          padding: "0 22px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "30px",
                borderRadius: "24px",
                background:
                  plan.highlight
                    ? "linear-gradient(160deg,#1d4ed8,#312e81)"
                    : "linear-gradient(160deg,#111827,#0f172a)",
                border: plan.highlight
                  ? "1px solid rgba(147,197,253,.55)"
                  : "1px solid rgba(255,255,255,.09)",
                boxShadow: plan.highlight
                  ? "0 25px 70px rgba(37,99,235,.25)"
                  : "0 20px 55px rgba(0,0,0,.22)",
                minHeight: "570px",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    height: "4px",
                    background:
                      "linear-gradient(90deg,#60a5fa,#c084fc)",
                  }}
                />
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    color: plan.highlight
                      ? "#dbeafe"
                      : "#94a3b8",
                    fontSize: "11px",
                    fontWeight: "900",
                    letterSpacing: "1px",
                  }}
                >
                  {plan.badge}
                </span>

                {plan.highlight && (
                  <span
                    style={{
                      padding: "6px 9px",
                      borderRadius: "999px",
                      background:
                        "rgba(255,255,255,.14)",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "900",
                    }}
                  >
                    ★ POPULAR
                  </span>
                )}
              </div>

              <h2
                style={{
                  fontSize: "28px",
                  margin: "0 0 15px",
                  fontWeight: "850",
                }}
              >
                {plan.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "7px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "40px",
                    fontWeight: "900",
                    letterSpacing: "-1.5px",
                  }}
                >
                  {plan.price}
                </span>

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {plan.priceLabel}
                </span>
              </div>

              <p
                style={{
                  color: "#aeb9ca",
                  fontSize: "14px",
                  lineHeight: "23px",
                  minHeight: "70px",
                  margin: "0 0 24px",
                }}
              >
                {plan.description}
              </p>

              <div
                style={{
                  height: "1px",
                  background:
                    "rgba(255,255,255,.09)",
                  marginBottom: "20px",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gap: "13px",
                  flex: 1,
                }}
              >
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      color: "#e2e8f0",
                      fontSize: "14px",
                      lineHeight: "21px",
                    }}
                  >
                    <span
                      style={{
                        color: plan.highlight
                          ? "#bfdbfe"
                          : "#60a5fa",
                        fontWeight: "900",
                      }}
                    >
                      ✓
                    </span>

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={plan.disabled}
                style={{
                  width: "100%",
                  marginTop: "28px",
                  padding: "15px 18px",
                  borderRadius: "13px",
                  border: "none",
                  background: plan.disabled
                    ? "#374151"
                    : "#ffffff",
                  color: plan.disabled
                    ? "#9ca3af"
                    : "#111827",
                  fontSize: "15px",
                  fontWeight: "850",
                  cursor: plan.disabled
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          WHY UPGRADE
      ===================================================== */}

      <section
        style={{
          maxWidth: "1100px",
          margin: "100px auto 0",
          padding: "0 22px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#60a5fa",
              fontSize: "13px",
              fontWeight: "900",
              letterSpacing: "1.5px",
              marginBottom: "12px",
            }}
          >
            WHY UPGRADE
          </div>

          <h2
            style={{
              fontSize: "clamp(34px,5vw,50px)",
              margin: "0 0 18px",
              fontWeight: "850",
              letterSpacing: "-1.5px",
            }}
          >
            More tools for serious builders
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: "28px",
            }}
          >
            ASTRIC AI Builder plans are designed to give you
            more room to create, save, customize and publish
            websites as your workflow grows.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(230px,1fr))",
            gap: "18px",
            marginTop: "42px",
          }}
        >
          {[
            {
              icon: "✦",
              title: "More AI Generation",
              text: "Create more AI-powered website projects when your development workflow grows.",
            },
            {
              icon: "☁",
              title: "More Projects",
              text: "Keep your website projects organized and available in your cloud workspace.",
            },
            {
              icon: "⌘",
              title: "Professional Tools",
              text: "Use premium components, branding and development features for professional projects.",
            },
            {
              icon: "🚀",
              title: "Publish & Scale",
              text: "Move from experimenting to building and publishing websites for real use cases.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: "26px",
                borderRadius: "20px",
                background:
                  "rgba(255,255,255,.045)",
                border:
                  "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "rgba(59,130,246,.14)",
                  color: "#60a5fa",
                  fontSize: "20px",
                  marginBottom: "20px",
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "23px",
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          COMPARISON
      ===================================================== */}

      <section
        style={{
          maxWidth: "1150px",
          margin: "100px auto 0",
          padding: "0 22px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h2
            style={{
              fontSize: "42px",
              margin: "0 0 12px",
              fontWeight: "850",
            }}
          >
            Compare Plans
          </h2>

          <p
            style={{
              color: "#94a3b8",
              margin: 0,
              fontSize: "16px",
            }}
          >
            See what is included across the ASTRIC AI Builder
            plans.
          </p>
        </div>

        <div
          style={{
            overflowX: "auto",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,.09)",
            background: "#0b1120",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "850px",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                {[
                  "Feature",
                  "Free",
                  "Starter",
                  "Pro",
                  "Enterprise",
                ].map((heading, index) => (
                  <th
                    key={heading}
                    style={{
                      padding: "18px",
                      textAlign:
                        index === 0
                          ? "left"
                          : "center",
                      color:
                        heading === "Pro"
                          ? "#93c5fd"
                          : "#cbd5e1",
                      borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                      fontWeight: "800",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparison.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        padding: "16px 18px",
                        textAlign:
                          cellIndex === 0
                            ? "left"
                            : "center",
                        color:
                          cellIndex === 0
                            ? "#e2e8f0"
                            : "#94a3b8",
                        borderBottom:
                          "1px solid rgba(255,255,255,.06)",
                        fontWeight:
                          cellIndex === 0
                            ? "700"
                            : "500",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section
        style={{
          maxWidth: "850px",
          margin: "100px auto 0",
          padding: "0 22px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <div
            style={{
              color: "#60a5fa",
              fontSize: "13px",
              fontWeight: "900",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            FAQ
          </div>

          <h2
            style={{
              fontSize: "42px",
              margin: 0,
              fontWeight: "850",
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {faqs.map((faq, index) => {
            const open = openFaq === index;

            return (
              <div
                key={faq.question}
                style={{
                  borderRadius: "16px",
                  border:
                    "1px solid rgba(255,255,255,.09)",
                  background:
                    "rgba(255,255,255,.04)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(open ? null : index)
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    color: "#ffffff",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "750",
                  }}
                >
                  <span>{faq.question}</span>

                  <span
                    style={{
                      fontSize: "20px",
                      color: "#60a5fa",
                      flexShrink: 0,
                    }}
                  >
                    {open ? "−" : "+"}
                  </span>
                </button>

                {open && (
                  <div
                    style={{
                      padding: "0 20px 20px",
                      color: "#94a3b8",
                      fontSize: "14px",
                      lineHeight: "24px",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section
        style={{
          maxWidth: "1000px",
          margin: "100px auto 0",
          padding: "0 22px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "55px 30px",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg,#1d4ed8,#4c1d95)",
            border:
              "1px solid rgba(147,197,253,.25)",
            boxShadow:
              "0 25px 70px rgba(37,99,235,.18)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(30px,5vw,48px)",
              margin: "0 0 15px",
              fontWeight: "900",
            }}
          >
            Ready to build with ASTRIC AI?
          </h2>

          <p
            style={{
              color: "#dbeafe",
              maxWidth: "650px",
              margin: "0 auto 28px",
              fontSize: "16px",
              lineHeight: "27px",
            }}
          >
            Choose the plan that matches your workflow and
            continue creating professional websites with
            ASTRIC AI Builder.
          </p>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 24px",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#1d4ed8",
              textDecoration: "none",
              fontWeight: "850",
              fontSize: "15px",
            }}
          >
            Back to Dashboard →
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        style={{
          maxWidth: "1150px",
          margin: "80px auto 0",
          padding: "25px 22px 0",
          borderTop:
            "1px solid rgba(255,255,255,.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        <span>
          © {new Date().getFullYear()} ASTRIC AI Builder
        </span>

        <div
          style={{
            display: "flex",
            gap: "18px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: "#94a3b8",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>

          <Link
            href="/pricing"
            style={{
              color: "#94a3b8",
              textDecoration: "none",
            }}
          >
            Pricing
          </Link>
        </div>
      </footer>
    </main>
  );
}
