"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const user_id = localStorage.getItem("user_id");

      const res = await fetch(
        `http://localhost:5000/api/projects?user_id=${user_id}`
      );

      const data = await res.json();

      if (data.success) {
        setProjects(data.projects);
        setFilteredProjects(data.projects);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    const result = projects.filter((project: any) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProjects(result);
  }, [search, projects]);

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;

    const res = await fetch(
      `http://localhost:5000/api/projects/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Project Deleted");
      loadProjects();
    } else {
      alert(data.error);
    }
  }
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "bold",
            }}
          >
            📂 My Projects
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Total Projects: {filteredProjects.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search Projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "15px",
          }}
        />
      </div>

      {loading ? (
        <h2>Loading Projects...</h2>
      ) : filteredProjects.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "60px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>📂 No Projects Found</h2>
          <p>Create your first AI website.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
            gap: "20px",
          }}
        >
          {filteredProjects.map((project: any) => (
            <div
              key={project.id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,.08)",
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
                {new Date(project.created_at).toLocaleString()}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "18px",
                  flexWrap: "wrap",
                }}
              >
                
                <Link href={`/projects/${project.id}`}>
  <button style={btnBlue}>
    👁 Preview
  </button>
</Link>

                <button style={btnGreen}>✏ Edit</button>

                <button
                  style={btnRed}
                  onClick={() => deleteProject(project.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </main>
  );
}

const btnBlue = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnGreen = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnRed = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};