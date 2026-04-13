import { PLATFORMS } from "../constants/data";

export default function Platforms() {
  return (
    <section style={{ marginTop: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#eef2ff", marginBottom: 8, letterSpacing: "-0.02em" }}>Supported platforms</h2>
      <p style={{ fontSize: 15, color: "#6b7a99", marginBottom: 32, lineHeight: 1.7 }}>We support a wide range of social media and video platforms.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {PLATFORMS.map((p) => (
          <div key={p.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#eef2ff" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#4a5878", marginTop: 2 }}>{p.types}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}