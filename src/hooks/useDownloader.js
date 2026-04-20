import { useState, useRef } from "react";
import axios from "axios";
import { safeFilename } from "../utils/formatters";
import { triggerDownload } from "../utils/download";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/download";

export function useDownloader() {
  const [url, setUrl] = useState("");
  const [cleanUrl, setCleanUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFormat, setActiveFormat] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState("");
  const [progress, setProgress] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [downloadingItem, setDownloadingItem] = useState(null);
  const [pasteHint, setPasteHint] = useState(false);
  const inputRef = useRef(null);

  const handleInputFocus = async () => {
    if (url) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text?.startsWith("http")) setPasteHint(true);
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
    // if (url.includes("youtube.com") || url.includes("youtu.be")) {
    //   return setError("YouTube downloads are currently unavailable. Try Instagram or other platforms.");
    // }
    try {
      setLoading(true); setData(null); setError("");
      setActiveFormat(null); setPasteHint(false);
      setCarouselItems([]); setSessionId(null);
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
      const res = await axios.get(`${BASE_URL}/carousel`, {
        params: { url: carouselUrl },
        timeout: 2 * 60 * 1000,
      });
      setCarouselItems(res.data.items || []);
      setSessionId(res.data.sessionId);
    } catch { setError("Failed to load carousel items."); }
    finally { setCarouselLoading(false); }
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
        params: { url: cleanUrl },
        responseType: "blob",
        onDownloadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded * 100) / e.total)); },
        timeout: 15 * 60 * 1000,
      });
      const ext = response.headers["content-disposition"]?.match(/\.(\w+)["']/)?.[1] || "mp3";
      triggerDownload(response.data, `${safeFilename(videoTitle)}.${ext}`);
    } catch { setError("Audio download failed."); }
    finally { setDownloading(false); setActiveFormat(null); }
  };

  const handleCarouselItemDownload = async (item) => {
    setDownloadingItem(item.filename);
    try {
      const response = await axios.get(`${BASE_URL}/carousel-item`, {
        params: { sessionId, filename: item.filename },
        responseType: "blob",
        timeout: 5 * 60 * 1000,
      });
      triggerDownload(response.data, `${safeFilename(videoTitle)}_${item.filename}`);
    } catch { setError("Failed to download item."); }
    finally { setDownloadingItem(null); }
  };

  const clearAll = () => {
    setUrl(""); setData(null); setError("");
    setCarouselItems([]); setPasteHint(false);
    inputRef.current?.focus();
  };

  return {
    // state
    url, setUrl, cleanUrl, videoTitle, data, loading, error,
    activeFormat, downloading, downloadType, progress,
    carouselItems, carouselLoading, sessionId, downloadingItem,
    pasteHint, setPasteHint, inputRef,
    // actions
    handleFetch, handleVideoDownload, handleAudioDownload,
    handleCarouselItemDownload, handleInputFocus,
    handlePasteFromClipboard, clearAll,
    BASE_URL,
  };
}