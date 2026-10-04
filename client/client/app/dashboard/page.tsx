"use client";

import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/navbar";
import PromptBox from "@/components/promptbox";

type Project = {
  id: string;
  name: string;
  prompt?: string;
  html?: string;
  css?: string;
  js?: string;
  created_at: string;
  user_id: string;
};

type PublishedSite = {
  id: string;
  name: string;
  url?: string;
  views?: number;
  created_at?: string;
  user_id: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [trialExpired, setTrialExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState(10);

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalPublished: 0,
    totalViews: 0,
    currentPlan: "10 Days FREE",
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [publishedSites, setPublishedSites] = useState<PublishedSite[]>(
    []
  );

  // ==========================================
  // LOAD DASHBOARD FROM SUPABASE
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      // Get currently logged-in user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Auth Error:", authError);
      }

      if (!user) {
        router.replace("/login");
        return;
      }

      // ==========================================
      // USER DATA
      // ==========================================

      setUserEmail(user.email || "");

      // ==========================================
      // PROFILE
      // ==========================================

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error("Profile Error:", profileError);
      }

      if (profile) {
        setUserName(
          profile.name ||
            user.user_metadata?.name ||
            "User"
        );

        setStats((prev) => ({
          ...prev,
          currentPlan:
            profile.plan || "10 Days FREE",
        }));

        // ==========================================
        // 10 DAY TRIAL CALCULATION
        // ==========================================

        if (profile.trial_start) {
          const trialStart = new Date(
            profile.trial_start
          );

          const now = new Date();

          const difference =
            now.getTime() -
            trialStart.getTime();

          const usedDays = Math.floor(
            difference /
              (1000 * 60 * 60 * 24)
          );

          const remaining = Math.max(
            0,
            10 - usedDays
          );

          setDaysLeft(remaining);

          if (remaining <= 0) {
            setTrialExpired(true);
          } else {
            setTrialExpired(false);
          }
        } else {
          // If trial_start doesn't exist
          // keep trial available for now
          setDaysLeft(10);
          setTrialExpired(false);
        }
      }

      // ==========================================
      // PROJECTS
      // ==========================================

      const {
        data: projectData,
        error: projectError,
      } = await supabase
        .from("ai_projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (projectError) {
        console.error(
          "Projects Error:",
          projectError
        );
      }

      const userProjects =
        (projectData || []) as Project[];

      setProjects(userProjects);

      // ==========================================
      // PUBLISHED SITES
      // ==========================================

      const {
        data: publishedData,
        error: publishedError,
      } = await supabase
        .from("published_sites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (publishedError) {
        console.error(
          "Published Sites Error:",
          publishedError
        );
      }

      const userPublishedSites =
        (publishedData || []) as PublishedSite[];

      setPublishedSites(
        userPublishedSites
      );

      // ==========================================
      // TOTAL VIEWS
      // ==========================================

      const totalViews =
        userPublishedSites.reduce(
          (total, site) =>
            total +
            Number(site.views || 0),
          0
        );

      // ==========================================
      // DASHBOARD STATS
      // ==========================================

      setStats((prev) => ({
        ...prev,
        totalProjects:
          userProjects.length,

        totalPublished:
          userPublishedSites.length,

        totalViews,
      }));
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // AI GENERATE
  // ==========================================

  const handleGenerate = async (
    prompt: string
  ) => {
    try {
      const res = await fetch(
        "https://astric-ai-builder-server.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "AI generation server error"
        );
      }

      const data = await res.json();

      const generatedHTML =
        data.code || "";

      const cssMatch =
        generatedHTML.match(
          /<style[^>]*>([\s\S]*?)<\/style>/i
        );

      const jsMatch =
        generatedHTML.match(
          /<script[^>]*>([\s\S]*?)<\/script>/i
        );

      const css =
        cssMatch?.[1] || "";

      const js =
        jsMatch?.[1] || "";

      const cleanHtml =
        generatedHTML
          .replace(
            /<style[^>]*>[\s\S]*?<\/style>/i,
            ""
          )
          .replace(
            /<script[^>]*>[\s\S]*?<\/script>/i,
            ""
          );

      localStorage.setItem(
        "generatedCode",
        JSON.stringify({
          html: cleanHtml,
          css,
          js,
          prompt,
        })
      );

      router.push("/editor");
    } catch (error) {
      console.error(
        "Generate Error:",
        error
      );

      alert(
        "AI server is not connected. Please start the backend."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Loading ASTRIC AI Builder...
      </main>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <Navbar />

      {/* =====================================
          TRIAL BANNER
      ====================================== */}

      <div
        style={{
          padding: "25px 30px 0",
        }}
      >
        {trialExpired ? (
          <div
            style={{
              background:
                "linear-gradient(90deg,#dc2626,#991b1b)",
              color: "#fff",
              padding: "20px",
              borderRadius: "16px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2>
                🚫 Free Trial Expired
              </h2>

              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Your 10-day free trial has
                ended. Choose a plan to
                continue.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/upgrede"
                )
              }
              style={{
                background: "#fff",
                color: "#dc2626",
                border: "none",
                padding: "14px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              View Plans
            </button>
          </div>
        ) : (
          <div
            style={{
              background:
                "linear-gradient(90deg,#2563eb,#7c3aed)",
              color: "#fff",
              padding: "20px",
              borderRadius: "16px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2>
                🎉 Free Trial Active
              </h2>

              <p
                style={{
                  marginTop: "8px",
                }}
              >
                {daysLeft}{" "}
                {daysLeft === 1
                  ? "Day"
                  : "Days"}{" "}
                Remaining
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/upgrede"
                )
              }
              style={{
                background: "#fff",
                color: "#2563eb",
                border: "none",
                padding: "14px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              View Plans
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "30px",
        }}
      >
        {/* =====================================
            HERO
        ====================================== */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "#fff",
            borderRadius: "24px",
            padding: "50px",
            marginBottom: "30px",
            boxShadow:
              "0 20px 45px rgba(37,99,235,.25)",
          }}
        >
          <h1
            style={{
              fontSize: "46px",
              marginBottom: "18px",
            }}
          >
            🚀 Welcome, {userName}
          </h1>

          <p
            style={{
              fontSize: "19px",
              lineHeight: "34px",
              maxWidth: "760px",
            }}
          >
            Build professional websites
            with AI, edit them instantly,
            preview live, save your projects
            securely and publish online.
          </p>
        </div>

        {/* =====================================
            STATS
        ====================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(230px,1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div style={cardStyle}>
            <h3>📁 Total Projects</h3>

            <h1>
              {stats.totalProjects}
            </h1>

            <p>
              Your AI websites
            </p>
          </div>

          <div style={cardStyle}>
            <h3>
              🌍 Published Sites
            </h3>

            <h1>
              {stats.totalPublished}
            </h1>

            <p>
              Your live websites
            </p>
          </div>

          <div style={cardStyle}>
            <h3>👀 Total Visitors</h3>

            <h1>
              {stats.totalViews}
            </h1>

            <p>
              Visitors to your sites
            </p>
          </div>

          <div style={cardStyle}>
            <h3>💎 Current Plan</h3>

            <h1
              style={{
                fontSize: "25px",
              }}
            >
              {stats.currentPlan}
            </h1>

            <p>
              Your current subscription
            </p>
          </div>
        </div>

        {/* =====================================
            AI GENERATOR
        ====================================== */}

        <PromptBox
          onGenerate={handleGenerate}
        />

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <div
          style={{
            marginTop: "35px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            ⚡ Quick Actions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  "/dashboard/projects"
                )
              }
              style={actionButton}
            >
              📂 My Projects
            </button>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/publish"
                )
              }
              style={actionButton}
            >
              🌍 Publish Website
            </button>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/upgrede"
                )
              }
              style={actionButton}
            >
              💎 Upgrade Plan
            </button>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/profile"
                )
              }
              style={actionButton}
            >
              👤 My Profile
            </button>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/settings"
                )
              }
              style={actionButton}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* =====================================
            RECENT PROJECTS
        ====================================== */}

        <div style={sectionStyle}>
          <h2>
            📂 Recent Projects
          </h2>

          {projects.length === 0 ? (
            <div
              style={{
                padding: "30px 0",
                color: "#6b7280",
              }}
            >
              No projects found.
            </div>
          ) : (
            projects
              .slice(0, 5)
              .map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "20px",
                    padding: "16px 0",
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <h3>
                      {project.name}
                    </h3>

                    <p
                      style={{
                        color: "#6b7280",
                        marginTop: "5px",
                      }}
                    >
                      {new Date(
                        project.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/projects/${project.id}`
                      )
                    }
                    style={actionButton}
                  >
                    Open
                  </button>
                </div>
              ))
          )}
        </div>

        {/* =====================================
            PUBLISHED WEBSITES
        ====================================== */}

        <div style={sectionStyle}>
          <h2>
            🌍 Published Websites
          </h2>

          {publishedSites.length === 0 ? (
            <p
              style={{
                marginTop: "20px",
                color: "#6b7280",
              }}
            >
              No published websites yet.
            </p>
          ) : (
            publishedSites.map(
              (site) => (
                <div
                  key={site.id}
                  style={{
                    padding: "16px 0",
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  <h3>
                    {site.name}
                  </h3>

                  {site.url ? (
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#2563eb",
                        display:
                          "inline-block",
                        marginTop: "7px",
                      }}
                    >
                      {site.url}
                    </a>
                  ) : (
                    <p
                      style={{
                        color: "#9ca3af",
                        marginTop: "7px",
                      }}
                    >
                      Publishing...
                    </p>
                  )}
                </div>
              )
            )
          )}
        </div>

        {/* =====================================
            FOOTER
        ====================================== */}

        <footer
          style={{
            marginTop: "50px",
            background: "#111827",
            color: "#fff",
            borderRadius: "22px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h2>
            ⚡ ASTRIC AI Builder
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              marginTop: "12px",
            }}
          >
            Build • Edit • Preview •
            Publish
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  "/dashboard/upgrede"
                )
              }
              style={actionButton}
            >
              Pricing
            </button>

            <button
              onClick={() =>
                router.push("/templates")
              }
              style={actionButton}
            >
              Templates
            </button>
          </div>

          <div
            style={{
              marginTop: "30px",
              borderTop:
                "1px solid #374151",
              paddingTop: "20px",
              color: "#9ca3af",
            }}
          >
            © 2026 ASTRIC AI Builder.
            All Rights Reserved.
            <p> Developed by ⚡ ASTRIC TEAM </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

// ==========================================
// STYLES
// ==========================================

const cardStyle = {
  background: "#ffffff",
  padding: "22px",
  borderRadius: "18px",
  boxShadow:
    "0 8px 20px rgba(0,0,0,.08)",
};

const sectionStyle = {
  marginTop: "35px",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "30px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,.08)",
};

const actionButton = {
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};
