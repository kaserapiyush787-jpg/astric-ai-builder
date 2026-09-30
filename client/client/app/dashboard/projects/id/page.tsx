"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function ProjectPreviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("ai_projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.log(error);
        setProject(null);
      } else {
        setProject(data);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
          background: "#f3f4f6",
        }}
      >
        ⏳ Loading Project...
      </main>
    );
  }

  if (!project) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#f3f4f6",
        }}
      >
        <h1>❌ Project Not Found</h1>

        <button
          onClick={() => router.push("/dashboard/projects")}
          style={{
            marginTop: "20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Back to Projects
        </button>
      </main>
    );
  }

  const fullCode = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${project.css || ""}
</style>
</head>

<body>

${project.html || ""}

<script>
${project.js || ""}
</script>

</body>
</html>
`;

  const downloadHTML = () => {
    const blob = new Blob([fullCode], {
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
      {/* Header */}

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "#ffffff",
          padding: "35px",
          borderRadius: "20px",
          marginBottom: "30px",
          boxShadow: "0 15px 35px rgba(37,99,235,.25)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "40px",
          }}
        >
          👁 Project Preview
        </h1>

        <p
          style={{
            marginTop: "12px",
            fontSize: "18px",
            opacity: .9,
          }}
        >
          {project.name}
        </p>
      </div>

      {/* Action Buttons */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={downloadHTML}
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ⬇ Download Website
        </button>

        <button
          onClick={() => router.push("/editor")}
          style={{
            background: "#16a34a",
            color: "#ffffff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ✏ Edit Project
        </button>

        <button
          onClick={() => router.push("/dashboard/projects")}
          style={{
            background: "#374151",
            color: "#ffffff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Live Preview */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            background: "#111827",
            color: "#ffffff",
            padding: "15px 20px",
            fontWeight: "bold",
          }}
        >
          🌐 Live Website Preview
        </div>

        <iframe
          srcDoc={fullCode}
          style={{
            width: "100%",
            height: "700px",
            border: "none",
            background: "#ffffff",
          }}
        />
      </div>
      {/* ===============================
          SOURCE CODE
      =============================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        {/* HTML */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>📄 HTML</h2>

          <textarea
            readOnly
            value={project.html || ""}
            style={{
              width: "100%",
              height: "250px",
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

        {/* CSS */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>🎨 CSS</h2>

          <textarea
            readOnly
            value={project.css || ""}
            style={{
              width: "100%",
              height: "250px",
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

        {/* JavaScript */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>⚡ JavaScript</h2>

          <textarea
            readOnly
            value={project.js || ""}
            style={{
              width: "100%",
              height: "250px",
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
      </div>

      {/* Footer */}

      <footer
        style={{
          marginTop: "40px",
          background: "#111827",
          color: "#ffffff",
          padding: "25px",
          borderRadius: "18px",
          textAlign: "center",
        }}
      >
        <h3>⚡ ASTRIC AI Builder</h3>

        <p
          style={{
            color: "#9ca3af",
            marginTop: "10px",
          }}
        >
          View • Download • Edit • Publish AI Websites
        </p>

        <p
          style={{
            marginTop: "20px",
            color: "#6b7280",
          }}
        >
          © 2026 ASTRIC AI Builder. All Rights Reserved.
        </p>
      </footer>

    </main>
  );
}
