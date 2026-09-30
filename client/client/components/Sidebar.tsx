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
      {/* HEADER */}
      <div className="sidebar-header">
        📁 EXPLORER
      </div>

      {/* FILES */}
      <div className="sidebar-files">
        <div className="project-title">
          PROJECT FILES
        </div>

        <div
          onClick={() => setActiveFile("html")}
          className={`file-item ${
            activeFile === "html" ? "active" : ""
          }`}
        >
          📄 <span>index.html</span>
        </div>

        <div
          onClick={() => setActiveFile("css")}
          className={`file-item ${
            activeFile === "css" ? "active" : ""
          }`}
        >
          🎨 <span>style.css</span>
        </div>

        <div
          onClick={() => setActiveFile("js")}
          className={`file-item ${
            activeFile === "js" ? "active" : ""
          }`}
        >
          ⚡ <span>script.js</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
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

      {/* RESPONSIVE CSS */}
      <style jsx>{`
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

        /* HEADER */

        .sidebar-header {
          padding: 18px;
          font-size: 17px;
          font-weight: bold;

          border-bottom: 1px solid #374151;

          flex-shrink: 0;
        }

        /* FILES */

        .sidebar-files {
          padding: 15px;

          overflow-y: auto;
          overflow-x: hidden;

          flex: 1;
        }

        .project-title {
          color: #9ca3af;
          font-size: 13px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .file-item {
          width: 100%;
          min-height: 42px;

          padding: 12px 14px;
          margin-bottom: 8px;

          border-radius: 8px;

          cursor: pointer;

          color: #ffffff;

          display: flex;
          align-items: center;
          gap: 8px;

          font-size: 14px;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .file-item:hover {
          background: #1f2937;
        }

        .file-item.active {
          background: #2563eb;
          font-weight: bold;
        }

        .file-item.active:hover {
          background: #2563eb;
        }

        /* FOOTER */

        .sidebar-footer {
          flex-shrink: 0;

          padding: 18px;

          border-top: 1px solid #374151;
        }

        .workspace-label {
          color: #9ca3af;
          font-size: 13px;
        }

        .workspace-name {
          margin-top: 8px;
          font-weight: bold;
          font-size: 14px;
        }

        .workspace-version {
          margin-top: 5px;
          color: #6b7280;
          font-size: 12px;
        }

        /* TABLET */

        @media (max-width: 900px) {
          .astric-sidebar {
            width: 220px;
            min-width: 220px;
          }
        }

        /* MOBILE */

        @media (max-width: 768px) {
          .astric-sidebar {
            width: 100%;
            min-width: 0;
            height: auto;

            max-height: 230px;

            border-right: none;
            border-bottom: 1px solid #374151;
          }

          .sidebar-header {
            padding: 14px 16px;
            font-size: 15px;
          }

          .sidebar-files {
            padding: 10px 12px;

            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;

            overflow-x: hidden;
            overflow-y: auto;
          }

          .project-title {
            grid-column: 1 / -1;

            margin-bottom: 2px;
            font-size: 11px;
          }

          .file-item {
            min-height: 44px;

            margin-bottom: 0;

            padding: 10px 8px;

            justify-content: center;

            font-size: 12px;
            text-align: center;
          }

          .file-item span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .sidebar-footer {
            display: none;
          }
        }

        /* SMALL MOBILE */

        @media (max-width: 480px) {
          .astric-sidebar {
            max-height: 190px;
          }

          .sidebar-header {
            padding: 12px;
            font-size: 14px;
          }

          .sidebar-files {
            padding: 8px;
            gap: 6px;
          }

          .project-title {
            font-size: 10px;
          }

          .file-item {
            min-height: 40px;
            padding: 8px 5px;
            font-size: 11px;
            border-radius: 7px;
          }
        }
      `}</style>
    </aside>
  );
}