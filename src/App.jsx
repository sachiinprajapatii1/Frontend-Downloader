import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/download";

const GlowOrb = ({ style }) => (
  <div style={{
    position: "fixed", borderRadius: "50%", filter: "blur(80px)",
    opacity: 0.15, pointerEvents: "none", zIndex: 0, ...style
  }} />
);

function formatDuration(s) {
  if (!s) return "";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
    : `${m}:${String(sec).padStart(2,"0")}`;
}

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

// Clean title for use as filename (remove special chars not allowed in filenames)
function safeFilename(title) {
  if (!title) return "download";
  return title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim().slice(0, 120);
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
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Show paste hint when input is focused and clipboard might have a URL
  const handleInputFocus = async () => {
    if (url) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith("http://") || text.startsWith("https://"))) {
        setPasteHint(true);
      }
    } catch {}
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setPasteHint(false);
        inputRef.current?.focus();
      }
    } catch {
      setError("Clipboard access denied. Please paste manually (Ctrl+V).");
    }
  };

  const handleFetch = async () => {
    if (!url.trim()) return setError("Please paste a valid URL");
    try {
      setLoading(true); setData(null); setError("");
      setActiveFormat(null); setPasteHint(false);
      const res = await axios.post(BASE_URL, { url: url.trim() });
      setData(res.data);
      setVideoTitle(res.data.title || "");
      setCleanUrl(res.data.cleanUrl || url.trim());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch media. Check the URL.");
    } finally { setLoading(false); }
  };

  const handleVideoDownload = async (format_id, qualityLabel) => {
    try {
      setDownloading(true); setActiveFormat(format_id);
      setDownloadType(qualityLabel); setProgress(0); setError("");
      const response = await axios.get(`${BASE_URL}/video`, {
        params: { url: cleanUrl, format_id },
        responseType: "blob",
        onDownloadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded * 100) / e.total)); },
        timeout: 15 * 60 * 1000,
      });
      const ext = response.headers["content-disposition"]?.match(/\.(\w+)["']/)?.[1] || "mp4";
      triggerDownload(response.data, `${safeFilename(videoTitle)}.${ext}`);
    } catch (err) {
      let msg = "Video download failed.";
      if (err.response) {
        try { const t = await err.response.data.text(); msg = JSON.parse(t).error || msg; } catch {}
      }
      setError(msg);
    } finally { setDownloading(false); setActiveFormat(null); }
  };

  const handleAudioDownload = async () => {
    try {
      setDownloading(true); setActiveFormat("audio");
      setDownloadType("MP3 Audio"); setProgress(0); setError("");
      const response = await axios.get(`${BASE_URL}/audio`, {
        params: { url: cleanUrl },
        responseType: "blob",
        onDownloadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded * 100) / e.total)); },
        timeout: 15 * 60 * 1000,
      });
      const ext = response.headers["content-disposition"]?.match(/\.(\w+)["']/)?.[1] || "mp3";
      triggerDownload(response.data, `${safeFilename(videoTitle)}.${ext}`);
    } catch (err) {
      setError("Audio download failed.");
    } finally { setDownloading(false); setActiveFormat(null); }
  };

  function triggerDownload(blobData, filename) {
    const blob = new Blob([blobData]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }

  // Main button label logic
  const mainBtnLabel = loading ? "Fetching..." : downloading ? "Downloading..." : "Download";

  const S = {
    root: {
      minHeight: "100vh", background: "#080c14",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e8eaf0", position: "relative", overflowX: "hidden",
    },
    wrap: { maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px", position: "relative", zIndex: 1 },
    badge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.18)",
      borderRadius: 100, padding: "6px 16px", fontSize: 12,
      color: "#63b3ed", marginBottom: 28, letterSpacing: "0.08em", textTransform: "uppercase",
    },
    h1: {
      fontSize: "clamp(32px,6vw,58px)", fontWeight: 700, letterSpacing: "-0.03em",
      lineHeight: 1.1, marginBottom: 14,
      background: "linear-gradient(135deg, #f0f4ff 0%, #a8b8d8 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    },
    sub: { fontSize: 16, color: "#6b7a99", marginBottom: 48, lineHeight: 1.6 },

    // Input row
    inputWrap: {
      display: "flex", gap: 12, background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
      padding: "8px 8px 8px 20px", backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)", marginBottom: 8,
      transition: "border-color 0.2s",
    },
    input: { flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#e8eaf0", minWidth: 0 },

    // Paste hint pill
    pasteHint: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(99,179,237,0.07)", border: "1px solid rgba(99,179,237,0.15)",
      borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#63b3ed",
      cursor: "pointer", marginBottom: 16, transition: "all 0.15s",
    },

    mainBtn: (active) => ({
      background: active
        ? "linear-gradient(135deg, #1d4ed8, #1e3a8a)"
        : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      border: "none", borderRadius: 10, padding: "12px 28px",
      fontSize: 14, fontWeight: 600, color: "#fff", cursor: active ? "not-allowed" : "pointer",
      whiteSpace: "nowrap", letterSpacing: "0.02em",
      boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
      transition: "all 0.2s", opacity: active ? 0.75 : 1,
      display: "flex", alignItems: "center", gap: 8,
    }),

    card: {
      background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24,
      overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.5)", marginTop: 40,
    },
    cardTop: {
      display: "flex", gap: 24, padding: "28px 28px 24px", alignItems: "flex-start",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    thumb: { width: 140, minWidth: 140, height: 90, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" },
    metaTitle: { fontSize: 17, fontWeight: 600, color: "#eef2ff", lineHeight: 1.4, marginBottom: 8 },
    metaPill: {
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#8899bb", marginRight: 8,
    },
    section: { padding: "24px 28px" },
    sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a5878", marginBottom: 16 },
    formatGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
    formatBtn: (active, isDownloading) => ({
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "12px 20px", borderRadius: 12,
      cursor: isDownloading ? "not-allowed" : "pointer",
      border: active ? "1px solid rgba(99,179,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
      background: active ? "rgba(99,179,237,0.12)" : "rgba(255,255,255,0.04)",
      color: active ? "#63b3ed" : "#a0aec0", fontSize: 13, fontWeight: 600,
      opacity: isDownloading && !active ? 0.4 : 1,
      transition: "all 0.18s", minWidth: 90,
    }),
    formatSize: { fontSize: 11, color: "#4a5878", fontWeight: 400 },
    audioBtn: (active, isDownloading) => ({
      display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 12,
      cursor: isDownloading ? "not-allowed" : "pointer",
      border: active ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.08)",
      background: active ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
      color: active ? "#34d399" : "#a0aec0", fontSize: 14, fontWeight: 600,
      opacity: isDownloading && !active ? 0.4 : 1, transition: "all 0.18s",
    }),
    divider: { height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" },
    progressWrap: { padding: "20px 28px 28px" },
    progressLabel: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7a99", marginBottom: 10 },
    progressTrack: { height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" },
    progressBar: (pct) => ({
      height: "100%", width: `${pct || 3}%`,
      background: "linear-gradient(90deg, #3b82f6, #34d399)",
      borderRadius: 99, transition: "width 0.3s ease",
    }),
    error: {
      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#fca5a5", marginTop: 12,
    },
    spinner: {
      width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)",
      borderTopColor: "#fff", borderRadius: "50%",
      animation: "spin 0.8s linear infinite", display: "inline-block", flexShrink: 0,
    },
    spinnerBlue: {
      width: 14, height: 14, border: "2px solid rgba(99,179,237,0.2)",
      borderTopColor: "#63b3ed", borderRadius: "50%",
      animation: "spin 0.8s linear infinite", display: "inline-block",
    },
    spinnerGreen: {
      width: 16, height: 16, border: "2px solid rgba(52,211,153,0.2)",
      borderTopColor: "#34d399", borderRadius: "50%",
      animation: "spin 0.8s linear infinite", display: "inline-block",
    },
    loadingWrap: { textAlign: "center", padding: "48px 0", color: "#4a5878" },
    loadingSpinner: {
      width: 28, height: 28, border: "2px solid rgba(99,179,237,0.15)",
      borderTopColor: "#63b3ed", borderRadius: "50%",
      animation: "spin 0.8s linear infinite", display: "inline-block",
    },
  };

  const isBusy = loading || downloading;

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .main-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.5) !important; }
        .main-btn:active:not(:disabled) { transform: translateY(0); }
        .fmt-btn:hover:not(:disabled) { border-color: rgba(99,179,237,0.35) !important; background: rgba(99,179,237,0.08) !important; color: #90cdf4 !important; }
        .audio-btn:hover:not(:disabled) { border-color: rgba(52,211,153,0.35) !important; background: rgba(52,211,153,0.08) !important; color: #6ee7b7 !important; }
        .paste-hint:hover { background: rgba(99,179,237,0.12) !important; border-color: rgba(99,179,237,0.28) !important; }
        input::placeholder { color: #2e3a52; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2a40; border-radius: 99px; }
      `}</style>

      <GlowOrb style={{ width: 500, height: 500, background: "#1a3a6e", top: -150, right: -100 }} />
      <GlowOrb style={{ width: 400, height: 400, background: "#0d3320", bottom: 0, left: -100 }} />

      <div style={S.wrap}>

        {/* Header */}
        <div style={S.badge}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#63b3ed", display: "inline-block" }} />
          Universal Media Downloader
        </div>
        <h1 style={S.h1}>Download anything.<br />Any quality.</h1>
        <p style={S.sub}>YouTube, Instagram, Shorts & more.<br />Pick your quality, get your file.</p>

        {/* Input row */}
        <div style={S.inputWrap}>
          <span style={{ fontSize: 16, paddingTop: 1, flexShrink: 0, color: "#3a4a66" }}>🔗</span>
          <input
            ref={inputRef}
            style={S.input}
            placeholder="Paste video URL here..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setPasteHint(false); }}
            onFocus={handleInputFocus}
            onBlur={() => setTimeout(() => setPasteHint(false), 200)}
            onKeyDown={(e) => e.key === "Enter" && !isBusy && handleFetch()}
            disabled={isBusy}
          />
          {/* Inline clear button */}
          {url && !isBusy && (
            <button
              onClick={() => { setUrl(""); setData(null); setError(""); setPasteHint(false); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", color: "#3a4a66", cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1 }}
            >
              ×
            </button>
          )}
          <button
            className="main-btn"
            style={S.mainBtn(isBusy)}
            onClick={handleFetch}
            disabled={isBusy}
          >
            {(loading || downloading) && <span style={S.spinner} />}
            {mainBtnLabel}
          </button>
        </div>

        {/* Paste hint */}
        {pasteHint && !url && (
          <div className="paste-hint" style={S.pasteHint} onClick={handlePasteFromClipboard}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span>Paste URL from clipboard</span>
            <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 4 }}>Ctrl+V</span>
          </div>
        )}

        {/* Error */}
        {error && <div style={S.error}>⚠ {error}</div>}

        {/* Loading state */}
        {loading && (
          <div style={S.loadingWrap} className="fade-up">
            <div style={S.loadingSpinner} />
            <p style={{ marginTop: 16, fontSize: 14 }}>Fetching media info...</p>
          </div>
        )}

        {/* Result Card */}
        {data && (
          <div style={S.card} className="fade-up">

            {/* Thumbnail + meta */}
            <div style={S.cardTop}>
              <img src={data.thumbnail} alt="" style={S.thumb} onError={(e) => { e.target.src = "https://placehold.co/140x90/1a2540/6b7a99?text=No+Preview"; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.metaTitle} title={data.title}>
                  {data.title.length > 80 ? data.title.slice(0, 80) + "…" : data.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {data.duration && <span style={S.metaPill}>⏱ {formatDuration(data.duration)}</span>}
                  <span style={S.metaPill}>🎬 {data.formats.length - 1} qualities</span>
                </div>
              </div>
            </div>

            {/* Video formats */}
            <div style={S.section}>
              <div style={S.sectionLabel}>Video Download</div>
              <div style={S.formatGrid}>
                {data.formats.map((f, i) => {
                  const isActive = activeFormat === f.format_id;
                  const sizeTxt = f.filesize ? "~" + formatBytes(f.filesize) : null;
                  return (
                    <button
                      key={i}
                      className="fmt-btn"
                      style={S.formatBtn(isActive, downloading)}
                      onClick={() => !downloading && handleVideoDownload(f.format_id, f.quality)}
                      disabled={downloading}
                    >
                      {isActive && downloading
                        ? <span style={S.spinnerBlue} />
                        : <span style={{ fontSize: 13, opacity: 0.7 }}>↓</span>
                      }
                      <span>{f.quality}</span>
                      {sizeTxt && <span style={S.formatSize}>{sizeTxt}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={S.divider} />

            {/* Audio */}
            <div style={S.section}>
              <div style={S.sectionLabel}>Audio Only</div>
              <button
                className="audio-btn"
                style={S.audioBtn(activeFormat === "audio", downloading)}
                onClick={() => !downloading && handleAudioDownload()}
                disabled={downloading}
              >
                {activeFormat === "audio" && downloading
                  ? <span style={S.spinnerGreen} />
                  : <span style={{ fontSize: 18 }}>♪</span>
                }
                <div>
                  <div>Download MP3</div>
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.55, marginTop: 2 }}>Best quality · saves as "{safeFilename(videoTitle).slice(0,30)}.mp3"</div>
                </div>
              </button>
            </div>

            {/* Progress bar */}
            {downloading && (
              <>
                <div style={S.divider} />
                <div style={S.progressWrap}>
                  <div style={S.progressLabel}>
                    <span>
                      {progress > 0 ? `Downloading ${downloadType}...` : `Processing ${downloadType} on server...`}
                    </span>
                    <span style={{ fontWeight: 600, color: "#e8eaf0" }}>{progress > 0 ? `${progress}%` : "—"}</span>
                  </div>
                  <div style={S.progressTrack}>
                    <div style={S.progressBar(progress)} />
                  </div>
                  {progress > 0 && (
                    <p style={{ fontSize: 12, color: "#3a4460", marginTop: 8 }}>
                      File will save as: <span style={{ color: "#6b7a99" }}>{safeFilename(videoTitle).slice(0,50)}…</span>
                    </p>
                  )}
                </div>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}