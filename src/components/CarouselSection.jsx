import { formatBytes, safeFilename } from "../utils/formatters";

const spinnerBlue = { width: 14, height: 14, border: "2px solid rgba(99,179,237,0.2)", borderTopColor: "#63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" };
const loadingSpinner = { width: 28, height: 28, border: "2px solid rgba(99,179,237,0.15)", borderTopColor: "#63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" };

export default function CarouselSection({
  carouselItems, carouselLoading, sessionId,
  downloadingItem, videoTitle, BASE_URL,
  handleCarouselItemDownload,
}) {
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a5878", marginBottom: 16 }}>
        {carouselLoading ? "Loading items..." : `Carousel Items (${carouselItems.length})`}
      </div>

      {carouselLoading && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={loadingSpinner} />
          <p style={{ marginTop: 12, fontSize: 13, color: "#4a5878" }}>Fetching via gallery-dl...</p>
        </div>
      )}

      {!carouselLoading && carouselItems.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 8 }}>
          {carouselItems.map((item, i) => {
            const isActive = downloadingItem === item.filename;
            const thumbUrl = `${BASE_URL}/carousel-thumb?sessionId=${sessionId}&filename=${encodeURIComponent(item.filename)}`;
            return (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden", position: "relative" }}>
                  {item.type === "photo" && (
                    <img
                      src={thumbUrl}
                      alt={`Item ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <div style={{
                    width: "100%", height: "100%",
                    background: item.type === "photo" ? "rgba(99,179,237,0.05)" : "rgba(52,211,153,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, position: "absolute", top: 0, left: 0,
                    zIndex: item.type === "photo" ? -1 : 1,
                  }}>
                    {item.type === "photo" ? "🖼" : "🎬"}
                  </div>
                </div>
                <div style={{ padding: "6px 8px", fontSize: 11, color: "#4a5878", textAlign: "center" }}>
                  {item.type === "photo" ? "Photo" : "Video"} {i + 1}
                  {item.size && <span style={{ marginLeft: 4 }}>· {formatBytes(item.size)}</span>}
                </div>
                <button
                  className="carousel-dl"
                  style={{
                    width: "100%", padding: "8px", fontSize: 12, fontWeight: 600, border: "none",
                    background: isActive ? "rgba(99,179,237,0.3)" : "rgba(99,179,237,0.15)",
                    color: "#63b3ed", cursor: isActive ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 6, transition: "all 0.15s",
                  }}
                  onClick={() => !isActive && handleCarouselItemDownload(item)}
                  disabled={isActive}
                >
                  {isActive ? <span style={spinnerBlue} /> : "↓"}
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
  );
}