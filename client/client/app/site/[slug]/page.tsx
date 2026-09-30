"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type PublishedSite = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  views: number;
  is_public: boolean;
};

export default function PublicWebsitePage() {
  const params = useParams();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : "";

  const [site, setSite] =
    useState<PublishedSite | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD PUBLISHED WEBSITE
  // =========================================

  useEffect(() => {
    if (!slug) return;

    loadWebsite();
  }, [slug]);

  async function loadWebsite() {
    try {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("published_sites")
          .select(
            "id,user_id,name,slug,html,css,js,views,is_public"
          )
          .eq("slug", slug)
          .eq("is_public", true)
          .single();

      if (error) {
        console.error(
          "Website Load Error:",
          error
        );

        setError(
          "Website not found or it is not published."
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "Website not found."
        );

        setLoading(false);
        return;
      }

      setSite(data);

      setLoading(false);

      // =========================================
      // COUNT VISIT
      // =========================================

      await incrementViews(data.id);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while loading the website."
      );

      setLoading(false);
    }
  }

  // =========================================
  // INCREMENT VIEWS
  // =========================================

  async function incrementViews(
    siteId: string
  ) {
    try {
      const { data: currentSite } =
        await supabase
          .from("published_sites")
          .select("views")
          .eq("id", siteId)
          .single();

      if (!currentSite) return;

      const currentViews =
        Number(currentSite.views || 0);

      await supabase
        .from("published_sites")
        .update({
          views: currentViews + 1,
        })
        .eq("id", siteId);
    } catch (err) {
      console.error(
        "View Count Error:",
        err
      );
    }
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              border:
                "4px solid #e5e7eb",
              borderTop:
                "4px solid #2563eb",
              borderRadius: "50%",
              margin:
                "0 auto 16px",
              animation:
                "spin 1s linear infinite",
            }}
          />

          <h2
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Loading Website...
          </h2>

          <style jsx>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </main>
    );
  }

  // =========================================
  // ERROR / NOT FOUND
  // =========================================

  if (error || !site) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background:
            "linear-gradient(135deg,#eff6ff,#f8fafc)",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px 25px",
            textAlign: "center",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            🌐
          </div>

          <h1
            style={{
              margin:
                "0 0 10px",
              color: "#111827",
              fontSize: "28px",
            }}
          >
            Website Not Found
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            {error ||
              "This website does not exist or is no longer public."}
          </p>

          <a
            href="/"
            style={{
              display:
                "inline-block",
              marginTop: "25px",
              padding:
                "12px 22px",
              borderRadius: "10px",
              background:
                "#2563eb",
              color: "#ffffff",
              textDecoration:
                "none",
              fontWeight: 600,
            }}
          >
            Go Home
          </a>
        </div>
      </main>
    );
  }

  // =========================================
  // WEBSITE
  // =========================================

  const websiteDocument = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>${escapeHtml(
    site.name
  )}</title>

<style>

${site.css}

</style>

</head>

<body>

${site.html}

<script>

${site.js}

<\/script>

</body>

</html>
`;

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "#ffffff",
      }}
    >
      <iframe
        title={site.name}
        srcDoc={websiteDocument}
        style={{
          display: "block",
          width: "100%",
          minHeight: "100vh",
          height: "100vh",
          border: "none",
          margin: 0,
          padding: 0,
          background: "#ffffff",
        }}
        sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation"
      />
    </main>
  );
}

// =========================================
// ESCAPE TITLE
// =========================================

function escapeHtml(
  value: string
) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}