"use client";

export default function TemplatesPage() {
  const templates = [
    "Business Website",
    "Portfolio",
    "E-Commerce",
    "Jewellery Shop",
    "Restaurant",
    "Hospital",
    "School",
    "News Website",
    "Blog",
    "Landing Page",
    "Real Estate",
    "Gym & Fitness"
  ];

  return (
    <main
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "34px", marginBottom: "25px" }}>
        🎨 Website Templates
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {templates.map((template) => (
          <div
            key={template}
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,.08)",
              textAlign: "center",
            }}
          >
            <h3>{template}</h3>

            <button
              style={{
                marginTop: "15px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}