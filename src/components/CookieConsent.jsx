import { useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("cookieConsent"));
  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      padding: "16px", display: "flex", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    }}>
      <div style={{
        background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: "20px 24px", maxWidth: 680, width: "100%",
        display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", margin: "0 0 6px" }}>We use cookies</p>
          <p style={{ fontSize: 13, color: "#6b7a99", margin: 0, lineHeight: 1.6 }}>
            We use cookies to personalize ads and improve your experience.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => { localStorage.setItem("cookieConsent", "declined"); setVisible(false); }}
            style={{ padding: "9px 18px", fontSize: 13, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#6b7a99", cursor: "pointer" }}
          >
            Decline
          </button>
          <button
            onClick={() => { localStorage.setItem("cookieConsent", "accepted"); setVisible(false); }}
            style={{ padding: "9px 20px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff", cursor: "pointer" }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}