import { useEffect } from "react";
import { useDownloader } from "./hooks/useDownloader";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import UrlInput from "./components/UrlInput";
import ResultCard from "./components/ResultCard";
import HowToUse from "./components/HowToUse";
import Features from "./components/Features";
import Platforms from "./components/Platforms";
import FAQ from "./components/FAQ";
import About from "./components/About";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";

const GlowOrb = ({ style }) => (
  <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(80px)", opacity: 0.15, pointerEvents: "none", zIndex: 0, ...style }} />
);

const loadingSpinner = { width: 28, height: 28, border: "2px solid rgba(99,179,237,0.15)", borderTopColor: "#63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" };

// ✅ Main Home Page alag component
function HomePage() {
  const dl = useDownloader();

  useEffect(() => { dl.inputRef.current?.focus(); }, []);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px", position: "relative", zIndex: 1 }}>
      <Hero />
      <UrlInput
        url={dl.url}
        setUrl={dl.setUrl}
        isBusy={dl.loading || dl.downloading}
        loading={dl.loading}
        downloading={dl.downloading}
        inputRef={dl.inputRef}
        handleFetch={dl.handleFetch}
        handleInputFocus={dl.handleInputFocus}
        handlePasteFromClipboard={dl.handlePasteFromClipboard}
        clearAll={dl.clearAll}
        pasteHint={dl.pasteHint}
        setPasteHint={dl.setPasteHint}
        error={dl.error}
      />

      {dl.loading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#4a5878" }} className="fade-up">
          <div style={loadingSpinner} />
          <p style={{ marginTop: 16, fontSize: 14 }}>Fetching media info...</p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#3a4460" }}>Instagram may take 20–30 seconds — please wait ⏳</p>
        </div>
      )}

      {dl.data && (
        <ResultCard
          data={dl.data}
          downloading={dl.downloading}
          activeFormat={dl.activeFormat}
          progress={dl.progress}
          downloadType={dl.downloadType}
          carouselItems={dl.carouselItems}
          carouselLoading={dl.carouselLoading}
          sessionId={dl.sessionId}
          downloadingItem={dl.downloadingItem}
          videoTitle={dl.videoTitle}
          BASE_URL={dl.BASE_URL}
          handleVideoDownload={dl.handleVideoDownload}
          handleAudioDownload={dl.handleAudioDownload}
          handleCarouselItemDownload={dl.handleCarouselItemDownload}
        />
      )}

      <HowToUse />
      <Features />
      <Platforms />
      <FAQ />
      <About />
      <Footer />
    </div>
  );
}

// ✅ App sirf wrapper hai — BrowserRouter yahan sahi jagah
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e8eaf0", position: "relative", overflowX: "hidden" }}>
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

        {/* ✅ Routes yahan — sirf matching page render hoga */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>

        <CookieConsent />
      </div>
    </BrowserRouter>
  );
}