"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function PublishPage() {

  const [projectName, setProjectName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);

  const [publishStatus, setPublishStatus] =
    useState("Not Published");

  const [liveUrl, setLiveUrl] =
    useState("");
    
  const handlePublish = async () => {

    if (!projectName || !subdomain) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {

     
        const {
  data: { user },
} = await supabase.auth.getUser();

const user_id = user?.id;

      const project_id =
        localStorage.getItem("project_id");

      const html =
        localStorage.getItem("website_html");

      const res = await fetch(
        "http://localhost:5000/api/publish",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            user_id,
            project_id,
            projectName,
            subdomain,
            html,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        setPublishStatus("Live ✅");

        setLiveUrl(data.url);

        alert("Website Published Successfully");

      } else {

        alert(data.error);

      }

    } catch (err) {

      alert("Server Error");

    }

    setLoading(false);

  };

  return (

    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        padding: "40px",
      }}
    >

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >

        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            padding: "45px",
            borderRadius: "24px",
            color: "#ffffff",
            boxShadow:
              "0 20px 60px rgba(0,0,0,.25)",
          }}
        >

          <h1
            style={{
              fontSize: "46px",
              marginBottom: "15px",
            }}
          >
            🌍 Publish Website
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "32px",
              maxWidth: "800px",
              color: "#e2e8f0",
            }}
          >
            Publish your AI generated website
            instantly. Manage deployments,
            monitor live status and share
            your website with the world.
          </p>

        </div>
        {/* Publish Form */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 420px",
            gap: "30px",
            marginTop: "35px",
          }}
        >

          {/* Left Card */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 15px 40px rgba(0,0,0,.12)",
            }}
          >

            <h2
              style={{
                marginBottom: "25px",
                color: "#111827",
              }}
            >
              🚀 Publish Configuration
            </h2>

            <label
              style={{
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Website Name
            </label>

            <input
              type="text"
              placeholder="My Portfolio Website"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "10px",
                marginBottom: "25px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <label
              style={{
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Website URL
            </label>

            <input
              type="text"
              placeholder="my-awesome-site"
              value={subdomain}
              onChange={(e) =>
                setSubdomain(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                )
              }
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                background: "#eff6ff",
                borderRadius: "12px",
                border: "1px solid #bfdbfe",
              }}
            >

              <h3
                style={{
                  margin: 0,
                  color: "#1d4ed8",
                }}
              >
                🌐 Website Preview URL
              </h3>

              <p
                style={{
                  marginTop: "12px",
                  color: "#2563eb",
                  fontWeight: "bold",
                  wordBreak: "break-all",
                }}
              >
                https://
                {subdomain || "your-site"}
                .netlify.app
              </p>

            </div>

            <button
              onClick={handlePublish}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "35px",
                padding: "18px",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ffffff",
                background: loading
                  ? "#64748b"
                  : "linear-gradient(135deg,#16a34a,#22c55e)",
              }}
            >
              {loading
                ? "⏳ Publishing..."
                : "🚀 Publish Website"}
            </button>

          </div>
          {/* RIGHT PANEL */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >

            {/* Publish Status */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "30px",
                boxShadow: "0 15px 40px rgba(0,0,0,.12)",
              }}
            >

              <h2
                style={{
                  marginBottom: "25px",
                  color: "#111827",
                }}
              >
                📡 Publish Status
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>Status</span>

                <strong
                  style={{
                    color:
                      publishStatus === "Live ✅"
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {publishStatus}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>SSL</span>

                <strong>✅ Enabled</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>Hosting</span>

                <strong>Netlify</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>CDN</span>

                <strong>Global</strong>
              </div>

            </div>

            {/* Live Website */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "30px",
                boxShadow: "0 15px 40px rgba(0,0,0,.12)",
              }}
            >

              <h2
                style={{
                  marginBottom: "20px",
                }}
              >
                🌐 Live Website
              </h2>

              <div
                style={{
                  background: "#f3f4f6",
                  padding: "18px",
                  borderRadius: "12px",
                  wordBreak: "break-all",
                  color: "#2563eb",
                  fontWeight: "bold",
                }}
              >
                {liveUrl ||
                  "https://your-site.netlify.app"}
              </div>

              <button
                onClick={() => {

                  if (liveUrl) {
                    navigator.clipboard.writeText(
                      liveUrl
                    );

                    alert("URL Copied");
                  }

                }}
                style={{
                  width: "100%",
                  marginTop: "18px",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                📋 Copy URL
              </button>

              <button
                onClick={() => {

                  if (liveUrl) {
                    window.open(
                      liveUrl,
                      "_blank"
                    );
                  }

                }}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#16a34a",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🌍 Open Website
              </button>

            </div>

          </div>

        </div>
        {/* Publish History */}

        <div
          style={{
            marginTop: "35px",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "35px",
            boxShadow: "0 15px 40px rgba(0,0,0,.12)",
          }}
        >

          <h2
            style={{
              marginBottom: "25px",
              color: "#111827",
            }}
          >
            📊 Publish History
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >

            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "16px",
              }}
            >
              <h3>🚀 Free Plan</h3>

              <p>✔ 1 Website</p>
              <p>✔ Netlify Hosting</p>
              <p>✔ SSL Included</p>
              <p>✔ 30 Days Trial</p>
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#ffffff",
                padding: "20px",
                borderRadius: "16px",
              }}
            >
              <h3>💎 Pro Plan</h3>

              <h1>₹199 / Month</h1>

              <p>✔ Unlimited Websites</p>
              <p>✔ Faster Publish</p>
              <p>✔ Custom Domain</p>
              <p>✔ Priority Support</p>
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "16px",
              }}
            >
              <h3>🌍 Current Website</h3>

              <p>
                {liveUrl
                  ? "Published Successfully"
                  : "Not Published Yet"}
              </p>

              <p>
                Status :
                <strong
                  style={{
                    color:
                      publishStatus === "Live ✅"
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {" "}
                  {publishStatus}
                </strong>
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <footer
          style={{
            marginTop: "40px",
            background: "#111827",
            color: "#ffffff",
            padding: "35px",
            borderRadius: "24px",
            textAlign: "center",
          }}
        >

          <h2>⚡ ASTRIC AI Builder</h2>

          <p
            style={{
              marginTop: "12px",
              color: "#d1d5db",
            }}
          >
            Publish your websites worldwide with one click.
          </p>

          <p
            style={{
              marginTop: "20px",
              color: "#9ca3af",
            }}
          >
            © 2026 ASTRIC AI Builder. All Rights Reserved.
          </p>

        </footer>

      </div>

    </main>

  );

}