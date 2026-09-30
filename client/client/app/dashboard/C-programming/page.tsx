"use client";

import { useState } from "react";

type Variables = Record<string, number | string>;

const DEFAULT_CODE = `#include <stdio.h>

int main() {
    int a, b, sum;

    printf("Enter first number: ");
    scanf("%d", &a);

    printf("Enter second number: ");
    scanf("%d", &b);

    sum = a + b;

    printf("Sum = %d\\n", sum);

    return 0;
}`;

function runSimpleC(code: string, inputText: string) {
  const variables: Variables = {};
  const output: string[] = [];

  const inputs = inputText
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  let inputIndex = 0;

  const source = code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .trim();

  const mainMatch = source.match(
    /int\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/
  );

  if (!mainMatch) {
    throw new Error(
      "main() function not found.\n\nExample:\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}"
    );
  }

  const body = mainMatch[1];

  const statements: string[] = [];
  let current = "";
  let inString = false;

  for (let i = 0; i < body.length; i++) {
    const char = body[i];

    if (char === '"' && body[i - 1] !== "\\") {
      inString = !inString;
    }

    if (char === ";" && !inString) {
      if (current.trim()) {
        statements.push(current.trim());
      }

      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  function evaluate(expression: string): number {
    let exp = expression.trim();

    exp = exp.replace(
      /\b[a-zA-Z_]\w*\b/g,
      (name) => {
        if (name in variables) {
          return String(Number(variables[name]));
        }

        return name;
      }
    );

    if (!/^[0-9+\-*/().%\s]+$/.test(exp)) {
      throw new Error(
        `Unsupported expression: ${expression}`
      );
    }

    try {
      return Function(
        `"use strict"; return (${exp})`
      )();
    } catch {
      throw new Error(
        `Invalid expression: ${expression}`
      );
    }
  }

  function decodeString(value: string) {
    return value
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  for (const statement of statements) {
    const line = statement.trim();

    if (!line) continue;

    if (/^return\b/.test(line)) {
      continue;
    }

    /*
     * printf("Hello")
     */
    const simplePrintf = line.match(
      /^printf\s*\(\s*"([\s\S]*?)"\s*\)$/
    );

    if (simplePrintf) {
      output.push(
        decodeString(simplePrintf[1])
      );

      continue;
    }

    /*
     * printf("Sum = %d", sum)
     */
    const formattedPrintf = line.match(
      /^printf\s*\(\s*"([\s\S]*?)"\s*,\s*(.*?)\s*\)$/
    );

    if (formattedPrintf) {
      let format = decodeString(
        formattedPrintf[1]
      );

      const args = formattedPrintf[2]
        .split(",")
        .map((item) => item.trim());

      for (const arg of args) {
        let value: string | number;

        if (arg in variables) {
          value = variables[arg];
        } else if (
          arg.startsWith('"') &&
          arg.endsWith('"')
        ) {
          value = decodeString(
            arg.slice(1, -1)
          );
        } else {
          value = evaluate(arg);
        }

        if (format.includes("%d")) {
          format = format.replace(
            "%d",
            String(value)
          );
        } else if (format.includes("%f")) {
          format = format.replace(
            "%f",
            String(value)
          );
        } else if (format.includes("%s")) {
          format = format.replace(
            "%s",
            String(value)
          );
        }
      }

      output.push(format);

      continue;
    }

    /*
     * scanf("%d", &a)
     */
    const scanfMatch = line.match(
      /^scanf\s*\(\s*"([^"]+)"\s*,\s*&?([a-zA-Z_]\w*)\s*\)$/
    );

    if (scanfMatch) {
      const variableName = scanfMatch[2];

      if (inputIndex >= inputs.length) {
        throw new Error(
          `Input required for "${variableName}".`
        );
      }

      const value = inputs[inputIndex++];

      if (scanfMatch[1].includes("%d")) {
        const number = Number(value);

        if (Number.isNaN(number)) {
          throw new Error(
            `Invalid integer input for "${variableName}".`
          );
        }

        variables[variableName] = number;
      } else {
        variables[variableName] = value;
      }

      continue;
    }

    /*
     * int a = 10
     */
    const declaration = line.match(
      /^(?:int|float|double)\s+([a-zA-Z_]\w*)\s*(?:=\s*(.*))?$/
    );

    if (declaration) {
      const variableName = declaration[1];
      const expression = declaration[2];

      if (expression) {
        variables[variableName] =
          evaluate(expression);
      } else {
        variables[variableName] = 0;
      }

      continue;
    }

    /*
     * a = a + b
     */
    const assignment = line.match(
      /^([a-zA-Z_]\w*)\s*=\s*(.*)$/
    );

    if (assignment) {
      const variableName = assignment[1];

      if (!(variableName in variables)) {
        throw new Error(
          `Variable "${variableName}" is not declared.`
        );
      }

      variables[variableName] =
        evaluate(assignment[2]);

      continue;
    }

    throw new Error(
      `Unsupported C statement:\n${line}`
    );
  }

  return output.join("");
}

export default function CProgrammingPage() {
  const [code, setCode] =
    useState(DEFAULT_CODE);

  const [input, setInput] =
    useState("10\n20");

  const [output, setOutput] =
    useState("");

  const [error, setError] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const runCode = () => {
    setRunning(true);
    setOutput("");
    setError("");

    setTimeout(() => {
      try {
        const result = runSimpleC(
          code,
          input
        );

        setOutput(
          result ||
            "Program finished successfully."
        );
      } catch (err: any) {
        setError(
          err?.message ||
            "Program execution failed."
        );
      } finally {
        setRunning(false);
      }
    }, 180);
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setInput("10\n20");
    setOutput("");
    setError("");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError(
        "Unable to copy code."
      );
    }
  };

  const downloadCode = () => {
    const blob = new Blob(
      [code],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "main.c";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="astric-page">

      {/* ================= TOP NAVBAR ================= */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-logo">
            ⚡
          </div>

          <div className="brand-text">
            <strong>
              ASTRIC
            </strong>

            <span>
              AI Builder
            </span>
          </div>

        </div>

        <nav className="desktop-nav">

          <a href="/dashboard">
            Dashboard
          </a>

          <a href="/dashboard/projects">
            Projects
          </a>

          <a
            className="active-link"
            href="/dashboard/C-programming"
          >
            C Programming
          </a>

          <a href="/dashboard/profile">
            Profile
          </a>

        </nav>

        <div className="nav-right">

          <a
            className="upgrade"
            href="/dashboard/upgrede"
          >
            ✨ Upgrade
          </a>

          <button
            className="mobile-menu"
            type="button"
            onClick={() => {
              document
                .getElementById(
                  "mobile-navigation"
                )
                ?.classList.toggle(
                  "show"
                );
            }}
          >
            ☰
          </button>

        </div>

      </header>

      {/* MOBILE NAV */}

      <div
        id="mobile-navigation"
        className="mobile-navigation"
      >

        <a href="/dashboard">
          🏠 Dashboard
        </a>

        <a href="/dashboard/projects">
          📁 Projects
        </a>

        <a
          href="/dashboard/C-programming"
          className="mobile-active"
        >
          💻 C Programming
        </a>

        <a href="/dashboard/profile">
          👤 Profile
        </a>

        <a
          href="/dashboard/upgrede"
          className="mobile-upgrade"
        >
          ✨ Upgrade
        </a>

      </div>

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            <span className="green-dot"></span>

            ASTRIC C DEVELOPMENT
            ENVIRONMENT
          </div>

          <h1>
            Professional
            <span> C Programming </span>
            Workspace
          </h1>

          <p>
            Write, test and practice C
            programming directly inside
            Astric AI Builder.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-action"
              onClick={runCode}
            >
              ▶ Run Program
            </button>

            <button
              className="outline-action"
              onClick={resetCode}
            >
              ↻ Reset
            </button>

          </div>

        </div>

        <div className="hero-visual">

          <div className="code-window">

            <div className="window-top">

              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span>
                main.c
              </span>

              <small>
                C
              </small>

            </div>

            <div className="mini-code">

              <div>
                <i>01</i>
                <span>
                  #include &lt;stdio.h&gt;
                </span>
              </div>

              <div>
                <i>02</i>
                <span>
                  int main() {"{"}
                </span>
              </div>

              <div>
                <i>03</i>
                <span>
                  &nbsp;&nbsp;printf(
                  "Hello Astric");
                </span>
              </div>

              <div>
                <i>04</i>
                <span>
                  &nbsp;&nbsp;return 0;
                </span>
              </div>

              <div>
                <i>05</i>
                <span>
                  {"}"}
                </span>
              </div>

            </div>

            <div className="mini-output">
              <span>
                ● PROGRAM OUTPUT
              </span>

              <strong>
                Hello Astric
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* ================= COMPILER ================= */}

      <main className="compiler-section">

        <div className="section-heading">

          <div>

            <span>
              CODE WORKSPACE
            </span>

            <h2>
              C Compiler & Console
            </h2>

          </div>

          <div className="browser-status">

            <span></span>

            Browser Runner
          </div>

        </div>

        <div className="compiler-grid">

          {/* EDITOR */}

          <section className="panel editor-panel">

            <div className="panel-header">

              <div className="file-name">

                <span>
                  📄
                </span>

                main.c

              </div>

              <div className="language-tag">
                C
              </div>

            </div>

            <textarea
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                )
              }
              spellCheck={false}
              className="main-editor"
              aria-label="C code editor"
            />

            <div className="editor-status">

              <span>
                C Language
              </span>

              <span>
                {code.length} chars
              </span>

            </div>

          </section>

          {/* RIGHT SIDE */}

          <section className="side-panels">

            {/* INPUT */}

            <div className="panel input-panel">

              <div className="panel-header">

                <span>
                  ⌨️ Program Input
                </span>

                <small>
                  stdin
                </small>

              </div>

              <textarea
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                className="input-box"
                placeholder={
                  "Enter input here..."
                }
              />

            </div>

            {/* OUTPUT */}

            <div className="panel output-panel">

              <div className="panel-header">

                <span>
                  🖥️ Console Output
                </span>

                {running && (
                  <small className="running">
                    Running...
                  </small>
                )}

              </div>

              <pre className="console">

                {output ||
                  (!error
                    ? "Program output will appear here..."
                    : "")}

              </pre>

              {error && (

                <div className="error">

                  <strong>
                    ⚠ Execution Error
                  </strong>

                  <pre>
                    {error}
                  </pre>

                </div>

              )}

            </div>

          </section>

        </div>

        {/* TOOLBAR */}

        <div className="toolbar">

          <button
            onClick={copyCode}
          >
            {copied
              ? "✓ Copied"
              : "📋 Copy"}
          </button>

          <button
            onClick={downloadCode}
          >
            💾 Download
          </button>

          <button
            onClick={resetCode}
          >
            ↻ Reset
          </button>

          <button
            className="run-main"
            onClick={runCode}
            disabled={running}
          >
            {running
              ? "Running..."
              : "▶ Run Code"}
          </button>

        </div>

      </main>

      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            ⚡
          </div>

          <div>

            <h3>
              Fast Browser Runner
            </h3>

            <p>
              Practice simple C programs
              directly from your browser.
            </p>

          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            📱
          </div>

          <div>

            <h3>
              Mobile Friendly
            </h3>

            <p>
              The complete workspace
              automatically adapts to
              mobile screens.
            </p>

          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            🎓
          </div>

          <div>

            <h3>
              Learn C
            </h3>

            <p>
              Practice variables, input,
              output and arithmetic.
            </p>

          </div>

        </div>

      </section>

      {/* ================= LEARNING SECTION ================= */}

      <section className="learn-section">

        <div className="learn-content">

          <span className="section-label">
            LEARN & BUILD
          </span>

          <h2>
            Start Your C Programming
            Journey With Astric
          </h2>

          <p>
            Learn programming concepts
            by writing and testing code.
            Astric gives you a simple
            development workspace for
            your programming practice.
          </p>

          <div className="learn-points">

            <div>
              <b>01</b>
              Variables & Data Types
            </div>

            <div>
              <b>02</b>
              Input & Output
            </div>

            <div>
              <b>03</b>
              Operators & Expressions
            </div>

            <div>
              <b>04</b>
              Functions & Logic
            </div>

          </div>

        </div>

        <div className="learning-visual">

          <div className="circle-icon">
            C
          </div>

          <div className="orbit orbit-one">
            &lt;/&gt;
          </div>

          <div className="orbit orbit-two">
            {"{}"}
          </div>

          <div className="orbit orbit-three">
            ⚡
          </div>

        </div>

      </section>

      {/* ================= NOTICE ================= */}

      <section className="notice">

        <strong>
          ASTRIC C RUNNER
        </strong>

        <span>
          Current browser mode supports
          basic C learning programs such
          as printf, scanf, variables and
          arithmetic expressions. A full
          GCC/Clang compiler will require
          a compiler backend or WebAssembly
          compiler.
        </span>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-brand">

          <div className="brand-logo">
            ⚡
          </div>

          <div>

            <strong>
              ASTRIC AI Builder
            </strong>

            <span>
              Build. Code. Create.
            </span>

          </div>

        </div>

        <p>
          © 2026 Astric AI Builder.
          All rights reserved.
        </p>

      </footer>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .astric-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(37, 99, 235, .14),
              transparent 30%
            ),
            #070b14;
          color: #f8fafc;
          overflow-x: hidden;
        }

        /* NAVBAR */

        .navbar {
          min-height: 70px;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(10, 15, 27, .96);
          border-bottom: 1px solid #202b3d;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(16px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          box-shadow:
            0 8px 25px rgba(37,99,235,.25);
          font-size: 19px;
        }

        .brand-text strong {
          display: block;
          font-size: 15px;
          letter-spacing: 1px;
        }

        .brand-text span {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 9px;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .desktop-nav a {
          padding: 9px 12px;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 8px;
          font-size: 12px;
          transition: .2s;
        }

        .desktop-nav a:hover,
        .desktop-nav .active-link {
          color: #fff;
          background: #172033;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .upgrade {
          text-decoration: none;
          color: white;
          background: #2563eb;
          border: 1px solid #3b82f6;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .mobile-menu {
          display: none;
          width: 40px;
          height: 40px;
          border: 1px solid #334155;
          background: #111827;
          color: white;
          border-radius: 9px;
          font-size: 20px;
        }

        .mobile-navigation {
          display: none;
        }

        /* HERO */

        .hero {
          max-width: 1400px;
          margin: auto;
          padding: 72px 28px 70px;
          display: grid;
          grid-template-columns: 1fr .9fr;
          align-items: center;
          gap: 70px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border: 1px solid #243047;
          background: #101827;
          border-radius: 30px;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .green-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 10px #22c55e;
        }

        .hero h1 {
          margin: 20px 0 0;
          max-width: 720px;
          font-size: clamp(
            38px,
            6vw,
            72px
          );
          line-height: .98;
          letter-spacing: -3px;
        }

        .hero h1 span {
          color: #60a5fa;
        }

        .hero p {
          max-width: 600px;
          margin: 22px 0 0;
          color: #94a3b8;
          line-height: 1.7;
          font-size: 15px;
        }

        .hero-buttons {
          display: flex;
          gap: 10px;
          margin-top: 28px;
        }

        .primary-action,
        .outline-action {
          border-radius: 9px;
          padding: 12px 18px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }

        .primary-action {
          color: white;
          background: #2563eb;
          border: 1px solid #3b82f6;
        }

        .outline-action {
          color: #cbd5e1;
          background: #111827;
          border: 1px solid #334155;
        }

        /* VISUAL */

        .hero-visual {
          min-width: 0;
        }

        .code-window {
          border: 1px solid #26344a;
          border-radius: 16px;
          overflow: hidden;
          background: #0c1320;
          box-shadow:
            0 30px 80px rgba(0,0,0,.35);
          transform: perspective(1000px)
            rotateY(-3deg);
        }

        .window-top {
          height: 48px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #111a2a;
          border-bottom: 1px solid #26344a;
          color: #cbd5e1;
          font-size: 12px;
        }

        .window-dots {
          display: flex;
          gap: 6px;
        }

        .window-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #475569;
        }

        .window-top small {
          color: #60a5fa;
        }

        .mini-code {
          padding: 22px;
          font-family: Consolas, Monaco, monospace;
          font-size: 12px;
          line-height: 2;
        }

        .mini-code div {
          display: flex;
          gap: 16px;
        }

        .mini-code i {
          width: 20px;
          color: #475569;
          font-style: normal;
        }

        .mini-code span {
          color: #93c5fd;
        }

        .mini-output {
          margin: 0 15px 15px;
          padding: 15px;
          border: 1px solid #26344a;
          border-radius: 9px;
          background: #080d17;
        }

        .mini-output span {
          display: block;
          color: #64748b;
          font-size: 9px;
        }

        .mini-output strong {
          display: block;
          margin-top: 8px;
          color: #86efac;
          font-family: Consolas, monospace;
          font-size: 12px;
        }

        /* COMPILER */

        .compiler-section {
          max-width: 1400px;
          margin: auto;
          padding: 0 28px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .section-heading > div:first-child > span,
        .section-label {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .section-heading h2 {
          margin: 7px 0 0;
          font-size: 27px;
        }

        .browser-status {
          padding: 8px 12px;
          border: 1px solid #26344a;
          background: #101827;
          border-radius: 20px;
          color: #94a3b8;
          font-size: 10px;
        }

        .browser-status span {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 7px;
          background: #22c55e;
          border-radius: 50%;
        }

        .compiler-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(300px, .75fr);
          gap: 14px;
        }

        .panel {
          overflow: hidden;
          background: #0d1522;
          border: 1px solid #243047;
          border-radius: 12px;
        }

        .editor-panel {
          min-height: 590px;
          display: flex;
          flex-direction: column;
        }

        .side-panels {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .input-panel {
          min-height: 180px;
        }

        .output-panel {
          min-height: 395px;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          min-height: 47px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #243047;
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .file-name {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .language-tag {
          color: #60a5fa;
          font-size: 10px;
        }

        .panel-header small {
          color: #64748b;
          font-size: 10px;
        }

        .running {
          color: #60a5fa !important;
        }

        .main-editor,
        .input-box {
          width: 100%;
          border: 0;
          outline: 0;
          resize: none;
          background: #080d16;
          color: #dbeafe;
          font-family:
            Consolas,
            Monaco,
            "Courier New",
            monospace;
        }

        .main-editor {
          flex: 1;
          min-height: 0;
          padding: 20px;
          font-size: 14px;
          line-height: 1.65;
          white-space: pre;
          overflow: auto;
        }

        .input-box {
          height: 130px;
          padding: 15px;
          font-size: 13px;
          line-height: 1.6;
        }

        .editor-status {
          height: 28px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #111827;
          border-top: 1px solid #243047;
          color: #64748b;
          font-size: 9px;
          flex-shrink: 0;
        }

        .console {
          flex: 1;
          min-height: 0;
          margin: 0;
          padding: 17px;
          background: #080d16;
          color: #86efac;
          font-family:
            Consolas,
            Monaco,
            monospace;
          font-size: 12px;
          line-height: 1.7;
          white-space: pre-wrap;
          overflow: auto;
        }

        .error {
          padding: 12px;
          border-top: 1px solid #7f1d1d;
          background: #241015;
          color: #fca5a5;
          font-size: 11px;
        }

        .error pre {
          margin: 7px 0 0;
          white-space: pre-wrap;
          font-family: Consolas, monospace;
        }

        /* TOOLBAR */

        .toolbar {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 12px;
        }

        .toolbar button {
          min-height: 38px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid #2c3b52;
          background: #111827;
          color: #cbd5e1;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .toolbar button:hover {
          background: #172033;
        }

        .toolbar .run-main {
          color: white;
          background: #2563eb;
          border-color: #3b82f6;
        }

        /* FEATURES */

        .features {
          max-width: 1400px;
          margin: 55px auto 0;
          padding: 0 28px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 13px;
        }

        .feature-card {
          display: flex;
          gap: 14px;
          padding: 20px;
          border: 1px solid #243047;
          border-radius: 12px;
          background: #0d1522;
        }

        .feature-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          background: #17233a;
          font-size: 19px;
        }

        .feature-card h3 {
          margin: 0;
          font-size: 13px;
        }

        .feature-card p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        /* LEARNING */

        .learn-section {
          max-width: 1400px;
          margin: 70px auto 0;
          padding: 55px 45px;
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          align-items: center;
          gap: 40px;
          border: 1px solid #243047;
          border-radius: 18px;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(37,99,235,.14),
              transparent 35%
            ),
            #0c1320;
        }

        .learn-content h2 {
          max-width: 600px;
          margin: 10px 0;
          font-size: clamp(
            28px,
            4vw,
            44px
          );
          line-height: 1.08;
        }

        .learn-content > p {
          max-width: 600px;
          color: #94a3b8;
          line-height: 1.7;
          font-size: 13px;
        }

        .learn-points {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 22px;
        }

        .learn-points div {
          padding: 12px;
          border: 1px solid #243047;
          border-radius: 8px;
          color: #cbd5e1;
          font-size: 11px;
        }

        .learn-points b {
          margin-right: 8px;
          color: #60a5fa;
        }

        .learning-visual {
          min-height: 310px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .circle-icon {
          width: 125px;
          height: 125px;
          display: grid;
          place-items: center;
          border: 1px solid #3b82f6;
          border-radius: 50%;
          background: #111d31;
          color: #60a5fa;
          font-family: Georgia, serif;
          font-size: 70px;
          font-weight: bold;
          box-shadow:
            0 0 70px rgba(37,99,235,.2);
        }

        .orbit {
          position: absolute;
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border: 1px solid #30405a;
          border-radius: 50%;
          background: #111827;
          color: #93c5fd;
          font-size: 12px;
        }

        .orbit-one {
          top: 20px;
          right: 15%;
        }

        .orbit-two {
          bottom: 25px;
          left: 15%;
        }

        .orbit-three {
          right: 4%;
          bottom: 30%;
        }

        /* NOTICE */

        .notice {
          max-width: 1400px;
          margin: 22px auto;
          padding: 0 28px;
          display: flex;
          gap: 10px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.7;
        }

        .notice strong {
          flex-shrink: 0;
          color: #94a3b8;
        }

        /* FOOTER */

        footer {
          max-width: 1400px;
          margin: 50px auto 0;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid #202b3d;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .footer-brand .brand-logo {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }

        .footer-brand strong {
          display: block;
          font-size: 11px;
        }

        .footer-brand span {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 9px;
        }

        footer p {
          margin: 0;
          color: #475569;
          font-size: 9px;
        }

        /* TABLET */

        @media (max-width: 1000px) {

          .desktop-nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .hero-visual {
            max-width: 700px;
          }

          .compiler-grid {
            grid-template-columns: 1fr;
          }

          .editor-panel {
            min-height: 500px;
          }

          .output-panel {
            min-height: 330px;
          }

          .learn-section {
            margin-left: 28px;
            margin-right: 28px;
          }

        }

        /* MOBILE */

        @media (max-width: 650px) {

          .navbar {
            min-height: 62px;
            padding: 0 12px;
          }

          .brand-logo {
            width: 35px;
            height: 35px;
          }

          .brand-text strong {
            font-size: 13px;
          }

          .brand-text span {
            font-size: 8px;
          }

          .desktop-nav,
          .nav-right .upgrade {
            display: none;
          }

          .mobile-menu {
            display: block;
          }

          .mobile-navigation {
            padding: 8px 12px 12px;
            background: #0b1120;
            border-bottom: 1px solid #202b3d;
          }

          .mobile-navigation.show {
            display: grid;
            gap: 5px;
          }

          .mobile-navigation a {
            padding: 12px;
            border-radius: 8px;
            color: #94a3b8;
            background: #111827;
            text-decoration: none;
            font-size: 12px;
          }

          .mobile-navigation .mobile-active {
            color: white;
            background: #1d4ed8;
          }

          .mobile-navigation .mobile-upgrade {
            color: white;
            background: #2563eb;
            font-weight: 700;
          }

          .hero {
            padding: 45px 14px 40px;
            gap: 35px;
          }

          .hero h1 {
            margin-top: 16px;
            font-size: 42px;
            letter-spacing: -2px;
          }

          .hero p {
            font-size: 13px;
          }

          .hero-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .primary-action,
          .outline-action {
            width: 100%;
            padding: 12px 8px;
            font-size: 11px;
          }

          .code-window {
            transform: none;
          }

          .mini-code {
            padding: 16px;
            font-size: 10px;
          }

          .compiler-section {
            padding: 0 12px;
          }

          .section-heading {
            display: block;
          }

          .section-heading h2 {
            font-size: 23px;
          }

          .browser-status {
            display: inline-block;
            margin-top: 10px;
          }

          .compiler-grid {
            gap: 10px;
          }

          .editor-panel {
            min-height: 430px;
          }

          .main-editor {
            min-height: 380px;
            padding: 13px;
            font-size: 12px;
          }

          .input-panel {
            min-height: 150px;
          }

          .input-box {
            height: 105px;
          }

          .output-panel {
            min-height: 290px;
          }

          .console {
            font-size: 11px;
          }

          .toolbar {
            display: grid;
            grid-template-columns:
              repeat(2, 1fr);
          }

          .toolbar button {
            width: 100%;
          }

          .features {
            margin-top: 40px;
            padding: 0 12px;
            grid-template-columns: 1fr;
          }

          .learn-section {
            margin: 40px 12px 0;
            padding: 32px 20px;
            grid-template-columns: 1fr;
          }

          .learn-content h2 {
            font-size: 30px;
          }

          .learn-points {
            grid-template-columns: 1fr;
          }

          .learning-visual {
            min-height: 260px;
          }

          .notice {
            padding: 0 12px;
            display: block;
          }

          .notice strong {
            display: block;
            margin-bottom: 5px;
          }

          footer {
            margin-top: 35px;
            padding: 20px 12px;
            display: block;
          }

          footer p {
            margin-top: 12px;
          }

        }

        /* SMALL PHONES */

        @media (max-width: 380px) {

          .hero h1 {
            font-size: 35px;
          }

          .hero-buttons {
            grid-template-columns: 1fr;
          }

          .window-top {
            font-size: 10px;
          }

          .mini-code {
            font-size: 8px;
          }

          .panel-header {
            padding: 0 10px;
            font-size: 10px;
          }

          .main-editor {
            font-size: 11px;
          }

        }

      `}</style>

    </div>
  );
}