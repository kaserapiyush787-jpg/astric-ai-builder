"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type PromptBoxProps = {
  onGenerate?: (prompt: string) => Promise<void> | void;
};

export default function PromptBox({
  onGenerate,
}: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter your website idea.");
      return;
    }

    setLoading(true);

    try {
      if (onGenerate) {
        await onGenerate(prompt);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate website.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prompt-box">
      {/* HEADER */}
      <div className="prompt-header">
        <div className="prompt-icon">
          🤖
        </div>

        <div className="prompt-heading">
          <h2>AI Website Generator</h2>

          <p>
            Describe your website idea and let AI build it.
          </p>
        </div>
      </div>

      {/* AI PROMPT */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Example: Create a modern e-commerce website with login, shopping cart, payment gateway, responsive design and admin dashboard..."
        className="prompt-textarea"
      />

      {/* CHARACTER COUNTER */}
      <div className="character-row">
        <span>
          ✨ AI understands detailed prompts better.
        </span>

        <span>
          {prompt.length} Characters
        </span>
      </div>

      {/* PROMPT SUGGESTIONS */}
      <div className="suggestions-section">
        <h3>💡 Prompt Examples</h3>

        <div className="suggestions-grid">
          {[
            "Modern Portfolio Website",
            "E-Commerce Website",
            "School Management System",
            "Restaurant Website",
            "Hospital Management",
            "AI Chat Application",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPrompt(item)}
              className="suggestion-button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* GENERATE AREA */}
      <div className="generate-area">
        <div className="status-area">
          {loading ? (
            <div className="loading-message">
              <span className="spinner"></span>

              <span>
                🤖 AI is generating your website...
                <br />
                <small>Please wait 30–60 seconds.</small>
              </span>
            </div>
          ) : (
            <span className="powered-text">
              ⚡ Powered by Astric AI
            </span>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`generate-button ${
            loading ? "generate-disabled" : ""
          }`}
        >
          {loading
            ? "⏳ Generating Website..."
            : "🚀 Generate Website"}
        </button>
      </div>

      {/* AI NOTICE */}
      <div className="ai-notice">
        <p>
          💡{" "}
          <strong>
            Tip:
          </strong>{" "}
          The more detailed your prompt is, the better your generated
          website will be. Include colors, pages, features, layout,
          animations, and functionality for the best AI-generated results.
        </p>
      </div>

      {/* FOOTER INFO */}
      <div className="prompt-footer">
        <div>
          <h4>
            🚀 ASTRIC AI Builder
          </h4>

          <p>
            Build professional websites with AI in seconds.
          </p>
        </div>

        <div className="technology-info">
          <div>HTML • CSS • JavaScript</div>
          <div>Powered by Astric AI</div>
        </div>
      </div>

      {/* RESPONSIVE CSS */}
      <style jsx>{`
        .prompt-box {
          width: 100%;
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            #111827,
            #1e293b
          );
          border: 1px solid #374151;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
        }

        /* HEADER */

        .prompt-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .prompt-icon {
          width: 55px;
          height: 55px;
          min-width: 55px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #7c3aed
          );
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
        }

        .prompt-heading {
          min-width: 0;
        }

        .prompt-heading h2 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          line-height: 1.2;
        }

        .prompt-heading p {
          margin: 6px 0 0;
          color: #9ca3af;
          font-size: 15px;
          line-height: 1.5;
        }

        /* TEXTAREA */

        .prompt-textarea {
          display: block;
          width: 100%;
          height: 180px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid #374151;
          background: #0f172a;
          color: #ffffff;
          font-size: 16px;
          line-height: 1.6;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
          font-family: inherit;
        }

        .prompt-textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .prompt-textarea::placeholder {
          color: #64748b;
        }

        /* CHARACTER */

        .character-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.5;
        }

        .character-row span:last-child {
          white-space: nowrap;
        }

        /* SUGGESTIONS */

        .suggestions-section {
          margin-top: 25px;
        }

        .suggestions-section h3 {
          color: #ffffff;
          margin: 0 0 12px;
          font-size: 18px;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(240px, 1fr)
          );
          gap: 12px;
        }

        .suggestion-button {
          width: 100%;
          min-height: 48px;
          background: #1e293b;
          color: #ffffff;
          border: 1px solid #374151;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .suggestion-button:hover {
          background: #273449;
          border-color: #4b5563;
          transform: translateY(-1px);
        }

        /* GENERATE AREA */

        .generate-area {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .status-area {
          min-width: 0;
          flex: 1;
        }

        .loading-message {
          color: #60a5fa;
          font-size: 15px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.5;
        }

        .loading-message small {
          color: #93c5fd;
          font-size: 13px;
          font-weight: normal;
        }

        .powered-text {
          color: #9ca3af;
          font-size: 14px;
        }

        /* SPINNER */

        .spinner {
          width: 18px;
          height: 18px;
          min-width: 18px;
          border: 3px solid #374151;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* GENERATE BUTTON */

        .generate-button {
          background: linear-gradient(
            90deg,
            #2563eb,
            #7c3aed
          );
          color: #ffffff;
          border: none;
          padding: 15px 35px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          min-width: 240px;
          min-height: 52px;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .generate-disabled {
          background: #475569;
          cursor: not-allowed;
          opacity: 0.8;
        }

        /* NOTICE */

        .ai-notice {
          margin-top: 25px;
          background: #0f172a;
          border: 1px solid #374151;
          border-radius: 14px;
          padding: 16px;
        }

        .ai-notice p {
          color: #9ca3af;
          margin: 0;
          line-height: 28px;
          font-size: 14px;
        }

        .ai-notice strong {
          color: #ffffff;
        }

        /* FOOTER */

        .prompt-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .prompt-footer h4 {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
        }

        .prompt-footer p {
          margin: 8px 0 0;
          color: #9ca3af;
          font-size: 14px;
        }

        .technology-info {
          color: #6b7280;
          font-size: 13px;
          text-align: right;
          line-height: 1.6;
        }

        /* TABLET */

        @media (max-width: 768px) {
          .prompt-box {
            margin: 24px auto;
            padding: 22px;
            border-radius: 20px;
          }

          .prompt-heading h2 {
            font-size: 24px;
          }

          .prompt-heading p {
            font-size: 14px;
          }

          .prompt-textarea {
            height: 170px;
          }

          .suggestions-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .generate-area {
            align-items: stretch;
            flex-direction: column;
          }

          .status-area {
            width: 100%;
          }

          .generate-button {
            width: 100%;
            min-width: 0;
          }

          .technology-info {
            text-align: left;
          }
        }

        /* MOBILE */

        @media (max-width: 480px) {
          .prompt-box {
            margin: 16px auto;
            padding: 16px;
            border-radius: 16px;
          }

          .prompt-header {
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
          }

          .prompt-icon {
            width: 46px;
            height: 46px;
            min-width: 46px;
            border-radius: 13px;
            font-size: 24px;
          }

          .prompt-heading h2 {
            font-size: 20px;
          }

          .prompt-heading p {
            font-size: 13px;
            margin-top: 5px;
          }

          .prompt-textarea {
            height: 155px;
            padding: 14px;
            border-radius: 13px;
            font-size: 16px;
          }

          .character-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
            font-size: 12px;
          }

          .character-row span:last-child {
            white-space: normal;
          }

          .suggestions-section {
            margin-top: 20px;
          }

          .suggestions-section h3 {
            font-size: 16px;
          }

          .suggestions-grid {
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .suggestion-button {
            min-height: 46px;
            padding: 11px;
          }

          .generate-area {
            margin-top: 22px;
          }

          .loading-message {
            align-items: flex-start;
            font-size: 13px;
          }

          .generate-button {
            min-height: 50px;
            padding: 13px 18px;
            font-size: 15px;
          }

          .ai-notice {
            margin-top: 20px;
            padding: 13px;
          }

          .ai-notice p {
            line-height: 23px;
            font-size: 13px;
          }

          .prompt-footer {
            margin-top: 22px;
            padding-top: 16px;
            flex-direction: column;
            align-items: flex-start;
          }

          .technology-info {
            text-align: left;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}