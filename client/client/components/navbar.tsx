"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.name || "User");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    localStorage.removeItem("user_id");
    localStorage.removeItem("generatedCode");

    router.push("/login");
  }

  return (
    <>
      <header
        style={{
          minHeight: "70px",
          background: "#111827",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 30px",
          borderBottom: "1px solid #374151",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* LOGO */}
        <Link
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          style={{
            color: "#ffffff",
            textDecoration: "none",
            fontSize: "26px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          🚀 ASTRIC AI Builder
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div
          className="desktop-navbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
          }}
        >
          <Link
            href="/dashboard"
            className="navbar-link"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            className="navbar-link"
          >
            Projects
          </Link>

          <Link
            href="/dashboard/C-programming"
            className="navbar-link"
          >
            C-Programming
          </Link>

          <Link
            href="/dashboard/upgrede"
            className="navbar-link"
          >
            Pricing
          </Link>

          {/* USER PROFILE */}
          <div
            onClick={() => router.push("/dashboard/profile")}
            style={{
              cursor: "pointer",
              background: "#2563eb",
              padding: "10px 16px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: "180px",
              maxWidth: "220px",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              👋 Hello, {userName}
            </span>

            <span
              style={{
                color: "#dbeafe",
                fontSize: "12px",
                marginTop: "3px",
                wordBreak: "break-all",
                maxWidth: "100%",
              }}
            >
              {userEmail}
            </span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            style={{
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-navbar">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            onClick={() => setMenuOpen(false)}
          >
            📁 Projects
          </Link>

          <Link
            href="/dashboard/C-programming"
            onClick={() => setMenuOpen(false)}
          >
            💻 C-Programming
          </Link>

          <Link
            href="/dashboard/upgrede"
            onClick={() => setMenuOpen(false)}
          >
            💎 Pricing
          </Link>

          {/* MOBILE PROFILE */}
          <div
            onClick={() => {
              setMenuOpen(false);
              router.push("/dashboard/profile");
            }}
            className="mobile-profile"
          >
            <strong>👋 Hello, {userName}</strong>

            <span>
              {userEmail}
            </span>
          </div>

          {/* MOBILE LOGOUT */}
          <button
            onClick={handleLogout}
            className="mobile-logout"
          >
            Logout
          </button>
        </div>
      )}

      {/* NAVBAR RESPONSIVE CSS */}
      <style jsx>{`
        .navbar-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          white-space: nowrap;
          transition: opacity 0.2s ease;
        }

        .navbar-link:hover {
          opacity: 0.75;
        }

        .mobile-menu-button {
          display: none;
          background: #2563eb;
          color: #ffffff;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          font-size: 24px;
          cursor: pointer;
        }

        .mobile-navbar {
          display: none;
        }

        @media (max-width: 1100px) {
          header {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .desktop-navbar {
            gap: 14px !important;
          }

          .navbar-link {
            font-size: 14px;
          }
        }

        @media (max-width: 900px) {
          .desktop-navbar {
            display: none !important;
          }

          .mobile-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-navbar {
            display: flex;
            flex-direction: column;
            width: 100%;
            background: #111827;
            border-bottom: 1px solid #374151;
            padding: 12px 16px 18px;
            position: sticky;
            top: 70px;
            z-index: 999;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          }

          .mobile-navbar a {
            color: #ffffff;
            text-decoration: none;
            padding: 14px 12px;
            border-radius: 10px;
            font-weight: 500;
            transition: background 0.2s ease;
          }

          .mobile-navbar a:hover {
            background: #1f2937;
          }

          .mobile-profile {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 8px;
            padding: 14px 12px;
            background: #2563eb;
            border-radius: 12px;
            cursor: pointer;
            overflow: hidden;
          }

          .mobile-profile strong {
            color: #ffffff;
            font-size: 15px;
          }

          .mobile-profile span {
            color: #dbeafe;
            font-size: 12px;
            overflow-wrap: anywhere;
          }

          .mobile-logout {
            width: 100%;
            margin-top: 10px;
            padding: 13px;
            border: none;
            border-radius: 10px;
            background: #dc2626;
            color: #ffffff;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
          }
        }

        @media (max-width: 480px) {
          header {
            min-height: 62px !important;
            padding: 10px 12px !important;
          }

          header > a {
            font-size: 18px !important;
          }

          .mobile-menu-button {
            width: 40px;
            height: 40px;
            font-size: 21px;
          }

          .mobile-navbar {
            top: 62px;
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </>
  );
}