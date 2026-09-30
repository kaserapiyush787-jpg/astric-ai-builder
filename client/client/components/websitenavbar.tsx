"use client";

import { useState } from "react";
import Link from "next/link";

const navLink = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "15px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="website-navbar">
        {/* LOGO */}

        <Link
          href="/"
          className="website-logo"
          onClick={closeMenu}
        >
          ⚡ ASTRIC AI
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="desktop-nav">
          <Link href="/" style={navLink}>
            Home
          </Link>

          <Link href="/pricing" style={navLink}>
            Pricing
          </Link>

          <Link href="/templates" style={navLink}>
            Templates
          </Link>

          <Link href="/about" style={navLink}>
            About
          </Link>

          <Link href="/contect" style={navLink}>
            Contact
          </Link>

          <Link href="/login" style={navLink}>
            Login
          </Link>

          <Link href="/signup">
            <button style={primaryBtn}>
              Start Free
            </button>
          </Link>
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
      </nav>

      {/* MOBILE NAVIGATION */}

      {menuOpen && (
        <div className="mobile-nav">
          <Link
            href="/"
            onClick={closeMenu}
          >
            🏠 Home
          </Link>

          <Link
            href="/pricing"
            onClick={closeMenu}
          >
            💎 Pricing
          </Link>

          <Link
            href="/templates"
            onClick={closeMenu}
          >
            🎨 Templates
          </Link>

          <Link
            href="/about"
            onClick={closeMenu}
          >
            ℹ️ About
          </Link>

          <Link
            href="/contect"
            onClick={closeMenu}
          >
            📩 Contact
          </Link>

          <Link
            href="/login"
            onClick={closeMenu}
          >
            🔐 Login
          </Link>

          <Link
            href="/signup"
            onClick={closeMenu}
            className="mobile-start-link"
          >
            🚀 Start Free
          </Link>
        </div>
      )}

      {/* RESPONSIVE CSS */}

      <style jsx>{`
        .website-navbar {
          width: 100%;
          max-width: 1300px;

          margin: 0 auto;

          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 22px 30px;

          position: relative;
          z-index: 1000;
        }

        /* LOGO */

        .website-logo {
          color: #ffffff;
          text-decoration: none;

          font-size: 32px;
          font-weight: bold;

          white-space: nowrap;
        }

        /* DESKTOP NAV */

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .desktop-nav a {
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .desktop-nav a:hover {
          opacity: 0.75;
        }

        /* MOBILE BUTTON */

        .mobile-menu-button {
          display: none;

          width: 44px;
          height: 44px;

          align-items: center;
          justify-content: center;

          background: #2563eb;
          color: #ffffff;

          border: none;
          border-radius: 10px;

          font-size: 23px;

          cursor: pointer;
        }

        /* MOBILE MENU */

        .mobile-nav {
          display: none;
        }

        /* TABLET */

        @media (max-width: 1050px) {
          .website-navbar {
            padding-left: 22px;
            padding-right: 22px;
          }

          .desktop-nav {
            gap: 18px;
          }

          .desktop-nav a {
            font-size: 14px;
          }
        }

        /* MOBILE */

        @media (max-width: 850px) {
          .website-navbar {
            padding: 16px 20px;
          }

          .website-logo {
            font-size: 25px;
          }

          .desktop-nav {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-nav {
            display: flex;

            width: 100%;

            flex-direction: column;

            padding: 10px 18px 20px;

            background: #111827;

            border-bottom: 1px solid #374151;

            box-shadow:
              0 15px 30px rgba(0, 0, 0, 0.25);

            position: relative;
            z-index: 999;
          }

          .mobile-nav a {
            color: #ffffff;
            text-decoration: none;

            padding: 14px 12px;

            border-radius: 10px;

            font-size: 15px;
            font-weight: 600;

            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }

          .mobile-nav a:hover {
            background: #1f2937;
          }

          .mobile-start-link {
            margin-top: 8px;

            text-align: center;

            background: #2563eb !important;

            font-weight: bold !important;
          }
        }

        /* SMALL MOBILE */

        @media (max-width: 480px) {
          .website-navbar {
            padding: 12px 14px;
          }

          .website-logo {
            font-size: 20px;
          }

          .mobile-menu-button {
            width: 40px;
            height: 40px;

            font-size: 21px;
          }

          .mobile-nav {
            padding-left: 12px;
            padding-right: 12px;
          }

          .mobile-nav a {
            padding: 13px 11px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}