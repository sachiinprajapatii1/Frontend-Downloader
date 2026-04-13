import { formatDuration, formatBytes, safeFilename } from "../utils/formatters";
import CarouselSection from "./CarouselSection";

const spinnerBlue = { width: 14, height: 14, border: "2px solid rgba(99,179,237,0.2)", borderTopColor: "#63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" };
const spinnerGreen = { width: 16, height: 16, border: "2px solid rgba(52,211,153,0.2)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" };

export default function ResultCard({
  data, downloading, activeFormat, progress, downloadType,
  carouselItems, carouselLoading, sessionId, downloadingItem,
  videoTitle, BASE_URL,
  handleVideoDownload, handleAudioDownload, handleCarouselItemDownload,
}) {
  const isPhoto = data?.isPhoto;
  const isCarousel = data?.isCarousel;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24,
      overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.5)", marginTop: 40,
    }} className="fade-up">

      {/* Thumbnail + meta */}
      <div style={{ display: "flex", gap: 24, padding: "28px 28px 24px", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <img
          src={data.thumbnail} alt={data.title}
          style={{ width: 140, minWidth: 140, height: 90, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}
          onError={(e) => { e.target.src = "https://placehold.co/140x90/1a2540/6b7a99?text=No+Preview"; }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#eef2ff", lineHeight: 1.4, marginBottom: 8 }} title={data.title}>
            {(data.title || "").length > 80 ? data.title.slice(0, 80) + "…" : data.title}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {data.duration && <MetaPill>⏱ {formatDuration(data.duration)}</MetaPill>}
            {isCarousel && <MetaPill>🖼 Carousel · {data.itemCount} items</MetaPill>}
            {isPhoto && <MetaPill>🖼 Photo</MetaPill>}
            {!isCarousel && !isPhoto && <MetaPill>🎬 {data.formats.length - 1} qualities</MetaPill>}
          </div>
        </div>
      </div>

      {/* Carousel */}
      {isCarousel && (
        <CarouselSection
          carouselItems={carouselItems}
          carouselLoading={carouselLoading}
          sessionId={sessionId}
          downloadingItem={downloadingItem}
          videoTitle={videoTitle}
          BASE_URL={BASE_URL}
          handleCarouselItemDownload={handleCarouselItemDownload}
        />
      )}

      {/* Video formats */}
      {!isCarousel && (
        <>
          <div style={{ padding: "24px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a5878", marginBottom: 16 }}>
              {isPhoto ? "Photo" : "Video Download"}
            </div>

            {isPhoto ? (
              <div style={{ fontSize: 13, color: "#63b3ed", background: "rgba(99,179,237,0.06)", border: "1px solid rgba(99,179,237,0.15)", borderRadius: 10, padding: "10px 16px" }}>
                ℹ Photo post — right-click the preview image above and select "Save Image As".
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {data.formats.map((f) => {
                  const isActive = activeFormat === f.format_id;
                  const sizeTxt = f.filesize ? "~" + formatBytes(f.filesize) : null;
                  return (
                    <button
                      key={f.format_id}
                      className="fmt-btn"
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 4, padding: "12px 20px", borderRadius: 12,
                        cursor: downloading ? "not-allowed" : "pointer",
                        border: isActive ? "1px solid rgba(99,179,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        background: isActive ? "rgba(99,179,237,0.12)" : "rgba(255,255,255,0.04)",
                        color: isActive ? "#63b3ed" : "#a0aec0", fontSize: 13, fontWeight: 600,
                        opacity: downloading && !isActive ? 0.4 : 1,
                        transition: "all 0.18s", minWidth: 90,
                      }}
                      onClick={() => !downloading && handleVideoDownload(f.format_id, f.quality)}
                      disabled={downloading}
                    >
                      {isActive && downloading ? <span style={spinnerBlue} /> : <span style={{ fontSize: 13, opacity: 0.7 }}>↓</span>}
                      <span>{f.quality}</span>
                      {sizeTxt && <span style={{ fontSize: 11, color: "#4a5878", fontWeight: 400 }}>{sizeTxt}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Audio */}
          {!isPhoto && (
            <>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" }} />
              <div style={{ padding: "24px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a5878", marginBottom: 16 }}>Audio Only</div>
                <button
                  className="audio-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 12,
                    cursor: downloading ? "not-allowed" : "pointer",
                    border: activeFormat === "audio" ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: activeFormat === "audio" ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
                    color: activeFormat === "audio" ? "#34d399" : "#a0aec0", fontSize: 14, fontWeight: 600,
                    opacity: downloading && activeFormat !== "audio" ? 0.4 : 1, transition: "all 0.18s",
                  }}
                  onClick={() => !downloading && handleAudioDownload()}
                  disabled={downloading}
                >
                  {activeFormat === "audio" && downloading ? <span style={spinnerGreen} /> : <span style={{ fontSize: 18 }}>♪</span>}
                  <div>
                    <div>Download MP3</div>
                    <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.55, marginTop: 2 }}>
                      Best quality · saves as "{safeFilename(videoTitle).slice(0, 30)}.mp3"
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Progress bar */}
      {downloading && (
        <>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" }} />
          <div style={{ padding: "20px 28px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7a99", marginBottom: 10 }}>
              <span>{progress > 0 ? `Downloading ${downloadType}...` : "Processing on server..."}</span>
              <span style={{ fontWeight: 600, color: "#e8eaf0" }}>{progress > 0 ? `${progress}%` : "—"}</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress || 3}%`, background: "linear-gradient(90deg, #3b82f6, #34d399)", borderRadius: 99, transition: "width 0.3s ease" }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetaPill({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#8899bb", marginRight: 8,
    }}>
      {children}
    </span>
  );
}