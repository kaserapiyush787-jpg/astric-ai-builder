"use client";

import Link from "next/link";
import WebsiteNavbar from "@/components/websitenavbar";


export default function AboutPage() {

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
       <WebsiteNavbar />
     
      {/* HERO SECTION */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "90px 20px",
          textAlign: "center",
        }}
      >

        <span
          style={{
            display: "inline-block",
            padding: "8px 18px",
            borderRadius: "999px",
            background: "#1d4ed8",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "25px",
          }}
        >
          🚀 About ASTRIC AI Builder
        </span>

        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            lineHeight: "1.2",
            marginBottom: "25px",
          }}
        >
          Build Professional Websites
          <br />
          Faster with Artificial Intelligence
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            color: "#9ca3af",
            fontSize: "20px",
            lineHeight: "34px",
          }}
        >
          ASTRIC AI Builder is a modern AI-powered platform that helps
          developers, businesses, students, and creators build beautiful,
          responsive websites using HTML, CSS, and JavaScript with an easy,
          professional workflow.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginTop: "45px",
            flexWrap: "wrap",
          }}
        >

          <Link
            href="/signup"
            style={{
              textDecoration: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "15px 28px",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            Start Building
          </Link>

          <Link
            href="/features"
            style={{
              textDecoration: "none",
              border: "1px solid #374151",
              color: "#fff",
              padding: "15px 28px",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            Explore Features
          </Link>

        </div>

      </section>
      {/* =========================
            WHO WE ARE
      ========================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
        >

          <div>

            <span
              style={{
                color: "#3b82f6",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              WHO WE ARE
            </span>

            <h2
              style={{
                fontSize: "42px",
                marginTop: "18px",
                marginBottom: "22px",
              }}
            >
              Building the Future of Website Creation
            </h2>

            <p
              style={{
                color: "#9ca3af",
                lineHeight: "32px",
                fontSize: "18px",
              }}
            >
              ASTRIC AI Builder is designed to make website development
              simple, fast, and intelligent. Whether you are a beginner
              learning web development or a professional developer building
              modern applications, our platform helps you create websites
              efficiently with AI assistance.
            </p>

          </div>


          <div
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "20px",
              padding: "35px",
            }}
          >

            <h3
              style={{
                marginBottom: "20px",
                fontSize: "28px",
              }}
            >
              🚀 Why Choose ASTRIC?
            </h3>

            <ul
              style={{
                color: "#d1d5db",
                lineHeight: "38px",
                fontSize: "17px",
              }}
            >
              <li>AI Powered Website Builder</li>
              <li>Professional Code Editor</li>
              <li>Live Website Preview</li>
              <li>Responsive Website Design</li>
              <li>Fast & Secure Platform</li>
              <li>Modern UI Experience</li>
            </ul>

          </div>

        </div>

      </section>


      {/* =========================
            OUR MISSION
      ========================= */}

      <section
        style={{
          background: "#111827",
          padding: "90px 20px",
        }}
      >

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >

          <span
            style={{
              color: "#60a5fa",
              fontWeight: "bold",
            }}
          >
            OUR MISSION
          </span>

          <h2
            style={{
              fontSize: "44px",
              marginTop: "20px",
              marginBottom: "25px",
            }}
          >
            Empower Everyone to Build Websites with AI
          </h2>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "19px",
              lineHeight: "34px",
            }}
          >
            Our mission is to make professional website development
            accessible to everyone. With AI-powered tools, visual editing,
            and modern technologies, ASTRIC AI Builder enables users to
            transform ideas into fully functional websites in minutes.
          </p>

        </div>

      </section>
      {/* =========================
            FEATURES
      ========================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "90px 20px",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >

          <span
            style={{
              color: "#60a5fa",
              fontWeight: "bold",
            }}
          >
            PLATFORM FEATURES
          </span>

          <h2
            style={{
              fontSize: "46px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            Everything You Need in One Platform
          </h2>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              color: "#9ca3af",
              fontSize: "18px",
              lineHeight: "32px",
            }}
          >
            ASTRIC AI Builder provides powerful tools that help you design,
            build, edit and publish modern websites with speed and simplicity.
          </p>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "25px",
          }}
        >

          {[
            ["🤖","AI Website Generation"],
            ["💻","Professional Code Editor"],
            ["⚡","Real-Time Live Preview"],
            ["📱","Responsive Website Design"],
            ["☁️","Cloud Project Storage"],
            ["📦","Export HTML, CSS & JS"],
            ["🎨","Modern UI Components"],
            ["🔒","Secure Authentication"],
          ].map(([icon,title]) => (

            <div
              key={title}
              style={{
                background:"#111827",
                border:"1px solid #374151",
                borderRadius:"18px",
                padding:"30px",
              }}
            >

              <div
                style={{
                  fontSize:"40px",
                  marginBottom:"18px",
                }}
              >
                {icon}
              </div>

              <h3
                style={{
                  marginBottom:"12px",
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  color:"#9ca3af",
                  lineHeight:"28px",
                }}
              >
                Powerful tools designed for developers,
                students, startups and businesses to
                create professional websites faster.
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =========================
            STATS
      ========================= */}

      <section
        style={{
          background:"#111827",
          padding:"90px 20px",
        }}
      >

        <div
          style={{
            maxWidth:"1200px",
            margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
            gap:"25px",
            textAlign:"center",
          }}
        >

          <div>
            <h2 style={{fontSize:"48px",color:"#3b82f6"}}>
              99.9%
            </h2>

            <p style={{color:"#9ca3af"}}>
              Platform Uptime
            </p>
          </div>

          <div>
            <h2 style={{fontSize:"48px",color:"#3b82f6"}}>
              AI
            </h2>

            <p style={{color:"#9ca3af"}}>
              Smart Website Builder
            </p>
          </div>

          <div>
            <h2 style={{fontSize:"48px",color:"#3b82f6"}}>
              HTML
            </h2>

            <p style={{color:"#9ca3af"}}>
              CSS & JavaScript Support
            </p>
          </div>

          <div>
            <h2 style={{fontSize:"48px",color:"#3b82f6"}}>
              24/7
            </h2>

            <p style={{color:"#9ca3af"}}>
              Future Support Vision
            </p>
          </div>

        </div>

      </section>
      {/* =========================
            CALL TO ACTION
      ========================= */}

      <section
        style={{
          padding: "100px 20px",
          textAlign: "center",
          background: "#030712",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              marginBottom: "20px",
            }}
          >
            Ready to Build Your Next Website?
          </h2>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "18px",
              lineHeight: "32px",
              marginBottom: "40px",
            }}
          >
            Join ASTRIC AI Builder and create professional, responsive websites
            with AI-powered tools. Start building faster with a modern developer
            experience.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/signup"
              style={{
                background: "#2563eb",
                color: "#fff",
                textDecoration: "none",
                padding: "15px 30px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Get Started Free
            </Link>

            <Link
              href="/contact"
              style={{
                border: "1px solid #374151",
                color: "#fff",
                textDecoration: "none",
                padding: "15px 30px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
            FOOTER
      ========================= */}

      <footer
        style={{
          background: "#111827",
          borderTop: "1px solid #374151",
          padding: "50px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "30px",
          }}
        >
          <div>
            <h3>🚀 ASTRIC AI Builder</h3>

            <p
              style={{
                color: "#9ca3af",
                maxWidth: "350px",
                lineHeight: "28px",
              }}
            >
              Build modern websites using AI, a professional code editor,
              live preview, and powerful development tools.
            </p>
          </div>

          <div>
            <h4>Platform</h4>

       
            <p>
            <Link href="/templates" style={{ color: "#9ca3af" }}>Templates</Link></p>
          
            <Link href="/pricing" style={{ color: "#9ca3af" }}>Pricing</Link>
          </div>

          <div>
            <h4>Resources</h4>
            <p>
            <Link href="/contect"
             style={{ color: "#9ca3af" }}>Documentation</Link></p>
             <p>
            <Link href="/contect" style={{ color: "#9ca3af" }}>Help Center</Link></p>
            <p>
            <Link href="/privacy policy" style={{ color: "#9ca3af" }}>Privacy Policy</Link></p>
            <p>
            <Link href="/terms" style={{ color: "#9ca3af" }}>Terms of Service</Link>
            </p>
          </div>

        </div>
        <Link
            href="/signup"
            style={{
              textDecoration: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "15px 28px",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            Start Building
          </Link>


        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "#6b7280",
            borderTop: "1px solid #374151",
            paddingTop: "25px",
          }}
        >
          <li>© 2026 ASTRIC AI Builder. All Rights Reserved.</li>
          <li>Devloped by ⚡ASTRIC </li>
        </div>
      </footer>

    </main>
  );
}