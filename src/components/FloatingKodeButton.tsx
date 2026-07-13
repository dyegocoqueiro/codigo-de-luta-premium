import { useState } from "react";
import { Bot, X } from "lucide-react";
import KodeChat from "./KodeChat";
import kodeAvatar from "@assets/kode-avatar_1782758047742.png";

export default function FloatingKodeButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-20 z-40 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all hover:scale-105"
        style={{
          background: "rgba(12,16,24,0.94)",
          border: "1px solid rgba(213,15,50,0.32)",
          color: "#ff6b7c",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          backdropFilter: "blur(14px)",
        }}
        data-testid="kode-floating-open"
      >
        <Bot className="h-4 w-4" />
        <span>IA Kode</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden"
            style={{
              background: "rgba(10,14,22,0.98)",
              border: "1px solid rgba(213,15,50,0.25)",
              borderRadius: "18px",
              boxShadow: "0 24px 90px rgba(0,0,0,0.65)",
            }}
          >
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(213,15,50,0.06)" }}>
              <img src={kodeAvatar} alt="Kode" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <div className="text-sm font-bold text-white">IA Kode</div>
                <div className="text-xs" style={{ color: "#32d98b" }}>Coach do Código de Luta</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar IA Kode"
                className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", color: "#aab5c4", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <X size={16} />
              </button>
            </div>
            <KodeChat />
          </div>
        </div>
      )}
    </>
  );
}
