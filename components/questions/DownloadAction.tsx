"use client";

import { useState } from "react";
import { Download, FileText, ImageIcon, Loader2 } from "lucide-react";

interface DownloadActionProps {
  url: string;
  filename: string;
  type: "question" | "solution";
  index: number;
}

export default function DownloadAction({
  url,
  filename,
  type,
  index,
}: DownloadActionProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const isPdf = url.toLowerCase().endsWith(".pdf");

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if wrapped in an anchor
    setIsDownloading(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback: open in new tab if blob fetch fails (e.g., severe CORS issue)
      window.open(url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const isQuestion = type === "question";

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-[9px] font-black uppercase border ${
        isQuestion
          ? "bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 border-transparent hover:border-emerald-600 disabled:bg-emerald-200"
          : "bg-cyan-50 hover:bg-cyan-500 hover:text-white text-cyan-700 border-cyan-100 hover:border-cyan-600 disabled:bg-cyan-200"
      }`}
    >
      {isDownloading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isPdf ? (
        <FileText className="w-3 h-3" />
      ) : (
        <ImageIcon className="w-3 h-3" />
      )}

      {isQuestion ? `Q-P${index + 1}` : `Sol-${index + 1}`}
      <Download className="w-3 h-3 ml-1 opacity-50" />
    </button>
  );
}
