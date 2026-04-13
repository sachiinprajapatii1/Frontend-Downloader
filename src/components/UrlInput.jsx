export default function UrlInput({
  url, setUrl, isBusy, loading, downloading,
  inputRef, handleFetch, handleInputFocus,
  handlePasteFromClipboard, clearAll,
  pasteHint, setPasteHint, error,
}) {
  const mainBtnLabel = loading ? "Fetching..." : downloading ? "Downloading..." : "Download";

  const spinner = {
    width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", display: "inline-block", flexShrink: 0,
  };

  return (
    <>
      <div style={{
        display: "flex", gap: 12, background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
        padding: "8px 8px 8px 20px", backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)", marginBottom: 8,
      }}>
        <span style={{ fontSize: 16, paddingTop: 1, flexShrink: 0, color: "#3a4a66" }}>🔗</span>
        <input
          ref={inputRef}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#e8eaf0", minWidth: 0 }}
          placeholder="Paste video URL here — Instagram, Facebook, Twitter..."
          value={url}
          onChange={(e) => { setUrl(e.target.value); setPasteHint(false); }}
          onFocus={handleInputFocus}
          onBlur={() => setTimeout(() => setPasteHint(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && !isBusy && handleFetch()}
          disabled={isBusy}
        />
        {url && !isBusy && (
          <button onClick={clearAll} style={{ background: "none", border: "none", color: "#3a4a66", cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1 }}>×</button>
        )}
        <button
          className="main-btn"
          style={{
            background: isBusy ? "linear-gradient(135deg, #1d4ed8, #1e3a8a)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none", borderRadius: 10, padding: "12px 28px",
            fontSize: 14, fontWeight: 600, color: "#fff",
            cursor: isBusy ? "not-allowed" : "pointer",
            whiteSpace: "nowrap", letterSpacing: "0.02em",
            boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
            transition: "all 0.2s", opacity: isBusy ? 0.75 : 1,
            display: "flex", alignItems: "center", gap: 8,
          }}
          onClick={handleFetch}
          disabled={isBusy}
        >
          {isBusy && <span style={spinner} />}
          {mainBtnLabel}
        </button>
      </div>

      {pasteHint && !url && (
        <div
          className="paste-hint"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,179,237,0.07)", border: "1px solid rgba(99,179,237,0.15)",
            borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#63b3ed",
            cursor: "pointer", marginBottom: 16,
          }}
          onClick={handlePasteFromClipboard}
        >
          <span style={{ fontSize: 14 }}>📋</span>
          <span>Paste URL from clipboard</span>
          <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 4 }}>Ctrl+V</span>
        </div>
      )}

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#fca5a5", marginTop: 12,
        }}>
          ⚠ {error}
        </div>
      )}
    </>
  );
}