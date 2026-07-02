import { useEffect, useState } from "react";

interface YouTubeVideo {
  id: string;
  title: string;
}

interface YouTubeModalProps {
  videoId: string;
  title: string;
  videos?: YouTubeVideo[];
  onClose: () => void;
}

export default function YouTubeModal({ videoId, title, videos, onClose }: YouTubeModalProps) {
  const playlist = videos?.length ? videos : [{ id: videoId, title }];
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>(playlist[0] ?? { id: videoId, title });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    setActiveVideo((videos?.length ? videos[0] : { id: videoId, title }) ?? { id: videoId, title });
  }, [videoId, title, videos]);

  const openOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${activeVideo.id}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="relative w-full max-w-lg"
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(10,14,22,0.98)",
          borderRadius: "24px",
          border: "1px solid rgba(213,15,50,0.3)",
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(213,15,50,0.15)",
        }}
      >
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(213,15,50,0.06)" }}
        >
          <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "#d50f32" }}>
            Vídeo de Referência
          </div>
          <div className="text-sm font-bold text-white leading-snug pr-8">{activeVideo.title}</div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: "#aab5c4" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Thumbnail preview */}
        <div className="relative" style={{ height: "220px", background: "#000" }}>
          <img
            src={`https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`}
            alt={activeVideo.title}
            className="w-full h-full object-cover"
            style={{ opacity: 0.6, filter: "blur(2px) brightness(0.5)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${activeVideo.id}/mqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <button
              onClick={openOnYouTube}
              className="group flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(213,15,50,0.9)",
                border: "3px solid rgba(255,255,255,0.2)",
                boxShadow: "0 0 40px rgba(213,15,50,0.6)",
              }}
            >
              <svg className="w-9 h-9 ml-1.5" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="mt-4 text-sm font-bold text-white text-center px-4">
              Clique para assistir no YouTube
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {playlist.length > 1 && (
            <div className="space-y-2">
              {playlist.map((video, index) => {
                const isActive = video.id === activeVideo.id;
                return (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-xs transition-all"
                    style={{
                      background: isActive ? "rgba(213,15,50,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isActive ? "rgba(213,15,50,0.45)" : "rgba(255,255,255,0.08)"}`,
                      color: isActive ? "#fff" : "#aab5c4",
                    }}
                  >
                    <span className="font-bold" style={{ color: isActive ? "#ff355a" : "#6b7a8d" }}>
                      Vídeo {index + 1}
                    </span>
                    <span> — {video.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={openOnYouTube}
            className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #d50f32, #ff355a)",
              color: "#fff",
              boxShadow: "0 0 30px rgba(213,15,50,0.4)",
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Abrir no YouTube
          </button>

          <p className="text-xs text-center" style={{ color: "#6b7a8d" }}>
            O vídeo abrirá numa nova aba do navegador
          </p>
        </div>
      </div>
    </div>
  );
}
