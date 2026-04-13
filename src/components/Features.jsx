import { FEATURES } from "../constants/data";

export default function Features() {
  return (
    <section style={{ marginTop: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#eef2ff", marginBottom: 8, letterSpacing: "-0.02em" }}>Why choose us?</h2>
      <p style={{ fontSize: 15, color: "#6b7a99", marginBottom: 32, lineHeight: 1.7 }}>Everything you need to download media — fast, free, and hassle-free.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#eef2ff", marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}