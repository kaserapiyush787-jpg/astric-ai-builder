"use client";

type CodeEditorProps = {
  activeFile: "html" | "css" | "js";
  html: string;
  css: string;
  js: string;
  setHtml: (value: string) => void;
  setCss: (value: string) => void;
  setJs: (value: string) => void;
};

export default function CodeEditor({
  activeFile,
  html,
  css,
  js,
  setHtml,
  setCss,
  setJs,
}: CodeEditorProps) {
  const currentCode =
    activeFile === "html"
      ? html
      : activeFile === "css"
      ? css
      : js;

  const handleChange = (value: string) => {
    if (activeFile === "html") {
      setHtml(value);
    }

    if (activeFile === "css") {
      setCss(value);
    }

    if (activeFile === "js") {
      setJs(value);
    }
  };

  const fileName =
    activeFile === "html"
      ? "📄 index.html"
      : activeFile === "css"
      ? "🎨 style.css"
      : "⚡ script.js";

  return (
    <section className="code-editor">
      {/* Editor Header / Active File */}
      <div className="editor-header">
        <div className="active-file">
          <span className="file-icon">
            {activeFile === "html"
              ? "📄"
              : activeFile === "css"
              ? "🎨"
              : "⚡"}
          </span>

          <span>{fileName.replace(/^[^ ]+ /, "")}</span>
        </div>

        <div className="editor-language">
          {activeFile === "html"
            ? "HTML"
            : activeFile === "css"
            ? "CSS"
            : "JavaScript"}
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor-wrapper">
        <textarea
          spellCheck={false}
          value={currentCode}
          onChange={(e) => handleChange(e.target.value)}
          className="code-textarea"
          aria-label={`Edit ${fileName}`}
        />
      </div>

      {/* Editor Footer */}
      <div className="editor-footer">
        <span>
          {activeFile === "html"
            ? "HTML"
            : activeFile === "css"
            ? "CSS"
            : "JavaScript"}
        </span>

        <span>
          {currentCode.length} characters
        </span>
      </div>

      <style jsx>{`
        .code-editor {
          flex: 1;
          min-width: 0;
          min-height: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #0f172a;
          overflow: hidden;
        }

        /* =========================================
           EDITOR HEADER
           ========================================= */

        .editor-header {
          height: 50px;
          min-height: 50px;
          width: 100%;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          color: #ffffff;
          font-weight: bold;
          border-bottom: 1px solid #374151;
          flex-shrink: 0;
        }

        .active-file {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
        }

        .file-icon {
          flex-shrink: 0;
          font-size: 16px;
        }

        .editor-language {
          flex-shrink: 0;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* =========================================
           EDITOR AREA
           ========================================= */

        .editor-wrapper {
          flex: 1;
          min-height: 0;
          min-width: 0;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #0b1220;
        }

        .code-textarea {
          display: block;
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;

          background: #0b1220;
          color: #e5e7eb;

          border: none;
          outline: none;
          resize: none;

          padding: 20px;

          font-size: 15px;
          font-family:
            Consolas,
            Monaco,
            "Courier New",
            monospace;

          line-height: 1.6;

          tab-size: 2;

          overflow: auto;
          white-space: pre;
          word-wrap: normal;

          -webkit-overflow-scrolling: touch;
        }

        .code-textarea::selection {
          background: #2563eb;
          color: #ffffff;
        }

        .code-textarea::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .code-textarea::-webkit-scrollbar-track {
          background: #0b1220;
        }

        .code-textarea::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }

        .code-textarea::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        /* =========================================
           EDITOR FOOTER
           ========================================= */

        .editor-footer {
          height: 30px;
          min-height: 30px;
          background: #111827;
          border-top: 1px solid #374151;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          color: #64748b;
          font-size: 11px;
          flex-shrink: 0;
        }

        /* =========================================
           TABLET
           ========================================= */

        @media (max-width: 900px) {
          .editor-header {
            height: 46px;
            min-height: 46px;
            padding: 0 13px;
          }

          .code-textarea {
            padding: 16px;
            font-size: 14px;
          }
        }

        /* =========================================
           MOBILE
           ========================================= */

        @media (max-width: 768px) {
          .code-editor {
            width: 100%;
            height: 420px;
            min-height: 420px;
            flex: none;
          }

          .editor-header {
            height: 44px;
            min-height: 44px;
            padding: 0 12px;
          }

          .active-file {
            font-size: 13px;
          }

          .file-icon {
            font-size: 14px;
          }

          .editor-language {
            font-size: 10px;
          }

          .code-textarea {
            padding: 14px;
            font-size: 14px;
            line-height: 1.55;
          }

          .editor-footer {
            height: 28px;
            min-height: 28px;
            padding: 0 12px;
            font-size: 10px;
          }
        }

        /* =========================================
           SMALL MOBILE
           ========================================= */

        @media (max-width: 480px) {
          .code-editor {
            height: 360px;
            min-height: 360px;
          }

          .editor-header {
            height: 42px;
            min-height: 42px;
            padding: 0 10px;
          }

          .active-file {
            font-size: 12px;
            gap: 6px;
          }

          .file-icon {
            font-size: 13px;
          }

          .editor-language {
            font-size: 9px;
          }

          .code-textarea {
            padding: 12px;
            font-size: 13px;
            line-height: 1.5;
          }

          .editor-footer {
            height: 26px;
            min-height: 26px;
            padding: 0 10px;
            font-size: 9px;
          }
        }
      `}</style>
    </section>
  );
}