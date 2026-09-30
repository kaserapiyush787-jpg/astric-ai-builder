"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Template = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
  thumbnail_url?: string;
  sort_order?: number;
};

type CommentItem = {
  id: string;
  name: string;
  content: string;
  rating: number;
  created_at: string;
};

type LiveStats = {
  projects: number;
  websites: number;
  views: number;
  users: number;
};

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);

  const [stats, setStats] = useState<LiveStats>({
    projects: 0,
    websites: 0,
    views: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState("");

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");

  useEffect(() => {
    loadPageData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadPageData() {
    setLoading(true);

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      await Promise.all([
        loadTemplates(),
        loadComments(),
        loadStats(),
      ]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     LIVE TEMPLATES
  ========================== */

  async function loadTemplates() {
    const { data, error } = await supabase
      .from("templates")
      .select(
        "id,name,category,description,preview_url,thumbnail_url,sort_order"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Templates error:", error);
      setTemplates([]);
      return;
    }

    setTemplates(data || []);
  }

  /* =========================
     LIVE COMMENTS
  ========================== */

  async function loadComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("id,name,content,rating,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("Comments error:", error);
      setComments([]);
      return;
    }

    setComments(data || []);
  }

  /* =========================
     LIVE STATISTICS
  ========================== */

  async function loadStats() {
    let projects = 0;
    let websites = 0;
    let views = 0;
    let users = 0;

    const projectsResult = await supabase
      .from("ai_projects")
      .select("id", { count: "exact", head: true });

    if (!projectsResult.error) {
      projects = projectsResult.count || 0;
    }

    const websitesResult = await supabase
      .from("published_sites")
      .select("id,views");

    if (!websitesResult.error) {
      websites = websitesResult.data?.length || 0;

      views =
        websitesResult.data?.reduce(
          (total, site) => total + Number(site.views || 0),
          0
        ) || 0;
    }

    const usersResult = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (!usersResult.error) {
      users = usersResult.count || 0;
    }

    setStats({
      projects,
      websites,
      views,
      users,
    });
  }

  /* =========================
     AI WEBSITE GENERATOR
  ========================== */

  async function generateWebsite() {
    if (!prompt.trim()) {
      setGenerateMessage("Please describe the website you want to create.");
      return;
    }

    setGenerating(true);
    setGenerateMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      const response = await fetch(`${apiUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Website generation failed."
        );
      }

      if (data.generatedCode) {
        sessionStorage.setItem(
          "astric_generated_code",
          JSON.stringify(data.generatedCode)
        );
      }

      sessionStorage.setItem(
        "astric_generation_prompt",
        prompt.trim()
      );

      window.location.href = "/editor";
    } catch (error: any) {
      console.error(error);

      setGenerateMessage(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  }

  /* =========================
     TEMPLATE
  ========================== */

  function useTemplate(template: Template) {
    if (template.preview_url) {
      sessionStorage.setItem(
        "astric_template_url",
        template.preview_url
      );
    }

    sessionStorage.setItem(
      "astric_template_name",
      template.name
    );

    window.location.href = "/editor";
  }

  /* =========================
     COMMENTS
  ========================== */

  async function submitComment() {
    setCommentMessage("");

    if (!commentName.trim()) {
      setCommentMessage("Please enter your name.");
      return;
    }

    if (!commentText.trim()) {
      setCommentMessage("Please write a comment.");
      return;
    }

    if (commentText.trim().length < 5) {
      setCommentMessage("Comment is too short.");
      return;
    }

    setCommentLoading(true);

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          name: commentName.trim(),
          content: commentText.trim(),
          rating: commentRating,
          status: "approved",
          user_id: user?.id || null,
        })
        .select(
          "id,name,content,rating,created_at"
        )
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setComments((previous) => [
          data,
          ...previous,
        ]);
      }

      setCommentName("");
      setCommentText("");
      setCommentRating(5);

      setCommentMessage("Your comment has been added.");
    } catch (error: any) {
      console.error("Comment error:", error);

      setCommentMessage(
        error?.message ||
          "Unable to submit comment."
      );
    } finally {
      setCommentLoading(false);
    }
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat("en-IN").format(value);
  }

  function formatDate(date: string) {
    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  }

  return (
    <main style={pageStyle}>

      {/* =========================
          NAVBAR
      ========================== */}

      <nav style={navbarStyle}>
        <div style={navInnerStyle}>

          <Link href="/" style={brandStyle}>
            <span style={brandIconStyle}>⚡</span>
            <span>ASTRIC AI</span>
          </Link>

          <div style={navLinksStyle}>
            <Link href="/" style={navLink}>
              Home
            </Link>

            <Link href="/pricing" style={navLink}>
              Pricing
            </Link>

            <Link href="/templates" style={navLink}>
              Templates
            </Link>

            {user ? (
              <Link href="/dashboard" style={navLink}>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" style={navLink}>
                Login
              </Link>
            )}

            {user ? (
              <Link href="/dashboard" style={primaryBtn}>
                Dashboard
              </Link>
            ) : (
              <Link href="/signup" style={primaryBtn}>
                Start Free
              </Link>
            )}
          </div>

        </div>
      </nav>

      {/* =========================
          HERO
      ========================== */}

      <section style={heroStyle}>
        <div style={heroGridStyle}>

          <div>

            <div style={badgeStyle}>
              🚀 AI Powered Website Builder
            </div>

            <h1 style={heroTitleStyle}>
              Build Professional Websites
              <br />
              <span style={gradientText}>
                with AI in Seconds
              </span>
            </h1>

            <p style={heroTextStyle}>
              Generate modern websites using AI,
              edit HTML, CSS & JavaScript, save
              projects, preview instantly and publish
              online — all from one platform.
            </p>

            <div style={heroButtonsStyle}>

              <Link
                href={user ? "/dashboard" : "/signup"}
                style={primaryBtnLarge}
              >
                🚀 Start Building
              </Link>

              <a
                href="#how-it-works"
                style={secondaryBtnLarge}
              >
                ▶ How It Works
              </a>

            </div>

            <div style={liveNoticeStyle}>
              <span style={greenDot}></span>
              Live platform data • No fabricated statistics
            </div>

          </div>

          {/* AI GENERATOR */}

          <div style={generatorCardStyle}>

            <div style={browserTopStyle}>
              <span style={dotRed}></span>
              <span style={dotYellow}></span>
              <span style={dotGreen}></span>

              <span style={browserTitle}>
                ASTRIC AI Builder
              </span>
            </div>

            <div style={{ padding: "25px" }}>

              <div style={aiTitleStyle}>
                🤖 AI Website Generator
              </div>

              <p style={smallTextStyle}>
                Describe the website you want to build.
              </p>

              <textarea
                value={prompt}
                onChange={(e) =>
                  setPrompt(e.target.value)
                }
                placeholder="Create a modern portfolio website for a software developer..."
                style={textareaStyle}
              />

              <button
                onClick={generateWebsite}
                disabled={generating}
                style={{
                  ...generateButtonStyle,
                  opacity: generating ? 0.65 : 1,
                }}
              >
                {generating
                  ? "⏳ Generating..."
                  : "⚡ Generate Website"}
              </button>

              {generateMessage && (
                <p style={errorMessageStyle}>
                  {generateMessage}
                </p>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* =========================
          LIVE STATS
      ========================== */}

      <section style={statsSectionStyle}>

        <div style={statsGridStyle}>

          <LiveStat
            number={formatNumber(stats.users)}
            title="Registered Users"
          />

          <LiveStat
            number={formatNumber(stats.projects)}
            title="AI Projects"
          />

          <LiveStat
            number={formatNumber(stats.websites)}
            title="Published Websites"
          />

          <LiveStat
            number={formatNumber(stats.views)}
            title="Website Views"
          />

        </div>

      </section>

      {/* =========================
          TRUSTED TECHNOLOGIES
      ========================== */}

      <section style={sectionStyle}>

        <SectionHeading
          title="Built With Modern Technology"
          description="ASTRIC AI connects modern web technologies with AI-powered website generation."
        />

        <div style={techGridStyle}>

          {[
            "Next.js",
            "React",
            "Node.js",
            "Supabase",
            "JavaScript",
            "AI Powered",
          ].map((item) => (
            <div key={item} style={techCardStyle}>
              {item}
            </div>
          ))}

        </div>

      </section>

      {/* =========================
          FEATURES
      ========================== */}

      <section id="features" style={sectionStyle}>

        <SectionHeading
          title="Everything You Need"
          description="One platform to generate, edit, preview, save and publish websites."
        />

        <div style={featureGridStyle}>

          {[
            [
              "🤖",
              "AI Website Generator",
              "Generate websites from simple natural-language prompts.",
            ],
            [
              "💻",
              "Code Editor",
              "Edit HTML, CSS and JavaScript with your generated website.",
            ],
            [
              "⚡",
              "Instant Preview",
              "Preview your website before publishing.",
            ],
            [
              "☁️",
              "Cloud Projects",
              "Keep your projects connected to your account.",
            ],
            [
              "🌍",
              "One-click Publish",
              "Publish your completed website online.",
            ],
            [
              "🔒",
              "Secure Platform",
              "Authentication and data are handled through Supabase.",
            ],
          ].map(([icon, title, desc]) => (

            <div key={title} style={featureCardStyle}>

              <div style={featureIconStyle}>
                {icon}
              </div>

              <h3>{title}</h3>

              <p style={featureTextStyle}>
                {desc}
              </p>

            </div>

          ))}

        </div>

      </section>

     {/* ASTRIC TEAM PROJECTS */}

<section
  id="projects"
  style={{
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "70px 30px 100px",
  }}
>
  <div
    style={{
      textAlign: "center",
      marginBottom: "55px",
    }}
  >
    <div
      style={{
        display: "inline-block",
        padding: "8px 16px",
        borderRadius: "999px",
        background: "rgba(255,255,255,.10)",
        border: "1px solid rgba(255,255,255,.15)",
        color: "#bfdbfe",
        fontSize: "14px",
        fontWeight: "700",
        marginBottom: "18px",
      }}
    >
      ⚡ ASTRIC TEAM PROJECTS
    </div>

    <h2
      style={{
        fontSize: "46px",
        lineHeight: "1.15",
        margin: "0 0 15px",
      }}
    >
      Websites Built by ASTRIC TEAM
    </h2>

    <p
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        color: "#cbd5e1",
        fontSize: "18px",
        lineHeight: "30px",
      }}
    >
      Explore websites and digital products created by our team.
      Open any project to view the live website.
    </p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "30px",
    }}
  >
    {[
      {
        title: "ASTRIC Result",
        category: "Jobs & Results Platform",
        description:
          "Government jobs, results, admit cards and answer key platform.",
        url: "https://astricresult.netlify.app/",
      },

      {
        title: "ASTRIC Calculator",
        category: "Web Application",
        description:
          "Professional online calculator platform with multiple tools.",
        url: "https://astric-calculator.netlify.app/",
      },

      {
        title: "ASTRIC Daily News",
        category: "Daliy News Platform",
        description:
          "Online Daily news platform.",
        url: "https://technovaxnews.netlify.app/",
      },

      {
        title: "ASTRIC AI Builder",
        category: "AI Website Builder",
        description:
          "AI-powered platform for generating, editing and publishing websites.",
        url: "https://astricai.netlify.app/",
      },

      {
        title: "ASTRIC Market",
        category: "E-Commerce",
        description:
          "Modern online shopping and product management platform.",
        url: "https://piyushmegamart.netlify.app/",
      },

      {
        title: "ASTRIC Business",
        category: "Business Website",
        description:
          "Professional business website and digital solutions platform.",
        url: "https://astric-calculator.netlify.app/",
      },
    ].map((project) => (
      <div
        key={project.title}
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,.22)",
          border: "1px solid rgba(255,255,255,.12)",
        }}
      >
        {/* Live Website Preview */}

        <div
          style={{
            height: "250px",
            background: "#f8fafc",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <iframe
            src={project.url}
            title={project.title}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "#ffffff",
            }}
            loading="lazy"
          />

          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background: "rgba(15,23,42,.88)",
              color: "#ffffff",
              padding: "7px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
              backdropFilter: "blur(8px)",
            }}
          >
            ● LIVE PREVIEW
          </div>
        </div>

        {/* Project Information */}

        <div
          style={{
            padding: "25px",
            color: "#111827",
          }}
        >
          <div
            style={{
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            {project.category}
          </div>

          <h3
            style={{
              fontSize: "24px",
              margin: "0 0 10px",
              fontWeight: "800",
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              color: "#64748b",
              lineHeight: "26px",
              minHeight: "52px",
              margin: 0,
            }}
          >
            {project.description}
          </p>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "22px",
              padding: "14px 18px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,#2563eb,#7c3aed)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "800",
            }}
          >
            Open Live Website ↗
          </a>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section
        id="how-it-works"
        style={sectionStyle}
      >

        <SectionHeading
          title="How It Works"
          description="Create and publish your website through a simple workflow."
        />

        <div style={stepsGridStyle}>

          {[
            ["01", "Describe Your Idea"],
            ["02", "AI Generates Website"],
            ["03", "Edit & Preview"],
            ["04", "Publish Online"],
          ].map(([number, title]) => (

            <div key={number} style={stepCardStyle}>

              <div style={stepNumberStyle}>
                {number}
              </div>

              <h3>{title}</h3>

              <p style={featureTextStyle}>
                Move to the next stage whenever
                your website is ready.
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* =========================
          PRICING
      ========================== */}

      <section id="pricing" style={sectionStyle}>

        <SectionHeading
          title="Simple Pricing"
          description="Choose a plan according to your website-building needs."
        />

        <div style={pricingGridStyle}>

          <PricingCard
            title="FREE"
            price="₹11"
            subtitle="For Donation"
            features={[
              "3 AI Websites / Month",
              "AI Code Generation",
              "Save Projects",
              "Live Preview",
            ]}
            button="Get Started"
            href="/signup"
          />

          <PricingCard
            featured
            title="PRO ⭐"
            price="₹499"
            subtitle="per month"
            features={[
              "Unlimited AI Websites",
              "Custom Domains",
              "Premium Templates",
              "Priority Support",
            ]}
            button="Upgrade Now"
            href="/pricing"
          />

          <PricingCard
            title="BUSINESS"
            price="₹999"
            subtitle="per month"
            features={[
              "Team Collaboration",
              "Unlimited Hosting",
              "API Access",
              "Dedicated Support",
            ]}
            button="Contact Sales"
            href="/pricing"
          />

        </div>

      </section>

      {/* =========================
          LIVE COMMENTS
      ========================== */}

      <section id="community" style={sectionStyle}>

        <SectionHeading
          title="Community Feedback"
          description="Comments displayed here are loaded from your Supabase database."
        />

        <div style={communityGridStyle}>

          {/* FORM */}

          <div style={commentCardStyle}>

            <h3>Share Your Experience</h3>

            <p style={smallTextStyle}>
              Your feedback can appear here immediately
              after submission.
            </p>

            <input
              value={commentName}
              onChange={(e) =>
                setCommentName(e.target.value)
              }
              placeholder="Your name"
              style={inputStyle}
            />

            <div style={ratingRowStyle}>

              <span style={{ color: "#94a3b8" }}>
                Rating:
              </span>

              {[1, 2, 3, 4, 5].map((star) => (

                <button
                  key={star}
                  onClick={() =>
                    setCommentRating(star)
                  }
                  style={{
                    ...starButtonStyle,
                    color:
                      star <= commentRating
                        ? "#facc15"
                        : "#64748b",
                  }}
                >
                  ★
                </button>

              ))}

            </div>

            <textarea
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write your feedback..."
              style={commentTextareaStyle}
            />

            <button
              onClick={submitComment}
              disabled={commentLoading}
              style={commentSubmitStyle}
            >
              {commentLoading
                ? "Submitting..."
                : "Submit Comment"}
            </button>

            {commentMessage && (
              <p style={smallTextStyle}>
                {commentMessage}
              </p>
            )}

          </div>

          {/* COMMENTS */}

          <div style={commentsCardStyle}>

            <div style={commentsHeaderStyle}>
              <div>
                <h3 style={{ margin: 0 }}>
                  Latest Feedback
                </h3>

                <p style={smallTextStyle}>
                  Newest comments appear first.
                </p>
              </div>

              <span style={livePillStyle}>
                ● LIVE
              </span>
            </div>

            {comments.length === 0 ? (

              <div style={emptyCommentsStyle}>
                No approved comments yet.
              </div>

            ) : (

              <div style={commentsListStyle}>

                {comments.map((comment) => (

                  <div
                    key={comment.id}
                    style={commentItemStyle}
                  >

                    <div style={commentTopStyle}>

                      <div>
                        <strong>
                          {comment.name}
                        </strong>

                        <div style={starsStyle}>
                          {"★".repeat(
                            Math.max(
                              0,
                              Math.min(
                                5,
                                Number(
                                  comment.rating || 0
                                )
                              )
                            )
                          )}
                        </div>
                      </div>

                      <span
                        style={{
                          color: "#64748b",
                          fontSize: "11px",
                        }}
                      >
                        {formatDate(
                          comment.created_at
                        )}
                      </span>

                    </div>

                    <p style={commentTextStyle}>
                      {comment.content}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </section>

      {/* =========================
          FAQ
      ========================== */}

      <section
        id="faq"
        style={{
          ...sectionStyle,
          maxWidth: "1000px",
        }}
      >

        <SectionHeading
          title="Frequently Asked Questions"
          description="Common questions about ASTRIC AI Builder."
        />

        {[
          [
            "Is ASTRIC AI Builder free?",
            "You can start with the Free plan. Paid plans can provide additional capabilities according to the plan configuration.",
          ],
          [
            "Can I publish my website?",
            "Yes. Once your website is ready, it can be published through the publishing workflow.",
          ],
          [
            "Can I edit HTML, CSS and JavaScript?",
            "Yes. Generated website code can be opened in the editor and customized.",
          ],
          [
            "Are the statistics real?",
            "The statistics on this page are calculated from the connected Supabase tables. If there is no data, the value remains 0.",
          ],
        ].map(([question, answer]) => (

          <div key={question} style={faqCardStyle}>

            <h3 style={{ margin: "0 0 10px" }}>
              {question}
            </h3>

            <p style={faqAnswerStyle}>
              {answer}
            </p>

          </div>

        ))}

      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section style={ctaSectionStyle}>

        <h2>
          Turn Your Idea Into a Website
        </h2>

        <p>
          Start with an AI prompt and build your
          website with ASTRIC AI Builder.
        </p>

        <Link
          href={user ? "/dashboard" : "/signup"}
          style={primaryBtnLarge}
        >
          🚀 Start Building Free
        </Link>

      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer style={footerStyle}>

        <div style={footerGridStyle}>

          <div>
            <div style={brandStyle}>
              <span style={brandIconStyle}>
                ⚡
              </span>

              ASTRIC AI Builder
            </div>

            <p style={footerTextStyle}>
              Build modern websites with AI.
              Generate, edit, preview and publish
              from one platform.
            </p>
          </div>

          <div>
            <h4>Product</h4>

            <Link href="/pricing" style={footerLink}>
              Pricing
            </Link>

            <Link
              href="/templates"
              style={footerLink}
            >
              Templates
            </Link>

            <Link href="/login" style={footerLink}>
              Login
            </Link>
          </div>

          <div>
            <h4>Company</h4>

            <Link href="/about" style={footerLink}>
              About
            </Link>

            <Link
              href="/contect"
              style={footerLink}
            >
              Contact
            </Link>

            <Link
              href="/terms"
              style={footerLink}
            >
              Terms & Conditions
            </Link>
          </div>

          <div>
            <h4>Account</h4>

            <Link
              href="/signup"
              style={footerLink}
            >
              Create Account
            </Link>

            <Link
              href="/dashboard"
              style={footerLink}
            >
              Dashboard
            </Link>

            <Link
              href="/pricing"
              style={footerLink}
            >
              Upgrade
            </Link>
          </div>

        </div>

        <div style={footerBottomStyle}>

          <span>
            © 2026 ASTRIC AI Builder. All Rights Reserved.
          </span>

          <span>
            Developed by ⚡ ASTRIC TEAM
          </span>

        </div>

      </footer>

    </main>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={sectionHeadingStyle}>
      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

function LiveStat({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div style={statCardStyle}>
      <strong>{number}</strong>
      <span>{title}</span>
    </div>
  );
}

function PricingCard({
  title,
  price,
  subtitle,
  features,
  button,
  href,
  featured = false,
}: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  button: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        ...pricingCardStyle,
        ...(featured
          ? pricingFeaturedStyle
          : {}),
      }}
    >
      {featured && (
        <div style={popularBadgeStyle}>
          POPULAR
        </div>
      )}

      <h2>{title}</h2>

      <div style={priceStyle}>
        {price}
      </div>

      <p style={smallTextStyle}>
        {subtitle}
      </p>

      <div style={{ marginTop: "25px" }}>
        {features.map((feature) => (
          <p key={feature} style={priceFeatureStyle}>
            ✓ {feature}
          </p>
        ))}
      </div>

      <Link
        href={href}
        style={{
          ...priceButtonStyle,
          ...(featured
            ? featuredPriceButtonStyle
            : {}),
        }}
      >
        {button}
      </Link>
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#07111f 0%,#10245c 48%,#172d73 100%)",
  color: "#fff",
  fontFamily:
    "Inter, Arial, sans-serif",
  overflowX: "hidden" as const,
};

const navbarStyle = {
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  background:
    "rgba(7,17,31,.78)",
  backdropFilter: "blur(18px)",
  borderBottom:
    "1px solid rgba(255,255,255,.08)",
};

const navInnerStyle = {
  maxWidth: "1300px",
  minHeight: "76px",
  margin: "0 auto",
  padding: "0 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#fff",
  textDecoration: "none",
  fontSize: "20px",
  fontWeight: "800",
};

const brandIconStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  boxShadow:
    "0 10px 30px rgba(37,99,235,.35)",
};

const navLinksStyle = {
  display: "flex",
  gap: "25px",
  alignItems: "center",
};

const navLink = {
  color: "#e2e8f0",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "11px",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow:
    "0 10px 30px rgba(37,99,235,.25)",
};

const heroStyle = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "100px 30px",
};

const heroGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "1.08fr .92fr",
  gap: "70px",
  alignItems: "center",
};

const badgeStyle = {
  display: "inline-block",
  padding: "9px 15px",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,.09)",
  border:
    "1px solid rgba(255,255,255,.12)",
  color: "#bfdbfe",
  marginBottom: "25px",
  fontSize: "13px",
  fontWeight: "700",
};

const heroTitleStyle = {
  margin: 0,
  fontSize: "clamp(42px,6vw,70px)",
  lineHeight: 1.05,
  letterSpacing: "-3px",
  fontWeight: "850",
};

const gradientText = {
  background:
    "linear-gradient(90deg,#60a5fa,#a78bfa,#22d3ee)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const heroTextStyle = {
  maxWidth: "680px",
  color: "#cbd5e1",
  fontSize: "18px",
  lineHeight: 1.8,
  marginTop: "28px",
};

const heroButtonsStyle = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap" as const,
  marginTop: "35px",
};

const primaryBtnLarge = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  padding: "15px 24px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "800",
  border: "none",
};

const secondaryBtnLarge = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "rgba(255,255,255,.07)",
  color: "#fff",
  padding: "15px 24px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "700",
  border:
    "1px solid rgba(255,255,255,.15)",
};

const liveNoticeStyle = {
  marginTop: "25px",
  color: "#94a3b8",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const greenDot = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#22c55e",
  boxShadow:
    "0 0 12px rgba(34,197,94,.8)",
};

const generatorCardStyle = {
  background: "#fff",
  color: "#111827",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow:
    "0 30px 90px rgba(0,0,0,.35)",
};

const browserTopStyle = {
  height: "48px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "0 18px",
  background: "#f8fafc",
  borderBottom:
    "1px solid #e5e7eb",
};

const browserTitle = {
  marginLeft: "10px",
  color: "#64748b",
  fontSize: "11px",
  fontWeight: "600",
};

const dotRed = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#ef4444",
};

const dotYellow = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#facc15",
};

const dotGreen = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "#22c55e",
};

const aiTitleStyle = {
  fontSize: "21px",
  fontWeight: "800",
};

const smallTextStyle = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.6,
};

const textareaStyle = {
  width: "100%",
  height: "165px",
  marginTop: "15px",
  padding: "15px",
  borderRadius: "13px",
  border:
    "1px solid #dbe3ef",
  resize: "none" as const,
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box" as const,
};

const generateButtonStyle = {
  width: "100%",
  marginTop: "15px",
  padding: "15px",
  borderRadius: "12px",
  border: "none",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  fontWeight: "800",
  cursor: "pointer",
};

const errorMessageStyle = {
  color: "#dc2626",
  fontSize: "12px",
  marginTop: "10px",
};

const statsSectionStyle = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "0 30px 80px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4,1fr)",
  gap: "18px",
};

const statCardStyle = {
  padding: "28px",
  borderRadius: "18px",
  textAlign: "center" as const,
  background:
    "rgba(255,255,255,.07)",
  border:
    "1px solid rgba(255,255,255,.09)",
};

const sectionStyle = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "90px 30px",
};

const sectionHeadingStyle = {
  textAlign: "center" as const,
  marginBottom: "50px",
};

const techGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(6,1fr)",
  gap: "15px",
};

const techCardStyle = {
  padding: "22px",
  textAlign: "center" as const,
  borderRadius: "15px",
  background:
    "rgba(255,255,255,.07)",
  border:
    "1px solid rgba(255,255,255,.09)",
  fontWeight: "700",
};

const featureGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3,1fr)",
  gap: "22px",
};

const featureCardStyle = {
  background: "#fff",
  color: "#111827",
  padding: "30px",
  borderRadius: "20px",
  boxShadow:
    "0 18px 45px rgba(0,0,0,.15)",
};

const featureIconStyle = {
  fontSize: "40px",
  marginBottom: "18px",
};

const featureTextStyle = {
  color: "#64748b",
  lineHeight: 1.7,
  fontSize: "14px",
};

const templateGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3,1fr)",
  gap: "25px",
};

const templateCardStyle = {
  overflow: "hidden",
  background: "#fff",
  color: "#111827",
  borderRadius: "20px",
  boxShadow:
    "0 18px 45px rgba(0,0,0,.16)",
};

const templatePreviewStyle = {
  height: "220px",
  position: "relative" as const,
  background: "#e2e8f0",
};

const templateImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const iframeStyle = {
  width: "100%",
  height: "100%",
  border: "none",
  background: "#fff",
};

const templatePlaceholderStyle = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "60px",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
};

const liveBadgeStyle = {
  position: "absolute" as const,
  top: "12px",
  left: "12px",
  padding: "6px 9px",
  borderRadius: "999px",
  background:
    "rgba(0,0,0,.7)",
  color: "#fff",
  fontSize: "9px",
  fontWeight: "800",
};

const templateBodyStyle = {
  padding: "22px",
};

const categoryStyle = {
  color: "#2563eb",
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase" as const,
};

const templateDescriptionStyle = {
  color: "#64748b",
  lineHeight: 1.6,
  fontSize: "13px",
};

const useTemplateButtonStyle = {
  width: "100%",
  marginTop: "12px",
  padding: "13px",
  border: "none",
  borderRadius: "11px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "800",
  cursor: "pointer",
};

const emptyStyle = {
  padding: "60px 25px",
  textAlign: "center" as const,
  borderRadius: "20px",
  background:
    "rgba(255,255,255,.05)",
  border:
    "1px dashed rgba(255,255,255,.15)",
  color: "#94a3b8",
};

const stepsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4,1fr)",
  gap: "20px",
};

const stepCardStyle = {
  padding: "30px",
  borderRadius: "20px",
  background: "#fff",
  color: "#111827",
  textAlign: "center" as const,
};

const stepNumberStyle = {
  width: "62px",
  height: "62px",
  margin: "0 auto 18px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  fontSize: "19px",
  fontWeight: "800",
};

const pricingGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3,1fr)",
  gap: "22px",
  alignItems: "stretch",
};

const pricingCardStyle = {
  position: "relative" as const,
  padding: "32px",
  borderRadius: "22px",
  background: "#fff",
  color: "#111827",
  boxShadow:
    "0 18px 45px rgba(0,0,0,.16)",
};

const pricingFeaturedStyle = {
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  transform: "translateY(-8px)",
};

const popularBadgeStyle = {
  position: "absolute" as const,
  top: "18px",
  right: "18px",
  padding: "6px 9px",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,.18)",
  fontSize: "9px",
  fontWeight: "800",
};

const priceStyle = {
  fontSize: "48px",
  fontWeight: "850",
  margin: "20px 0 5px",
};

const priceFeatureStyle = {
  fontSize: "13px",
  lineHeight: 1.7,
};

const priceButtonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "25px",
  padding: "14px",
  borderRadius: "11px",
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "800",
};

const featuredPriceButtonStyle = {
  background: "#fff",
  color: "#2563eb",
};

const communityGridStyle = {
  display: "grid",
  gridTemplateColumns:
    ".8fr 1.2fr",
  gap: "22px",
};

const commentCardStyle = {
  padding: "28px",
  borderRadius: "20px",
  background: "#fff",
  color: "#111827",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #dbe3ef",
  boxSizing: "border-box" as const,
};

const ratingRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  margin: "15px 0",
};

const starButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
};

const commentTextareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical" as const,
};

const commentSubmitStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  border: "none",
  borderRadius: "11px",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  fontWeight: "800",
  cursor: "pointer",
};

const commentsCardStyle = {
  padding: "28px",
  borderRadius: "20px",
  background:
    "rgba(255,255,255,.06)",
  border:
    "1px solid rgba(255,255,255,.1)",
};

const commentsHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
};

const livePillStyle = {
  color: "#86efac",
  fontSize: "10px",
  fontWeight: "800",
};

const commentsListStyle = {
  display: "grid",
  gap: "12px",
  maxHeight: "470px",
  overflowY: "auto" as const,
};

const commentItemStyle = {
  padding: "17px",
  borderRadius: "14px",
  background:
    "rgba(255,255,255,.045)",
  border:
    "1px solid rgba(255,255,255,.07)",
};

const commentTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
};

const starsStyle = {
  color: "#facc15",
  fontSize: "12px",
  marginTop: "4px",
};

const commentTextStyle = {
  color: "#cbd5e1",
  fontSize: "13px",
  lineHeight: 1.7,
  marginBottom: 0,
};

const emptyCommentsStyle = {
  padding: "40px",
  textAlign: "center" as const,
  color: "#64748b",
};

const faqCardStyle = {
  padding: "23px",
  marginBottom: "13px",
  borderRadius: "16px",
  background: "#fff",
  color: "#111827",
};

const faqAnswerStyle = {
  margin: 0,
  color: "#64748b",
  lineHeight: 1.7,
  fontSize: "14px",
};

const ctaSectionStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "80px 30px 110px",
  textAlign: "center" as const,
};

const footerStyle = {
  background: "#020617",
  padding: "70px 30px 25px",
};

const footerGridStyle = {
  maxWidth: "1300px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "2fr 1fr 1fr 1fr",
  gap: "45px",
};

const footerTextStyle = {
  maxWidth: "380px",
  color: "#94a3b8",
  lineHeight: 1.7,
  fontSize: "13px",
};

const footerLink = {
  display: "block",
  color: "#94a3b8",
  textDecoration: "none",
  marginTop: "12px",
  fontSize: "13px",
};

const footerBottomStyle = {
  maxWidth: "1300px",
  margin: "55px auto 0",
  paddingTop: "20px",
  borderTop:
    "1px solid rgba(255,255,255,.08)",
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  color: "#64748b",
  fontSize: "11px",
};
         
         