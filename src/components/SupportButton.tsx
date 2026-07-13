import { useState, type FormEvent } from "react";
import { Mail, Send, X } from "lucide-react";
import { SUPPORT_EMAIL, getStoredAuthUser } from "../lib/support";

export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      setError("Digite sua dúvida ou problema antes de enviar.");
      setStatus("error");
      return;
    }

    const user = getStoredAuthUser();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _subject: "Ajuda ou dúvida - Código de Luta",
          _template: "box",
          _captcha: "false",
          "Nome": user?.name || "Não informado",
          "E-mail da conta": user?.email || "Não informado",
          "Telefone": user?.phone || "Não informado",
          "Mensagem": cleanMessage,
          "Página": window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha no envio.");
      }

      setMessage("");
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Não consegui enviar agora. Tente novamente em instantes.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStatus("idle");
          setError("");
        }}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all hover:scale-105"
        style={{
          background: "rgba(12,16,24,0.94)",
          border: "1px solid rgba(248,197,77,0.28)",
          color: "#f8c54d",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          backdropFilter: "blur(14px)",
        }}
        data-testid="support-open"
      >
        <Mail className="h-4 w-4" />
        <span>Ajuda</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
        >
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md p-6"
            style={{
              background: "rgba(12,16,24,0.98)",
              border: "1px solid rgba(248,197,77,0.25)",
              borderRadius: "18px",
              boxShadow: "0 24px 90px rgba(0,0,0,0.65)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar ajuda"
              className="absolute right-3 top-3 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", color: "#aab5c4", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(248,197,77,0.12)", border: "1px solid rgba(248,197,77,0.3)", color: "#f8c54d" }}
              >
                <Mail size={22} />
              </div>
              <div>
                <div className="text-lg font-black text-white">Ajuda Código de Luta</div>
                <div className="text-xs" style={{ color: "#aab5c4" }}>Envia direto para {SUPPORT_EMAIL}</div>
              </div>
            </div>

            <label className="block text-xs font-bold mb-2" style={{ color: "#aab5c4" }}>
              Digite sua dúvida ou problema
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              placeholder="Escreva aqui o que aconteceu ou qual dúvida você tem..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
              data-testid="support-message"
            />

            {status === "sent" && (
              <div className="mt-3 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)", color: "#86efac" }}>
                Mensagem enviada com sucesso.
              </div>
            )}

            {status === "error" && error && (
              <div className="mt-3 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(213,15,50,0.12)", border: "1px solid rgba(213,15,50,0.3)", color: "#ff6b6b" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-4 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #d50f32, #a00924)",
                color: "#fff",
                border: "none",
                boxShadow: status === "sending" ? "none" : "0 0 24px rgba(213,15,50,0.32)",
              }}
              data-testid="support-send"
            >
              <Send size={16} />
              {status === "sending" ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
