"use client";


import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${id}`
      );

      const data = await res.json();

      if (data.success) {
        setProject(data.project);
        setCode(data.project.html);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        Loading Project...
      </main>
    );
  }

  if (!project) {
    return (
      <main style={{ padding: 40 }}>
        Project Not Found
      </main>
    );
  }
  async function saveChanges() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: code,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("✅ Project Updated Successfully");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server Error");
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
      <h1
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        ✏ Edit Project
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "20px",
        }}
      >
        {project.name}
      </p>

      <button
        onClick={saveChanges}
        style={{
          background: "#16a34a",
          color: "#fff",
          border: "none",
          padding: "12px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        💾 Save Changes
      </button>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          height: "350px",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          fontFamily: "monospace",
          fontSize: "14px",
          marginBottom: "25px",
          boxSizing: "border-box",
        }}
      />

      <h2>🌐 Live Preview</h2>

      <iframe
        srcDoc={code}
        style={{
          width: "100%",
          height: "650px",
          border: "1px solid #d1d5db",
          borderRadius: "10px",
          background: "#fff",
        }}
      />
      <button
        onClick={() => router.push("/projects")}
        style={{
          marginTop: "20px",
          background: "#374151",
          color: "#fff",
          border: "none",
          padding: "12px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ← Back to My Projects
      </button>
    </main>
  );
}