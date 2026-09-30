"use client";

import Link from "next/link";
import WebsiteNavbar from "@/components/websitenavbar";
export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <WebsiteNavbar/>

      {/* HERO */}

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
            background: "#2563eb",
            borderRadius: "999px",
            fontWeight: "bold",
            marginBottom: "25px",
          }}
        >
          📞 Contact Us
        </span>

        <h1
          style={{
            fontSize: "58px",
            marginBottom: "20px",
          }}
        >
          We'd Love To Hear
          <br />
          From You
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
          Have questions, suggestions or need support?
          Contact the ASTRIC AI Builder team and we'll
          help you as soon as possible.
        </p>

      </section>

      {/* CONTACT SECTION */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
        }}
      >
        {/* =========================
              CONTACT FORM
        ========================= */}

       <div
  style={{
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "20px",
    padding: "35px",
  }}
>
  <h2
    style={{
      marginBottom: "25px",
      fontSize: "32px",
      color: "#ffffff" // Heading color add kiya gaya hai dark mode ke liye
    }}
  >
    Send Us a Message
  </h2>

  {/* Form action mein 'aapka_email@gmail.com' ko hatakar apna real Gmail ID likhein */}
  <form
    action="https://supportkp786@gmail.com" 
   
    method="POST"
    
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    }}
  >
    {/* Spam se bachne ke liye Captcha disable karna ho toh ye line use karein (Optional) */}
    <input type="hidden" name="_captcha" value="false" />
    <input type="email" name="email"></input>
    
    {/* Success hone par wapas apni website par aane ke liye link (Optional) */}
    {/* <input type="hidden" name="_next" value="https://aapki-website.com/thanks" /> */}

    <input
      type="text"
      name="name" // Name attribute zaroori hai data bhejne ke liye
      placeholder="Full Name"
      required
      style={inputStyle}
    />

    <input
      type="email"
      name="email" // Name attribute zaroori hai
      placeholder="Email Address"
      required
      style={inputStyle}
    />

    <input
      type="text"
      name="subject" // Name attribute zaroori hai
      placeholder="Subject"
      style={inputStyle}
    />

    <textarea
      name="message" // Name attribute zaroori hai
      placeholder="Write your message..."
      rows={7}
      required
      style={{
        ...inputStyle,
        resize: "vertical",
      }}
    />

    <button
      type="submit"
      style={{
        background: "#2563eb",
        color: "#ffffff",
        border: "none",
        padding: "15px",
        borderRadius: "12px",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      📩 Send Message
    </button>
  </form>
</div>

        {/* =========================
              CONTACT INFO
        ========================= */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          <div
            style={cardStyle}
          >
            <h3>📧 Email</h3>

            <p style={{ color: "#9ca3af" }}>
              supportkp786@gmail.com
            </p>
          </div>

          <div
            style={cardStyle}
          >
            <h3>💬 Live Support</h3>

            <p style={{ color: "#9ca3af" }}>
              Available 24/7 for future premium support.
            </p>
          </div>

          <div
            style={cardStyle}
          >
            <h3>🌍 Office</h3>

            <p style={{ color: "#9ca3af" }}>
              Global AI Platform
            </p>
          </div>

          <div
            style={cardStyle}
          >
            <h3>🚀 Platform</h3>

            <p style={{ color: "#9ca3af" }}>
              AI Website Builder • Code Editor • Live Preview
            </p>
          </div>

        </div>

      </section>
      {/* =========================
            FAQ SECTION
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
            marginBottom: "50px",
          }}
        >

          <span
            style={{
              color: "#60a5fa",
              fontWeight: "bold",
            }}
          >
            FAQ
          </span>

          <h2
            style={{
              fontSize: "46px",
              marginTop: "18px",
              marginBottom: "18px",
            }}
          >
            Frequently Asked Questions
          </h2>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "30px",
            }}
          >
            Here are answers to some common questions about
            ASTRIC AI Builder.
          </p>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "25px",
          }}
        >

          {[
            {
              q: "Is ASTRIC AI Builder free?",
              a: "Yes. A free version is available and more premium features will be added in the future."
            },
            {
              q: "Can I download my website?",
              a: "Yes. You can export your HTML, CSS and JavaScript files."
            },
            {
              q: "Do I need coding knowledge?",
              a: "No. Beginners can use AI while developers can edit code directly."
            },
            {
              q: "Can I publish my website?",
              a: "Publishing support will be available in future updates."
            }
          ].map((item) => (

            <div
              key={item.q}
              style={{
                background:"#111827",
                border:"1px solid #374151",
                borderRadius:"18px",
                padding:"25px",
              }}
            >

              <h3
                style={{
                  marginBottom:"15px",
                }}
              >
                {item.q}
              </h3>

              <p
                style={{
                  color:"#9ca3af",
                  lineHeight:"28px",
                }}
              >
                {item.a}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =========================
            SUPPORT CARDS
      ========================= */}

      <section
        style={{
          background:"#111827",
          padding:"80px 20px",
        }}
      >

        <div
          style={{
            maxWidth:"1200px",
            margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
            gap:"25px",
          }}
        >

          <div style={cardStyle}>
            <h3>📚 Documentation</h3>
            <p style={{color:"#9ca3af"}}>
              Read detailed guides to use ASTRIC AI Builder.
            </p>
          </div>

          <div style={cardStyle}>
            <h3>💬 Community</h3>
            <p style={{color:"#9ca3af"}}>
              Connect with developers and share ideas.
            </p>
          </div>

          <div style={cardStyle}>
            <h3>⚡ Technical Support</h3>
            <p style={{color:"#9ca3af"}}>
              Get help for technical issues and platform guidance.
            </p>
          </div>

          <div style={cardStyle}>
            <h3>🚀 Feature Requests</h3>
            <p style={{color:"#9ca3af"}}>
              Share your ideas to improve ASTRIC AI Builder.
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
        <h2
          style={{
            fontSize: "46px",
            marginBottom: "20px",
          }}
        >
          Let's Build Something Amazing Together
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            color: "#9ca3af",
            lineHeight: "32px",
            fontSize: "18px",
          }}
        >
          Whether you have a question, feedback, or a new idea,
          we're always happy to hear from you.
        </p>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              background: "#2563eb",
              color: "#ffffff",
              padding: "14px 30px",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            🏠 Back to Home
          </Link>

          <Link
            href="/about"
            style={{
              textDecoration: "none",
              border: "1px solid #374151",
              color: "#ffffff",
              padding: "14px 30px",
              borderRadius: "12px",
              fontWeight: "bold",
            }}
          >
            ℹ️ About Us
          </Link>
        </div>
      </section>

      {/* =========================
            FOOTER
      ========================= */}

      <footer
        style={{
          background: "#111827",
          borderTop: "1px solid #374151",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h3>🚀 ASTRIC AI Builder</h3>

        <p
          style={{
            color: "#9ca3af",
            marginTop: "15px",
            lineHeight: "28px",
          }}
        >
          AI Website Builder • Professional Code Editor • Live Preview
        </p>

        <p
          style={{
            marginTop: "25px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          © 2026 ASTRIC AI Builder. All Rights Reserved.
        </p>
      </footer>

    </main>
  );
}

/* =========================
      STYLES
========================= */

const inputStyle = {
  width: "100%",
  padding: "14px",
  background: "#030712",
  color: "#ffffff",
  border: "1px solid #374151",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box" as const,
};

const cardStyle = {
  background: "#111827",
  border: "1px solid #374151",
  borderRadius: "16px",
  padding: "24px",
};
//footer
 