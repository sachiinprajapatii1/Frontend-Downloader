export default function Hero() {
  return (
    <>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.18)",
        borderRadius: 100, padding: "6px 16px", fontSize: 12,
        color: "#63b3ed", marginBottom: 28, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#63b3ed", display: "inline-block" }} />
        Universal Media Downloader
      </div>

      <h1 style={{
        fontSize: "clamp(32px,6vw,58px)", fontWeight: 700, letterSpacing: "-0.03em",
        lineHeight: 1.1, marginBottom: 14,
        background: "linear-gradient(135deg, #f0f4ff 0%, #a8b8d8 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        Download anything.<br />Any quality.
      </h1>

      <p style={{ fontSize: 16, color: "#6b7a99", marginBottom: 48, lineHeight: 1.6 }}>
        Download Instagram Reels, Facebook Videos, Twitter/X Videos,<br />
        TikTok Videos & more — Free, HD Quality, No Login Required.
      </p>
    </>
  );
}