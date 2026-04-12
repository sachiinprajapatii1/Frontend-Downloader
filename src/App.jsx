import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/download";

const GlowOrb = ({ style }) => (
  <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(80px)", opacity: 0.15, pointerEvents: "none", zIndex: 0, ...style }} />
);

function formatDuration(s) {
  if (!s) return "";
  s = Math.floor(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`;
}

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

function safeFilename(title) {
  if (!title) return "download";
  return title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("cookieConsent"));
  if (!visible) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, padding: "16px", display: "flex", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px 24px", maxWidth: 680, width: "100%", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", margin: "0 0 6px" }}>We use cookies</p>
          <p style={{ fontSize: 13, color: "#6b7a99", margin: 0, lineHeight: 1.6 }}>We use cookies to personalize ads and improve your experience. By clicking Accept, you consent to our use of cookies.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={() => { localStorage.setItem("cookieConsent", "declined"); setVisible(false); }} style={{ padding: "9px 18px", fontSize: 13, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#6b7a99", cursor: "pointer" }}>Decline</button>
          <button onClick={() => { localStorage.setItem("cookieConsent", "accepted"); setVisible(false); }} style={{ padding: "9px 20px", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff", cursor: "pointer" }}>Accept all</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [cleanUrl, setCleanUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState("");
  const [error, setError] = useState("");
  const [activeFormat, setActiveFormat] = useState(null);
  const [pasteHint, setPasteHint] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [downloadingItem, setDownloadingItem] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleInputFocus = async () => {
    if (url) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith("http://") || text.startsWith("https://"))) setPasteHint(true);
    } catch {}
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) { setUrl(text); setPasteHint(false); inputRef.current?.focus(); }
    } catch { setError("Clipboard access denied. Please paste manually (Ctrl+V)."); }
  };

  const handleFetch = async () => {
    if (!url.trim()) return setError("Please paste a valid URL");
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return setError("YouTube downloads are currently unavailable. Try Instagram or other platforms.");
    }
    try {
      setLoading(true); setData(null); setError(""); setActiveFormat(null);
      setPasteHint(false); setCarouselItems([]); setSessionId(null);
      const res = await axios.post(BASE_URL, { url: url.trim() });
      setData(res.data);
      setVideoTitle(res.data.title || "");
      setCleanUrl(res.data.cleanUrl || url.trim());
      if (res.data.isCarousel) fetchCarouselItems(res.data.cleanUrl || url.trim());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch media. Check the URL.");
    } finally { setLoading(false); }
  };

  const fetchCarouselItems = async (carouselUrl) => {
    setCarouselLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/carousel`, { params: { url: carouselUrl }, timeout: 2 * 60 * 1000 });
      setCarouselItems(res.data.items || []);
      setSessionId(res.data.sessionId);
    } catch { setError("Failed to load carousel items."); }
    finally { setCarouselLoading(false); }
  };

  const handleCarouselItemDownload = async (item) => {
    setDownloadingItem(item.filename);
    try {
      const response = await axios.get(`${BASE_URL}/carousel-item`, {
        params: { sessionId, filename: item.filename },
        responseType: "blob", timeout: 5 * 60 * 1000,
      });
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${safeFilename(videoTitle)}_${item.filename}`;
      document.body.appendChild(link); link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch { setError("Failed to download item."); }
    finally { setDownloadingItem(null); }
  };

  const handleVideoDownload = async (format_id, qualityLabel) => {
    try {
      setDownloading(true); setActiveFormat(format_id);
      setDownloadType(qualityLabel); setProgress(0); setError("");
      const response = await axios.get(`${BASE_URL}/video`, {
        params: { url: cleanUrl, format_id }, responseType: "blob",
        onDownloadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded * 100) / e.total)); },
        timeout: 15 * 60 * 1000,
      });
      const ext = response.headers["content-disposition"]?.match(/\.(\w+)["']/)?.[1] || "mp4";
      triggerDownload(response.data, `${safeFilename(videoTitle)}.${ext}`);
    } catch (err) {
      let msg = "Download failed.";
      if (err.response) { try { const t = await err.response.data.text(); msg = JSON.parse(t).error || msg; } catch {} }
      setError(msg);
    } finally { setDownloading(false); setActiveFormat(null); }
  };

  const handleAudioDownload = async () => {
    try {
      setDownloading(true); setActiveFormat("audio");
      setDownloadType("MP3 Audio"); setProgress(0); setError("");
      const response = await axios.get(`${BASE_URL}/audio`, {
        params: { url: cleanUrl }, responseType: "blob",
        onDownloadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded * 100) / e.total)); },
        timeout: 15 * 60 * 1000,
      });
      const ext = response.headers["content-disposition"]?.match(/\.(\w+)["']/)?.[1] || "mp3";
      triggerDownload(response.data, `${safeFilename(videoTitle)}.${ext}`);
    } catch { setError("Audio download failed."); }
    finally { setDownloading(false); setActiveFormat(null); }
  };

  function triggerDownload(blobData, filename) {
    const blob = new Blob([blobData]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }

  const mainBtnLabel = loading ? "Fetching..." : downloading ? "Downloading..." : "Download";
  const isBusy = loading || downloading;
  const isPhoto = data?.isPhoto;
  const isCarousel = data?.isCarousel;

  const S = {
    root: { minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e8eaf0", position: "relative", overflowX: "hidden" },
    wrap: { maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px", position: "relative", zIndex: 1 },
    badge: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.18)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#63b3ed", marginBottom: 28, letterSpacing: "0.08em", textTransform: "uppercase" },
    h1: { fontSize: "clamp(32px,6vw,58px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14, background: "linear-gradient(135deg, #f0f4ff 0%, #a8b8d8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    sub: { fontSize: 16, color: "#6b7a99", marginBottom: 48, lineHeight: 1.6 },
    inputWrap: { display: "flex", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "8px 8px 8px 20px", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", marginBottom: 8 },
    input: { flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#e8eaf0", minWidth: 0 },
    pasteHint: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,179,237,0.07)", border: "1px solid rgba(99,179,237,0.15)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#63b3ed", cursor: "pointer", marginBottom: 16 },
    mainBtn: (active) => ({ background: active ? "linear-gradient(135deg, #1d4ed8, #1e3a8a)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: active ? "not-allowed" : "pointer", whiteSpace: "nowrap", letterSpacing: "0.02em", boxShadow: "0 4px 16px rgba(59,130,246,0.4)", transition: "all 0.2s", opacity: active ? 0.75 : 1, display: "flex", alignItems: "center", gap: 8 }),
    card: { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.5)", marginTop: 40 },
    cardTop: { display: "flex", gap: 24, padding: "28px 28px 24px", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.06)" },
    thumb: { width: 140, minWidth: 140, height: 90, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" },
    metaTitle: { fontSize: 17, fontWeight: 600, color: "#eef2ff", lineHeight: 1.4, marginBottom: 8 },
    metaPill: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#8899bb", marginRight: 8 },
    section: { padding: "24px 28px" },
    sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a5878", marginBottom: 16 },
    formatGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
    formatBtn: (active, isDownloading) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 20px", borderRadius: 12, cursor: isDownloading ? "not-allowed" : "pointer", border: active ? "1px solid rgba(99,179,237,0.5)" : "1px solid rgba(255,255,255,0.08)", background: active ? "rgba(99,179,237,0.12)" : "rgba(255,255,255,0.04)", color: active ? "#63b3ed" : "#a0aec0", fontSize: 13, fontWeight: 600, opacity: isDownloading && !active ? 0.4 : 1, transition: "all 0.18s", minWidth: 90 }),
    formatSize: { fontSize: 11, color: "#4a5878", fontWeight: 400 },
    audioBtn: (active, isDownloading) => ({ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 12, cursor: isDownloading ? "not-allowed" : "pointer", border: active ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.08)", background: active ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)", color: active ? "#34d399" : "#a0aec0", fontSize: 14, fontWeight: 600, opacity: isDownloading && !active ? 0.4 : 1, transition: "all 0.18s" }),
    divider: { height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" },
    progressWrap: { padding: "20px 28px 28px" },
    progressLabel: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7a99", marginBottom: 10 },
    progressTrack: { height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" },
    progressBar: (pct) => ({ height: "100%", width: `${pct || 3}%`, background: "linear-gradient(90deg, #3b82f6, #34d399)", borderRadius: 99, transition: "width 0.3s ease" }),
    error: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#fca5a5", marginTop: 12 },
    spinner: { width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block", flexShrink: 0 },
    spinnerBlue: { width: 14, height: 14, border: "2px solid rgba(99,179,237,0.2)", borderTopColor: "#63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
    spinnerGreen: { width: 16, height: 16, border: "2px solid rgba(52,211,153,0.2)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
    loadingWrap: { textAlign: "center", padding: "48px 0", color: "#4a5878" },
    loadingSpinner: { width: 28, height: 28, border: "2px solid rgba(99,179,237,0.15)", borderTopColor: "#63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
    carouselGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 8 },
    carouselItem: { borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" },
    carouselDlBtn: (active) => ({ width: "100%", padding: "8px", fontSize: 12, fontWeight: 600, border: "none", background: active ? "rgba(99,179,237,0.3)" : "rgba(99,179,237,0.15)", color: "#63b3ed", cursor: active ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }),
    sectionTitle: { fontSize: 24, fontWeight: 700, color: "#eef2ff", marginBottom: 8, letterSpacing: "-0.02em" },
    sectionDesc: { fontSize: 15, color: "#6b7a99", marginBottom: 32, lineHeight: 1.7 },
    infoCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px" },
    faqItem: { borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16, marginBottom: 16 },
  };

  const features = [
    { icon: "⚡", title: "Fast Downloads", desc: "High-speed downloads with no waiting time or queues." },
    { icon: "🎬", title: "Multiple Qualities", desc: "Choose from 480p, 720p, 1080p, 2K, 4K and Original quality." },
    { icon: "🎵", title: "Audio Extraction", desc: "Extract MP3 audio from any video at the best quality." },
    { icon: "📱", title: "All Devices", desc: "Works perfectly on mobile, tablet and desktop browsers." },
    { icon: "🔒", title: "No Registration", desc: "No sign up, no login. Just paste and download." },
    { icon: "🆓", title: "100% Free", desc: "Completely free to use with no hidden charges." },
  ];

  const platforms = [
    { name: "Instagram", types: "Reels, Videos, Posts", color: "#e1306c" },
    { name: "Facebook", types: "Videos, Reels, Stories", color: "#1877f2" },
    { name: "Twitter / X", types: "Videos, GIFs", color: "#1da1f2" },
    { name: "Pinterest", types: "Videos, Slideshows", color: "#ff0000" },
    { name: "Reddit", types: "Videos, GIFs", color: "#ff4500" },
    { name: "Vimeo", types: "HD Videos", color: "#1ab7ea" },
  ];

  const faqs = [
    { q: "Is this tool free to use?", a: "Yes, Universal Media Downloader is completely free. No registration, no subscription, no hidden charges." },
    { q: "Which platforms are supported?", a: "We support Instagram, Facebook, Twitter/X, TikTok, Reddit, Vimeo and many more platforms. Simply paste the URL and we'll handle the rest." },
    { q: "What video qualities are available?", a: "We offer 480p, 720p, 1080p, 2K, 4K and Original quality depending on what the source video provides." },
    { q: "Can I download audio only?", a: "Yes! You can extract MP3 audio from any supported video using the 'Download MP3' button." },
    { q: "Is it safe to use?", a: "Absolutely. We don't store any of your downloads or personal data. All files are processed and deleted from our servers immediately after download." },
    { q: "Why is my download taking long?", a: "Download speed depends on the video size and your internet connection. Large HD videos may take a few seconds to process on our server." },
    { q: "Do I need to install anything?", a: "No installation needed. Universal Media Downloader works directly in your browser on any device." },
    { q: "Can I download private videos?", a: "We can only download publicly accessible videos. Private or restricted content cannot be downloaded." },
  ];

  return (
    <div style={S.root}>
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

      <div style={S.wrap}>

        {/* ── HERO ── */}
        <div style={S.badge}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#63b3ed", display: "inline-block" }} />
          Universal Media Downloader
        </div>
        <h1 style={S.h1}>Download anything.<br />Any quality.</h1>
        <p style={S.sub}>Instagram, Facebook, Twitter & more.<br />Videos, photos, carousels — all supported. Free forever.</p>

        {/* ── INPUT ── */}
        <div style={S.inputWrap}>
          <span style={{ fontSize: 16, paddingTop: 1, flexShrink: 0, color: "#3a4a66" }}>🔗</span>
          <input ref={inputRef} style={S.input} placeholder="Paste video URL here — Instagram, Facebook, Twitter..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setPasteHint(false); }}
            onFocus={handleInputFocus}
            onBlur={() => setTimeout(() => setPasteHint(false), 200)}
            onKeyDown={(e) => e.key === "Enter" && !isBusy && handleFetch()}
            disabled={isBusy}
          />
          {url && !isBusy && (
            <button onClick={() => { setUrl(""); setData(null); setError(""); setCarouselItems([]); setPasteHint(false); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", color: "#3a4a66", cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1 }}>×</button>
          )}
          <button className="main-btn" style={S.mainBtn(isBusy)} onClick={handleFetch} disabled={isBusy}>
            {isBusy && <span style={S.spinner} />}
            {mainBtnLabel}
          </button>
        </div>

        {pasteHint && !url && (
          <div className="paste-hint" style={S.pasteHint} onClick={handlePasteFromClipboard}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span>Paste URL from clipboard</span>
            <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 4 }}>Ctrl+V</span>
          </div>
        )}

        {error && <div style={S.error}>⚠ {error}</div>}

        {loading && (
          <div style={S.loadingWrap} className="fade-up">
            <div style={S.loadingSpinner} />
            <p style={{ marginTop: 16, fontSize: 14 }}>Fetching media info...</p>
            <p style={{ marginTop: 8, fontSize: 12, color: "#3a4460" }}>Instagram may take 20–30 seconds — please wait ⏳</p>
          </div>
        )}

        {/* ── RESULT CARD ── */}
        {data && (
          <div style={S.card} className="fade-up">
            <div style={S.cardTop}>
              <img src={data.thumbnail} alt="" style={S.thumb}
                onError={(e) => { e.target.src = "https://placehold.co/140x90/1a2540/6b7a99?text=No+Preview"; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.metaTitle} title={data.title}>
                  {(data.title || "").length > 80 ? data.title.slice(0, 80) + "…" : data.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {data.duration && <span style={S.metaPill}>⏱ {formatDuration(data.duration)}</span>}
                  {isCarousel && <span style={S.metaPill}>🖼 Carousel · {data.itemCount} items</span>}
                  {isPhoto && <span style={S.metaPill}>🖼 Photo</span>}
                  {!isCarousel && !isPhoto && <span style={S.metaPill}>🎬 {data.formats.length - 1} qualities</span>}
                </div>
              </div>
            </div>

            {isCarousel && (
              <div style={S.section}>
                <div style={S.sectionLabel}>{carouselLoading ? "Loading items..." : `Carousel Items (${carouselItems.length})`}</div>
                {carouselLoading && (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={S.loadingSpinner} />
                    <p style={{ marginTop: 12, fontSize: 13, color: "#4a5878" }}>Fetching via gallery-dl...</p>
                  </div>
                )}
                {!carouselLoading && carouselItems.length > 0 && (
                  <div style={S.carouselGrid}>
                    {carouselItems.map((item, i) => {
                      const isActive = downloadingItem === item.filename;
                      const thumbUrl = `${BASE_URL}/carousel-thumb?sessionId=${sessionId}&filename=${encodeURIComponent(item.filename)}`;
                      return (
                        <div key={i} style={S.carouselItem}>
                          <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden", position: "relative" }}>
                            <img src={item.type === "photo" ? thumbUrl : undefined} alt={`Item ${i + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: item.type === "photo" ? "block" : "none" }}
                              onError={(e) => { e.target.style.display = "none"; }} />
                            <div style={{ width: "100%", height: "100%", background: item.type === "photo" ? "rgba(99,179,237,0.05)" : "rgba(52,211,153,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "absolute", top: 0, left: 0 }}>
                              {item.type === "photo" ? "🖼" : "🎬"}
                            </div>
                          </div>
                          <div style={{ padding: "6px 8px", fontSize: 11, color: "#4a5878", textAlign: "center" }}>
                            {item.type === "photo" ? "Photo" : "Video"} {i + 1}{item.size && <span style={{ marginLeft: 4 }}>· {formatBytes(item.size)}</span>}
                          </div>
                          <button className="carousel-dl" style={S.carouselDlBtn(isActive)}
                            onClick={() => !isActive && handleCarouselItemDownload(item)} disabled={isActive}>
                            {isActive ? <span style={S.spinnerBlue} /> : "↓"}
                            {isActive ? "Downloading..." : "Download"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!carouselLoading && carouselItems.length === 0 && (
                  <div style={{ fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "12px 16px" }}>
                    ⚠ Carousel & Story downloads require a dedicated server. This feature works on local version only.
                  </div>
                )}
              </div>
            )}

            {!isCarousel && (
              <>
                <div style={S.section}>
                  <div style={S.sectionLabel}>{isPhoto ? "Photo" : "Video Download"}</div>
                  {isPhoto ? (
                    <div style={{ fontSize: 13, color: "#63b3ed", background: "rgba(99,179,237,0.06)", border: "1px solid rgba(99,179,237,0.15)", borderRadius: 10, padding: "10px 16px" }}>
                      ℹ Photo post — right-click the preview image above and select "Save Image As".
                    </div>
                  ) : (
                    <div style={S.formatGrid}>
                      {data.formats.map((f, i) => {
                        const isActive = activeFormat === f.format_id;
                        const sizeTxt = f.filesize ? "~" + formatBytes(f.filesize) : null;
                        return (
                          <button key={i} className="fmt-btn" style={S.formatBtn(isActive, downloading)}
                            onClick={() => !downloading && handleVideoDownload(f.format_id, f.quality)} disabled={downloading}>
                            {isActive && downloading ? <span style={S.spinnerBlue} /> : <span style={{ fontSize: 13, opacity: 0.7 }}>↓</span>}
                            <span>{f.quality}</span>
                            {sizeTxt && <span style={S.formatSize}>{sizeTxt}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {!isPhoto && (
                  <>
                    <div style={S.divider} />
                    <div style={S.section}>
                      <div style={S.sectionLabel}>Audio Only</div>
                      <button className="audio-btn" style={S.audioBtn(activeFormat === "audio", downloading)}
                        onClick={() => !downloading && handleAudioDownload()} disabled={downloading}>
                        {activeFormat === "audio" && downloading ? <span style={S.spinnerGreen} /> : <span style={{ fontSize: 18 }}>♪</span>}
                        <div>
                          <div>Download MP3</div>
                          <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.55, marginTop: 2 }}>Best quality · saves as "{safeFilename(videoTitle).slice(0, 30)}.mp3"</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {downloading && (
              <>
                <div style={S.divider} />
                <div style={S.progressWrap}>
                  <div style={S.progressLabel}>
                    <span>{progress > 0 ? `Downloading ${downloadType}...` : "Processing on server..."}</span>
                    <span style={{ fontWeight: 600, color: "#e8eaf0" }}>{progress > 0 ? `${progress}%` : "—"}</span>
                  </div>
                  <div style={S.progressTrack}><div style={S.progressBar(progress)} /></div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── HOW TO USE ── */}
        <div style={{ marginTop: 80 }}>
          <div style={S.sectionTitle}>How to use</div>
          <div style={S.sectionDesc}>Download any video in 3 simple steps — no account needed.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { n: "01", t: "Copy the URL", d: "Go to Instagram, Facebook, or Twitter. Open the video and copy its link from the share menu." },
              { n: "02", t: "Paste & fetch", d: "Paste the URL in the input box above and click the Download button to fetch media info." },
              { n: "03", t: "Choose & download", d: "Select your preferred video quality or download MP3 audio. The file saves directly to your device." },
            ].map((s) => (
              <div key={s.n} style={{ ...S.infoCard }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "rgba(99,179,237,0.3)", marginBottom: 12, fontVariantNumeric: "tabular-nums" }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#eef2ff", marginBottom: 8 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.7 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div style={{ marginTop: 80 }}>
          <div style={S.sectionTitle}>Why choose us?</div>
          <div style={S.sectionDesc}>Everything you need to download media — fast, free, and hassle-free.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {features.map((f) => (
              <div key={f.title} style={{ ...S.infoCard }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#eef2ff", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SUPPORTED PLATFORMS ── */}
        <div style={{ marginTop: 80 }}>
          <div style={S.sectionTitle}>Supported platforms</div>
          <div style={S.sectionDesc}>We support a wide range of social media and video platforms.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {platforms.map((p) => (
              <div key={p.name} style={{ ...S.infoCard, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#eef2ff" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#4a5878", marginTop: 2 }}>{p.types}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop: 80 }}>
          <div style={S.sectionTitle}>Frequently asked questions</div>
          <div style={S.sectionDesc}>Got questions? We've got answers.</div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                <button className="faq-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "18px 4px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, borderRadius: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "#eef2ff" }}>{faq.q}</span>
                  <span style={{ fontSize: 18, color: "#4a5878", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 4px 18px", fontSize: 14, color: "#6b7a99", lineHeight: 1.8 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── ABOUT ── */}
        <div style={{ marginTop: 80, ...S.infoCard }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#eef2ff", marginBottom: 12 }}>About Universal Media Downloader</div>
          <p style={{ fontSize: 14, color: "#6b7a99", lineHeight: 1.9, marginBottom: 12 }}>
            Universal Media Downloader is a free online tool that lets you download videos, reels, photos and audio from popular social media platforms including Instagram, Facebook, Twitter/X, TikTok and more — directly to your device.
          </p>
          <p style={{ fontSize: 14, color: "#6b7a99", lineHeight: 1.9, marginBottom: 12 }}>
            Our tool supports multiple video quality options from 480p all the way up to 4K, and lets you extract high-quality MP3 audio from any supported video. No registration, no software installation, and no hidden fees — ever.
          </p>
          <p style={{ fontSize: 14, color: "#6b7a99", lineHeight: 1.9 }}>
            We respect your privacy. We do not store downloaded files or collect any personal data. All media is processed temporarily on our servers and deleted immediately after your download completes.
          </p>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 80, padding: "32px 0 16px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#2e3a52", marginBottom: 16 }}>Built with passion by <span style={{ color: "#63b3ed" }}>Sachin Prajapati</span></p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/sachiin-prajapatii" },
              { label: "GitHub", href: "https://github.com/sachiinprajapatii1" },
              { label: "Instagram", href: "https://www.instagram.com/sachiinprajapatii/" },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ color: "#3a4a66", fontSize: 13, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#63b3ed"}
                onMouseLeave={e => e.target.style.color = "#3a4a66"}>
                {link.label}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#1e2a40" }}>© 2026 Universal Media Downloader · Built by Sachin Prajapati · All rights reserved</p>
          <p style={{ fontSize: 11, color: "#1e2a40", marginTop: 6 }}>This tool is for personal use only. Please respect copyright laws and platform terms of service.</p>
        </div>
      </div>
      <CookieConsent />
    </div>
  );
}