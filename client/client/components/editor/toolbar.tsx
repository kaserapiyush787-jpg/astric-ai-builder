"use client";

type ToolbarProps = {
  onRun: () => void;
  onSave: () => void;
  onDownload: () => void;
  onPublish: () => void;
};

export default function Toolbar({
  onRun,
  onSave,
  onDownload,
  onPublish,
}: ToolbarProps) {
  return (
    <header className="astric-toolbar">
      {/* Logo */}
      <div className="toolbar-brand">
        <span className="brand-icon">⚡</span>
        <span>ASTRIC AI Builder</span>
      </div>

      {/* Actions */}
      <div className="toolbar-actions">
        <button
          type="button"
          onClick={onRun}
          className="toolbar-button run-button"
        >
          <span>▶</span>
          <span>Run</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          className="toolbar-button save-button"
        >
          <span>💾</span>
          <span>Save</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="toolbar-button download-button"
        >
          <span>⬇</span>
          <span>Download</span>
        </button>

        <button
          type="button"
          onClick={onPublish}
          className="toolbar-button publish-button"
        >
          <span>🌍</span>
          <span>Publish</span>
        </button>
      </div>

      <style jsx>{`
        /* =========================================
           TOOLBAR
           ========================================= */

        .astric-toolbar {
          width: 100%;
          height: 60px;
          min-height: 60px;

          background: #111827;
          border-bottom: 1px solid #374151;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 20px;

          gap: 20px;

          flex-shrink: 0;

          overflow: hidden;
        }

        /* =========================================
           BRAND
           ========================================= */

        .toolbar-brand {
          min-width: 0;

          display: flex;
          align-items: center;
          gap: 8px;

          color: #ffffff;

          font-size: 22px;
          font-weight: bold;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .brand-icon {
          flex-shrink: 0;
          font-size: 22px;
        }

        /* =========================================
           ACTIONS
           ========================================= */

        .toolbar-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 10px;

          flex-shrink: 0;
        }

        /* =========================================
           BUTTON
           ========================================= */

        .toolbar-button {
          min-height: 38px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 6px;

          color: #ffffff;

          border: none;
          border-radius: 8px;

          padding: 10px 16px;

          cursor: pointer;

          font-family: inherit;
          font-size: 13px;
          font-weight: bold;

          white-space: nowrap;

          transition:
            transform 0.2s ease,
            filter 0.2s ease,
            opacity 0.2s ease;
        }

        .toolbar-button:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .toolbar-button:active {
          transform: translateY(0);
        }

        .toolbar-button:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }

        .run-button {
          background: #22c55e;
        }

        .save-button {
          background: #2563eb;
        }

        .download-button {
          background: #9333ea;
        }

        .publish-button {
          background: #ea580c;
        }

        /* =========================================
           TABLET
           ========================================= */

        @media (max-width: 1000px) {
          .astric-toolbar {
            padding: 0 15px;
            gap: 12px;
          }

          .toolbar-brand {
            font-size: 18px;
          }

          .brand-icon {
            font-size: 19px;
          }

          .toolbar-actions {
            gap: 7px;
          }

          .toolbar-button {
            padding: 9px 11px;
            font-size: 12px;
          }
        }

        /* =========================================
           MOBILE
           ========================================= */

        @media (max-width: 768px) {
          .astric-toolbar {
            height: auto;
            min-height: 58px;

            padding: 9px 12px;

            flex-direction: column;
            align-items: stretch;

            gap: 9px;

            overflow: visible;
          }

          .toolbar-brand {
            justify-content: center;

            font-size: 17px;

            white-space: nowrap;
          }

          .brand-icon {
            font-size: 18px;
          }

          .toolbar-actions {
            width: 100%;

            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));

            gap: 6px;
          }

          .toolbar-button {
            width: 100%;
            min-width: 0;
            min-height: 38px;

            padding: 8px 4px;

            gap: 3px;

            border-radius: 7px;

            font-size: 11px;
          }
        }

        /* =========================================
           SMALL MOBILE
           ========================================= */

        @media (max-width: 480px) {
          .astric-toolbar {
            padding: 8px;

            gap: 8px;
          }

          .toolbar-brand {
            font-size: 15px;
          }

          .brand-icon {
            font-size: 16px;
          }

          .toolbar-actions {
            gap: 5px;
          }

          .toolbar-button {
            min-height: 36px;

            padding: 7px 2px;

            font-size: 10px;
          }
        }

        /* =========================================
           VERY SMALL DEVICES
           ========================================= */

        @media (max-width: 360px) {
          .toolbar-brand {
            font-size: 14px;
          }

          .toolbar-button {
            font-size: 9px;
            gap: 2px;
          }
        }
      `}</style>
    </header>
  );
}
