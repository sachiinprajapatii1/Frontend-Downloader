const STEPS = [
  { n: "01", t: "Copy the URL", d: "Go to Instagram, Facebook, or Twitter. Open the video and copy its link from the share menu." },
  { n: "02", t: "Paste & fetch", d: "Paste the URL in the input box above and click the Download button to fetch media info." },
  { n: "03", t: "Choose & download", d: "Select your preferred video quality or download MP3 audio. The file saves directly to your device." },
];

export default function HowToUse() {
  return (
    <section style={{ marginTop: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#eef2ff", marginBottom: 8, letterSpacing: "-0.02em" }}>How to use</h2>
      <p style={{ fontSize: 15, color: "#6b7a99", marginBottom: 32, lineHeight: 1.7 }}>Download any video in 3 simple steps — no account needed.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "rgba(99,179,237,0.3)", marginBottom: 12 }}>{s.n}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#eef2ff", marginBottom: 8 }}>{s.t}</div>
            <div style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.7 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}