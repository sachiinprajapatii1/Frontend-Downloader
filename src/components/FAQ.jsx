import { useState } from "react";
import { FAQS } from "../constants/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ marginTop: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#eef2ff", marginBottom: 8, letterSpacing: "-0.02em" }}>Frequently asked questions</h2>
      <p style={{ fontSize: 15, color: "#6b7a99", marginBottom: 32, lineHeight: 1.7 }}>Got questions? We've got answers.</p>
      <div>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
            <button
              className="faq-btn"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", background: "transparent",
                border: "none", padding: "18px 4px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 16, borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: "#eef2ff" }}>{faq.q}</span>
              <span style={{
                fontSize: 18, color: "#4a5878", flexShrink: 0,
                transform: openIndex === i ? "rotate(45deg)" : "none",
                transition: "transform 0.2s",
              }}>+</span>
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 4px 18px", fontSize: 14, color: "#6b7a99", lineHeight: 1.8 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}