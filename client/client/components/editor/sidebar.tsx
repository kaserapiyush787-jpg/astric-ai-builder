"use client";

type SidebarProps = {
  activeFile: "html" | "css" | "js";
  setActiveFile: (file: "html" | "css" | "js") => void;
};

export default function Sidebar({
  activeFile,
  setActiveFile,
}: SidebarProps) {
  return (
    <aside className="astric-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <span>📁</span>
        <span>EXPLORER</span>
      </div>

      {/* Files */}
      <div className="sidebar-files">
        <div className="files-title">PROJECT FILES</div>

        <button
          type="button"
          onClick={() => setActiveFile("html")}
          className={`file-item ${
            activeFile === "html" ? "active" : ""
          }`}
        >
          <span className="file-icon">📄</span>
          <span className="file-name">index.html</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFile("css")}
          className={`file-item ${
            activeFile === "css" ? "active" : ""
          }`}
        >
          <span className="file-icon">🎨</span>
          <span className="file-name">style.css</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFile("js")}
          className={`file-item ${
            activeFile === "js" ? "active" : ""
          }`}
        >
          <span className="file-icon">⚡</span>
          <span className="file-name">script.js</span>
        </button>
      </div>

      {/* Workspace */}
      <div className="sidebar-workspace">
        <div className="workspace-label">
          Workspace
        </div>

        <div className="workspace-name">
          🚀 ASTRIC AI Builder
        </div>

        <div className="workspace-version">
          Version 1.0
        </div>
      </div>

      <style jsx>{`
        /* =========================================
           DESKTOP SIDEBAR
           ========================================= */

        .astric-sidebar {
          width: 250px;
          min-width: 250px;
          height: 100%;
          min-height: 0;

          background: #111827;
          color: #ffffff;

          border-right: 1px solid #374151;

          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        /* =========================================
           HEADER
           ========================================= */

        .sidebar-header {
          height: 55px;
          min-height: 55px;

          padding: 0 18px;

          display: flex;
          align-items: center;
          gap: 9px;

          font-size: 16px;
          font-weight: bold;

          border-bottom: 1px solid #374151;

          flex-shrink: 0;
        }

        /* =========================================
           FILE LIST
           ========================================= */

        .sidebar-files {
          flex: 1;
          min-height: 0;

          padding: 16px;

          overflow-y: auto;
          overflow-x: hidden;
        }

        .files-title {
          margin-bottom: 12px;

          color: #9ca3af;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: 0.8px;
        }

        .file-item {
          width: 100%;
          min-height: 44px;

          margin-bottom: 8px;
          padding: 10px 12px;

          display: flex;
          align-items: center;
          gap: 9px;

          border: 1px solid transparent;
          border-radius: 9px;

          background: transparent;
          color: #ffffff;

          cursor: pointer;

          font-family: inherit;
          font-size: 14px;
          text-align: left;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .file-item:hover {
          background: #1f2937;
          border-color: #374151;
        }

        .file-item:active {
          transform: scale(0.98);
        }

        .file-item.active {
          background: #2563eb;
          border-color: #3b82f6;
          font-weight: bold;
        }

        .file-item.active:hover {
          background: #2563eb;
        }

        .file-icon {
          width: 20px;
          min-width: 20px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .file-name {
          min-width: 0;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* =========================================
           WORKSPACE
           ========================================= */

        .sidebar-workspace {
          flex-shrink: 0;

          padding: 18px;

          border-top: 1px solid #374151;
        }

        .workspace-label {
          color: #9ca3af;
          font-size: 12px;
        }

        .workspace-name {
          margin-top: 9px;

          color: #ffffff;

          font-size: 13px;
          font-weight: bold;

          overflow-wrap: anywhere;
        }

        .workspace-version {
          margin-top: 6px;

          color: #6b7280;
          font-size: 11px;
        }

        /* =========================================
           SCROLLBAR
           ========================================= */

        .sidebar-files::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-files::-webkit-scrollbar-track {
          background: #111827;
        }

        .sidebar-files::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }

        /* =========================================
           TABLET
           ========================================= */

        @media (max-width: 900px) {
          .astric-sidebar {
            width: 220px;
            min-width: 220px;
          }

          .sidebar-header {
            padding: 0 15px;
            font-size: 14px;
          }

          .sidebar-files {
            padding: 13px;
          }

          .file-item {
            font-size: 13px;
          }
        }

        /* =========================================
           MOBILE
           ========================================= */

        @media (max-width: 768px) {
          .astric-sidebar {
            width: 100%;
            min-width: 0;
            height: auto;
            min-height: auto;

            border-right: none;
            border-bottom: 1px solid #374151;

            display: flex;
            flex-direction: column;
          }

          .sidebar-header {
            height: 44px;
            min-height: 44px;

            padding: 0 14px;

            font-size: 14px;
          }

          .sidebar-files {
            flex: none;

            padding: 10px 12px;

            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;

            overflow: visible;
          }

          .files-title {
            grid-column: 1 / -1;

            margin-bottom: 0;

            font-size: 10px;
          }

          .file-item {
            min-width: 0;
            min-height: 44px;

            margin-bottom: 0;
            padding: 8px 6px;

            justify-content: center;

            border-radius: 8px;

            font-size: 11px;
          }

          .file-icon {
            width: auto;
            min-width: auto;
          }

          .file-name {
            max-width: 100%;
          }

          .sidebar-workspace {
            display: none;
          }
        }

        /* =========================================
           SMALL MOBILE
           ========================================= */

        @media (max-width: 480px) {
          .sidebar-header {
            height: 40px;
            min-height: 40px;

            padding: 0 11px;

            font-size: 12px;
          }

          .sidebar-files {
            padding: 8px;
            gap: 6px;
          }

          .files-title {
            font-size: 9px;
          }

          .file-item {
            min-height: 40px;

            padding: 7px 4px;

            gap: 4px;

            font-size: 10px;
          }

          .file-icon {
            font-size: 12px;
          }
        }
      `}</style>
    </aside>
  );
}