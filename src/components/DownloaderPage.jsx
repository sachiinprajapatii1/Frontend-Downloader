import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDownloader } from "../hooks/useDownloader";

import UrlInput from "./UrlInput";
import ResultCard from "./ResultCard";
import HowToUse from "./HowToUse";
import Features from "./Features";
import FAQ from "./FAQ";
import Footer from "./Footer";

const PLATFORM_INFO = {
  instagram: {
    name: "Instagram",
    placeholder: "Paste Instagram Reel / Video / Post URL here...",
    color: "#e1306c",
    gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
    emoji: "📸",
    hint: "Supports: Reels, Videos, Posts, IGTV",
  },
  facebook: {
    name: "Facebook",
    placeholder: "Paste Facebook Video / Reel URL here...",
    color: "#1877f2",
    gradient: "linear-gradient(135deg, #1877f2, #0a52cc)",
    emoji: "📘",
    hint: "Supports: Videos, Reels, Stories",
  },
  twitter: {
    name: "Twitter / X",
    placeholder: "Paste Twitter / X Video URL here...",
    color: "#1da1f2",
    gradient: "linear-gradient(135deg, #000000, #14171a)",
    emoji: "🐦",
    hint: "Supports: Videos, GIFs, Clips",
  },
  tiktok: {
    name: "TikTok",
    placeholder: "Paste TikTok Video URL here...",
    color: "#ff0050",
    gradient: "linear-gradient(135deg, #010101, #1a1a2e)",
    emoji: "🎵",
    hint: "Supports: Videos, Slideshows",
  },
  reddit: {
    name: "Reddit",
    placeholder: "Paste Reddit Video / GIF URL here...",
    color: "#ff4500",
    gradient: "linear-gradient(135deg, #ff4500, #cc3700)",
    emoji: "🤖",
    hint: "Supports: Videos, GIFs",
  },
  vimeo: {
    name: "Vimeo",
    placeholder: "Paste Vimeo Video URL here...",
    color: "#1ab7ea",
    gradient: "linear-gradient(135deg, #1ab7ea, #0d8ab5)",
    emoji: "🎬",
    hint: "Supports: HD Videos, 4K",
  },
};

const loadingSpinner = {
  width: 28, height: 28,
  border: "2px solid rgba(99,179,237,0.15)",
  borderTopColor: "#63b3ed",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  display: "inline-block",
};

export default function DownloaderPage() {
  const { platform } = useParams(); // undefined on /downloader
  const navigate = useNavigate();
  const dl = useDownloader();

  const info = platform ? PLATFORM_INFO[platform] : null;

  useEffect(() => {
    dl.inputRef.current?.focus();
  }, []);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "none", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "8px 16px",
          color: "#4a5878", fontSize: 13, cursor: "pointer",
          marginBottom: 36, display: "inline-flex", alignItems: "center", gap: 6,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#63b3ed")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5878")}
      >
        ← Back to platforms
      </button>

      {/* Platform Header */}
      {info ? (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: info.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: `0 4px 16px ${info.color}44`,
            }}>
              {info.emoji}
            </div>
            <div>
              <h1 style={{
                fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700,
                letterSpacing: "-0.02em", lineHeight: 1.1,
                background: "linear-gradient(135deg, #f0f4ff 0%, #a8b8d8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {info.name} Downloader
              </h1>
              <p style={{ fontSize: 13, color: "#4a5878", marginTop: 3 }}>{info.hint}</p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#6b7a99", lineHeight: 1.6 }}>
            Paste your {info.name} URL below and download in HD — free, no login required.
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.18)",
            borderRadius: 100, padding: "6px 16px", fontSize: 12,
            color: "#63b3ed", marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#63b3ed", display: "inline-block" }} />
            Universal Media Downloader
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em",
            lineHeight: 1.1, marginBottom: 14,
            background: "linear-gradient(135deg, #f0f4ff 0%, #a8b8d8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Download anything.<br />Any quality.
          </h1>
          <p style={{ fontSize: 16, color: "#6b7a99", lineHeight: 1.6 }}>
            Download Instagram Reels, Facebook Videos, Twitter/X Videos,<br />
            TikTok Videos & more — Free, HD Quality, No Login Required.
          </p>
        </div>
      )}

      {/* URL Input */}
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
        placeholder={info?.placeholder}
      />

      {dl.loading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#4a5878" }} className="fade-up">
          <div style={loadingSpinner} />
          <p style={{ marginTop: 16, fontSize: 14 }}>Fetching media info...</p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#3a4460" }}>
            {info?.name === "Instagram" ? "Instagram may take 20–30 seconds — please wait ⏳" : "Please wait while we fetch the video..."}
          </p>
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
      <FAQ />
      <Footer />
    </div>
  );
}