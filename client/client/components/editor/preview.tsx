"use client";

type PreviewProps = {
  preview: string;
  onRefresh: () => void;
};

export default function Preview({
  preview,
  onRefresh,
}: PreviewProps) {
  return (
    <aside className="preview-panel">
      {/* Browser Header */}
      <div className="browser-header">
        {/* Browser Dots */}
        <div className="browser-dots">
          <span className="dot red">🔴</span>
          <span className="dot yellow">🟡</span>
          <span className="dot green">🟢</span>
        </div>

        {/* Address Bar */}
        <div className="address-bar">
          <span className="address-icon">🔒</span>
          <span className="address-text">
            astric-preview.local
          </span>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          className="refresh-button"
          aria-label="Refresh website preview"
        >
          🔄 <span>Refresh</span>
        </button>
      </div>

      {/* Website Preview */}
      <div className="preview-frame-wrapper">
        <iframe
          title="Website Preview"
          srcDoc={preview}
          className="preview-frame"
        />
      </div>

      <style jsx>{`
        /* =========================================
           PREVIEW PANEL
           ========================================= */

        .preview-panel {
          flex: 1;
          min-width: 0;
          min-height: 0;
          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;

          background: #ffffff;
          border-left: 1px solid #374151;

          overflow: hidden;
        }

        /* =========================================
           BROWSER HEADER
           ========================================= */

        .browser-header {
          width: 100%;
          height: 50px;
          min-height: 50px;

          background: #f3f4f6;
          border-bottom: 1px solid #d1d5db;

          display: flex;
          align-items: center;

          padding: 0 15px;
          gap: 12px;

          flex-shrink: 0;
        }

        /* =========================================
           BROWSER DOTS
           ========================================= */

        .browser-dots {
          display: flex;
          align-items: center;
          gap: 5px;

          flex-shrink: 0;
          white-space: nowrap;
        }

        .dot {
          font-size: 11px;
          line-height: 1;
        }

        /* =========================================
           ADDRESS BAR
           ========================================= */

        .address-bar {
          flex: 1;
          min-width: 0;

          height: 34px;

          display: flex;
          align-items: center;

          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;

          padding: 0 12px;
          gap: 7px;

          color: #6b7280;
          font-size: 13px;

          overflow: hidden;
        }

        .address-icon {
          flex-shrink: 0;
          font-size: 11px;
        }

        .address-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* =========================================
           REFRESH BUTTON
           ========================================= */

        .refresh-button {
          flex-shrink: 0;

          min-height: 34px;

          background: #2563eb;
          color: #ffffff;

          border: none;
          border-radius: 8px;

          padding: 8px 15px;

          cursor: pointer;

          font-weight: bold;
          font-size: 13px;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .refresh-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .refresh-button:active {
          transform: translateY(0);
        }

        /* =========================================
           PREVIEW FRAME
           ========================================= */

        .preview-frame-wrapper {
          flex: 1;
          min-width: 0;
          min-height: 0;

          width: 100%;

          background: #ffffff;

          overflow: hidden;
        }

        .preview-frame {
          display: block;

          width: 100%;
          height: 100%;

          border: none;
          outline: none;

          background: #ffffff;
        }

        /* =========================================
           TABLET
           ========================================= */

        @media (max-width: 900px) {
          .preview-panel {
            border-left: none;
          }

          .browser-header {
            height: 46px;
            min-height: 46px;
            padding: 0 12px;
            gap: 9px;
          }

          .address-bar {
            height: 32px;
            font-size: 12px;
          }

          .refresh-button {
            min-height: 32px;
            padding: 7px 12px;
            font-size: 12px;
          }
        }

        /* =========================================
           MOBILE
           ========================================= */

        @media (max-width: 768px) {
          .preview-panel {
            width: 100%;
            height: 500px;
            min-height: 500px;
            flex: none;

            border-left: none;
            border-top: 1px solid #374151;
          }

          .browser-header {
            height: 44px;
            min-height: 44px;
            padding: 0 10px;
            gap: 8px;
          }

          .browser-dots {
            gap: 2px;
          }

          .dot {
            font-size: 9px;
          }

          .address-bar {
            height: 30px;
            padding: 0 9px;
            border-radius: 7px;
            font-size: 11px;
          }

          .address-icon {
            display: none;
          }

          .refresh-button {
            min-height: 30px;
            padding: 6px 10px;
            border-radius: 7px;
            font-size: 11px;
          }

          .preview-frame-wrapper {
            width: 100%;
            height: calc(100% - 44px);
          }

          .preview-frame {
            width: 100%;
            height: 100%;
          }
        }

        /* =========================================
           SMALL MOBILE
           ========================================= */

        @media (max-width: 480px) {
          .preview-panel {
            height: 430px;
            min-height: 430px;
          }

          .browser-header {
            height: 42px;
            min-height: 42px;
            padding: 0 8px;
            gap: 6px;
          }

          .browser-dots {
            gap: 1px;
          }

          .dot {
            font-size: 8px;
          }

          .address-bar {
            height: 29px;
            padding: 0 7px;
            font-size: 10px;
            border-radius: 6px;
          }

          .refresh-button {
            height: 29px;
            min-height: 29px;
            padding: 5px 8px;
            font-size: 10px;
            border-radius: 6px;
          }

          .refresh-button span {
            display: none;
          }

          .preview-frame-wrapper {
            height: calc(100% - 42px);
          }
        }
      `}</style>
    </aside>
  );
}