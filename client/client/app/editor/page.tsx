"use client";

import { useState, useEffect, useMemo } from "react";

import Sidebar from "@/components/editor/sidebar";
import Toolbar from "@/components/editor/toolbar";
import CodeEditor from "@/components/editor/codeeditor";
import { supabase } from "../../lib/supabase";

export default function EditorPage() {
  const [activeFile, setActiveFile] = useState<
    "html" | "css" | "js"
  >("html");

  const [previewSize, setPreviewSize] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================================
  // LOAD GENERATED CODE
  // =========================================

  useEffect(() => {
    const generated =
      localStorage.getItem("generatedCode");

    if (generated) {
      try {
        const data = JSON.parse(generated);

        setHtml(data.html || "");
        setCss(data.css || "");
        setJs(data.js || "");
      } catch (error) {
        console.error(
          "Generated code error:",
          error
        );
      }
    }

    const savedHtml =
      localStorage.getItem("astric_html");

    const savedCss =
      localStorage.getItem("astric_css");

    const savedJs =
      localStorage.getItem("astric_js");

    if (!generated) {
      if (savedHtml) {
        setHtml(savedHtml);
      }

      if (savedCss) {
        setCss(savedCss);
      }

      if (savedJs) {
        setJs(savedJs);
      }
    }
  }, []);

  // =========================================
  // LOCAL AUTO SAVE
  // =========================================

  useEffect(() => {
    localStorage.setItem(
      "astric_html",
      html
    );

    localStorage.setItem(
      "astric_css",
      css
    );

    localStorage.setItem(
      "astric_js",
      js
    );
  }, [html, css, js]);

  // =========================================
  // LIVE PREVIEW
  // =========================================

  const preview = useMemo(() => {
    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

<\/script>

</body>

</html>
`;
  }, [html, css, js]);

  // =========================================
  // RUN
  // =========================================

  const handleRun = () => {
    alert(
      "✅ Preview Updated Successfully"
    );
  };

  // =========================================
  // SAVE PROJECT
  // =========================================

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        alert(
          "Authentication Error:\n\n" +
            authError.message
        );
        return;
      }

      if (!user) {
        alert("Please Login First");
        return;
      }

      const projectName =
        prompt(
          "Enter Project Name"
        )?.trim() ||
        "Untitled Project";

      const { error } =
        await supabase
          .from("ai_projects")
          .insert({
            user_id: user.id,
            name: projectName,
            html: html,
            css: css,
            js: js,
            prompt:
              "AI Generated Website",
          });

      if (error) {
        console.error(
          "SAVE ERROR:",
          error
        );

        alert(
          "Save Error\n\n" +
            "Message: " +
            (error.message ||
              "Unknown error") +
            "\n\nCode: " +
            (error.code || "N/A")
        );

        return;
      }

      alert(
        "✅ Project Saved Successfully"
      );
    } catch (error: any) {
      console.error(
        "SAVE SYSTEM ERROR:",
        error
      );

      alert(
        "Save System Error\n\n" +
          (error?.message ||
            "Unknown error")
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DOWNLOAD
  // =========================================

  const handleDownload = () => {
    try {
      const blob = new Blob(
        [preview],
        {
          type: "text/html",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "astric-website.html";

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "DOWNLOAD ERROR:",
        error
      );

      alert(
        "Download failed."
      );
    }
  };

  // =========================================
  // PUBLISH WEBSITE
  // =========================================

  const handlePublish = async () => {
    if (publishing) return;

    try {
      setPublishing(true);

      // -------------------------------------
      // CHECK USER
      // -------------------------------------

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "AUTH ERROR:",
          authError
        );

        alert(
          "Authentication Error\n\n" +
            authError.message
        );

        return;
      }

      if (!user) {
        alert(
          "Please Login First"
        );

        return;
      }

      // -------------------------------------
      // WEBSITE NAME
      // -------------------------------------

      const siteName =
        prompt(
          "Enter Website Name"
        )?.trim();

      if (!siteName) {
        alert(
          "Website name is required."
        );

        return;
      }

      // -------------------------------------
      // UNIQUE SLUG
      // -------------------------------------

      const cleanName =
        siteName
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          );

      const slug =
        (cleanName ||
          "my-website") +
        "-" +
        Date.now();

      // -------------------------------------
      // INSERT PUBLISHED WEBSITE
      // -------------------------------------

      console.log(
        "Publishing website..."
      );

      const {
        data,
        error,
      } = await supabase
        .from("published_sites")
        .insert({
          user_id: user.id,
          name: siteName,
          slug: slug,
          html: html,
          css: css,
          js: js,
          views: 0,
          is_public: true,
        })
        .select()
        .single();

      // -------------------------------------
      // DATABASE ERROR
      // -------------------------------------

      if (error) {
        console.error(
          "================================"
        );

        console.error(
          "PUBLISH ERROR MESSAGE:",
          error.message
        );

        console.error(
          "PUBLISH ERROR CODE:",
          error.code
        );

        console.error(
          "PUBLISH ERROR DETAILS:",
          error.details
        );

        console.error(
          "PUBLISH ERROR HINT:",
          error.hint
        );

        console.error(
          "================================"
        );

        alert(
          "❌ Publish Error\n\n" +
            "Message:\n" +
            (error.message ||
              "Unknown error") +
            "\n\nCode:\n" +
            (error.code ||
              "N/A") +
            "\n\nDetails:\n" +
            (error.details ||
              "N/A") +
            "\n\nHint:\n" +
            (error.hint ||
              "N/A")
        );

        return;
      }

      if (!data) {
        alert(
          "❌ Website was not created."
        );

        return;
      }

      // -------------------------------------
      // PUBLIC WEBSITE URL
      // -------------------------------------

      const siteUrl =
        `${window.location.origin}/site/${data.slug}`;

      console.log(
        "Website URL:",
        siteUrl
      );

      // -------------------------------------
      // SAVE URL
      // -------------------------------------

      const {
        error: updateError,
      } = await supabase
        .from("published_sites")
        .update({
          url: siteUrl,
        })
        .eq(
          "id",
          data.id
        )
        .eq(
          "user_id",
          user.id
        );

      // -------------------------------------
      // URL ERROR
      // -------------------------------------

      if (updateError) {
        console.error(
          "URL UPDATE ERROR:",
          updateError
        );

        alert(
          "⚠️ Website was created,\n" +
            "but URL could not be saved.\n\n" +
            updateError.message
        );

        return;
      }

      // -------------------------------------
      // SUCCESS
      // -------------------------------------

      alert(
        "🌍 Website Published Successfully!\n\n" +
          siteUrl
      );

      // -------------------------------------
      // OPEN WEBSITE
      // -------------------------------------

      window.open(
        siteUrl,
        "_blank"
      );
    } catch (error: any) {
      console.error(
        "================================"
      );

      console.error(
        "PUBLISH SYSTEM ERROR:",
        error
      );

      console.error(
        "================================"
      );

      alert(
        "❌ Publish System Error\n\n" +
          (error?.message ||
            "Unknown error")
      );
    } finally {
      setPublishing(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        display: "grid",
        gridTemplateRows:
          "60px 1fr",
        background:
          "#0f172a",
        overflow: "hidden",
      }}
    >

      {/* ================================
          TOOLBAR
      ================================= */}

      <Toolbar
        onRun={handleRun}
        onSave={handleSave}
        onDownload={
          handleDownload
        }
        onPublish={
          handlePublish
        }
      />

      {/* ================================
          MAIN EDITOR
      ================================= */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "250px minmax(0, 1fr) 45%",
          height: "100%",
          minHeight: 0,
        }}
      >

        {/* ================================
            SIDEBAR
        ================================= */}

        <Sidebar
          activeFile={
            activeFile
          }
          setActiveFile={
            setActiveFile
          }
        />

        {/* ================================
            CODE EDITOR
        ================================= */}

        <CodeEditor
          activeFile={
            activeFile
          }
          html={html}
          css={css}
          js={js}
          setHtml={
            setHtml
          }
          setCss={
            setCss
          }
          setJs={
            setJs
          }
        />

        {/* ================================
            LIVE PREVIEW
        ================================= */}

        <div
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            background:
              "#ffffff",
            borderLeft:
              "1px solid #374151",
            minWidth: 0,
          }}
        >

          {/* PREVIEW HEADER */}

          <div
            style={{
              height:
                "50px",
              minHeight:
                "50px",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              padding:
                "0 15px",
              background:
                "#f3f4f6",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >

            <strong>
              🌐 Live Preview
            </strong>

            <div
              style={{
                display:
                  "flex",
                gap:
                  "8px",
              }}
            >

              {/* DESKTOP */}

              <button
                onClick={() =>
                  setPreviewSize(
                    "desktop"
                  )
                }
                title="Desktop"
                style={{
                  cursor:
                    "pointer",
                  padding:
                    "6px 9px",
                  border:
                    previewSize ===
                    "desktop"
                      ? "2px solid #2563eb"
                      : "1px solid #d1d5db",
                  borderRadius:
                    "6px",
                  background:
                    "#ffffff",
                }}
              >
                🖥
              </button>

              {/* TABLET */}

              <button
                onClick={() =>
                  setPreviewSize(
                    "tablet"
                  )
                }
                title="Tablet"
                style={{
                  cursor:
                    "pointer",
                  padding:
                    "6px 9px",
                  border:
                    previewSize ===
                    "tablet"
                      ? "2px solid #2563eb"
                      : "1px solid #d1d5db",
                  borderRadius:
                    "6px",
                  background:
                    "#ffffff",
                }}
              >
                📱
              </button>

              {/* MOBILE */}

              <button
                onClick={() =>
                  setPreviewSize(
                    "mobile"
                  )
                }
                title="Mobile"
                style={{
                  cursor:
                    "pointer",
                  padding:
                    "6px 9px",
                  border:
                    previewSize ===
                    "mobile"
                      ? "2px solid #2563eb"
                      : "1px solid #d1d5db",
                  borderRadius:
                    "6px",
                  background:
                    "#ffffff",
                }}
              >
                📲
              </button>

            </div>
          </div>

          {/* IFRAME */}

          <iframe
            title="Live Website Preview"
            srcDoc={
              preview
            }
            style={{
              flex: 1,
              width:
                previewSize ===
                "desktop"
                  ? "100%"
                  : previewSize ===
                    "tablet"
                  ? "768px"
                  : "390px",
              maxWidth:
                "100%",
              margin:
                "0 auto",
              border:
                "none",
              background:
                "#ffffff",
            }}
          />

        </div>
      </section>
    </main>
  );
}