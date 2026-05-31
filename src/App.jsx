import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import DownloaderPage from "./components/DownloaderPage";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicy from "./components/Privacypolicy";
import TermsOfService from "./components/Termsofservice";

const GlowOrb = ({ style }) => (
  <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(80px)", opacity: 0.15, pointerEvents: "none", zIndex: 0, ...style }} />
);

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        minHeight: "100vh",
        background: "#080c14",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e8eaf0",
        position: "relative",
        overflowX: "hidden",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fadeUp 0.4s ease forwards; }
          .main-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.5) !important; }
          .fmt-btn:hover:not(:disabled) { border-color: rgba(99,179,237,0.35) !important; background: rgba(99,179,237,0.08) !important; color: #90cdf4 !important; }
          .audio-btn:hover:not(:disabled) { border-color: rgba(52,211,153,0.35) !important; background: rgba(52,211,153,0.08) !important; color: #6ee7b7 !important; }
          .paste-hint:hover { background: rgba(99,179,237,0.12) !important; }
          .carousel-dl:hover:not(:disabled) { background: rgba(99,179,237,0.25) !important; }
          .faq-btn:hover { background: rgba(255,255,255,0.04) !important; }
          input::placeholder { color: #2e3a52; }
          ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1e2a40; border-radius: 99px; }
        `}</style>

        <GlowOrb style={{ width: 500, height: 500, background: "#1a3a6e", top: -150, right: -100 }} />
        <GlowOrb style={{ width: 400, height: 400, background: "#0d3320", bottom: 0, left: -100 }} />

        <Routes>
          {/* Home — platform selection */}
          <Route path="/" element={<LandingPage />} />

          {/* Universal downloader — no platform selected */}
          <Route path="/downloader" element={<DownloaderPage />} />

          {/* Platform-specific downloaders */}
          <Route path="/downloader/:platform" element={<DownloaderPage />} />

          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>

        <CookieConsent />
      </div>
    </BrowserRouter>
  );
}