import { useNavigate } from "react-router-dom";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    desc: "Reels, Videos, Posts, Stories",
    route: "/downloader/instagram",
    color: "#e1306c",
    gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    desc: "Videos, Reels, Stories",
    route: "/downloader/facebook",
    color: "#1877f2",
    gradient: "linear-gradient(135deg, #1877f2, #0a52cc)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "Twitter / X",
    desc: "Videos, GIFs, Clips",
    route: "/downloader/twitter",
    color: "#1da1f2",
    gradient: "linear-gradient(135deg, #000000, #14171a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    desc: "Videos, Slideshows",
    route: "/downloader/tiktok",
    color: "#ff0050",
    gradient: "linear-gradient(135deg, #010101, #1a1a2e)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z" />
      </svg>
    ),
  },
  {
    id: "reddit",
    name: "Reddit",
    desc: "Videos, GIFs",
    route: "/downloader/reddit",
    color: "#ff4500",
    gradient: "linear-gradient(135deg, #ff4500, #cc3700)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  {
    id: "vimeo",
    name: "Vimeo",
    desc: "HD Videos, 4K",
    route: "/downloader/vimeo",
    color: "#1ab7ea",
    gradient: "linear-gradient(135deg, #1ab7ea, #0d8ab5)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.48 4.807l-.002.127z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e8eaf0",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Glow orbs */}
      <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", filter: "blur(80px)", opacity: 0.12, pointerEvents: "none", zIndex: 0, background: "#1a3a6e", top: -150, right: -100 }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", filter: "blur(80px)", opacity: 0.1, pointerEvents: "none", zIndex: 0, background: "#0d3320", bottom: 0, left: -100 }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .platform-card {
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .platform-card:hover {
          transform: translateY(-6px) scale(1.02);
        }
        .arrow-icon { transition: transform 0.2s ease; }
        .platform-card:hover .arrow-icon { transform: translateX(4px); }
        .all-btn:hover { background: rgba(99,179,237,0.15) !important; border-color: rgba(99,179,237,0.4) !important; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "70px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.18)",
            borderRadius: 100, padding: "6px 18px", fontSize: 12,
            color: "#63b3ed", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#63b3ed", display: "inline-block", animation: "pulse 2s infinite" }} />
            Universal Media Downloader
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 18, animation: "fadeUp 0.5s ease forwards" }}>
          <h1 style={{
            fontSize: "clamp(34px, 6vw, 62px)", fontWeight: 700, letterSpacing: "-0.03em",
            lineHeight: 1.1, marginBottom: 16,
            background: "linear-gradient(135deg, #f0f4ff 0%, #a8b8d8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Choose your platform.<br />Download instantly.
          </h1>
          <p style={{ fontSize: 16, color: "#6b7a99", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Free HD downloads from Instagram, Facebook, Twitter, TikTok & more. No login, no install, 100% free.
          </p>
        </div>

        {/* Platform Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
          marginTop: 52,
        }}>
          {PLATFORMS.map((p, i) => (
            <div
              key={p.id}
              className="platform-card"
              onClick={() => navigate(p.route)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: "24px 22px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* color glow behind icon */}
              <div style={{
                position: "absolute", top: -20, left: -20,
                width: 100, height: 100, borderRadius: "50%",
                background: p.color, filter: "blur(40px)", opacity: 0.12,
                pointerEvents: "none",
              }} />

              {/* Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: p.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff",
                boxShadow: `0 4px 16px ${p.color}44`,
              }}>
                {p.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#e8eaf0", marginBottom: 4 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 13, color: "#4a5878" }}>{p.desc}</div>
              </div>

              {/* Arrow */}
              <div className="arrow-icon" style={{ color: "#3a4a66", fontSize: 18 }}>→</div>
            </div>
          ))}
        </div>

        {/* Universal downloader button */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button
            className="all-btn"
            onClick={() => navigate("/downloader")}
            style={{
              background: "rgba(99,179,237,0.07)",
              border: "1px solid rgba(99,179,237,0.2)",
              borderRadius: 50, padding: "14px 36px",
              fontSize: 15, fontWeight: 600, color: "#63b3ed",
              cursor: "pointer", letterSpacing: "0.01em",
              transition: "all 0.2s",
            }}
          >
            🔗 Paste any URL — Universal Downloader
          </button>
          <p style={{ fontSize: 13, color: "#2e3a52", marginTop: 10 }}>
            Don't know the platform? Just paste your link here
          </p>
        </div>

        {/* Footer strip */}
        <div style={{ textAlign: "center", marginTop: 72, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 12, color: "#1e2a40" }}>
            © 2026 Universal Media Downloader · Built by{" "}
            <span style={{ color: "#63b3ed" }}>Sachin Prajapati</span>
            {" · "}
            <a href="/privacy" style={{ color: "#2e3a52", textDecoration: "none" }}>Privacy</a>
            {" · "}
            <a href="/terms" style={{ color: "#2e3a52", textDecoration: "none" }}>Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}