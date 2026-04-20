import { SOCIAL_LINKS } from "../constants/data";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 80, padding: "32px 0 16px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#2e3a52", marginBottom: 16 }}>
        Built with passion by <span style={{ color: "#63b3ed" }}>Sachin Prajapati</span>
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 12 }}>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3a4a66", fontSize: 13, textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "#63b3ed")}
            onMouseLeave={(e) => (e.target.style.color = "#3a4a66")}
          >
            {link.label}
            
          </a>
          
        ))}
        
      </div>
      <div className=" items-center space-x-6 justify-center mb-2 gap-6">
        <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      </div>
      <p style={{ fontSize: 11, color: "#1e2a40" }}>
        © 2026 Universal Media Downloader · Built by Sachin Prajapati · All rights reserved
      </p>
      <p style={{ fontSize: 11, color: "#1e2a40", marginTop: 6 }}>
        This tool is for personal use only. Please respect copyright laws and platform terms of service.
      </p>
    </footer>
  );
}