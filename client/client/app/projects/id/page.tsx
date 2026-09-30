"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectPreviewPage() {
  const { id } = useParams();

  const [project, setProject] = useState<any>(null);
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
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          padding: "40px",
          textAlign: "center",
          fontSize: "22px",
        }}
      >
        Loading Project...
      </main>
    );
  }

  if (!project) {
    return (
      <main
        style={{
          padding: "40px",
          textAlign: "center",
          fontSize: "22px",
        }}
      >
        Project Not Found
      </main>
    );
  }
  const downloadHTML = () => {
    const blob = new Blob([project.html], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.html`;
    a.click();

    URL.revokeObjectURL(url);
  };

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
        👁 Project Preview
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "25px",
        }}
      >
        {project.name}
      </p>

      <button
        onClick={downloadHTML}
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "12px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ⬇ Download HTML
      </button>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,.08)",
        }}
      >
        <h2>🌐 Live Preview</h2>

        <iframe
          srcDoc={project.html}
          style={{
            width: "100%",
            height: "700px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        />
      </div>
      <div
        style={{
          marginTop: "25px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,.08)",
        }}
      >
        <h2>💻 HTML Code</h2>

        <textarea
          readOnly
          value={project.html}
          style={{
            width: "100%",
            height: "350px",
            marginTop: "15px",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontFamily: "monospace",
            fontSize: "14px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: "25px",
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