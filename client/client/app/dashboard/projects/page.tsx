"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
};

export default function ProjectsPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const [search, setSearch] = useState("");

  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {

    getCurrentUser();

  }, []);

  async function getCurrentUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.replace("/login");

      return;

    }

    setUserId(user.id);

    loadProjects(user.id);

  }

  async function loadProjects(uid: string) {

    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", {
        ascending: false,
      });

    if (error) {

      console.log(error);

      setLoading(false);

      return;

    }

    setProjects(data || []);

    setFilteredProjects(data || []);

    setTotalProjects(data?.length || 0);

    setLoading(false);

  }

  useEffect(() => {

    const result = projects.filter((project) =>
      project.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredProjects(result);

  }, [search, projects]);
  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f4f6",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Loading Projects...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "35px",
      }}
    >
      {/* Hero */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          borderRadius: "24px",
          padding: "40px",
          color: "#fff",
          marginBottom: "35px",
          boxShadow: "0 20px 45px rgba(37,99,235,.25)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          📂 My Projects
        </h1>

        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
          }}
        >
          Manage all your AI generated websites in one place.
        </p>
      </div>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Projects</h3>

          <h1>{totalProjects}</h1>

          <p>Your AI Websites</p>
        </div>

        <div style={cardStyle}>
          <h3>Current User</h3>

          <p
            style={{
              wordBreak: "break-all",
            }}
          >
            {userId}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>Status</h3>

          <h2
            style={{
              color: "#16a34a",
            }}
          >
            ● Connected
          </h2>
        </div>
      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search Project..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #ddd",
          marginBottom: "30px",
          fontSize: "16px",
        }}
      />

      {/* Project Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(350px,1fr))",
          gap: "25px",
        }}
      >{filteredProjects.length === 0 ? (

          <div
            style={{
              gridColumn: "1/-1",
              background: "#ffffff",
              padding: "60px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
          >
            <h2>📂 No Projects Found</h2>

            <p
              style={{
                color: "#6b7280",
                marginTop: "10px",
              }}
            >
              Generate your first AI website to get started.
            </p>
          </div>

        ) : (

          filteredProjects.map((project) => (

            <div
              key={project.id}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "22px",
                boxShadow: "0 10px 25px rgba(0,0,0,.08)",
              }}
            >

              <h2>{project.name}</h2>

              <p
                style={{
                  color: "#6b7280",
                  minHeight: "55px",
                }}
              >
                {project.prompt}
              </p>

              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                Created :
                {" "}
                {new Date(project.created_at).toLocaleString()}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  style={btnBlue}
                  onClick={() => {

                    localStorage.setItem(
                      "generatedCode",
                      JSON.stringify({
                        html: project.html,
                        css: project.css,
                        js: project.js,
                      })
                    );

                    router.push("/editor");

                  }}
                >
                  👁 Open
                </button>

                <button
                  style={btnGreen}
                  onClick={async () => {

                    const name = prompt(
                      "New Project Name",
                      project.name
                    );

                    if (!name) return;

                    await supabase
                      .from("projects")
                      .update({
                        name,
                      })
                      .eq("id", project.id)
                      .eq("user_id", userId);

                    loadProjects(userId);

                  }}
                >
                  ✏ Rename
                </button>

                <button
                  style={btnRed}
                  onClick={async () => {

                    if (
                      !confirm(
                        "Delete this project?"
                      )
                    ) return;

                    await supabase
                      .from("projects")
                      .delete()
                      .eq("id", project.id)
                      .eq("user_id", userId);

                    loadProjects(userId);

                  }}
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </main>

  );

}

const cardStyle = {
  background: "#ffffff",
  padding: "22px",
  borderRadius: "18px",
  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
};

const btnBlue = {
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnGreen = {
  background: "#16a34a",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnRed = {
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};